import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import logo from "../assets/logo.png";
import React, { createContext, useContext, useState } from "react";
import "../index.css";
const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <>
      <aside className=" relative">
        <nav className=" h-[97svh] flex flex-col  bg-surface rounded-md   shadow-sm">
          <div
            className={`${
              expanded ? "my-2" : "my-6"
            } p-4 flex justify-between items-center`}
          >
            <button
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              onClick={() => setExpanded((curr) => !curr)}
              className={`p-1.5 ${
                expanded ? "end-2 " : "mx-auto"
              } top-3 shadow-md absolute rounded-md bg-surfaceHover text-textSecondary`}
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <div className="p-4 pb-2 flex justify-center items-center">
            {/* <img
              src={logo}
              className={`overflow-hidden h-32 transition-all ${
                expanded ? "w-32" : "w-0"
              }  `}
            /> */}
            <img
              src={logo}
              loading="lazy" // Lazy load
              width={expanded ? 128 : 0} // ضبط الحجم بدقة
              height={128}
              className="transition-all"
              alt="Logo" // accessibility
            />
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 p-3">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    </>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const SidebarItemComponent=({ icon, text, path, alert })=> {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === path;

  return (
    <li
      onClick={() => navigate(path)}
      className={`relative flex items-center font-bold py-3  px-3 my-1 rounded-md cursor-pointer transition-colors group
        ${
          isActive
            ? "bg-surfaceHover shadow-md text-textPrimary"
            : "hover:bg-surfaceHover text-textSecondary hover:text-textPrimary"
        }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 mx-4" : "hidden"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-red-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}
      {!expanded && (
        <div
          className={`absolute start-full rounded-md px-2 py-1  bg-indigo-100 text-gray-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
export const SidebarItem = React.memo(SidebarItemComponent);

// export function SidebarItem({ icon, text, active, alert }) {
//   const { expanded } = useContext(SidebarContext);
//   return (
//     <li
//       className={`relative flex items-center  font-bold py-3 px-3 my-1  rounded-s-full  cursor-pointer transition-colors group ${
//         active
//           ? "bg-[#f8f8f8] text-gray-800"
//           : "hover:bg-[#f8f8f88a] text-white"
//       }`}
//     >
//       {icon}
//       <span
//         className={`overflow-hidden transition-all ${
//           expanded ? "w-52 mx-4" : "w-0"
//         }`}
//       >
//         {text}
//       </span>
//       {alert && (
//         <div
//           className={`absolute right-2 w-2 h-2 rounded bg-red-400 ${
//             expanded ? "" : "top-2"
//           }`}
//         ></div>
//       )}

//       {!expanded && (
//         <div
//           className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-gray-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
//         >
//           {text}
//         </div>
//       )}
//     </li>
//   );
// }
