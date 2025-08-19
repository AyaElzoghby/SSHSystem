import React, { useState, useMemo, useRef, useEffect } from "react";
import SearchInput from "./SearchInput";
import CustomButton from "./CustomButton";
import { ChevronLeft } from "lucide-react";
import folderopened from "../assets/folder opened.png";
import folderclosed from "../assets/folder closed.png";
import file from "../assets/file.png";
/**
 * NestedTree.jsx
 * - data: array of nodes, each node: { dcodE2, dname, children: [...] }
 * - onItemSelected: function(id) called on double-click
 * - initialExpanded: optional array of ids to start expanded
 */

const TreeItem = ({
  node,
  level = 0,
  onClickSelect,
  onDoubleClickSelect,
  selectedId,
  expandedNodes,
  toggleNode,
  focusId,
  setFocusId,
}) => {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const isExpanded = expandedNodes.has(String(node.dcodE2));
  const isSelected = String(selectedId) === String(node.dcodE2);
  const isFocused = String(focusId) === String(node.dcodE2);
  const ref = useRef(null);

  useEffect(() => {
    if (isFocused && ref.current) {
      // scroll element into view when focused
      ref.current.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [isFocused]);

  return (
    <div style={{ marginInlineStart: level * 20 }}>
      <div
        ref={ref}
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onClickSelect(node);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClickSelect && onDoubleClickSelect(String(node.dcodE2));
        }}
        onFocus={() => setFocusId && setFocusId(String(node.dcodE2))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          background: isSelected
            ? "var(--surface-color-hover)"
            : isFocused
            ? "var(--surface-color)"
            : "transparent",
          padding: "6px 8px",
          borderRadius: 6,
          outline: "none",
          userSelect: "none",
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(String(node.dcodE2));
            }}
            aria-label={isExpanded ? "collapse" : "expand"}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              width: 40,
              height: 20,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="flex gap-1">

            <ChevronLeft
              className={
                ("w-4 h-4 transition-transform duration-200",
                isExpanded && "-rotate-90")
              }
            />
            {isExpanded ? (
              <img src={folderopened} alt="Opened folder" className="w-4 h-4" />
            ) : (
              <img src={folderclosed} alt="Closed folder" className="w-4 h-4" />
            )}
            </div>
          </button>
        ) : (
          <span
            className="flex justify-center items-center "
            style={{ width: 40 }}
          >
            <img src={file} alt="Closed folder" className="w-4 h-4" />
          </span>
        )}

        <div style={{ flex: 1 }}>{node.dname}</div>
      </div>

      {isExpanded &&
        hasChildren &&
        node.children.map((child) => (
          <TreeItem
            key={String(child.dcodE2)}
            node={child}
            level={level + 1}
            onClickSelect={onClickSelect}
            onDoubleClickSelect={onDoubleClickSelect}
            selectedId={selectedId}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            focusId={focusId}
            setFocusId={setFocusId}
          />
        ))}
    </div>
  );
};

