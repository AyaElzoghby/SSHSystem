// import React from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";

// import AccountForm from "./AccountFormReceipt";
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
  faClockRotateLeft,
  faPrint,
  faRightLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import ReceiptLang from "@/constants/Lang/Receipt";
import Checkbox from "@/components/Checkbox";
import DatePickerInput from "@/components/DatePicker";
import DropdownComponent from "@/components/ui/DropDown";
export default function Disbursement() {
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
            title={ReceiptLang.new[languageId]}
          />

          <CustomButton
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            title={ReceiptLang.Edit[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faTrash} />}
            title={ReceiptLang.delete[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            title={ReceiptLang.Save[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faClockRotateLeft} />}
            title={ReceiptLang.review[languageId]}
          />
          <CustomButton
            icon={<FontAwesomeIcon icon={faPrint} />}
            title={ReceiptLang.print[languageId]}
          />

          <CustomButton
            icon={<FontAwesomeIcon icon={faRightFromBracket} />}
            title={ReceiptLang.exit[languageId]}
          />
        </div>
        <div className="flex justify-center  grid grid-cols-12 my-5 gap-4">
          <div className="col-span-full flex gap-4 text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark px-4 pt-4 shadow-md rounded-lg">
            <InputComponent
              flex
              title={ReceiptLang.BondNumber[languageId]}
              type="number"
            />
            <InputComponent
              flex
              title={ReceiptLang.BondHistory[languageId]}
              type="date"
            />
          </div>
          <div className="col-span-full grid grid-cols-12 flex gap-4 text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark px-4 pt-4 shadow-md rounded-lg">
            <div className="col-span-6 flex gap-4">
              <DropdownComponent flex label={ReceiptLang.Account[languageId]} />
              {/* <InputComponent
                type="search"
              /> */}
            </div>
            <div className="col-span-6 flex gap-4">
              <DropdownComponent flex label={ReceiptLang.Account[languageId]} />
              {/* <InputComponent
                flex
                title={ReceiptLang.BondHistory[languageId]}
                type="search"
              /> */}
            </div>
          </div>
          {/* <div
            className="col-span-full shadow-md h-fit rounded-lg max-h-[75svh] text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark overflow-y-auto
                      [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:rounded-full
                      [&::-webkit-scrollbar-track]:bg-navbar-bg-light
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-background-light
                      dark:[&::-webkit-scrollbar-track]:bg-navbar-bg-dark
                      dark:[&::-webkit-scrollbar-thumb]:bg-background-dark"
          >
            <div className="flex justify-between items-center px-10 gap-6 pt-4">
              <InputComponent flex title={ReceiptLang.BondNumber[languageId]} type="number"/> 
              <InputComponent flex title={ReceiptLang.BondHistory[languageId]} type="date"/> 
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
