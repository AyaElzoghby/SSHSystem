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

// apiSchema.js
export const getSchema = async () => {
  const res = await fetch("/swagger/v1/swagger.json")
  .then(res => res.json())
  .then(data => {
    console.log("Schema:", data.components.schemas.AccountDto.properties);
      return data.components.schemas.AccountDto.properties;

  })
  .catch(err => console.error("Error fetching schema", err));

};

export default function ServicBill() {

  const { languageId } = useLanguage();
getSchema()
  return (
    <>
      <div
        dir={languageId === 1 ? "rtl" : "ltr"}
        className="flex-col p-4 justify-around m-auto items-center  overflow-y-auto"
      >
       
        <div className="flex justify-center  grid grid-cols-12 my-5 gap-4">
          <div className="col-span-full flex gap-4 text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark px-4 pt-4 shadow-md rounded-lg">
       
          </div>
          <div className="col-span-full grid grid-cols-12 flex gap-4 text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark px-4 pt-4 shadow-md rounded-lg">
            <div className="col-span-6 flex gap-4">
       
            </div>
            <div className="col-span-6 flex gap-4">
         
            </div>
          </div>
    
        </div>
      </div>
    </>
  );
}
