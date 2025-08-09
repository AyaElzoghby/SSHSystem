import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import { createContext, useContext, useState } from "react";
import "../index.css";
// import { useLanguage } from "@/context/LanguageContext";
const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  // const [languageId]=useLanguage()
  return (
    <>
      <aside className="h-screen relative">
        <nav className="h-full flex flex-col  bg-[#1e3756] border-s shadow-sm">
          <div  className="p-4 pb-2 flex justify-between items-center">
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 end-2 top-4 absolute rounded-full bg-navbar-bg-light dark:bg-navbar-bg-dark text-navbar-text-light dark:text-navbar-text-dark hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <div className="p-4 pb-2 flex justify-center items-center">
            <img
              src={logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }  ${expanded ? "h-32" : "h-0"}`}
            />
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 ps-3">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    </>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export function SidebarItem({ icon, text, path, alert }) {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === path;

  return (
    <li
      onClick={() => navigate(path)}
      className={`relative flex items-center font-bold py-3 px-3 my-1 rounded-s-full cursor-pointer transition-colors group
        ${
          isActive
            ? "bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            : "hover:bg-hover-light hover:dark:bg-hover-dark text-white"
        }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 mx-4" : "w-0"
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
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-gray-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}

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
