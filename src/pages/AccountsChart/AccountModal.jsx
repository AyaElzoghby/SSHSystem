import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";
import DatePicker from "@/components/DatePicker";
import { formatDate } from "date-fns";
import { API } from "@/api/api";
import { Dna } from "lucide-react";
export default function AccountModal({
  modalType,
  Type,
  Type1,
  Type2,
  Currencies,
  ViewOf,
  setAccountType,
  setFormState,
  formState,
  setSelectedType,
  loadingDetails,
}) {
  const { languageId } = useLanguage();
  const [Code, setCode] = useState("");
  const [codeError, setcodeError] = useState("");
  const [nameArError, setnameArError] = useState("");
  const [nameEnError, setnameEnError] = useState("");
  const [nameAr, setnameAr] = useState("");
  const [nameEn, setnameEn] = useState("");
  const dateFormat = languageId == 1 ? "yyyy/MM/dd" : "dd/MM/yyyy";
  const api = API();
  // 1- Validate Code
  useEffect(() => {
    if (!Code) return;

    const validateAccountCode = async () => {
      try {
        const res = await api.get(
          `/Account/ValidateAccountCode?accountCode=${Code}`
        );

        if (!res) {
          // لو الرد false
          setcodeError(AccountsChartLang.Codenotvalid[languageId]);
        } else {
          setcodeError(""); // نظف الخطأ لو صح
          setFormState((prev) => ({ ...prev, dcodE1: Code }));
        }
      } catch (err) {
        setcodeError(AccountsChartLang.Errorvalidatingcode[languageId]);
      }
    };

    validateAccountCode();
  }, [Code]);

  // 2- Validate Name

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  // --- داخل الكومبوننت ---
  // استخدمي ديبونس عشان يتأكد بعد 500ms من توقف الكتابة
  const debouncedNameAr = useDebounce(nameAr, 500);
  const debouncedNameEn = useDebounce(nameEn, 500);

  useEffect(() => {
    const validateAccountName = async () => {
      if (debouncedNameAr) {
        try {
          const res = await api.get(
            `/Account/ValidateAccountName?accountName=${debouncedNameAr}`
          );

          if (res) {
            setnameArError(""); // valid
            setFormState((prev) => ({ ...prev, dname: debouncedNameAr }));
          } else {
            setnameArError(AccountsChartLang.Arabicnamenotvalid[languageId]); // invalid
          }
        } catch {
          setnameArError(AccountsChartLang.ErrorvalidatingArabicname[languageId]);
        }
      }

      if (debouncedNameEn) {
        try {
          const res = await api.get(
            `/Account/ValidateAccountName?accountName=${debouncedNameEn}`
          );

          if (res) {
            setnameEnError(""); // valid
            setFormState((prev) => ({ ...prev, dnamE2: debouncedNameEn }));
          } else {
            setnameEnError(AccountsChartLang.Englishnamenotvalid[languageId]); // invalid
          }
        } catch {
          setnameEnError(AccountsChartLang.ErrorvalidatingEnglishname[languageId]);
        }
      }
    };

    validateAccountName();
  }, [debouncedNameAr, debouncedNameEn]);

  return (
    <>
      {loadingDetails ? (
        <div className="flex items-center justify-center p-10">
          <span className="loader"></span>
        </div>
      ) : modalType === "Edit" || modalType === "Add" ? (
        <>
          {/* toggle checkboxes */}

          <div className="flex justify-start gap-4 mb-4">
            <Checkbox
              disabled={modalType === "Edit"}
              label={AccountsChartLang.secondary[languageId]}
              checked={!formState.dsecondry}
              onChange={() => setAccountType("secondary")}
            />
            <Checkbox
              disabled={modalType === "Edit"}
              label={AccountsChartLang.general[languageId]}
              checked={formState.dsecondry}
              onChange={() => setAccountType("general")}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <DropdownComponent
              disabled={modalType === "Edit" || formState.dlevel > 1}
              value={formState.dacC_TYPE0}
              options={Type}
              label={AccountsChartLang.primaryType[languageId]}
              placeholder={AccountsChartLang.Select[languageId]}
              onChange={(val) => {
                setSelectedType(val.value);
                setFormState((prev) => ({ ...prev, dacC_TYPE0: val.value }));
              }}
            />
            <DropdownComponent
              disabled={modalType === "Edit" || formState.dlevel > 2}
              value={formState.dacC_TYPE}
              options={Type1}
              label={AccountsChartLang.secondaryType[languageId]}
              placeholder={AccountsChartLang.Select[languageId]}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, dacC_TYPE: val.value }))
              }
            />
            <DropdownComponent
              value={formState.dacC_TYPE2}
              options={Type2}
              label={AccountsChartLang.tertiaryType[languageId]}
              placeholder={AccountsChartLang.Select[languageId]}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, dacC_TYPE2: val.value }))
              }
            />
          </div>

          <div className="flex gap-4 grid grid-cols-4 mb-4">
            <div className="col-span-1">
              <InputComponent
                disabled
                type="number"
                onTextChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    dlevel: val,
                  }))
                }
                value={formState.dlevel}
                title={AccountsChartLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                disabled={modalType === "Edit"}
                value={Code ? Code : formState.dcodE1 ? formState.dcodE1: ""}
                error={codeError}
                title={AccountsChartLang.accountCode[languageId]}
                type="number"
                onTextChange={(val) => setCode(val)}
              />
            </div>
          </div>

          <InputComponent
            title={AccountsChartLang.accountNameArabic[languageId]}
            className="mb-4"
            error={nameArError}
            value={nameAr ? nameAr : formState.dname ?  formState.dname:""}
            onTextChange={
              modalType === "Add"
                ? (val) => setnameAr(val)
                : (val) =>
                    setFormState((prev) => ({
                      ...prev,
                      dname: val,
                    }))
            }
          />
          <InputComponent
            title={AccountsChartLang.accountNameEnglish[languageId]}
            className="mb-4"
            error={nameEnError}
            value={nameEn ? nameEn : formState.dnamE2 ?formState.dnamE2 :""}
            onTextChange={
              modalType === "Add"
                ? (val) => setnameEn(val)
                : (val) =>
                    setFormState((prev) => ({
                      ...prev,
                      dnamE2: val,
                    }))
            }
          />
          {/* extra fields لو النوع secondary */}
          {!formState.dsecondry && (
            <>
              {/* Information part */}
              <>
                <p className="text-textPrimary text-base w-fit mb-4 border-b-[0.5px] font-bold">
                  {AccountsChartLang.Information[languageId]}
                </p>
                <InputComponent
                  title={AccountsChartLang.Address1[languageId]}
                  value={formState.daddress}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, daddress: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.Address2[languageId]}
                  value={formState.daddresS2}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, daddresS2: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.fax[languageId]}
                  value={formState.dphonE2}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dphonE2: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.phone[languageId]}
                  value={formState.dphone}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dphone: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.mobile[languageId]}
                  className="mb-4"
                  value={formState.dtelx}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dtelx: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.Employee[languageId]}
                  value={formState.demployee}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, demployee: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.sales[languageId]}
                  value={formState.dslaes}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dslaes: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.email[languageId]}
                  className="mb-4"
                  value={formState.email}
                  type="email"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, email: val }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.taxnumber[languageId]}
                  value={formState.accVatNo}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, accVatNo: val }))
                  }
                />
                <DatePicker
                  title={AccountsChartLang.creationdate[languageId]}
                  value={modalType === "Edit"?formState.dfdate : new Date()}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, dfdate: val }))
                  }
                />
              </>
              {/* openning balance */}
              <>
                <p className="text-textPrimary text-base w-fit mb-4 border-b-[0.5px] font-bold">
                  {AccountsChartLang.Openingbalance[languageId]}
                </p>{" "}
                <InputComponent
                  disabled
                  title={`${
                    AccountsChartLang.openingBalanceCurrent[languageId]
                  } ${
                    formState.doldacC2 > 0
                    ? AccountsChartLang.credit[languageId]
                    : formState.doldacC1 > 0
                    ? AccountsChartLang.debt[languageId]
                      : ""
                  }`}
                  value={Math.abs(formState.doldacc)}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, doldacc: val }))
                  }
                />
                <div className="flex gap-4">
                  <InputComponent
                    flex
                    title={AccountsChartLang.debtor[languageId]}
                    value={formState.doldacC1}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        doldacC1: val,
                        doldacC2: 0,
                      }))
                    }
                  />
                  <InputComponent
                    flex
                    title={AccountsChartLang.creditor[languageId]}
                    value={formState.doldacC2}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        doldacC2: val,
                        doldacC1: 0,
                      }))
                    }
                  />
                </div>
                <p className="text-textPrimary text-base font-bold">
                  {AccountsChartLang.ForeignCurrencies[languageId]}{" "}
                </p>
                <DropdownComponent
                  label={AccountsChartLang.ChooseCurrency[languageId]}
                  value={formState.dcurrency}
                  options={Currencies}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, dcurrency: val.value }))
                  }
                />
                <div className="flex gap-4">
                  <InputComponent
                    flex
                    title={AccountsChartLang.debtor[languageId]}
                    value={formState.dcurrenT1}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        dcurrenT1: val,
                        dcurrenT2: 0,
                      }))
                    }
                  />
                  <InputComponent
                    flex
                    title={AccountsChartLang.creditor[languageId]}
                    value={formState.dcurrenT2}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        dcurrenT2: val,
                        dcurrenT1: 0,
                      }))
                    }
                  />
                </div>
              </>
              {/* Account Control */}
              <>
                <p className="text-textPrimary  text-base w-fit mb-4 border-b-[0.5px] font-bold">
                  {AccountsChartLang.AccountControl[languageId]}
                </p>
                <p className="text-textPrimary mb-4 w-fit text-base font-bold">
                  {AccountsChartLang.CreditLimit[languageId]}
                </p>
                <div className="flex gap-4">
                  <InputComponent
                    flex
                    title={AccountsChartLang.CreditAmount[languageId]}
                    value={formState.dcrediT_LIMT}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, dcrediT_LIMT: val }))
                    }
                  />
                  <InputComponent
                    flex
                    title={AccountsChartLang.creditdays[languageId]}
                    value={formState.dutY_DAY}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, dutY_DAY: val }))
                    }
                  />
                </div>
                <DropdownComponent
                  flex
                  options={ViewOf}
                  value={formState.scur}
                  label={AccountsChartLang.View[languageId]}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, scur: val.value }))
                  }
                />
                <Checkbox
                  checked={formState.emaiL_MSG}
                  label={AccountsChartLang.NotifyCustomer[languageId]}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, emaiL_MSG: val }))
                  }
                />
                <Checkbox
                  checked={formState.dstop}
                  label={AccountsChartLang.SuspendAccount[languageId]}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, dstop: val }))
                  }
                />
                {formState.dstop && (
                  <InputComponent
                    placeholder={
                      AccountsChartLang.SuspendAccountReason[languageId]
                    }
                    value={formState.dStop_Rem}
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, dStop_Rem: val }))
                    }
                  />
                )}
                <Checkbox
                  checked={formState.accshow_Rem}
                  label={AccountsChartLang.AccountHandlingNotes[languageId]}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, accshow_Rem: val }))
                  }
                />
                {formState.accshow_Rem && (
                  <InputComponent
                    value={formState.acc_Rem}
                    placeholder={
                      AccountsChartLang.AccountHandlingNotes[languageId]
                    }
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, acc_Rem: val }))
                    }
                  />
                )}
                <Checkbox
                  checked={formState.CostCRelate}
                  label={AccountsChartLang.accountMustLinked[languageId]}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, CostCRelate: val }))
                  }
                />
              </>
              {/* Information1 */}
              <>
                <p className="text-textPrimary text-base w-fit mb-4 border-b-[0.5px] font-bold">
                  {AccountsChartLang.Information1[languageId]}
                </p>
                <div className="grid grid-cols-5 gap-4 flex">
                  <div className="col-span-4 ">
                    <InputComponent
                      flex
                      title={AccountsChartLang.Country[languageId]}
                      className="mb-4"
                      value={formState.cntryName}
                      onTextChange={(val) =>
                        setFormState((prev) => ({ ...prev, cntryName: val }))
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <InputComponent
                      className="mb-4"
                      // type="number"
                      value={formState.cntryIdCode}
                      onTextChange={(val) =>
                        setFormState((prev) => ({ ...prev, cntryIdCode: val }))
                      }
                    />
                  </div>
                </div>
                <InputComponent
                  flex
                  title={AccountsChartLang.Governorate[languageId]}
                  className="mb-4"
                  value={formState.cntrySubentity}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, cntrySubentity: val }))
                  }
                />

                <div className="flex gap-4">
                  <InputComponent
                    flex
                    type="number"
                    value={formState.postalCode}
                    title={AccountsChartLang.PostalCode[languageId]}
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, postalCode: val }))
                    }
                  />

                  <InputComponent
                    flex
                    value={formState.buildNo}
                    title={AccountsChartLang.buildingNumber[languageId]}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, buildNo: val }))
                    }
                  />
                </div>

                <InputComponent
                  flex
                  title={AccountsChartLang.city[languageId]}
                  className="mb-4"
                  value={formState.cityName}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, cityName: val }))
                  }
                />
                <InputComponent
                  flex
                  title={AccountsChartLang.neighborhood[languageId]}
                  className="mb-4"
                  value={formState.citySubDivsion}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, citySubDivsion: val }))
                  }
                />
                <InputComponent
                  flex
                  title={AccountsChartLang.PlotID[languageId]}
                  className="mb-4"
                  value={formState.plotId}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, plotId: val }))
                  }
                />
                <InputComponent
                  flex
                  title={AccountsChartLang.commercialRegister[languageId]}
                  className="mb-4"
                  value={formState.crNo}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, crNo: val }))
                  }
                />
                <InputComponent
                  flex
                  title={AccountsChartLang.streetName[languageId]}
                  className="mb-4"
                  value={formState.streetname}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, streetname: val }))
                  }
                />
                <InputComponent
                  flex
                  title={AccountsChartLang.ExtraStreet[languageId]}
                  className="mb-4"
                  value={formState.addStreetname}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, addStreetname: val }))
                  }
                />
              </>
            </>
          )}
        </>
      ) : (
        <p className="text-base font-bold text-center">
         {AccountsChartLang.deletion[languageId]}
        </p>
      )}
    </>
  );
}
