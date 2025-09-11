import Tabs from "../../components/Tabs";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";
import DatePicker from "@/components/DatePicker";

export function AccountDetails({
  DetailedTabs,
  selectedAccount,
  Type,
  Type1,
  Type2,
}) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedAccount ? (
        <>
          {/* toggle checkboxes */}
          <div className="flex justify-start gap-4 mb-4">
            <Checkbox
              label={AccountsChartLang.secondary[languageId]}
              checked={!selectedAccount.dsecondry}
            />
            <Checkbox
              label={AccountsChartLang.general[languageId]}
              checked={selectedAccount.dsecondry}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <DropdownComponent
              disabled
              value={selectedAccount.dacC_TYPE0}
              // initialValue={Type[0]}
              options={Type}
              label={AccountsChartLang.primaryType[languageId]}
            />

            <DropdownComponent
              disabled
              value={selectedAccount.dacC_TYPE}
              // initialValue={Type1[0]}
              options={Type1}
              label={AccountsChartLang.secondaryType[languageId]}
            />

            <DropdownComponent
              disabled
              value={selectedAccount.dacC_TYPE2}
              options={Type2}
              label={AccountsChartLang.tertiaryType[languageId]}
            />
          </div>

          <div className="flex gap-4 grid grid-cols-4 mb-4">
            <div className="col-span-1">
              <InputComponent
                disabled
                type="number"
                value={selectedAccount.dlevel}
                title={AccountsChartLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                disabled
                value={selectedAccount.dcodE1}
                title={AccountsChartLang.accountCode[languageId]}
                type="number"
              />
            </div>
          </div>

          <InputComponent
            disabled
            title={AccountsChartLang.accountNameArabic[languageId]}
            className="mb-4"
            value={selectedAccount.dname}
          />
          <InputComponent
            disabled
            title={AccountsChartLang.accountNameEnglish[languageId]}
            className="mb-4"
            value={selectedAccount.dnamE2}
          />
          {!selectedAccount.dsecondry && <Tabs contents={DetailedTabs} />}
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {AccountsChartLang.SelelctAccountDetails[languageId]}
        </p>
      )}
    </>
  );
}
export function Information({ selectedAccount }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedAccount ? (
        <>
          <InputComponent
            disabled
            title={AccountsChartLang.Address1[languageId]}
            value={selectedAccount.daddress}
          />
          <InputComponent
            disabled
            title={AccountsChartLang.Address2[languageId]}
            value={selectedAccount.daddresS2}
          />
          <InputComponent
            disabled
            title={AccountsChartLang.fax[languageId]}
            value={selectedAccount.dphonE2}
            type="number"
          />
          <InputComponent
            disabled
            title={AccountsChartLang.phone[languageId]}
            value={selectedAccount.dphone}
            type="number"
          />
          <InputComponent
            disabled
            title={AccountsChartLang.mobile[languageId]}
            className="mb-4"
            value={selectedAccount.dtelx}
            type="number"
          />
          <InputComponent
            disabled
            title={AccountsChartLang.Employee[languageId]}
            value={selectedAccount.demployee}
          />
          <InputComponent
            disabled
            title={AccountsChartLang.sales[languageId]}
            value={selectedAccount.dslaes}
          />
          <InputComponent
            disabled
            title={AccountsChartLang.email[languageId]}
            className="mb-4"
            value={selectedAccount.email}
            type="email"
          />
          <InputComponent
            disabled
            title={AccountsChartLang.taxnumber[languageId]}
            value={selectedAccount.accVatNo}
            type="number"
          />
          <DatePicker
            disabled
            title={AccountsChartLang.creationdate[languageId]}
            value={selectedAccount.dfdate}
          />
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {AccountsChartLang.SelelctAccountDetails[languageId]}
        </p>
      )}
    </>
  );
}
export function Openingbalance({ selectedAccount, Currencies }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedAccount ? (
        <>
          {" "}
          <InputComponent
            disabled
                  title={`${AccountsChartLang.openingBalanceCurrent[languageId]} ${selectedAccount.doldacC2==0?AccountsChartLang.debt[languageId]:selectedAccount.doldacC1==0?AccountsChartLang.credit[languageId] :""}`}
            value={selectedAccount.doldacc}
            type="number"
          />
          <div className="flex gap-4">
            <InputComponent
              disabled
              flex
              title={AccountsChartLang.debtor[languageId]}
              value={selectedAccount.doldacC1}
              type="number"
            />
            <InputComponent
              disabled
              flex
              title={AccountsChartLang.creditor[languageId]}
              value={selectedAccount.doldacC2}
              type="number"
            />
          </div>
          <p className="text-textPrimary text-base font-bold">
            {AccountsChartLang.ForeignCurrencies[languageId]}{" "}
          </p>
          <DropdownComponent
            disabled
            label={AccountsChartLang.ChooseCurrency[languageId]}
            value={selectedAccount.dcurrency}
            options={Currencies}
          />
          <div className="flex gap-4">
            <InputComponent
              disabled
              flex
              title={AccountsChartLang.debtor[languageId]}
              value={selectedAccount.dcurrenT1}
              type="number"
            />
            <InputComponent
              disabled
              flex
              title={AccountsChartLang.creditor[languageId]}
              value={selectedAccount.dcurrenT2}
              type="number"
            />
          </div>
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {AccountsChartLang.SelelctAccountDetails[languageId]}
        </p>
      )}
    </>
  );
}
export function AccountControl({ selectedAccount, ViewOf }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedAccount ? (
        <>
          <p className="text-textPrimary mb-4 border-b-2 w-fit text-base font-bold">
            {AccountsChartLang.CreditLimit[languageId]}
          </p>
          <div className="flex gap-4">
            <InputComponent
              flex
              disabled
              title={AccountsChartLang.CreditAmount[languageId]}
              value={selectedAccount.dcrediT_LIMT}
              type="number"
            />
            <InputComponent
              flex
              disabled
              title={AccountsChartLang.creditdays[languageId]}
              value={selectedAccount.dutY_DAY}
              type="number"
            />
          </div>
          <DropdownComponent
            disabled
            flex
            options={ViewOf}
            value={selectedAccount.scur}
            label={AccountsChartLang.View[languageId]}
          />
          <Checkbox
            disabled
            checked={selectedAccount.EMAIL_MSG}
            label={AccountsChartLang.NotifyCustomer[languageId]}
          />
          <Checkbox
            disabled
            checked={selectedAccount.dstop}
            label={AccountsChartLang.SuspendAccount[languageId]}
          />
          {selectedAccount.dstop && (
            <InputComponent
              disabled
              placeholder={AccountsChartLang.SuspendAccountReason[languageId]}
              value={selectedAccount.dStop_Rem}
              type="number"
            />
          )}
          <Checkbox
            disabled
            checked={selectedAccount.Accshow_Rem}
            label={AccountsChartLang.AccountHandlingNotes[languageId]}
          />
          {selectedAccount.Accshow_Rem && (
            <InputComponent
              disabled
              value={selectedAccount.acc_Rem}
              placeholder={AccountsChartLang.AccountHandlingNotes[languageId]}
              type="number"
            />
          )}
          <Checkbox
            disabled
            checked={selectedAccount.CostCRelate}
            label={AccountsChartLang.accountMustLinked[languageId]}
          />
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {AccountsChartLang.SelelctAccountDetails[languageId]}
        </p>
      )}
    </>
  );
}
export function Information1({ selectedAccount }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedAccount ? (
        <>
          <div className="grid grid-cols-5 gap-4 flex">
            <div className="col-span-4 ">
              <InputComponent
                disabled
                flex
                title={AccountsChartLang.Country[languageId]}
                className="mb-4"
                value={selectedAccount.cntryName}
              />
            </div>
            <div className="col-span-1">
              <InputComponent
                disabled
                className="mb-4"
                value={selectedAccount.cntryIdCode}
              />
            </div>
          </div>
          <InputComponent
            disabled
            flex
            title={AccountsChartLang.Governorate[languageId]}
            className="mb-4"
            value={selectedAccount.cntrySubentity}
          />

          <div className="flex gap-4">
            <InputComponent
              disabled
              flex
              type="number"
              value={selectedAccount.postalCode}
              title={AccountsChartLang.PostalCode[languageId]}
            />

            <InputComponent
              flex
              disabled
              value={selectedAccount.buildNo}
              title={AccountsChartLang.buildingNumber[languageId]}
              type="number"
            />
          </div>

          <InputComponent
            flex
            disabled
            title={AccountsChartLang.city[languageId]}
            className="mb-4"
            value={selectedAccount.cityName}
          />
          <InputComponent
            flex
            disabled
            title={AccountsChartLang.neighborhood[languageId]}
            className="mb-4"
            value={selectedAccount.citySubDivsion}
          />
          <InputComponent
            flex
            disabled
            title={AccountsChartLang.PlotID[languageId]}
            className="mb-4"
            value={selectedAccount.plotId}
          />
          <InputComponent
            flex
            disabled
            title={AccountsChartLang.commercialRegister[languageId]}
            className="mb-4"
            value={selectedAccount.crNo}
          />
          <InputComponent
            flex
            disabled
            title={AccountsChartLang.streetName[languageId]}
            className="mb-4"
            value={selectedAccount.streetname}
          />
          <InputComponent
            flex
            disabled
            title={AccountsChartLang.ExtraStreet[languageId]}
            className="mb-4"
            value={selectedAccount.addStreetname}
          />
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {AccountsChartLang.SelelctAccountDetails[languageId]}
        </p>
      )}
    </>
  );
}
