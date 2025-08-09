import React, { useState, useCallback, useMemo } from "react";
import {
  expandAllFeature,
  hotkeysCoreFeature,
  searchFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { SearchIcon } from "lucide-react";

import Input from "./ui/input";
import { Tree, TreeItem, TreeItemLabel } from "./tree";
import folderopened from "../assets/folder opened.png";
import folderclosed from "../assets/folder closed.png";
import file from "../assets/file.png";
import clsx from "clsx";
/**
 * Props:
 * - data: object map of itemId -> { name, children?: [childId,...], ... }
 * - initialExpanded: array of itemIds to start expanded (defaults to first key)
 * - onItemClicked: function(itemId) called on double click (can change to click if you prefer)
 * - indent: number px indent per level
 */
export default function NestedTree({
  data,
  initialExpanded,
  onItemClicked,
  indent = 20,
}) {
  const defaultRoot = useMemo(() => {
    const keys = Object.keys(data || {});
    return keys[0] || null;
  }, [data]);

  const [state, setState] = useState({});

  const tree = useTree({
    state,
    setState,
    initialState: {
      expandedItems: initialExpanded ?? (defaultRoot ? [defaultRoot] : []),
    },
    indent,
    rootItemId: defaultRoot,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,

    dataLoader: {
      getItem: (itemId) => data[itemId],
      getChildren: (itemId) => data[itemId]?.children ?? [],
    },
    features: [
      syncDataLoaderFeature,
      hotkeysCoreFeature,
      selectionFeature,
      searchFeature,
      expandAllFeature,
    ],
  });

  const searchInputProps = tree.getSearchInputElementProps();

  const handleSearchChange = useCallback(
    (e) => {
      searchInputProps.onChange?.(e);
      const value = e.target.value;
      if (value.length > 0) {
        tree.expandAll();
      } else {
        setState((prev) => ({
          ...prev,
          expandedItems: initialExpanded ?? (defaultRoot ? [defaultRoot] : []),
        }));
      }
    },
    [searchInputProps, tree, initialExpanded, defaultRoot]
  );

  const handleItemClick = useCallback(
    (item) => {
      onItemClicked?.(item.getId());
    },
    [onItemClicked]
  );

  if (!defaultRoot) return null; // no data

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="relative">
        <Input
          className="peer ps-9 transition"
          {...{
            ...searchInputProps,
            onChange: handleSearchChange,
          }}
          type="search"
          placeholder="Quick search..."
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
          <SearchIcon className="size-4" aria-hidden="true" />
        </div>
      </div>

      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => (
          <div key={item.getId()} className="group">
            <button
              onDoubleClick={() => handleItemClick(item)}
              className={`
                w-full text-left flex items-center gap-2 rounded px-2 py-1
                transition-colors duration-150
                hover:bg-slate-600 dark:hover:bg-slate-200
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary
                origin-left
              `}
              style={{
                transform: item.isExpanded() ? "scale(1.02)" : "scale(1)",
                transition: "transform .2s ease, background-color .15s ease",
              }}
            >
              <TreeItem item={item}>
                <TreeItemLabel>
                  <span
                    className={clsx(
                      "flex items-center gap-2 transition-all duration-200",
                    )}

                  >
                    {item.isFolder() ? (
                      item.isExpanded() ? (
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
                      )
                    ) : (
                      <img src={file} alt="file" className="w-4 h-4" />
                    )}
                    {item.getItemName()}
                  </span>
                </TreeItemLabel>
              </TreeItem>
            </button>
          </div>
        ))}
      </Tree>
    </div>
  );
}

// import React, { useState } from "react"
// import {
//   expandAllFeature,
//   hotkeysCoreFeature,
//   searchFeature,
//   selectionFeature,
//   syncDataLoaderFeature,
// } from "@headless-tree/core";
// import { useTree } from "@headless-tree/react"
// import { FolderIcon, FolderOpenIcon, SearchIcon } from "lucide-react"

// import { Input } from "../components/ui/input"
// import { Tree, TreeItem, TreeItemLabel } from "../components/tree"

// const items = {
//   company: {
//     name: "Company",
//     children: ["engineering", "marketing", "operations"],
//   },
//   engineering: {
//     name: "Engineering",
//     children: ["frontend", "backend", "platform-team"],
//   },
//   frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
//   "design-system": {
//     name: "Design System",
//     children: ["components", "tokens", "guidelines"],
//   },
//   components: { name: "Components" },
//   tokens: { name: "Tokens" },
//   guidelines: { name: "Guidelines" },
//   "web-platform": { name: "Web Platform" },
//   backend: { name: "Backend", children: ["apis", "infrastructure"] },
//   apis: { name: "APIs" },
//   infrastructure: { name: "Infrastructure" },
//   "platform-team": { name: "Platform Team" },
//   marketing: { name: "Marketing", children: ["content", "seo"] },
//   content: { name: "Content" },
//   seo: { name: "SEO" },
//   operations: { name: "Operations", children: ["hr", "finance"] },
//   hr: { name: "HR" },
//   finance: { name: "Finance" },
// }

// const indent = 20

// export default function NestedTree(Data ,onItemChlicked) {
//   const [state, setState] = useState({})

//   const tree = useTree({
//     state,
//     setState,
//     initialState: {
//       expandedItems: Data,
//     },
//     indent,
//     rootItemId: "company",
//     getItemName: (item) => item.getItemData().name,
//     isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
//     dataLoader: {
//       getItem: (itemId) => items[itemId],
//       getChildren: (itemId) => items[itemId].children ?? [],
//     },
//     features: [
//       syncDataLoaderFeature,
//       hotkeysCoreFeature,
//       selectionFeature,
//       searchFeature,
//       expandAllFeature,
//     ],
//   })

//   return (
//     <div className="flex h-full flex-col gap-2 *:nth-2:grow">
//       <div className="relative">
//         <Input
//           className="peer ps-9"
//           {...{
//             ...tree.getSearchInputElementProps(),
//             onChange: (e) => {
//               // First call the original onChange handler from getSearchInputElementProps
//               const originalProps = tree.getSearchInputElementProps()
//               if (originalProps.onChange) {
//                 originalProps.onChange(e)
//               }

//               // Then handle our custom logic
//               const value = e.target.value

//               if (value.length > 0) {
//                 // If input has at least one character, expand all items
//                 tree.expandAll()
//               } else {
//                 // If input is cleared, reset to initial expanded state
//                 setState((prevState) => {
//                   return {
//                     ...prevState,
//                     expandedItems: Data,
//                   }
//                 })
//               }
//             },
//           }}
//           type="search"
//           placeholder="Quick search..." />
//         <div
//           className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
//           <SearchIcon className="size-4" aria-hidden="true" />
//         </div>
//       </div>
//       <Tree indent={indent} tree={tree}>
//         {tree.getItems().map((item) => {
//           return (
//             <button className="hover:bg-slate-500" onDoubleClick={onItemChlicked()} key={item.getId()}>

//             <TreeItem  item={item} >
//               <TreeItemLabel>
//                 <span className="flex items-center gap-2">
//                   {item.isFolder() &&
//                     (item.isExpanded() ? (
//                       <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
//                     ) : (
//                       <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
//                     ))}
//                   {item.getItemName()}
//                 </span>
//               </TreeItemLabel>
//             </TreeItem>
//             </button>
//           );
//         })}
//       </Tree>

//     </div>
//   );
// }
