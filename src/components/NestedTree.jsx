import { useState, useMemo, useRef, useEffect } from "react";
import SearchInput from "./SearchInput";
import CustomButton from "./CustomButton";
import { ChevronLeft } from "lucide-react";
import folderopened from "../assets/folder opened.png";
import folderclosed from "../assets/folder closed.png";
import file from "../assets/file.png";
import { useLanguage } from "@/context/LanguageContext";

/**
 * NestedTree.jsx
 * - data: array of nodes, each node: { dcodE1, dname, children: [...] }
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
  const isExpanded = expandedNodes.has(String(node.dcodE1));
  const isSelected = String(selectedId) === String(node.dcodE1);
  const isFocused = String(focusId) === String(node.dcodE1);
  const ref = useRef(null);
  const { languageId } = useLanguage();

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
          onClickSelect(String(node.dcodE1));
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClickSelect && onDoubleClickSelect(String(node.dcodE1));
        }}
        onFocus={() => setFocusId && setFocusId(String(node.dcodE1))}
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
        className="hover:bg-secondaryHover"
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(String(node.dcodE1));
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
                className={`w-4 h-4 transition-transform duration-200
                  ${isExpanded && "-rotate-90"} ${
                  languageId === 1 ? "" : "-rotate-180"
                }`}
              />
              {isExpanded ? (
                <img
                  src={folderopened}
                  alt="Opened folder"
                  className="w-4 h-4"
                />
              ) : (
                <img
                  src={folderclosed}
                  alt="Closed folder"
                  className="w-4 h-4"
                />
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

        <div style={{ flex: 1 }}>
          {languageId === 1
            ? node.dname
            : node.dnamE2 && node.dnamE2.trim() !== ""
            ? node.dnamE2
            : node.dname}
        </div>
      </div>

      {isExpanded &&
        hasChildren &&
        node.children.map((child) => (
          <TreeItem
            key={String(child.dcodE1)}
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
  selectedId,
  onItemSelected, // called with id (string) on double click
  onSelectedChange,
  initialExpanded = [], // optional array of ids to start expanded
}) {
  const [search, setSearch] = useState("");
  // const [selectedId, setSelectedId] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(
    new Set(initialExpanded.map(String))
  );
  const [focusId, setFocusId] = useState(null);

  // Filter tree by search (returns pruned tree keeping parents of matches)
  const normalize = (str) =>
    String(str || "")
      .toLowerCase()
      .replace(/\s+/g, ""); // يشيل أي مسافات

  const filterTree = (nodes, query) => {
    if (!query) return nodes;
    const q = normalize(query);
    const out = [];

    for (const n of nodes) {
      const name1 = normalize(n.dname);
      const name2 = normalize(n.dnamE2);
      const code = normalize(n.dcodE1);

      let matched = name1.includes(q) || name2.includes(q) || code.includes(q);

      let children = [];

      if (Array.isArray(n.children) && n.children.length > 0) {
        children = filterTree(n.children, query);
        if (children.length > 0) matched = true;
      }

      if (matched) {
        out.push({
          ...n,
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
        ids.add(String(n.dcodE1));
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
        list.push(String(n.dcodE1));
        if (
          expandedNodes.has(String(n.dcodE1)) &&
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
      onSelectedChange(focusId);
    } else if (e.key === "ArrowRight") {
      // expand focused node (if it has children)
      const id = focusId;
      // find node by id in filteredData
      const findNode = (nodes, idToFind) => {
        for (const n of nodes) {
          if (String(n.dcodE1) === String(idToFind)) return n;
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
    setFocusId(String(node.dcodE1));
    if (onSelectedChange) onSelectedChange(String(node.dcodE1));
    if (onItemSelected) onItemSelected(node);
  };

  // Double-click handler -> call parent
  const handleDoubleClick = (id) => {
    console.log("Double click id:", id);

    if (onItemSelected) onItemSelected(String(id));
  };

  // render
  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="nested-tree"
      className="w-full"
    >
      {/* Search + Expand/Collapse All */}
      <SearchInput value={search} onChange={setSearch} />

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
      <div
        className=" overflow-y-auto [&::-webkit-scrollbar]:w-3
          [&::-webkit-scrollbar-track]:rounded-md
          [&::-webkit-scrollbar-track]:bg-surface
          [&::-webkit-scrollbar-thumb]:rounded-md
          [&::-webkit-scrollbar-thumb]:bg-surfaceHover max-h-64 lg:max-h-[72.25svh]"
      >
        {" "}
        {filteredData.length === 0 ? (
          <div style={{ color: "#666", padding: 8 }}>No items</div>
        ) : (
          filteredData.map((node) => (
            <TreeItem
              key={String(node.dcodE1)}
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
