import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import CustomButton from "@/components/CustomButton";
import Checkbox from "@/components/Checkbox";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";
import DatePicker from "@/components/DatePicker";
import { API } from "@/api/api";

const AccountModal = ({
  modalType,
  Type,
  Type1,
  Type2,
  AccountsChartLang,
  selectedChildCode,
  selectedId,
  languageId,
  modelVisible,
  setModelVisible,
  initialFormState,
}) => {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [SelectedType, setSelectedType] = useState(null);
  const [formState, setFormState] = useState(initialFormState);

  const api = API();

  const closeModal = () => {
    setModelVisible(false);
    setFormState(initialFormState);
    setSelectedType(null);
    setError(null);
    setLoadingDetails(false);
  };

  // الحفظ
  const handleSave = async () => {
    try {
      if (modalType === "Add") {
        await api.post(`/Account/CreateAccount`, formState);
      } else if (modalType === "Edit") {
        await api.put(`/Account/UpdateAccount`, {
          ...formState,
          dcodE1: selectedChildCode,
        });
      }
      closeModal();
    } catch (err) {
      console.error("Error saving account:", err);
      setError("حدث خطأ أثناء الحفظ");
    }
  };

  // الحذف
  const handleDelete = async () => {
    try {
      await api.delete(`/Account/DeleteAccount?code=${selectedChildCode}`);
      closeModal();
    } catch (err) {
      console.error("Delete error:", err);
      setError("حدث خطأ أثناء الحذف");
    }
  };

  // جلب البيانات (Add / Edit)
  useEffect(() => {
    if (!modelVisible || !modalType) return;
    if (!selectedChildCode && modalType !== "Add") return;
    if (modalType === "Delete") return;

    let cancelled = false;

    const GetNewAccountData = async () => {
      setLoadingDetails(true);
      try {
        const NewAccountData = await api.get(
          `/Account/GetNewAccountData?parentCode=${selectedId}`
        );
        if (cancelled) return;

        setFormState((prev) => ({
          ...prev,
          dacC_TYPE0: NewAccountData?.accountType0,
          dacC_TYPE: NewAccountData?.accountType1,
          dacC_TYPE2: NewAccountData?.accountType2,
          dcodE1: NewAccountData?.accountCode,
          dlevel: NewAccountData?.accountLevel,
          dcodE2: selectedId,
        }));
        setSelectedType(NewAccountData?.accountType0);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    };

    const loadDetails = async () => {
      setLoadingDetails(true);
      try {
        const details = await api.get(
          `/Account/GetAccountDetail?code=${selectedChildCode}`
        );
        if (cancelled) return;

        setFormState({
          ...details,
          dfdate: details?.dfdate
            ? new Date(details.dfdate).toISOString().split("T")[0]
            : "",
        });
        setSelectedType(details?.dacC_TYPE0 || null);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    };

    if (modalType === "Add") {
      GetNewAccountData();
    } else if (modalType === "Edit") {
      loadDetails();
    }

    return () => {
      cancelled = true;
    };
  }, [modelVisible, modalType, selectedChildCode, selectedId]);

  return (
    <Modal
      isOpen={modelVisible}
      onClose={closeModal}
      title={
        modalType === "Delete"
          ? AccountsChartLang.DeleteAccount[languageId]
          : modalType === "Add"
          ? AccountsChartLang.AddAccount[languageId]
          : AccountsChartLang.EditAccount[languageId]
      }
      footer={
        modalType === "Delete" ? (
          <div className="flex gap-4 justify-center w-full">
            <CustomButton
              className="bg-danger"
              title={AccountsChartLang.Sure[languageId]}
              onClick={handleDelete}
            />
            <CustomButton
              title={AccountsChartLang.Cancel[languageId]}
              onClick={closeModal}
            />
          </div>
        ) : (
          <div className="flex gap-4 justify-center w-full ">
            <CustomButton
              className="bg-success text-gray-100"
              title={AccountsChartLang.Save[languageId]}
              onClick={handleSave}
            />
            <CustomButton
              className="bg-danger text-gray-100"
              title={AccountsChartLang.Cancel[languageId]}
              onClick={closeModal}
            />
          </div>
        )
      }
    >
      {loadingDetails ? (
        <div className="flex items-center justify-center p-10">
          <span className="loader"></span>
        </div>
      ) : modalType === "Edit" || modalType === "Add" ? (
        <>
          {/* checkboxes */}
          <div className="flex justify-start gap-4 mb-4">
            <Checkbox
              disabled={modalType === "Edit"}
              label={AccountsChartLang.secondary[languageId]}
              checked={!formState.dsecondry}
              onChange={() =>
                setFormState((prev) => ({ ...prev, dsecondry: false }))
              }
            />
            <Checkbox
              disabled={modalType === "Edit"}
              label={AccountsChartLang.general[languageId]}
              checked={formState.dsecondry}
              onChange={() =>
                setFormState((prev) => ({ ...prev, dsecondry: true }))
              }
            />
          </div>

          {/* dropdowns */}
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
              disabled={modalType === "Edit" || formState.dlevel > 3}
              value={formState.dacC_TYPE2}
              options={Type2}
              label={AccountsChartLang.tertiaryType[languageId]}
              placeholder={AccountsChartLang.Select[languageId]}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, dacC_TYPE2: val.value }))
              }
            />
          </div>

          {/* level + code */}
          <div className="flex gap-4 grid grid-cols-4 mb-4">
            <div className="col-span-1">
              <InputComponent
                disabled
                type="number"
                value={formState.dlevel || ""}
                title={AccountsChartLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                disabled={modalType === "Edit"}
                value={formState.dcodE1 || ""}
                error={error}
                title={AccountsChartLang.accountCode[languageId]}
                type="number"
                onTextChange={(val) => {
                  setFormState((prev) => ({
                    ...prev,
                    dcodE1: val.replace(/[^\d]/g),
                  }));
                }}
              />
            </div>
          </div>

          {/* names */}
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
                  value={formState.dfdate}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dfdate: val }))
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
          هل انت متأكد من إتمام عملية الحذف؟
        </p>
      )}
    </Modal>
  );
};

