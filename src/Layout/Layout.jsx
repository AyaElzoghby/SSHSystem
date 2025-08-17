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
  const {token}=useUser()
  useSystemTheme();
  
  return (
    <>
      <div className={`${token&&"p-4"}`} dir={languageId===1?"rtl":"ltr"}>
        <div className="flex">
          {token&&(

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
          )}

          <div className={`${token&&" ms-4 max-h-[98svh] overflow-y-auto"} flex-1`}>
            {token&&(
              
            <Navbar />
            )}
            <Outlet>{children}</Outlet>
          </div>
        </div>
      </div>
    </>
  );
}
