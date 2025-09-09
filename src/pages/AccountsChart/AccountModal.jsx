import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";
import DatePicker from "@/components/DatePicker";
import { formatDate } from "date-fns";
export default function AccountModal({
  modalType,
  Type,
  Type1,
  Type2,
  setAccountType,
  setFormState,
  formState,
  setSelectedType,
  loadingDetails,
}) {
  const {languageId}=useLanguage()
  const [Code, setCode] = useState(""); 
  const [error, setError] = useState("");
  const [nameAr, setnameAr] = useState("");
  const [nameEn, setnameEn] = useState("");
  const dateFormat = languageId==1 ? "yyyy/MM/dd" : "dd/MM/yyyy";

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
              disabled={modalType === "Edit" || formState.dlevel >= 2}
              value={formState.dacC_TYPE}
              options={Type1}
              label={AccountsChartLang.secondaryType[languageId]}
              placeholder={AccountsChartLang.Select[languageId]}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, dacC_TYPE: val.value }))
              }
            />
            <DropdownComponent
              // disabled={modalType === "Edit" || formState.dlevel > 3}
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
                    dlevel: val.replace(/[^\d]/g, ""),
                  }))
                }
                value={formState.dlevel || ""}
                title={AccountsChartLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                disabled={modalType === "Edit"}
                value={formState.dcodE1 || ""}
                title={AccountsChartLang.accountCode[languageId]}
                type="number"
                onTextChange={(val) => {
                  setFormState((prev) => ({
                    ...prev,
                    dcodE1: val.replace(/[^\d]/g),
                  }));
                  // setError("");

                  // setCode(val.replace(/[^\d]/g));
                }}
                // onBlur={async () => {
                //   if (!Code) return;

                //   try {
                //     const res = await api.get(
                //       `Account/ValidateAccountCode?accountCode=${Code}`
                //     );

                //     if (res === "false") {
                //       setError("كود الحساب غير صالح"); // ✨ نظهر رسالة
                //     } else {
                //       setFormState((prev) => ({
                //         ...prev,
                //         dcodE1: Code, // ✨ نعتمد القيمة بس لو valid
                //       }));
                //       setError(""); // نمسح رسالة الخطأ
                //     }
                //   } catch (err) {
                //     console.error("Fetch error:", err);
                //     setError("حصل خطأ أثناء التحقق");
                //   }
                // }}
              />
            </div>
          </div>

          <InputComponent
            title={AccountsChartLang.accountNameArabic[languageId]}
            className="mb-4"
            value={formState.dname || ""}
            onTextChange={(val) =>
              setFormState((prev) => ({ ...prev, dname: val }))
            }
          />
          <InputComponent
            title={AccountsChartLang.accountNameEnglish[languageId]}
            className="mb-4"
            value={formState.dnamE2 || ""}
            onTextChange={(val) =>
              setFormState((prev) => ({ ...prev, dnamE2: val }))
            }
          />

          {/* extra fields لو النوع secondary */}
          {!formState.dsecondry && (
            <>
              <div className="flex gap-4 mb-4">
                <InputComponent
                  title={AccountsChartLang.phone[languageId]}
                  value={formState.dphone}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      dphone: val.replace(/[^\d]/g, ""),
                    }))
                  }
                />
                <InputComponent
                  title={AccountsChartLang.fax[languageId]}
                  value={formState.dphonE2}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      dphonE2: val.replace(/[^\d]/g, ""),
                    }))
                  }
                />
              </div>
              <InputComponent
                title={AccountsChartLang.mobile[languageId]}
                className="mb-4"
                value={formState.dtelx}
                type="number"
                onTextChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    dtelx: val.replace(/[^\d]/g, ""),
                  }))
                }
              />
              <div className="flex gap-4 mb-4">
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
              </div>
              <InputComponent
                title={AccountsChartLang.email[languageId]}
                className="mb-4"
                value={formState.email}
                type="email"
                onTextChange={(val) =>
                  setFormState((prev) => ({ ...prev, email: val }))
                }
              />
              <div className="flex gap-4 mb-4">
                <DatePicker
                  title={AccountsChartLang.creationdate[languageId]}
                  value={formState.dfdate!=null?formState.dfdate :formatDate(new Date(), dateFormat)}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      dfdate: val.toISOString(),
                    }))
                  }
                />

                <InputComponent
                  title={AccountsChartLang.taxnumber[languageId]}
                  value={formState.accVatNo}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      accVatNo: val.replace(/[^\d]/g, ""),
                    }))
                  }
                />
              </div>
              <InputComponent
                disabled={modalType === "Edit"}
                title={AccountsChartLang.openingBalance[languageId]}
                value={formState.doldacc}
                type="number"
                onTextChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    doldacc: val.replace(/[^\d]/g, ""),
                  }))
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
                      doldacC1: val.replace(/[^\d]/g, ""),
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
                      doldacC2: val.replace(/[^\d]/g, ""),
                      doldacC1: 0,
                    }))
                  }
                />
              </div>
              <InputComponent
                title={AccountsChartLang.notes[languageId]}
                value={formState.remark}
                onTextChange={(val) =>
                  setFormState((prev) => ({ ...prev, remark: val }))
                }
              />
            </>
          )}
        </>
      ) : (
        <p className="text-base font-bold text-center">
          هل انت متاكد من اتمام عمليه الحذف؟
        </p>
      )}
    </>
  );
}