export default AccountModal;

// import React, { useEffect, useState } from "react";
// import Modal from "@/components/Modal";
// import CustomButton from "@/components/CustomButton";
// import Checkbox from "@/components/Checkbox";
// import DropdownComponent from "@/components/ui/DropDown";
// import InputComponent from "@/components/InputComponent";
// import DatePicker from "@/components/DatePicker";

// const AccountModal = ({
//   isOpen,
//   onClose,
//   modalType,
//   formState,
//   setFormState,
//   // loadingDetails,
//   error,
//   Type,
//   Type1,
//   Type2,
//   AccountsChartLang,
//   languageId,
//   selectedChildCode,
//   selectedId,
// }) => {
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   const setAccountType = (type) => {
//     setFormState((prev) => ({
//       ...prev,
//       dsecondry: type === "general", // true لو جنرال
//     }));
//   };

//   // load tree
//   async function loadData() {
//     try {
//       const tree = await api.get("/Account/GetFullTree");
//       setRawData(tree);
//     } catch (err) {
//       console.error("Fetch error (GetFullTree):", err);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   async function handleSave() {
//     try {
//       if (modalType === "Add") {
//         console.log("Adddddd Dataaaaaaaaaa", formState);
//         await api.post(`/Account/CreateAccount`, formState);
//         setModelVisible(false);
//       } else if (modalType === "Edit") {
//         await api.put(`/Account/UpdateAccount`, {
//           ...formState,
//           dcodE1: selectedChildCode,
//         });
//         fetchAccountDetails(selectedId, setSelectedAccount);
//       }

//       await loadData();
//       setModelVisible(false);
//       reset();
//     } catch (error) {
//       console.error("Error saving account:", error);
//     }
//   }

//   async function handleDelete() {
//     try {
//       console.log("Deleting:", selectedChildCode);

//       await api.delete(`/Account/DeleteAccount?code=${selectedChildCode}`);

//       await loadData(); // refresh tree
//       setSelectedId(selectedAccount.dcodE2);
//       setModelVisible(false);
//       reset();
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   }
//   useEffect(() => {
//     if (!selectedChildCode || modalType === "Delete") return;

