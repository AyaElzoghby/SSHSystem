import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import CostCenterLang from "@/constants/Lang/CostCenter";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";
import DatePicker from "@/components/DatePicker";
import { formatDate } from "date-fns";
import { API } from "@/api/api";
import { Dna } from "lucide-react";
export default function CostCenterModal({
  modalType,
  setCostCenterType,
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
  // const dateFormat = languageId == 1 ? "yyyy/MM/dd" : "dd/MM/yyyy";
  const api = API();
  // 1- Validate Code
  useEffect(() => {
    if (!Code) return;

    const validateCostCenterCode = async () => {
      try {
        const res = await api.get(
          `/CostCenter/ValidateCostCenterCode?CostCode=${Code}`
        );

        if (!res) {
          // لو الرد false
          setcodeError(CostCenterLang.Codenotvalid[languageId]);
        } else {
          setcodeError(""); // نظف الخطأ لو صح
          setFormState((prev) => ({ ...prev, dcodE1: Code }));
        }
      } catch (err) {
        setcodeError(CostCenterLang.Errorvalidatingcode[languageId]);
      }
    };

    validateCostCenterCode();
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
    const validateCostCenterName = async () => {
      if (debouncedNameAr) {
        try {
          const res = await api.get(
            `/CostCenter/ValidateCostCenterName?CostName=${debouncedNameAr}`
          );

          if (res) {
            setnameArError(""); // valid
            setFormState((prev) => ({ ...prev, dname: debouncedNameAr }));
          } else {
            setnameArError(CostCenterLang.Arabicnamenotvalid[languageId]); // invalid
          }
        } catch {
          setnameArError(CostCenterLang.ErrorvalidatingArabicname[languageId]);
        }
      }

      if (debouncedNameEn) {
        try {
          const res = await api.get(
            `/CostCenter/ValidateCostCenterName?CostName=${debouncedNameEn}`
          );

          if (res) {
            setnameEnError(""); // valid
            setFormState((prev) => ({ ...prev, dnamE2: debouncedNameEn }));
          } else {
            setnameEnError(CostCenterLang.Englishnamenotvalid[languageId]); // invalid
          }
        } catch {
          setnameEnError(CostCenterLang.ErrorvalidatingEnglishname[languageId]);
        }
      }
    };

    validateCostCenterName();
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
              label={CostCenterLang.secondary[languageId]}
              checked={!formState.dsecondry}
              onChange={() => setCostCenterType("secondary")}
            />
            <Checkbox
              disabled={modalType === "Edit"}
              label={CostCenterLang.general[languageId]}
              checked={formState.dsecondry}
              onChange={() => setCostCenterType("general")}
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
                title={CostCenterLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                disabled={modalType === "Edit"}
                required={true}
                value={Code ? Code : formState.dcodE1 ? formState.dcodE1 : ""}
                error={codeError}
                title={CostCenterLang.CostCenterCode[languageId]}
                type="number"
                onTextChange={(val) => setCode(val)}
              />
            </div>
          </div>
          <InputComponent
            title={CostCenterLang.CostCenterNameArabic[languageId]}
            required={true}
            className="mb-4"
            error={nameArError}
            value={nameAr ? nameAr : formState.dname ? formState.dname : ""}
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
            title={CostCenterLang.CostCenterNameEnglish[languageId]}
            className="mb-4"
            error={nameEnError}
            required={true}
            value={nameEn ? nameEn : formState.dnamE2 ? formState.dnamE2 : ""}
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
          <InputComponent
            disabled={modalType === "Edit"}
            title={CostCenterLang.usercreate[languageId]}
            value={formState.userName}
            required={true}
            onTextChange={(val) =>
              setFormState((prev) => ({ ...prev, userName: val }))
            }
          />
          <InputComponent
            disabled={modalType === "Edit"}
            title={CostCenterLang.codecreate[languageId]}
            value={formState.userNo}
            required={true}
            type="number"
            onTextChange={(val) =>
              setFormState((prev) => ({ ...prev, userNo: val }))
            }
          />{" "}
          <DatePicker
            disabled={modalType === "Edit"}
            title={CostCenterLang.datecreate[languageId]}
            required={true}
            value={formState.es_Date ?? new Date().toISOString().split("T")[0]}
            type="date"
            onTextChange={(val) =>
              setFormState((prev) => ({ ...prev, es_Date: val }))
            }
          />{" "}
          {modalType === "Edit" && (
            <>
              <InputComponent
                title={CostCenterLang.useredit[languageId]}
                value={formState.eUserName}
                required={true}
                onTextChange={(val) =>
                  setFormState((prev) => ({ ...prev, eUserName: val }))
                }
              />
              <InputComponent
                title={CostCenterLang.codeeditor[languageId]}
                value={formState.eUserNo}
                required={true}
                type="number"
                onTextChange={(val) =>
                  setFormState((prev) => ({ ...prev, eUserNo: val }))
                }
              />
              <DatePicker
                required={true}
                title={CostCenterLang.editdate[languageId]}
                value={
                  formState.edDate ?? new Date().toISOString().split("T")[0]
                }
                type="date"
                onTextChange={(val) =>
                  setFormState((prev) => ({ ...prev, edDate: val }))
                }
              />
            </>
          )}
          {/* extra fields لو النوع secondary */}
          {!formState.dsecondry && (
            <>
              {/* Information part */}
              <>
                <p className="text-textPrimary text-base w-fit mb-4 border-b-[0.5px] font-bold">
                  {CostCenterLang.Information[languageId]}
                </p>
                <InputComponent
                  title={CostCenterLang.Address1[languageId]}
                  value={formState.daddress}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, daddress: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.Address2[languageId]}
                  value={formState.daddresS2}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, daddresS2: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.fax[languageId]}
                  value={formState.dphonE2}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dphonE2: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.phone[languageId]}
                  value={formState.dphone}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dphone: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.mobile[languageId]}
                  className="mb-4"
                  value={formState.dtelx}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dtelx: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.Employee[languageId]}
                  value={formState.demployee}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, demployee: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.sales[languageId]}
                  value={formState.dslaes}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dslaes: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.email[languageId]}
                  className="mb-4"
                  value={formState.email}
                  type="email"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, email: val }))
                  }
                />
                <InputComponent
                  title={CostCenterLang.taxnumber[languageId]}
                  value={formState.accVatNo}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, accVatNo: val }))
                  }
                />
                <DatePicker
                  title={CostCenterLang.creationdate[languageId]}
                  value={
                    modalType === "Edit" ? formState.dvaluedate : new Date()
                  }
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, dvaluedate: val }))
                  }
                />
              </>
              {/* openning balance */}
              <>
                <p className="text-textPrimary text-base w-fit mb-4 border-b-[0.5px] font-bold">
                  {CostCenterLang.Openingbalance[languageId]}
                </p>{" "}
                <InputComponent
                  disabled
                  title={`${CostCenterLang.openingBalanceCurrent[languageId]} ${
                    formState.doldacC2 > 0
                      ? CostCenterLang.credit[languageId]
                      : formState.doldacC1 > 0
                      ? CostCenterLang.debt[languageId]
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
                    title={CostCenterLang.debtor[languageId]}
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
                    title={CostCenterLang.creditor[languageId]}
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
              </>
              {/* CostCenter Control */}
              <>
                <p className="text-textPrimary  text-base w-fit mb-4 border-b-[0.5px] font-bold">
                  {CostCenterLang.CostCenterControl[languageId]}
                </p>
                <Checkbox
                  checked={formState.dstop}
                  label={CostCenterLang.SuspendCostCenter[languageId]}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, dstop: val }))
                  }
                />
                {formState.dstop && (
                  <InputComponent
                    placeholder={
                      CostCenterLang.SuspendCostCenterReason[languageId]
                    }
                    value={formState.dStop_Rem}
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, dStop_Rem: val }))
                    }
                  />
                )}
                <Checkbox
                  checked={formState.accshow_Rem}
                  label={CostCenterLang.CostCenterHandlingNotes[languageId]}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, accshow_Rem: val }))
                  }
                />
                {formState.accshow_Rem && (
                  <InputComponent
                    value={formState.acc_Rem}
                    placeholder={
                      CostCenterLang.CostCenterHandlingNotes[languageId]
                    }
                    onTextChange={(val) =>
                      setFormState((prev) => ({ ...prev, acc_Rem: val }))
                    }
                  />
                )}
              </>
            </>
          )}
        </>
      ) : (
        <p className="text-base font-bold text-center">
          {CostCenterLang.deletion[languageId]}
        </p>
      )}
    </>
  );
}