export default function NestedTree({
  data = [], // array of root nodes (as returned by API)
  onItemSelected, // called with id (string) on double click
  initialExpanded = [], // optional array of ids to start expanded
}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(
    new Set(initialExpanded.map(String))
  );
  const [focusId, setFocusId] = useState(null);

  // Filter tree by search (returns pruned tree keeping parents of matches)
  const filterTree = (nodes, query) => {
    if (!query) return nodes;
    const q = query.trim().toLowerCase();
    const out = [];

    for (const n of nodes) {
      const name = String(n.dname || "").toLowerCase();
      let matched = name.includes(q);
      let children = [];

      if (Array.isArray(n.children) && n.children.length > 0) {
        children = filterTree(n.children, query);
        if (children.length > 0) matched = true;
      }

      if (matched) {
        out.push({
          ...n,
          // if children were filtered, use them; otherwise keep original children to allow expand behavior
          children: children.length > 0 ? children : n.children || [],
        });
      }
    }

    return out;
  };

  const filteredData = useMemo(() => filterTree(data, search), [data, search]);

  // Toggle expand/collapse for a node id
  const toggleNode = (id) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      const sid = String(id);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
  };

  // Expand all nodes in the given nodes list (recursive)
  const expandAll = (nodes) => {
    const ids = new Set();
    const walk = (arr) => {
      arr.forEach((n) => {
        ids.add(String(n.dcodE2));
        if (Array.isArray(n.children) && n.children.length > 0) {
          walk(n.children);
        }
      });
    };
    walk(nodes);
    setExpandedNodes(ids);
  };

  // Collapse all
  const collapseAll = () => setExpandedNodes(new Set());

  // Build visible nodes list (respecting current expandedNodes) for keyboard navigation
  const buildVisibleList = (nodes) => {
    const list = [];
    const walk = (arr) => {
      for (const n of arr) {
        list.push(String(n.dcodE2));
        if (
          expandedNodes.has(String(n.dcodE2)) &&
          Array.isArray(n.children) &&
          n.children.length > 0
        ) {
          walk(n.children);
        }
      }
    };
    walk(nodes);
    return list;
  };

  const visibleList = useMemo(
    () => buildVisibleList(filteredData),
    [filteredData, expandedNodes]
  );

  // Keyboard navigation handlers
  const handleKeyDown = (e) => {
    if (visibleList.length === 0) return;

    if (!focusId) {
      // if no focus, focus first
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setFocusId(visibleList[0]);
        return;
      }
    }

    const idx = visibleList.indexOf(String(focusId));
    if (e.key === "ArrowDown") {
      if (idx < visibleList.length - 1) setFocusId(visibleList[idx + 1]);
    } else if (e.key === "ArrowUp") {
      if (idx > 0) setFocusId(visibleList[idx - 1]);
    } else if (e.key === "Enter") {
      // Enter selects
      setSelectedId(focusId);
    } else if (e.key === "ArrowRight") {
      // expand focused node (if it has children)
      const id = focusId;
      // find node by id in filteredData
      const findNode = (nodes, idToFind) => {
        for (const n of nodes) {
          if (String(n.dcodE2) === String(idToFind)) return n;
          if (n.children) {
            const found = findNode(n.children, idToFind);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(filteredData, id);
      if (node && Array.isArray(node.children) && node.children.length > 0) {
        setExpandedNodes((prev) => new Set(prev).add(String(id)));
      }
    } else if (e.key === "ArrowLeft") {
      // collapse focused node
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        next.delete(String(focusId));
        return next;
      });
    }
  };

  // If user types a search, auto-expand filtered tree to show matches
  useEffect(() => {
    if (!search) {
      // keep previous expanded nodes (do nothing) OR collapse? we keep user's state
      return;
    }
    // expand all filtered nodes so matches are visible
    expandAll(filteredData);
    // set focus to first visible match
    const list = buildVisibleList(filteredData);
    if (list.length > 0) setFocusId(list[0]);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click select handler (single click)
  const handleClickSelect = (node) => {
    setSelectedId(String(node.dcodE2));
    setFocusId(String(node.dcodE2));
  };

  // Double-click handler -> call parent
  const handleDoubleClick = (id) => {
    if (onItemSelected) onItemSelected(String(id));
  };

  // render
  return (
    <div
      style={{ maxWidth: 700 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="nested-tree"
    >
      {/* Search */}
      <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex justify-between my-2">
        <CustomButton
          title={search ? "Clear" : "Expand All"}
          onClick={() => {
            if (search) {
              setSearch("");
            } else {
              expandAll(data);
            }
          }}
        />
        <CustomButton onClick={collapseAll} title={"Collapse All"} />
      </div>

      {/* Tree */}
      <div>
        {filteredData.length === 0 ? (
          <div style={{ color: "#666", padding: 8 }}>No items</div>
        ) : (
          filteredData.map((node) => (
            <TreeItem
              key={String(node.dcodE2)}
              node={node}
              level={0}
              onClickSelect={handleClickSelect}
              onDoubleClickSelect={handleDoubleClick}
              selectedId={selectedId}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              focusId={focusId}
              setFocusId={setFocusId}
            />
          ))
        )}
      </div>
    </div>
  );
}

// import React, { useState, useMemo, useRef, useEffect } from "react";

// // 🔹 Recursive TreeItem
// const TreeItem = ({
//   node,
//   level = 0,
//   onSelect,
//   selectedId,
//   expandedNodes,
//   toggleNode,
//   focusId,
//   setFocusId,
// }) => {
//   const hasChildren = node.children && node.children.length > 0;
//   const isExpanded = expandedNodes.has(node.dcodE2);
//   const isSelected = selectedId === node.dcodE2;
//   const isFocused = focusId === node.dcodE2;

//   const ref = useRef(null);

//   useEffect(() => {
//     if (isFocused && ref.current) {
//       ref.current.scrollIntoView({ block: "nearest" });
//     }
//   }, [isFocused]);

//   return (
//     <div style={{ marginInlineStart: level * 20 }}>
//       <div
//         ref={ref}
//         tabIndex={0}
//         onClick={() => onSelect(node)}
//         onFocus={() => setFocusId(node.dcodE2)}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           cursor: "pointer",
//           background: isSelected
//             ? "#bae6fd"
//             : isFocused
//             ? "#f1f5f9"
//             : "transparent",
//           padding: "4px 8px",
//           borderRadius: "6px",
//           outline: "none",
//         }}
//       >
//         {hasChildren && (
//           <span
//             style={{ marginRight: 6, cursor: "pointer" }}
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleNode(node.dcodE2);
//             }}
//           >
//             {isExpanded ? "▼" : "▶"}
//           </span>
//         )}
//         <span>{node.dname}</span>
//       </div>

//       {isExpanded &&
//         hasChildren &&
//         node.children.map((child) => (
//           <TreeItem
//             key={child.dcodE2}
//             node={child}
//             level={level + 1}
//             onSelect={onSelect}
//             selectedId={selectedId}
//             expandedNodes={expandedNodes}
//             toggleNode={toggleNode}
//             focusId={focusId}
//             setFocusId={setFocusId}
//           />
//         ))}
//     </div>
//   );
// };

// // 🔹 Main Component
// const NestedTree = ({ data }) => {
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState(null);
//   const [expandedNodes, setExpandedNodes] = useState(new Set());
//   const [focusId, setFocusId] = useState(null);

//   // 🔍 search filter
//   const filterTree = (nodes, query) => {
//     if (!query) return nodes;
//     return nodes
//       .map((n) => {
//         if (n.dname.toLowerCase().includes(query.toLowerCase())) {
//           return n;
//         }
//         if (n.children) {
//           const filteredChildren = filterTree(n.children, query);
//           if (filteredChildren.length > 0) {
//             return { ...n, children: filteredChildren };
//           }
//         }
//         return null;
//       })
//       .filter(Boolean);
//   };

//   const filteredData = useMemo(() => filterTree(data, search), [data, search]);

//   // Expand/Collapse toggle
//   const toggleNode = (id) => {
//     setExpandedNodes((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   // Expand all
//   const expandAll = (nodes) => {
//     const ids = new Set();
//     const traverse = (n) => {
//       ids.add(n.dcodE2);
//       if (n.children) n.children.forEach(traverse);
//     };
//     nodes.forEach(traverse);
//     setExpandedNodes(ids);
//   };

//   // Collapse all
//   const collapseAll = () => setExpandedNodes(new Set());

//   // Keyboard navigation
//   const flatNodes = [];
//   const flatten = (nodes) => {
//     nodes.forEach((n) => {
//       flatNodes.push(n.dcodE2);
//       if (expandedNodes.has(n.dcodE2) && n.children) flatten(n.children);
//     });
//   };
//   flatten(filteredData);

//   const handleKeyDown = (e) => {
//     if (!focusId) return;
//     const idx = flatNodes.indexOf(focusId);
//     if (e.key === "ArrowDown" && idx < flatNodes.length - 1) {
//       setFocusId(flatNodes[idx + 1]);
//     }
//     if (e.key === "ArrowUp" && idx > 0) {
//       setFocusId(flatNodes[idx - 1]);
//     }
//     if (e.key === "Enter") {
//       setSelected(focusId);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400 }} onKeyDown={handleKeyDown} tabIndex={0}>
//       {/* 🔍 Search Input */}
//       <input
//         type="text"
//         placeholder="Search..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{
//           width: "100%",
//           marginBottom: 10,
//           padding: "6px 8px",
//           borderRadius: "6px",
//           border: "1px solid #ddd",
//         }}
//       />

//       {/* 🔘 Expand/Collapse buttons */}
//       <div style={{ marginBottom: 10 }}>
//         <button onClick={() => expandAll(data)} style={{ marginRight: 6 }}>
//           Expand All
//         </button>
//         <button onClick={collapseAll}>Collapse All</button>
//       </div>

//       {/* 🌳 Render Tree */}
//       {filteredData.map((node) => (
//         <TreeItem
//           key={node.dcodE2}
//           node={node}
//           onSelect={(n) => setSelected(n.dcodE2)}
//           selectedId={selected}
//           expandedNodes={expandedNodes}
//           toggleNode={toggleNode}
//           focusId={focusId}
//           setFocusId={setFocusId}
//         />
//       ))}
//     </div>
//   );
// };

// export default NestedTree;

// import React, { useState, useCallback, useMemo } from "react";
// import {
//   expandAllFeature,
//   hotkeysCoreFeature,
//   searchFeature,
//   selectionFeature,
//   syncDataLoaderFeature,
// } from "@headless-tree/core";
// import { useTree } from "@headless-tree/react";
// import { SearchIcon } from "lucide-react";

// import Input from "./ui/input";
// import { Tree, TreeItem, TreeItemLabel } from "./tree";
// import folderopened from "../assets/folder opened.png";
// import folderclosed from "../assets/folder closed.png";
// import file from "../assets/file.png";
// import clsx from "clsx";
// /**
//  * Props:
//  * - data: object map of itemId -> { name, children?: [childId,...], ... }
//  * - initialExpanded: array of itemIds to start expanded (defaults to first key)
//  * - onItemClicked: function(itemId) called on double click (can change to click if you prefer)
//  * - indent: number px indent per level
//  */
// export default function NestedTree({
//   data,
//   initialExpanded,
//   onItemClicked,
//   indent = 20,
// }) {
//   const defaultRoot = useMemo(() => {
//     const keys = Object.keys(data || {});
//     return keys[0] || null;
//   }, [data]);

//   const [state, setState] = useState({});

//   const tree = useTree({
//     state,
//     setState,
//     initialState: {
//       expandedItems: initialExpanded ?? (defaultRoot ? [defaultRoot] : []),
//     },
//     indent,
//     rootItemId: defaultRoot,
//     getItemName: (item) => item.getItemData().name,
//     isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,

//     dataLoader: {
//       getItem: (itemId) => data[itemId],
//       getChildren: (itemId) => data[itemId]?.children ?? [],
//     },
//     features: [
//       syncDataLoaderFeature,
//       hotkeysCoreFeature,
//       selectionFeature,
//       searchFeature,
//       expandAllFeature,
//     ],
//   });

//   const searchInputProps = tree.getSearchInputElementProps();

//   const handleSearchChange = useCallback(
//     (e) => {
//       searchInputProps.onChange?.(e);
//       const value = e.target.value;
//       if (value.length > 0) {
//         tree.expandAll();
//       } else {
//         setState((prev) => ({
//           ...prev,
//           expandedItems: initialExpanded ?? (defaultRoot ? [defaultRoot] : []),
//         }));
//       }
//     },
//     [searchInputProps, tree, initialExpanded, defaultRoot]
//   );

//   const handleItemClick = useCallback(
//     (item) => {
//       onItemClicked?.(item.getId());
//     },
//     [onItemClicked]
//   );

//   if (!defaultRoot) return null; // no data

//   return (
//     <div className="flex h-full flex-col gap-2">
//       <div className="relative">
//         <Input
//           className="peer ps-9 transition"
//           {...{
//             ...searchInputProps,
//             onChange: handleSearchChange,
//           }}
//           type="search"
//           placeholder="Quick search..."
//         />
//         <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
//           <SearchIcon className="size-4" aria-hidden="true" />
//         </div>
//       </div>

//       <Tree indent={indent} tree={tree}>
//         {tree.getItems().map((item) => (
//           <div key={item.getId()} className="group">
//             <button
//               onDoubleClick={() => handleItemClick(item)}
//               className={`
//                 w-full text-left flex items-center gap-2 rounded px-2 py-1
//                 transition-colors duration-150
//                 hover:bg-slate-600 dark:hover:bg-slate-200
//                 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary
//                 origin-left
//               `}
//               style={{
//                 transform: item.isExpanded() ? "scale(1.02)" : "scale(1)",
//                 transition: "transform .2s ease, background-color .15s ease",
//               }}
//             >
//               <TreeItem item={item}>
//                 <TreeItemLabel>
//                   <span
//                     className={clsx(
//                       "flex items-center gap-2 transition-all duration-200",
//                     )}

//                   >
// {item.isFolder() ? (
//   item.isExpanded() ? (
//     <img
//       src={folderopened}
//       alt="Opened folder"
//       className="w-4 h-4"
//     />
//   ) : (
//     <img
//       src={folderclosed}
//       alt="Closed folder"
//       className="w-4 h-4"
//     />
//   )
// ) : (
//   <img src={file} alt="file" className="w-4 h-4" />
// )}
//                     {item.getItemName()}
//                   </span>
//                 </TreeItemLabel>
//               </TreeItem>
//             </button>
//           </div>
//         ))}
//       </Tree>
//     </div>
//   );
// }
// import React, { useState, useCallback, useMemo } from "react";
// import {
//   expandAllFeature,
//   hotkeysCoreFeature,
//   searchFeature,
//   selectionFeature,
//   syncDataLoaderFeature,
// } from "@headless-tree/core";
// import { useTree } from "@headless-tree/react";
// import clsx from "clsx";
// import SearchInput from "./SearchInput";
// import { Tree, TreeItem, TreeItemLabel } from "./tree";

// import { ChevronLeft } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// import folderopened from "../assets/folder opened.png";
// import folderclosed from "../assets/folder closed.png";
// import file from "../assets/file.png";

// export default function NestedTree({
//   data,
//   initialExpanded,
//   onItemClicked,
//   indent = 30,
//   onItemSelected,
// }) {
//   const defaultRoot = useMemo(() => {
//     if (data["root"]) return "root";
//     const keys = Object.keys(data || {});
//     return keys[0] || null;
//   }, [data]);

//   const [state, setState] = useState({});
//   const [selectedItemId, setSelectedItemId] = useState(null);

//   const tree = useTree({
//     state,
//     setState,
//     initialState: {
//       expandedItems: initialExpanded ?? (defaultRoot ? [defaultRoot] : []),
//     },
//     indent,
//     rootItemId: defaultRoot,
//     getItemName: (item) => item.getItemData().name,
//     isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
//     dataLoader: {
//       getItem: (itemId) => data[itemId],
//       getChildren: (itemId) => data[itemId]?.children ?? [],
//     },
//     features: [
//       syncDataLoaderFeature,
//       hotkeysCoreFeature,
//       selectionFeature,
//       searchFeature,
//       expandAllFeature,
//     ],
//   });

//   if (!defaultRoot) return null;

//   const handleSelectClick = useCallback(
//     (item) => {
//       setSelectedItemId(item.getId());
//       onItemSelected?.(item.getId());
//       onItemClicked?.(item.getId());
//     },
//     [onItemClicked, onItemSelected]
//   );

//   const handleExpandDoubleClick = useCallback(
//     (item) => {
//       if (!item.isFolder()) return;

//       setState((prev) => {
//         let expanded = new Set(prev.expandedItems ?? []);
//         const level = item.getItemMeta().level;

//         if (item.isExpanded()) {
//           expanded.delete(item.getId());
//         } else {
//           const itemsSameLevel = tree
//             .getItems()
//             .filter((it) => it.getItemMeta().level === level);
//           itemsSameLevel.forEach((it) => expanded.delete(it.getId()));
//           expanded.add(item.getId());
//         }

//         return { ...prev, expandedItems: Array.from(expanded) };
//       });
//     },
//     [tree]
//   );

//   return (
//     <div className="flex h-full flex-col gap-2 font-tajawal text-base">
//       <SearchInput />

//       <Tree indent={indent} tree={tree}>
//         {tree.getItems().map((item) => {
//           const isSelected = item.getId() === selectedItemId;
//           const isExpanded = item.isExpanded();
//           const isFolder = item.isFolder();

//           return (
//             <div key={item.getId()} className="group">
//               {/* زر العنصر */}
//               <button
//                 onClick={() => handleSelectClick(item)}
//                 onDoubleClick={() => handleExpandDoubleClick(item)}
//                 className={clsx(
//                   "inline-flex text-left flex items-center gap-2 rounded px-2 py-1 transition-colors duration-150",
//                   "hover:bg-slate-600 dark:hover:bg-slate-200 font-medium",
//                   "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary origin-left",
//                   isSelected
//                     ? "bg-blue-600 text-white dark:bg-blue-400 dark:text-black"
//                     : ""
//                 )}
//                 style={{
//                   paddingInlineStart: `${item.getItemMeta().level * indent}px`,
//                 }}
//               >
//                 <TreeItem item={item}>
//                   <TreeItemLabel>
//                     <span className="flex items-center gap-2">
//                       {/* سهم متحرك */}
//                       {isFolder ? (
// <ChevronLeft
//   className={clsx(
//     "w-4 h-4 text-gray-500 transition-transform duration-200",
//     isExpanded && "-rotate-90"
//   )}
// />
//                       ) : (
//                         <span className="w-4 h-4" />
//                       )}

//                       {/* أيقونة الملف/الفولدر */}
//                       {isFolder ? (
//                         isExpanded ? (
//                           <img
//                             src={folderopened}
//                             alt="Opened folder"
//                             className="w-4 h-4"
//                           />
//                         ) : (
//                           <img
//                             src={folderclosed}
//                             alt="Closed folder"
//                             className="w-4 h-4"
//                           />
//                         )
//                       ) : (
//                         <img src={file} alt="file" className="w-4 h-4" />
//                       )}

//                       {/* اسم العنصر */}
//                       {item.getItemName()}
//                     </span>
//                   </TreeItemLabel>
//                 </TreeItem>
//               </button>

//               {/* أنيميشن للأطفال */}
//               <AnimatePresence initial={false}>
//                 {isExpanded && isFolder && (
//                   <motion.div
//                     key="children"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.25, ease: "easeInOut" }}
//                   >
//                     {item.getChildren().map((child) => (
//                       <div key={child.getId()}>{/* Tree يرندر الطفل */}</div>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           );
//         })}
//       </Tree>
//     </div>
//   );
// }

// import React, { useState, useCallback, useMemo } from "react";
// import {
//   expandAllFeature,
//   hotkeysCoreFeature,
//   searchFeature,
//   selectionFeature,
//   syncDataLoaderFeature,
// } from "@headless-tree/core";
// import { useTree } from "@headless-tree/react";
// import { SearchIcon } from "lucide-react";

// import Input from "./ui/input";
// import { Button } from "./ui/button";

// import { Tree, TreeItem, TreeItemLabel } from "./tree";
// import folderopened from "../assets/folder opened.png";
// import folderclosed from "../assets/folder closed.png";
// import file from "../assets/file.png";
// import clsx from "clsx";
// import { useLanguage } from "@/context/LanguageContext";
// import SearchInput from "./SearchInput";
// /**
//  * Props:
//  * - data: object map of itemId -> { name, children?: [childId,...], ... }
//  * - initialExpanded: array of itemIds to start expanded (defaults to first key)
//  * - onItemClicked: function(itemId) called on double click (can change to click if you prefer)
//  * - indent: number px indent per level
//  */
// export default function NestedTree({
//   data,
//   initialExpanded,
//   onItemClicked,
//   indent = 30,
//   onItemSelected, // جديد: callback لتعريف العنصر المختار للأب
// }) {
//   // const defaultRoot = useMemo(() => {
//   //   const keys = Object.keys(data || {});
//   //   return keys[0] || null;
//   // }, [data]);
// const defaultRoot = useMemo(() => {
//   if (data["root"]) return "root"; // جذر وهمي موجود؟
//   const keys = Object.keys(data || {});
//   return keys[0] || null;
// }, [data]);

//   const [state, setState] = useState({});
//   const [selectedItemId, setSelectedItemId] = useState(null); // حالة العنصر المختار
//   const { languageId } = useLanguage();

//   const tree = useTree({
//     state,
//     setState,
//     initialState: {
//       expandedItems: initialExpanded ?? (defaultRoot ? [defaultRoot] : []),
//     },
//     indent,
//     rootItemId: defaultRoot,
//     getItemName: (item) => item.getItemData().name,
//     isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,

//     dataLoader: {
//       getItem: (itemId) => data[itemId],
//       getChildren: (itemId) => data[itemId]?.children ?? [],
//     },
//     features: [
//       syncDataLoaderFeature,
//       hotkeysCoreFeature,
//       selectionFeature,
//       searchFeature,
//       expandAllFeature,
//     ],
//   });

//   const searchInputProps = tree.getSearchInputElementProps();

//   const handleSearchChange = useCallback(
//     (e) => {
//       searchInputProps.onChange?.(e);
//       const value = e.target.value;
//       if (value.length > 0) {
//         tree.expandAll();
//       } else {
//         setState((prev) => ({
//           ...prev,
//           expandedItems: initialExpanded ?? (defaultRoot ? [defaultRoot] : []),
//         }));
//       }
//     },
//     [searchInputProps, tree, initialExpanded, defaultRoot]
//   );

//   // عند الضغط على عنصر، نخزن الـ selectedItemId ونرسلها للأب (لو موجود)
//   const handleItemClick = useCallback(
//     (item) => {
//       setSelectedItemId(item.getId());
//       if (onItemSelected) {
//         onItemSelected(item.getId());
//       }
//       // لو عايزة تنفذي وظيفة أخرى على النقر
//       onItemClicked?.(item.getId());
//     },
//     [onItemClicked, onItemSelected]
//   );
//   // const handleItemClick = useCallback(
//   //   (item) => {
//   //     onItemClicked?.(item.getId());
//   //   },
//   //   [onItemClicked]
//   // );

//   if (!defaultRoot) return null; // no data

//   return (
//     <div className="flex h-full flex-col gap-2">
//        {/* Search form */}
//        <SearchInput/>
//       <Tree indent={indent} tree={tree}>
//         {tree.getItems().map((item) => {
//           const isSelected = item.getId() === selectedItemId;
//           return (
//             <div key={item.getId()} className="group">
//               <button
//                 onDoubleClick={() => handleItemClick(item)}
//                 className={`
//                 inline-flex text-left flex items-center gap-2 rounded px-2 py-1
//                 transition-colors duration-150
//                 hover:bg-slate-600 dark:hover:bg-slate-200 font-medium
//                 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary
//                 origin-left ${
//                   isSelected
//                     ? "bg-blue-600 text-white dark:bg-blue-400 dark:text-black" // ستايل العنصر المحدد
//                     : ""
//                 }
//               `}
//                 style={{
//                   paddingInlineEnd: `${
//                     item.getItemMeta().level * indent + 8
//                   }px`, // +8 for extra padding

//                   transform: item.isExpanded() ? "scale(1.02)" : "scale(1)",
//                   transition: "transform .2s ease, background-color .15s ease",
//                 }}
//               >
//                 <TreeItem item={item}>
//                   <TreeItemLabel>
//                     <span
//                       className={clsx(
//                         "flex items-center gap-2 transition-all duration-200"
//                       )}
//                     >
//                       {item.isFolder() ? (
//                         item.isExpanded() ? (
//                           <img
//                             src={folderopened}
//                             alt="Opened folder"
//                             className="w-4 h-4"
//                           />
//                         ) : (
//                           <img
//                             src={folderclosed}
//                             alt="Closed folder"
//                             className="w-4 h-4"
//                           />
//                         )
//                       ) : (
//                         <img src={file} alt="file" className="w-4 h-4" />
//                       )}
//                       {item.getItemName()}
//                     </span>
//                   </TreeItemLabel>
//                 </TreeItem>
//               </button>
//             </div>
//           );
//         })}
//       </Tree>
//     </div>
//   );
// }

// // import React, { useState } from "react"
// // import {
// //   expandAllFeature,
// //   hotkeysCoreFeature,
// //   searchFeature,
// //   selectionFeature,
// //   syncDataLoaderFeature,
// // } from "@headless-tree/core";
// // import { useTree } from "@headless-tree/react"
// // import { FolderIcon, FolderOpenIcon, SearchIcon } from "lucide-react"

// // import { Input } from "../components/ui/input"
// // import { Tree, TreeItem, TreeItemLabel } from "../components/tree"

// // const items = {
// //   company: {
// //     name: "Company",
// //     children: ["engineering", "marketing", "operations"],
// //   },
// //   engineering: {
// //     name: "Engineering",
// //     children: ["frontend", "backend", "platform-team"],
// //   },
// //   frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
// //   "design-system": {
// //     name: "Design System",
// //     children: ["components", "tokens", "guidelines"],
// //   },
// //   components: { name: "Components" },
// //   tokens: { name: "Tokens" },
// //   guidelines: { name: "Guidelines" },
// //   "web-platform": { name: "Web Platform" },
// //   backend: { name: "Backend", children: ["apis", "infrastructure"] },
// //   apis: { name: "APIs" },
// //   infrastructure: { name: "Infrastructure" },
// //   "platform-team": { name: "Platform Team" },
// //   marketing: { name: "Marketing", children: ["content", "seo"] },
// //   content: { name: "Content" },
// //   seo: { name: "SEO" },
// //   operations: { name: "Operations", children: ["hr", "finance"] },
// //   hr: { name: "HR" },
// //   finance: { name: "Finance" },
// // }

// // const indent = 20

// // export default function NestedTree(Data ,onItemChlicked) {
// //   const [state, setState] = useState({})

// //   const tree = useTree({
// //     state,
// //     setState,
// //     initialState: {
// //       expandedItems: Data,
// //     },
// //     indent,
// //     rootItemId: "company",
// //     getItemName: (item) => item.getItemData().name,
// //     isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
// //     dataLoader: {
// //       getItem: (itemId) => items[itemId],
// //       getChildren: (itemId) => items[itemId].children ?? [],
// //     },
// //     features: [
// //       syncDataLoaderFeature,
// //       hotkeysCoreFeature,
// //       selectionFeature,
// //       searchFeature,
// //       expandAllFeature,
// //     ],
// //   })

// //   return (
// //     <div className="flex h-full flex-col gap-2 *:nth-2:grow">
// //       <div className="relative">
// //         <Input
// //           className="peer ps-9"
// //           {...{
// //             ...tree.getSearchInputElementProps(),
// //             onChange: (e) => {
// //               // First call the original onChange handler from getSearchInputElementProps
// //               const originalProps = tree.getSearchInputElementProps()
// //               if (originalProps.onChange) {
// //                 originalProps.onChange(e)
// //               }

// //               // Then handle our custom logic
// //               const value = e.target.value

// //               if (value.length > 0) {
// //                 // If input has at least one character, expand all items
// //                 tree.expandAll()
// //               } else {
// //                 // If input is cleared, reset to initial expanded state
// //                 setState((prevState) => {
// //                   return {
// //                     ...prevState,
// //                     expandedItems: Data,
// //                   }
// //                 })
// //               }
// //             },
// //           }}
// //           type="search"
// //           placeholder="Quick search..." />
// //         <div
// //           className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
// //           <SearchIcon className="size-4" aria-hidden="true" />
// //         </div>
// //       </div>
// //       <Tree indent={indent} tree={tree}>
// //         {tree.getItems().map((item) => {
// //           return (
// //             <button className="hover:bg-slate-500" onDoubleClick={onItemChlicked()} key={item.getId()}>

// //             <TreeItem  item={item} >
// //               <TreeItemLabel>
// //                 <span className="flex items-center gap-2">
// //                   {item.isFolder() &&
// //                     (item.isExpanded() ? (
// //                       <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
// //                     ) : (
// //                       <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
// //                     ))}
// //                   {item.getItemName()}
// //                 </span>
// //               </TreeItemLabel>
// //             </TreeItem>
// //             </button>
// //           );
// //         })}
// //       </Tree>

// //     </div>
// //   );
// // }