//     let cancelled = false;

//     const GetNewAccountData = async () => {
//       setLoadingDetails(true);
//       try {
//         const NewAccountData = await api.get(
//           `/Account/GetNewAccountData?parentCode=${selectedId}`
//         );

//         if (cancelled) return;
//         setFormState((prev) => ({
//           ...prev,
//           dacC_TYPE0: NewAccountData?.accountType0,
//           dacC_TYPE: NewAccountData?.accountType1,
//           dacC_TYPE2: NewAccountData?.accountType2,
//           dcodE1: NewAccountData?.accountCode,
//           dlevel: NewAccountData?.accountLevel,
//           dcodE2: selectedId,
//         }));
//         setSelectedType(NewAccountData?.accountType0);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         if (!cancelled) setLoadingDetails(false);
//       }
//     };

//     const loadDetails = async () => {
//       setLoadingDetails(true);
//       try {
//         const details = await api.get(
//           `/Account/GetAccountDetail?code=${selectedChildCode}`
//         );

//         if (cancelled) return;
//         setFormState({
//           ...details,
//           dfdate: details?.dfdate
//             ? new Date(details.dfdate).toISOString().split("T")[0]
//             : "",
//         });
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         if (!cancelled) setLoadingDetails(false);
//       }
//     };

//     // هنا نحدد نستدعي انهي دالة حسب الـ modalType
//     if (modalType === "Add") {
//       GetNewAccountData();
//     } else {
//       loadDetails();
//     }

//     return () => {
//       cancelled = true;
//     };
//   }, [selectedChildCode, selectedId, modalType]);
//   return (
//     <Modal
//       isOpen={modelVisible}
//       onClose={() => setModelVisible(false)}
//       title={
//         modalType === "Delete"
//           ? `${AccountsChartLang.DeleteAccount[languageId]}`
//           : modalType === "Add"
//           ? `${AccountsChartLang.AddAccount[languageId]}`
//           : `${AccountsChartLang.EditAccount[languageId]}`
//       }
//       footer={
//         modalType === "Delete" ? (
//           <div className="flex gap-4 justify-center w-full">
//             {/* <button onClick={() => handleDelete(selectedChildCode)}>Sure</button> */}

//             <CustomButton
//               className="bg-danger"
//               title={AccountsChartLang.Sure[languageId]}
//               onClick={handleDelete}
//             />
//             <CustomButton
//               title={AccountsChartLang.Cancel[languageId]}
//               onClick={() => {
//                 setModelVisible(false);
//                 reset();
//               }}
//             />
//           </div>
//         ) : (
//           <div className="flex gap-4 justify-center w-full ">
//             <CustomButton
//               className="bg-success text-gray-100"
//               title={AccountsChartLang.Save[languageId]}
//               onClick={handleSave}
//             />
//             <CustomButton
//               className="bg-danger text-gray-100"
//               title={AccountsChartLang.Cancel[languageId]}
//               onClick={() => {
//                 setModelVisible(false);
//                 reset();
//               }}
//             />
//           </div>
//         )
//       }
//     >
//       {loadingDetails ? (
//         <div className="flex items-center justify-center p-10">
//           <span className="loader"></span> {/* ممكن تستخدم Spinner جاهز */}
//         </div>
//       ) : modalType === "Edit" || modalType === "Add" ? (
//         <>
//           {/* toggle checkboxes */}
//           <div className="flex justify-start gap-4 mb-4">
//             <Checkbox
//               disabled={modalType === "Edit"}
//               label={AccountsChartLang.secondary[languageId]}
//               checked={!formState.dsecondry}
//               onChange={() => setAccountType("secondary")}
//             />
//             <Checkbox
//               disabled={modalType === "Edit"}
//               label={AccountsChartLang.general[languageId]}
//               checked={formState.dsecondry}
//               onChange={() => setAccountType("general")}
//             />
//           </div>

