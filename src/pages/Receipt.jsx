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
import SearchInput from "@/components/SearchInput";
export default function Receipt() {
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
        className="flex-col justify-around m-auto items-center overflow-y-auto"
      >
        <div className="col-span-12 lg:col-span-5 text-textPrimary flex items-center my-4 gap-4 bg-surface p-4 shadow-md h-fit rounded-lg grid grid-cols-12">
          <div className="col-span-12 md:col-span-9 flex gap-4">
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
          <div className="col-span-12 grid grid-cols-12 h-fit">
            <div className="col-span-12 grid grid-cols-12 gap-4 h-fit">
              <div className="relative border border-gray-400 rounded-md p-4 mt-6 col-span-12 md:col-span-6">
                {/* Label */}
                <span className="absolute -top-3 start-3 bg-surface px-1 text-sm text-gray-600">
                  {ReceiptLang.received[languageId]}{" "}
                </span>

                {/* Content inside div */}
                <div className="text-gray-800">
                  <DropdownComponent
                    flex
                    label={ReceiptLang.account[languageId]}
                  />
                </div>
              </div>
              <div className="relative border border-gray-400 rounded-md p-4 mt-6 col-span-12 md:col-span-6">
                {/* Label */}
                <span className="absolute -top-3 start-3 bg-surface px-1 text-sm text-gray-600">
                  {ReceiptLang.Deposited[languageId]}{" "}
                </span>

                {/* Content inside div */}
                <div className="text-gray-800">
                  <DropdownComponent
                    flex
                    label={ReceiptLang.account[languageId]}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 grid grid-cols-12 gap-4 h-fit">
              <div className="relative border border-gray-400 rounded-md p-4 mt-6 col-span-12 md:col-span-6">
                {/* Label */}
                <span className="absolute -top-3 start-3 bg-surface px-1 text-sm text-gray-600">
                  {ReceiptLang.Amountdetails[languageId]}{" "}
                </span>

                {/* Content inside div */}
                <div className="text-gray-800">
                  <InputComponent
                    flex
                    title={ReceiptLang.Amount[languageId]}
                    type="number"
                  />
                  <InputComponent
                    flex
                    title={ReceiptLang.Operationnumber[languageId]}
                    type="number"
                  />

                  <DropdownComponent
                    flex
                    label={ReceiptLang.paymentmethod[languageId]}
                  />
                  <InputComponent
                    flex
                    title={ReceiptLang.Payment[languageId]}
                    type="date"
                  />
                </div>
              </div>
              <div className="relative border border-gray-400 rounded-md p-4 mt-6 col-span-12 md:col-span-6">
                {/* Label */}
                <span className="absolute -top-3 start-3 bg-surface px-1 text-sm text-gray-600">
                  {ReceiptLang.voucherlinks[languageId]}{" "}
                </span>

                {/* Content inside div */}
                <div className="text-gray-800">
                  <DropdownComponent
                    flex
                    label={ReceiptLang.Costcenter[languageId]}
                  />
                  <DropdownComponent
                    flex
                    label={ReceiptLang.invoice[languageId]}
                  />
                  <DropdownComponent
                    flex
                    label={ReceiptLang.Seller[languageId]}
                  />
                </div>
              </div>
            </div>

            <div className="relative border border-gray-400 rounded-md p-4 mt-6 col-span-12">
              {/* Label */}
              <span className="absolute -top-3 start-3 bg-surface px-1 text-sm text-gray-600">
                {ReceiptLang.Notes[languageId]}{" "}
              </span>

              {/* Content inside div */}
              <div className="text-gray-800">
                <InputComponent flex title={ReceiptLang.Ref[languageId]} />
                <InputComponent flex title={ReceiptLang.Notes[languageId]} />
              </div>
            </div>
          </div>
          <div className="col-span-12  flex-wrap gap-4 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-6  flex  gap-4">
              <InputComponent
                flex
                title={ReceiptLang.Unitsymbol[languageId]}
                type="number"
              />
              <InputComponent
                flex
                title={ReceiptLang.Balancebefore[languageId]}
                type="number"
              />
            </div>
            <div className="col-span-12 lg:col-span-6  flex  gap-4">
              <InputComponent
                flex
                title={ReceiptLang.Buildingsymbol[languageId]}
                type="number"
              />
              <InputComponent
                flex
                title={ReceiptLang.Balanceafter[languageId]}
                type="number"
              />
            </div>
            <div className="col-span-6 lg:col-span-3  flex  gap-4">
              <InputComponent flex title={ReceiptLang.Contract[languageId]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
