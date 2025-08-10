import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./Aside";
import Navbar from "./Navbar";
import useSystemTheme from "@/hooks/SystemTheme";
import layoutLang from "@/constants/Lang/layout";
import { useLanguage } from "@/context/LanguageContext";
export default function Layout({ children }) {
  const { languageId, toggleLanguage } = useLanguage();
  useSystemTheme();
  return (
    <>
      <div className="bg-[#1e3756]" dir={languageId===1?"rtl":"ltr"}>
        <div className="flex">
          <Sidebar>
            <SidebarItem
              icon={<Home size={20} />}
              text={layoutLang.Receipt[languageId]}
              path="/Receipt"
              alert
            />
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text={layoutLang.AccountsChart[languageId]}
              path="/AccountsChart"
            />
            <SidebarItem
              icon={<StickyNote size={20} />}
              text={layoutLang.JournalEntry[languageId]}
              path="/JournalEntry"
              alert
            />
            <SidebarItem
              icon={<StickyNote size={20} />}
              text={layoutLang.AccountsStatement[languageId]}
              path="/AccountsStatement"
              alert
            />
            {/* <SidebarItem
              icon={<Layers size={20} />}
              text={layoutLang.AccountsStatement[languageId]}
              path="/AccountsStatement"
            /> */}
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

          <div className="flex-1 bg-background-light dark:bg-background-dark rounded-3xl my-2  me-2 max-h-[98svh] overflow-y-auto">
            <Navbar />
            <Outlet>{children}</Outlet>
          </div>
        </div>
      </div>
    </>
  );
}
