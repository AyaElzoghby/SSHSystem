import React, { useState } from "react";
import Dropdown from "../components/ui/DropDown";
import InputComponent from "../components/InputComponent";
import Tabs from "../components/Tabs"; // تأكد من مسار الملف حسب مكانه
import Checkbox from "../components/Checkbox";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import { useLanguage } from "@/context/LanguageContext";
export default function AccountFormAccountsChart() {
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
      tab_title: AccountsChartLang.information[languageId],
      tab_contents: (
        <div
          className="flex-col gap-x-6 gap-y-4"
          dir={languageId == 1 ? "rtl" : "ltr"}
        >
          <InputComponent
            flex
            label={AccountsChartLang.Address1[languageId]}
            title={AccountsChartLang.Address1[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.Address2[languageId]}
            title={AccountsChartLang.Address2[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.Fax[languageId]}
            title={AccountsChartLang.Fax[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.Mobile[languageId]}
            title={AccountsChartLang.Mobile[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.email[languageId]}
            title={AccountsChartLang.email[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.Tax[languageId]}
            title={AccountsChartLang.Tax[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.email[languageId]}
            title={AccountsChartLang.email[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.AccountHistory[languageId]}
            title={AccountsChartLang.AccountHistory[languageId]}
          />
        </div>
      ),
    },
    {
      tab_title: AccountsChartLang.openingBalance[languageId],
      tab_contents: (
        <div
          className="gap-x-6 gap-y-4 text-center sm:grid-cols-6"
          dir={languageId == 1 ? "rtl" : "ltr"}
        >
          <div className="justify-center flex">
            <p
              className={`text-sm  border-button-warning-light dark:border-button-warning-dark border-b-2 font-semibold mb-4 w-fit  justify-center flex text-text-light dark:text-text-dark text-start `}
            >
              {AccountsChartLang.openingBalanceCurrent[languageId]}
            </p>
          </div>
          <InputComponent
            flex
            label={AccountsChartLang.debtor[languageId]}
            title={AccountsChartLang.debtor[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.creditor[languageId]}
            title={AccountsChartLang.creditor[languageId]}
          />
          <div className="justify-center flex">
            <p
              className={`text-sm  border-button-warning-light dark:border-button-warning-dark border-b-2 font-semibold mb-4 w-fit  text-text-light dark:text-text-dark text-start `}
            >
              {AccountsChartLang.ForeignCurrencies[languageId]}
            </p>
          </div>
          <Dropdown
            flex
            rtl={languageId == 1}
            label={AccountsChartLang.ChooseCurrency[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.debtor[languageId]}
            title={AccountsChartLang.debtor[languageId]}
          />
          <InputComponent
            flex
            label={AccountsChartLang.creditor[languageId]}
            title={AccountsChartLang.creditor[languageId]}
          />
        </div>
      ),
    },
    {
      tab_title: AccountsChartLang.AccountControl[languageId],
      tab_contents: (
        <div
          className="gap-x-6 gap-y-4 sm:grid-cols-6 "
          dir={languageId == 1 ? "rtl" : "ltr"}
        >
          <div className="items-center gap-4  flex justify-between">
            <p
              className={`text-sm font-semibold mb-2  justify-center flex text-text-light dark:text-text-dark text-start `}
            >
              {AccountsChartLang.CreditLimit[languageId]}{" "}
            </p>

            <InputComponent
              flex
              label={AccountsChartLang.debtor[languageId]}
              title={AccountsChartLang.debtor[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.creditor[languageId]}
              title={AccountsChartLang.creditor[languageId]}
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
              label={AccountsChartLang.View[languageId]}
            />
            <Checkbox label={AccountsChartLang.NotifyCustomer[languageId]} />
            <Checkbox label={AccountsChartLang.SuspendAccount[languageId]} />
            <InputComponent
              title={AccountsChartLang.SuspendAccountReason[languageId]}
              placeholder={AccountsChartLang.SuspendAccountReason[languageId]}
            />
            <Checkbox
              label={AccountsChartLang.AccountHandlingNotes[languageId]}
            />
            <InputComponent
              title={AccountsChartLang.AccountHandlingNotes[languageId]}
              placeholder={AccountsChartLang.AccountHandlingNotes[languageId]}
            />
            <Checkbox label={AccountsChartLang.accountMustLinked[languageId]} />
          </div>
        </div>
      ),
    },
    {
      tab_title: AccountsChartLang.Information1[languageId],
      tab_contents: (
        <div
          className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6"
          dir={languageId == 1 ? "rtl" : "ltr"}
        >
          <div className="col-span-full  items-center gap-x-6 justify-between">
            <InputComponent
              flex
              label={AccountsChartLang.Country[languageId]}
              title={AccountsChartLang.Country[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.Governorate[languageId]}
              title={AccountsChartLang.Governorate[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.ZipCode[languageId]}
              title={AccountsChartLang.ZipCode[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.buildingNumber[languageId]}
              title={AccountsChartLang.buildingNumber[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.city[languageId]}
              title={AccountsChartLang.city[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.neighborhood[languageId]}
              title={AccountsChartLang.neighborhood[languageId]}
            />
            <InputComponent flex label={"PIot ID"} title={"PIot ID"} />
            <InputComponent
              flex
              label={AccountsChartLang.commercialRegister[languageId]}
              title={AccountsChartLang.commercialRegister[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.streetName[languageId]}
              title={AccountsChartLang.streetName[languageId]}
            />
            <InputComponent
              flex
              label={AccountsChartLang.ExtraStreet[languageId]}
              title={AccountsChartLang.ExtraStreet[languageId]}
            />
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
          label={AccountsChartLang.AccountNumber[languageId]}
          title={AccountsChartLang.AccountNumber[languageId]}
        />
        <InputComponent
          flex
          label={AccountsChartLang.AccountNameAr[languageId]}
          title={AccountsChartLang.AccountNameAr[languageId]}
        />
        <InputComponent
          flex
          label={AccountsChartLang.AccountNameEn[languageId]}
          title={AccountsChartLang.AccountNameEn[languageId]}
        />
        <InputComponent
          flex
          label={AccountsChartLang.MainAccount[languageId]}
          title={AccountsChartLang.MainAccount[languageId]}
        />
        <Dropdown
          rtl={languageId == 1}
          flex
          label={AccountsChartLang.AccountType[languageId]}
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
