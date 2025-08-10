import React, { useState } from "react";
import Dropdown from "../components/ui/DropDown";
import InputComponent from "../components/InputComponent";
import Tabs from "../components/Tabs"; // تأكد من مسار الملف حسب مكانه
import Checkbox from "../components/Checkbox";
import CostCenterLang from "@/constants/Lang/CostCenter";
import { useLanguage } from "@/context/LanguageContext";
export default function AccountFormCostCenter() {
  const { languageId } = useLanguage();
  const [formData, setFormData] = useState({
    agency: "",
    name: "",
    country: "",
    province: "",
    city: "",
    address: "",
  });
  const contentsData = [
    {
      tab_title: CostCenterLang.information[languageId],
      tab_contents: (
        <div
          className="flex-col gap-x-6 gap-y-4"
          dir={languageId == 1 ? "rtl" : "ltr"}
        >
          <InputComponent
            flex
            label={CostCenterLang.Address1[languageId]}
            title={CostCenterLang.Address1[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.Address2[languageId]}
            title={CostCenterLang.Address2[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.Fax[languageId]}
            title={CostCenterLang.Fax[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.Mobile[languageId]}
            title={CostCenterLang.Mobile[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.Employee[languageId]}
            title={CostCenterLang.Employee[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.delegate[languageId]}
            title={CostCenterLang.delegate[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.email[languageId]}
            title={CostCenterLang.email[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.CostCenterHistory[languageId]}
            title={CostCenterLang.CostCenterHistory[languageId]}
          />
        </div>
      ),
    },
    {
      tab_title: CostCenterLang.openingBalance[languageId],
      tab_contents: (
        <div
          className="gap-x-6 gap-y-4 text-center sm:grid-cols-6"
          dir={languageId == 1 ? "rtl" : "ltr"}
        >
          <div className="justify-center flex">
            <p
              className={`text-sm  border-button-warning-light dark:border-button-warning-dark border-b-2 font-semibold mb-4 w-fit  justify-center flex text-text-light dark:text-text-dark text-start `}
            >
              {CostCenterLang.openingBalanceCurrent[languageId]}
            </p>
          </div>
          <InputComponent
            flex
            label={CostCenterLang.debtor[languageId]}
            title={CostCenterLang.debtor[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.creditor[languageId]}
            title={CostCenterLang.creditor[languageId]}
          />
          <div className="justify-center flex">
            <p
              className={`text-sm  border-button-warning-light dark:border-button-warning-dark border-b-2 font-semibold mb-4 w-fit  text-text-light dark:text-text-dark text-start `}
            >
              {CostCenterLang.ForeignCurrencies[languageId]}
            </p>
          </div>
          <Dropdown
            flex
            rtl={languageId == 1}
            label={CostCenterLang.ChooseCurrency[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.debtor[languageId]}
            title={CostCenterLang.debtor[languageId]}
          />
          <InputComponent
            flex
            label={CostCenterLang.creditor[languageId]}
            title={CostCenterLang.creditor[languageId]}
          />
        </div>
      ),
    },
    {
      tab_title: CostCenterLang.CostCenterControl[languageId],
      tab_contents: (
        <div
          className="gap-x-6 gap-y-4 sm:grid-cols-6 "
          dir={languageId == 1 ? "rtl" : "ltr"}
        >
          <div className="items-center gap-4  flex justify-between">
            <p
              className={`text-sm font-semibold mb-2  justify-center flex text-text-light dark:text-text-dark text-start `}
            >
              {CostCenterLang.CreditLimit[languageId]}{" "}
            </p>

            <InputComponent
              flex
              label={CostCenterLang.debtor[languageId]}
              title={CostCenterLang.debtor[languageId]}
            />
            <InputComponent
              flex
              label={CostCenterLang.creditor[languageId]}
              title={CostCenterLang.creditor[languageId]}
            />
          </div>

          <div
            className="col-span-full  gap-x-6 "
            dir={languageId == 1 ? "rtl" : "ltr"}
          >
            {" "}
            <Dropdown
              rtl={languageId == 1}
              flex
              label={CostCenterLang.View[languageId]}
            />
            <Checkbox label={CostCenterLang.NotifyCustomer[languageId]} />
            <Checkbox label={CostCenterLang.SuspendAccount[languageId]} />
            <InputComponent
              title={CostCenterLang.SuspendAccountReason[languageId]}
              placeholder={CostCenterLang.SuspendAccountReason[languageId]}
            />
            <Checkbox
              label={CostCenterLang.AccountHandlingNotes[languageId]}
            />
            <InputComponent
              title={CostCenterLang.AccountHandlingNotes[languageId]}
              placeholder={CostCenterLang.AccountHandlingNotes[languageId]}
            />
            <Checkbox label={CostCenterLang.accountMustLinked[languageId]} />
          </div>
        </div>
      ),
    },
   
  ];
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("تم الحفظ:", formData);
  };

  const handleNew = () => {
    setFormData({
      agency: "",
      name: "",
      country: "",
      province: "",
      city: "",
      address: "",
    });
  };

  return (
    <div
      dir={languageId == 1 ? "rtl" : "ltr"}
      className="max-w-3xl mx-auto p-6 rounded-md shadow-md"
    >
      <div className="">
        <InputComponent
          flex
          label={CostCenterLang.AccountNumber[languageId]}
          title={CostCenterLang.AccountNumber[languageId]}
        />
        <InputComponent
          flex
          label={CostCenterLang.CenterName[languageId]}
          title={CostCenterLang.CenterName[languageId]}
        />
        <InputComponent
          flex
          label={CostCenterLang.AccountNameEn[languageId]}
          title={CostCenterLang.AccountNameEn[languageId]}
        />
        <InputComponent
          flex
          label={CostCenterLang.MainAccount[languageId]}
          title={CostCenterLang.MainAccount[languageId]}
        />
        <Dropdown
          rtl={languageId == 1}
          flex
          label={CostCenterLang.AccountType[languageId]}
        />
      </div>
      <div className="">
        <div>
          <Tabs contents={contentsData} />
        </div>
      </div>
    </div>
  );
}