//           <div className="flex gap-4 mb-4">
//             <DropdownComponent
//               disabled={modalType === "Edit" || formState.dlevel > 1}
//               value={formState.dacC_TYPE0}
//               options={Type}
//               label={AccountsChartLang.primaryType[languageId]}
//               placeholder={AccountsChartLang.Select[languageId]}
//               onChange={(val) => {
//                 setSelectedType(val.value);
//                 console.log("SelectedType:", SelectedType);
//                 setFormState((prev) => ({ ...prev, dacC_TYPE0: val.value }));
//               }}
//             />
//             <DropdownComponent
//               disabled={modalType === "Edit" || formState.dlevel > 2}
//               value={formState.dacC_TYPE}
//               options={Type1}
//               label={AccountsChartLang.secondaryType[languageId]}
//               placeholder={AccountsChartLang.Select[languageId]}
//               onChange={(val) =>
//                 setFormState((prev) => ({ ...prev, dacC_TYPE: val.value }))
//               }
//             />
//             <DropdownComponent
//               disabled={modalType === "Edit" || formState.dlevel > 3}
//               value={formState.dacC_TYPE2}
//               options={Type2}
//               label={AccountsChartLang.tertiaryType[languageId]}
//               placeholder={AccountsChartLang.Select[languageId]}
//               onChange={(val) =>
//                 setFormState((prev) => ({ ...prev, dacC_TYPE2: val.value }))
//               }
//             />
//           </div>

//           <div className="flex gap-4 grid grid-cols-4 mb-4">
//             <div className="col-span-1">
//               <InputComponent
//                 disabled
//                 type="number"
//                 onTextChange={(val) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     dlevel: val.replace(/[^\d]/g, ""),
//                   }))
//                 }
//                 value={formState.dlevel || ""}
//                 title={AccountsChartLang.level[languageId]}
//               />
//             </div>
//             <div className="col-span-3">
//               <InputComponent
//                 disabled={modalType === "Edit"}
//                 value={formState.dcodE1 || ""}
//                 error={error}
//                 title={AccountsChartLang.accountCode[languageId]}
//                 type="number"
//                 onTextChange={(val) => {
//                   setFormState((prev) => ({
//                     ...prev,
//                     dcodE1: val.replace(/[^\d]/g),
//                   }));
//                   // setError("");

//                   // setCode(val.replace(/[^\d]/g));
//                 }}
//                 // onBlur={async () => {
//                 //   if (!Code) return;

//                 //   try {
//                 //     const res = await api.get(
//                 //       `Account/ValidateAccountCode?accountCode=${Code}`
//                 //     );

//                 //     if (res === "false") {
//                 //       setError("كود الحساب غير صالح"); // ✨ نظهر رسالة
//                 //     } else {
//                 //       setFormState((prev) => ({
//                 //         ...prev,
//                 //         dcodE1: Code, // ✨ نعتمد القيمة بس لو valid
//                 //       }));
//                 //       setError(""); // نمسح رسالة الخطأ
//                 //     }
//                 //   } catch (err) {
//                 //     console.error("Fetch error:", err);
//                 //     setError("حصل خطأ أثناء التحقق");
//                 //   }
//                 // }}
//               />
//             </div>
//           </div>

//           <InputComponent
//             title={AccountsChartLang.accountNameArabic[languageId]}
//             className="mb-4"
//             value={formState.dname || ""}
//             onTextChange={(val) =>
//               setFormState((prev) => ({ ...prev, dname: val }))
//             }
//           />
//           <InputComponent
//             title={AccountsChartLang.accountNameEnglish[languageId]}
//             className="mb-4"
//             value={formState.dnamE2 || ""}
//             onTextChange={(val) =>
//               setFormState((prev) => ({ ...prev, dnamE2: val }))
//             }
//           />

