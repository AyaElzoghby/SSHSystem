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
import JournalEntryLang from "@/constants/Lang/JournalEntry";
import Checkbox from "@/components/Checkbox";
import DatePickerInput from "@/components/DatePicker";
import DropdownComponent from "@/components/ui/DropDown";
export default function JournalEntry() {
  const { languageId } = useLanguage();

  return (
    <>
      <div
        dir={languageId === 1 ? "rtl" : "ltr"}
        className="flex-col justify-around m-auto items-center overflow-y-auto"
      >
        <div className="col-span-12 lg:col-span-5 text-textPrimary flex items-center my-4 gap-4 bg-surface p-4 shadow-md h-fit rounded-lg grid grid-cols-12">
          <div className="md:col-span-9 flex gap-4">
            <InputComponent
              flex
              title={JournalEntryLang.BondNumber[languageId]}
              type="number"
            />
            <InputComponent
              flex
              title={JournalEntryLang.BondHistory[languageId]}
              type="date"
            />
          </div>
          <div className="col-span-12 h-96">
            
          </div>
          <div className="col-span-12  flex-wrap gap-4 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-6  flex  gap-4">
              <InputComponent
                flex
                title={JournalEntryLang.Totaldebit[languageId]}
                type="number"
              />
              <InputComponent
                flex
                title={JournalEntryLang.TotalCredit[languageId]}
                type="number"
              />
            </div>
            <div className="col-span-12 lg:col-span-6  flex  gap-4">
              <InputComponent
                flex
                title={JournalEntryLang.Registrationdifference[languageId]}
                type="number"
              />
              <InputComponent
                flex
                title={JournalEntryLang.Accountbalance[languageId]}
                type="number"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
