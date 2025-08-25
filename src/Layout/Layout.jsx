import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./Aside";
import Navbar from "./Navbar";
import useSystemTheme from "@/hooks/SystemTheme";
import layoutLang from "@/constants/Lang/layout";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/userContext";
export default function Layout({ children }) {
  const { languageId } = useLanguage();
  const { token } = useUser();
  useSystemTheme();

  return (
    <>
      <div
        className={`${token && "p-4"}`}
        dir={languageId === 1 ? "rtl" : "ltr"}
      >
        <div className="flex">
          {/* {token && ( */}
            <Sidebar>
              <SidebarItem
                icon={<Home size={20} />}
                text={layoutLang.Receipt[languageId]}
                path="/Receipt"
              />
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text={layoutLang.AccountsChart[languageId]}
                path="/AccountsChart"
              />
              <SidebarItem
                icon={<LifeBuoy size={20} />}
                text={layoutLang.JournalEntry[languageId]}
                path="/JournalEntry"
              />
              <SidebarItem
                icon={<StickyNote size={20} />}
                text={layoutLang.AccountsStatement[languageId]}
                path="/AccountsStatement"
              />
              <SidebarItem
                icon={<Layers size={20} />}
                text={layoutLang.ServicBill[languageId]}
                path="/ServicBill"
              />
              <SidebarItem
                icon={<Calendar size={20} />}
                text={layoutLang.disbursement[languageId]}
                path="/Disbursement"
              />
              <SidebarItem
                icon={<Flag size={20} />}
                text={layoutLang.CostCenter[languageId]}
                path="/CostCenter"
              />
            </Sidebar>
          {/* )} */}

          <div className={`${token && " ms-4 max-h-[98svh]"} flex-1`}>
            {/* {token && ( */}
              <div className="sticky">
                <Navbar />
              </div>
            {/* )} */}
            <div
              className={`${
                token &&
                "max-h-[90svh] flex=1 justify-center items-center my-auto overflow-y-auto"
              } flex-1  [&::-webkit-scrollbar]:w-3
          [&::-webkit-scrollbar-track]:rounded-md
          [&::-webkit-scrollbar-track]:bg-surface
          [&::-webkit-scrollbar-thumb]:rounded-md
          [&::-webkit-scrollbar-thumb]:bg-success"`}
            >
              <Outlet>{children}</Outlet>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
