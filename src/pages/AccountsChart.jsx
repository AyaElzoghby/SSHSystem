// import React from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";

import AccountForm from "./AccountFormAccountsChart";
import NestedTree from "../components/NestedTree";
import InputComponent from "@/components/InputComponent";
import { useLanguage } from "@/context/LanguageContext";
import CustomButton from "@/components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faSquarePlus,
  faFileLines,
  faPenToSquare,
  faTrash,
  faFolderTree,
  faPrint,
  faRightLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import Checkbox from "@/components/Checkbox";
export default function AccountsChart() {
  const items = {
    company: {
      name: "Company",
      children: ["engineering", "marketing", "operations"],
    },
    engineering: {
      name: "Engineering",
      children: ["frontend", "backend", "platform-team"],
    },
    frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
    "design-system": {
      name: "Design System",
      children: ["components", "tokens", "guidelines"],
    },
    components: { name: "Components" },
    tokens: { name: "Tokens" },
    guidelines: { name: "Guidelines" },
    "web-platform": { name: "Web Platform" },
    backend: { name: "Backend", children: ["apis", "infrastructure"] },
    apis: { name: "APIs" },
    infrastructure: { name: "Infrastructure" },
    "platform-team": { name: "Platform Team" },
    marketing: { name: "Marketing", children: ["content", "seo"] },
    content: { name: "Content" },
    seo: { name: "SEO" },
    operations: { name: "Operations", children: ["hr", "finance"] },
    hr: { name: "HR" },
    finance: { name: "Finance" },
  };
  const { languageId } = useLanguage();

  return (
    <>
      <div
        dir={languageId === 1 ? "rtl" : "ltr"}
        className="flex-col p-4 justify-around m-auto items-center  overflow-y-auto"
      >
        <div className="flex-wrap flex items-center justify-center gap-4">
          <CustomButton
            icon={<FontAwesomeIcon icon={faSquarePlus} />}
            title={AccountsChartLang.new[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faFileLines} />}
            title={AccountsChartLang.Branching[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            title={AccountsChartLang.Edit[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faTrash} />}
            title={AccountsChartLang.delete[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            title={AccountsChartLang.Save[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faRightLeft} />}
            title={AccountsChartLang.transfer[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faPrint} />}
            title={AccountsChartLang.print[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faFolderTree} />}
            title={AccountsChartLang.tree[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faRightFromBracket} />}
            title={AccountsChartLang.exit[languageId]}
          />
        </div>
        <div className="flex grid grid-cols-12 my-5 gap-4">
          <div className="col-span-5 max-w-3xl text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark p-4 shadow-md h-fit rounded-lg">
            <h3 className="block mb-1 border-button-warning-light dark:border-button-warning-dark border-b-2 w-fit mb-4 font-bold">
              {AccountsChartLang.UnitStructure[languageId]}
            </h3>
            <NestedTree data={items} initialExpanded={items[0]} />
          </div>
          <div
            className="col-span-7 shadow-md h-fit rounded-lg max-h-[75svh] text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark overflow-y-auto
                      [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:rounded-full
                      [&::-webkit-scrollbar-track]:bg-navbar-bg-light
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-background-light
                      dark:[&::-webkit-scrollbar-track]:bg-navbar-bg-dark
                      dark:[&::-webkit-scrollbar-thumb]:bg-background-dark"
          >
            <div className="flex justify-between px-10 pt-4">
              <Checkbox label={AccountsChartLang.general[languageId]} />
              <Checkbox label={AccountsChartLang.partial[languageId]} />
            </div>
            <AccountForm />
          </div>
        </div>
      </div>
    </>
  );
}