//           {/* extra fields لو النوع secondary */}
//           {!formState.dsecondry && (
//             <>
//               <div className="flex gap-4 mb-4">
//                 <InputComponent
//                   title={AccountsChartLang.phone[languageId]}
//                   value={formState.dphone}
//                   type="number"
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({
//                       ...prev,
//                       dphone: val.replace(/[^\d]/g, ""),
//                     }))
//                   }
//                 />
//                 <InputComponent
//                   title={AccountsChartLang.fax[languageId]}
//                   value={formState.dphonE2}
//                   type="number"
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({
//                       ...prev,
//                       dphonE2: val.replace(/[^\d]/g, ""),
//                     }))
//                   }
//                 />
//               </div>
//               <InputComponent
//                 title={AccountsChartLang.mobile[languageId]}
//                 className="mb-4"
//                 value={formState.dtelx}
//                 type="number"
//                 onTextChange={(val) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     dtelx: val.replace(/[^\d]/g, ""),
//                   }))
//                 }
//               />
//               <div className="flex gap-4 mb-4">
//                 <InputComponent
//                   title={AccountsChartLang.Employee[languageId]}
//                   value={formState.demployee}
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({ ...prev, demployee: val }))
//                   }
//                 />
//                 <InputComponent
//                   title={AccountsChartLang.sales[languageId]}
//                   value={formState.dslaes}
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({ ...prev, dslaes: val }))
//                   }
//                 />
//               </div>
//               <InputComponent
//                 title={AccountsChartLang.email[languageId]}
//                 className="mb-4"
//                 value={formState.email}
//                 type="email"
//                 onTextChange={(val) =>
//                   setFormState((prev) => ({ ...prev, email: val }))
//                 }
//               />
//               <div className="flex gap-4 mb-4">
//                 <DatePicker
//                   title={AccountsChartLang.creationdate[languageId]}
//                   value={formState.dfdate}
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({ ...prev, dfdate: val }))
//                   }
//                 />

//                 <InputComponent
//                   title={AccountsChartLang.taxnumber[languageId]}
//                   value={formState.accVatNo}
//                   type="number"
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({
//                       ...prev,
//                       accVatNo: val.replace(/[^\d]/g, ""),
//                     }))
//                   }
//                 />
//               </div>
//               <InputComponent
//                 disabled={modalType === "Edit"}
//                 title={AccountsChartLang.openingBalance[languageId]}
//                 value={formState.doldacc}
//                 type="number"
//                 onTextChange={(val) =>
//                   setFormState((prev) => ({
//                     ...prev,
//                     doldacc: val.replace(/[^\d]/g, ""),
//                   }))
//                 }
//               />
//               <div className="flex gap-4">
//                 <InputComponent
//                   flex
//                   title={AccountsChartLang.debtor[languageId]}
//                   value={formState.doldacC1}
//                   type="number"
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({
//                       ...prev,
//                       doldacC1: val.replace(/[^\d]/g, ""),
//                       doldacC2: 0,
//                     }))
//                   }
//                 />
//                 <InputComponent
//                   flex
//                   title={AccountsChartLang.creditor[languageId]}
//                   value={formState.doldacC2}
//                   type="number"
//                   onTextChange={(val) =>
//                     setFormState((prev) => ({
//                       ...prev,
//                       doldacC2: val.replace(/[^\d]/g, ""),
//                       doldacC1: 0,
//                     }))
//                   }
//                 />
//               </div>
//               <InputComponent
//                 title={AccountsChartLang.notes[languageId]}
//                 value={formState.remark}
//                 onTextChange={(val) =>
//                   setFormState((prev) => ({ ...prev, remark: val }))
//                 }
//               />
//             </>
//           )}
//         </>
//       ) : (
//         <p className="text-base font-bold text-center">
//           هل انت متاكد من اتمام عمليه الحذف؟
//         </p>
//       )}
//     </Modal>
//   );
// };

// export default AccountModal;
