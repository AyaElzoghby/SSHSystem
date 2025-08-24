import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NestedTree from "../components/NestedTree";
import Tabs from "../components/Tabs";
import CustomButton from "@/components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSquarePlus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import Modal from "@/components/Modal";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";

// ✅ helper: children by id
function getChildrenById(id, data) {
  if (!Array.isArray(data)) return [];
  for (const node of data) {
    if (String(node.dcodE2) === String(id)) return node.children || [];
    if (node.children && node.children.length) {
      const found = getChildrenById(id, node.children);
      if (found.length) return found;
    }
  }
  return [];
}

export default function AccountsChart() {
  const { languageId } = useLanguage();
  const [rawData, setRawData] = useState(null);
  const [modalType, setModalType] = useState(null); // Add | Edit | Delete
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);

  const [accountType, setAccountType] = useState("general"); // general | secondary
  const [formState, setFormState] = useState(); // input values for add/edit

  // load tree
  async function loadData() {
    try {
      const response = await fetch("/api/Account/GetFullTree.json");
      const raw = await response.json();
      setRawData(raw);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // load details when select account
  useEffect(() => {
    if (!selectedId) return;
    async function accountDetails() {
      try {
        const response = await fetch(`/api/Account/GetAccountDetail.json?code=${selectedId}`);
        const details = await response.json();
        setSelectedAccount(details);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    accountDetails();
  }, [selectedId]);

  const childrenToDisplay = selectedId ? getChildrenById(selectedId, rawData) : [];

  // ✅ handlers
  async function handleSave() {
    try {
      if (modalType === "Add") {
        await fetch(`/api/Account/CreateAccount.json?firstParent=${selectedId}&secondParent=${selectedId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
      } else if (modalType === "Edit") {
        await fetch(`/api/Account/UpdateAccount.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formState, code: selectedId }),
        });
      }
      await loadData(); // refresh tree
      setModelVisible(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  async function handleDelete() {
    try {
      await fetch(`/api/Account/DeleteAccount?code=${selectedId}`, { method: "DELETE" });
      await loadData();
      setModelVisible(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // input change helper
  function handleInputChange(key, value) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  const contentsData = [
    {
      tab_title: AccountsChartLang.AccountElements[languageId],
      tab_contents: (
        <ul>
          {childrenToDisplay.map((child) => (
            <li
              key={child.dcodE2}
              className="w-full flex justify-between items-center border-[0.5px] rounded-md p-2 border-border my-1 text-textSecondary hover:text-textPrimary"
            >
              {child.dname}
              <div className="flex gap-2">
                {child.secondary !== false && (
                  <CustomButton
                    icon={<FontAwesomeIcon icon={faSquarePlus} />}
                    size="small"
                    className="bg-success text-gray-100"
                    title={AccountsChartLang.Add[languageId]}
                    onClick={() => {
                      setModelVisible(true);
                      setModalType("Add");
                      setFormState({});
                    }}
                  />
                )}
                <CustomButton
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  size="small"
                  className="bg-warning text-gray-100"
                  title={AccountsChartLang.Edit[languageId]}
                  onClick={() => {
                    setModelVisible(true);
                    setModalType("Edit");
                    setFormState(selectedAccount || {});
                  }}
                />
                <CustomButton
                  icon={<FontAwesomeIcon icon={faTrashCan} />}
                  size="small"
                  className="bg-danger text-gray-100"
                  title={AccountsChartLang.Delete[languageId]}
                  onClick={() => {
                    setModelVisible(true);
                    setModalType("Delete");
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      ),
    },
    {
      tab_title: AccountsChartLang.AccountDetails[languageId],
      tab_contents: selectedAccount ? (
        <>
          {/* toggle checkboxes */}
          <div className="flex justify-start gap-4 mb-4">
            <Checkbox
              label={AccountsChartLang.secondary[languageId]}
              checked={selectedAccount.isSecondary}
              onChange={() => setAccountType("secondary")}
            />
            <Checkbox
              label={AccountsChartLang.general[languageId]}
              checked={!selectedAccount.isSecondary}
              onChange={() => setAccountType("general")}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <DropdownComponent
              disabled
              selected={selectedAccount.primaryType}
              label={AccountsChartLang.primaryType[languageId]}
            />
            <DropdownComponent
              disabled
              selected={selectedAccount.secondaryType}
              label={AccountsChartLang.secondaryType[languageId]}
            />
            <DropdownComponent
              disabled
              selected={selectedAccount.tertiaryType}
              label={AccountsChartLang.tertiaryType[languageId]}
            />
          </div>

          <div className="flex gap-4 grid grid-cols-4 mb-4">
            <div className="col-span-1">
              <InputComponent
                disabled
                type="number"
                value={selectedAccount.level}
                title={AccountsChartLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                disabled
                value={selectedAccount.accountCode}
                title={AccountsChartLang.accountCode[languageId]}
                type="number"
              />
            </div>
          </div>

          <InputComponent
            disabled
            title={AccountsChartLang.accountNameArabic[languageId]}
            className="mb-4"
            value={selectedAccount.accountNameArabic}
          />
          <InputComponent
            disabled
            title={AccountsChartLang.accountNameEnglish[languageId]}
            className="mb-4"
            value={selectedAccount.accountNameEnglish}
          />

          {/* extra fields لو النوع secondary */}
          {selectedAccount.isSecondary && (
            <>
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.phone[languageId]}
                  value={selectedAccount.tertiaryType}
                  type="number"
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.fax[languageId]}
                  value={selectedAccount.tertiaryType}
                  type="number"
                />
              </div>
              <InputComponent
                disabled
                title={AccountsChartLang.mobile[languageId]}
                className="mb-4"
                value={selectedAccount.tertiaryType}
                type="number"
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.Employee[languageId]}
                  value={selectedAccount.tertiaryType}
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.sales[languageId]}
                  value={selectedAccount.tertiaryType}
                />
              </div>
              <InputComponent
                disabled
                title={AccountsChartLang.email[languageId]}
                className="mb-4"
                value={selectedAccount.tertiaryType}
                type="email"
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.creationdate[languageId]}
                  value={selectedAccount.tertiaryType}
                  type="date"
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.taxnumber[languageId]}
                  value={selectedAccount.tertiaryType}
                  type="number"
                />
              </div>
               <InputComponent
                disabled
                title={AccountsChartLang.openingBalance[languageId]}
                value={selectedAccount.openingBalance}
                type="number"
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.openingDebit[languageId]}
                  value={selectedAccount.openingDebit}
                  type="number"
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.currentDebit[languageId]}
                  value={selectedAccount.currentDebit}
                  type="number"
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.totalDebits[languageId]}
                  value={selectedAccount.totalDebits}
                  type="number"
                />
              </div>
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.openingCredit[languageId]}
                  value={selectedAccount.openingCredit}
                  type="number"
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.currentCredit[languageId]}
                  value={selectedAccount.currentCredit}
                  type="number"
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.totalCredits[languageId]}
                  value={selectedAccount.totalCredits}
                  type="number"
                />
              </div>
             
              <InputComponent
                disabled
                title={AccountsChartLang.notes[languageId]}
                value={selectedAccount.notes}
              />
            </>
          )}
        </>
      ) : (
        <p>select account </p>
      ),
    },
  ];

  return (
    <>
      <div dir={languageId === 1 ? "rtl" : "ltr"} className="flex-col justify-around m-auto items-center overflow-y-auto">
        <div className="flex-row justify-center  grid grid-cols-12 my-4 gap-4">
          {/* tree */}
          <div className="col-span-12 lg:col-span-5 text-textPrimary bg-surface p-4 shadow-md h-fit rounded-lg">
            <h3 className="block border-b-2 w-fit mb-4 font-bold">
              {AccountsChartLang.AccountsChart[languageId]}
            </h3>

            {rawData ? (
              <NestedTree data={rawData} onItemSelected={(id) => setSelectedId(id)} />
            ) : (
              <div>Loading tree data...</div>
            )}
          </div>

          {/* details */}
          <div className="col-span-12 lg:col-span-7 shadow-md h-fit rounded-md max-h-[85svh] text-textPrimary bg-surface overflow-auto">
            <Tabs contents={contentsData} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modelVisible}
        onClose={() => setModelVisible(false)}
        title={
          modalType === "Delete"
            ? "حذف العنصر"
            : modalType === "Add"
            ? "إضافه عنصر جديد"
            : "تعديل البيانات"
        }
        footer={
          modalType === "Delete" ? (
            <div className="flex gap-4 justify-center w-full">
              <CustomButton className="bg-danger" title={AccountsChartLang.Sure[languageId]} onClick={handleDelete} />
              <CustomButton title={AccountsChartLang.Cancel[languageId]} onClick={() => setModelVisible(false)} />
            </div>
          ) : (
            <div className="flex gap-4 justify-center w-full">
              <CustomButton className="bg-success text-gray-100" title={AccountsChartLang.Save[languageId]} onClick={handleSave} />
              <CustomButton className="bg-danger text-gray-100" title={AccountsChartLang.Cancel[languageId]} onClick={() => setModelVisible(false)} />
            </div>
          )
        }
      >
        {modalType === "Edit" || modalType === "Add" ? (
               <>
          {/* toggle checkboxes */}
          <div className="flex justify-start gap-4 mb-4">
            <Checkbox
              label={AccountsChartLang.secondary[languageId]}
              checked={formState.isSecondary|| ""}
              onChange={() => setAccountType("secondary")}
            />
            <Checkbox
              label={AccountsChartLang.general[languageId]}
              checked={!formState.isSecondary|| ""}
              onChange={() => setAccountType("general")}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <DropdownComponent
              selected={formState.primaryType|| ""}
              label={AccountsChartLang.primaryType[languageId]}
            />
            <DropdownComponent
              
              selected={formState.secondaryType|| ""}
              label={AccountsChartLang.secondaryType[languageId]}
            />
            <DropdownComponent
              selected={formState.tertiaryType|| ""}
              label={AccountsChartLang.tertiaryType[languageId]}
            />
          </div>

          <div className="flex gap-4 grid grid-cols-4 mb-4">
            <div className="col-span-1">
              <InputComponent
                type="number"
                value={formState.level|| ""}
                title={AccountsChartLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                value={formState.accountCode || ""}
                title={AccountsChartLang.accountCode[languageId]}
                type="number"
              />
            </div>
          </div>

          <InputComponent
            title={AccountsChartLang.accountNameArabic[languageId]}
            className="mb-4"
            value={formState.accountNameArabic|| ""}
          />
          <InputComponent
            title={AccountsChartLang.accountNameEnglish[languageId]}
            className="mb-4"
            value={formState.accountNameEnglish|| ""}
          />

          {/* extra fields لو النوع secondary */}
          {selectedAccount.isSecondary && (
            <>
              <div className="flex gap-4 mb-4">
                <InputComponent
                  title={AccountsChartLang.phone[languageId]}
                  value={formState.dphone|| ""}
                  type="number"
                />
                <InputComponent
                  title={AccountsChartLang.fax[languageId]}
                  value={formState.tertiaryType|| ""}
                  type="number"
                />
              </div>
              <InputComponent
                title={AccountsChartLang.mobile[languageId]}
                className="mb-4"
                value={formState.tertiaryType|| ""}
                type="number"
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  title={AccountsChartLang.Employee[languageId]}
                  value={formState.tertiaryType|| ""}
                />
                <InputComponent
                  title={AccountsChartLang.sales[languageId]}
                  value={formState.tertiaryType|| ""}
                />
              </div>
              <InputComponent
                title={AccountsChartLang.email[languageId]}
                className="mb-4"
                value={formState.tertiaryType|| ""}
                type="email"
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  title={AccountsChartLang.creationdate[languageId]}
                  value={formState.tertiaryType|| ""}
                  type="date"
                />
                <InputComponent
                  title={AccountsChartLang.taxnumber[languageId]}
                  value={formState.tertiaryType|| ""}
                  type="number"
                />
              </div>
               <InputComponent
                title={AccountsChartLang.openingBalance[languageId]}
                value={formState.openingBalance|| ""}
                type="number"
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  title={AccountsChartLang.openingDebit[languageId]}
                  value={formState.openingDebit|| ""}
                  type="number"
                />
                <InputComponent
                  title={AccountsChartLang.currentDebit[languageId]}
                  value={formState.currentDebit|| ""}
                  type="number"
                />
                <InputComponent
                  title={AccountsChartLang.totalDebits[languageId]}
                  value={formState.totalDebits|| ""}
                  type="number"
                />
              </div>
              <div className="flex gap-4 mb-4">
                <InputComponent
                  title={AccountsChartLang.openingCredit[languageId]}
                  value={formState.openingCredit|| ""}
                  type="number"
                />
                <InputComponent
                  title={AccountsChartLang.currentCredit[languageId]}
                  value={formState.currentCredit|| ""}
                  type="number"
                />
                <InputComponent
                  title={AccountsChartLang.totalCredits[languageId]}
                  value={formState.totalCredits|| ""}
                  type="number"
                />
              </div>
             
              <InputComponent
                title={AccountsChartLang.notes[languageId]}
                value={formState.notes|| ""}
              />
            </>
          )}
        </>
        ) : (
          <p className="text-base font-bold text-center">هل انت متاكد من اتمام عمليه الحذف؟</p>
        )}
      </Modal>
    </>
  );
}

// import React, { useEffect, useState } from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import NestedTree from "../components/NestedTree";
// import Tabs from "../components/Tabs";
// import CustomButton from "@/components/CustomButton";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTrashCan,
//   faSquarePlus,
//   faPenToSquare,
// } from "@fortawesome/free-solid-svg-icons";
// import AccountsChartLang from "@/constants/Lang/AccountsChart";
// import { useLanguage } from "@/context/LanguageContext";
// import Checkbox from "@/components/Checkbox";
// import Modal from "@/components/Modal";
// import DropdownComponent from "@/components/ui/DropDown";
// import InputComponent from "@/components/InputComponent";

// // ✅ دالة تساعدنا نجيب children من الـ rawData الأصلية (لعرضها في التاب)
// function getChildrenById(id, data) {
//   if (!Array.isArray(data)) return [];
//   for (const node of data) {
//     if (String(node.dcodE2) === String(id)) return node.children || [];
//     if (node.children && node.children.length) {
//       const found = getChildrenById(id, node.children);
//       if (found.length) return found;
//     }
//   }
//   return [];
// }

// export default function AccountsChart() {
//   const { languageId } = useLanguage();
//   const [rawData, setRawData] = useState(null);
//   const [modalType, setModalType] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [modelVisible, setModelVisible] = useState(false);

//   // 👇 بدل اتنين state هنستخدم واحد
//   const [accountType, setAccountType] = useState("general"); // "general" | "secondary"

//   // ⬇️ تحميل الداتا من الـ API
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const response = await fetch("/api/Account/GetFullTree.json");
//         const raw = await response.json();
//         setRawData(raw);
//         console.log(rawData, "dataaaaaaaaaaaa");
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     }
//     loadData();
//   }, []);
//   useEffect(() => {
//     if (!selectedId) return; // ⛔ avoid calling API on mount
//     async function accountDetails() {
//       try {
//         const response = await fetch(
//           `/api/Account/GetAccountDetail.json?code=${selectedId}`
//         );
//         const details = await response.json();
//         setSelectedAccount(details);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     }
//     accountDetails();
//   }, [selectedId]);

//   const childrenToDisplay = selectedId
//     ? getChildrenById(selectedId, rawData)
//     : [];

//   const contentsData = [
//     {
//       tab_title: AccountsChartLang.AccountElements[languageId],
//       tab_contents: (
//         <ul>
//           {childrenToDisplay.map((child) => (
//             <li
//               key={child.dcodE2}
//               className="w-full flex justify-between items-center border-[0.5px] rounded-md p-2 border-border my-1 text-textSecondary hover:text-textPrimary"
//             >
//               {child.dname}
//               <div className="flex gap-2">
//                 {child.secondary !== false && (
//                   <CustomButton
//                     icon={<FontAwesomeIcon icon={faSquarePlus} />}
//                     size="small"
//                     className="bg-success text-gray-100"
//                     title={AccountsChartLang.Add[languageId]}
//                     onClick={() => {
//                       setModelVisible(true);
//                       setModalType("Add");
//                     }}
//                   />
//                 )}
//                 <CustomButton
//                   icon={<FontAwesomeIcon icon={faPenToSquare} />}
//                   size="small"
//                   className="bg-warning text-gray-100"
//                   title={AccountsChartLang.Edit[languageId]}
//                   onClick={() => {
//                     setModelVisible(true);
//                     setModalType("Edit");
//                   }}
//                 />
//                 <CustomButton
//                   icon={<FontAwesomeIcon icon={faTrashCan} />}
//                   size="small"
//                   className="bg-danger text-gray-100"
//                   title={AccountsChartLang.Delete[languageId]}
//                   onClick={() => {
//                     setModelVisible(true);
//                     setModalType("Delete");
//                   }}
//                 />
//               </div>
//             </li>
//           ))}
//         </ul>
//       ),
//     },
    // {
    //   tab_title: AccountsChartLang.AccountDetails[languageId],
    //   tab_contents: selectedAccount ? (
    //     <>
    //       {/* toggle checkboxes */}
    //       <div className="flex justify-start gap-4 mb-4">
    //         <Checkbox
    //           label={AccountsChartLang.secondary[languageId]}
    //           checked={selectedAccount.isSecondary}
    //           onChange={() => setAccountType("secondary")}
    //         />
    //         <Checkbox
    //           label={AccountsChartLang.general[languageId]}
    //           checked={!selectedAccount.isSecondary}
    //           onChange={() => setAccountType("general")}
    //         />
    //       </div>

    //       <div className="flex gap-4 mb-4">
    //         <DropdownComponent
    //           disabled
    //           selected={selectedAccount.primaryType}
    //           label={AccountsChartLang.primaryType[languageId]}
    //         />
    //         <DropdownComponent
    //           disabled
    //           selected={selectedAccount.secondaryType}
    //           label={AccountsChartLang.secondaryType[languageId]}
    //         />
    //         <DropdownComponent
    //           disabled
    //           selected={selectedAccount.tertiaryType}
    //           label={AccountsChartLang.tertiaryType[languageId]}
    //         />
    //       </div>

    //       <div className="flex gap-4 grid grid-cols-4 mb-4">
    //         <div className="col-span-1">
    //           <InputComponent
    //             disabled
    //             type="number"
    //             value={selectedAccount.level}
    //             title={AccountsChartLang.level[languageId]}
    //           />
    //         </div>
    //         <div className="col-span-3">
    //           <InputComponent
    //             disabled
    //             value={selectedAccount.accountCode}
    //             title={AccountsChartLang.accountCode[languageId]}
    //             type="number"
    //           />
    //         </div>
    //       </div>

    //       <InputComponent
    //         disabled
    //         title={AccountsChartLang.accountNameArabic[languageId]}
    //         className="mb-4"
    //         value={selectedAccount.accountNameArabic}
    //       />
    //       <InputComponent
    //         disabled
    //         title={AccountsChartLang.accountNameEnglish[languageId]}
    //         className="mb-4"
    //         value={selectedAccount.accountNameEnglish}
    //       />

    //       {/* extra fields لو النوع secondary */}
    //       {selectedAccount.isSecondary && (
    //         <>
    //           <div className="flex gap-4 mb-4">
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.phone[languageId]}
    //               value={selectedAccount.tertiaryType}
    //               type="number"
    //             />
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.fax[languageId]}
    //               value={selectedAccount.tertiaryType}
    //               type="number"
    //             />
    //           </div>
    //           <InputComponent
    //             disabled
    //             title={AccountsChartLang.mobile[languageId]}
    //             className="mb-4"
    //             value={selectedAccount.tertiaryType}
    //             type="number"
    //           />
    //           <div className="flex gap-4 mb-4">
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.Employee[languageId]}
    //               value={selectedAccount.tertiaryType}
    //             />
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.sales[languageId]}
    //               value={selectedAccount.tertiaryType}
    //             />
    //           </div>
    //           <InputComponent
    //             disabled
    //             title={AccountsChartLang.email[languageId]}
    //             className="mb-4"
    //             value={selectedAccount.tertiaryType}
    //             type="email"
    //           />
    //           <div className="flex gap-4 mb-4">
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.creationdate[languageId]}
    //               value={selectedAccount.tertiaryType}
    //               type="date"
    //             />
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.taxnumber[languageId]}
    //               value={selectedAccount.tertiaryType}
    //               type="number"
    //             />
    //           </div>
    //            <InputComponent
    //             disabled
    //             title={AccountsChartLang.openingBalance[languageId]}
    //             value={selectedAccount.openingBalance}
    //             type="number"
    //           />
    //           <div className="flex gap-4 mb-4">
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.openingDebit[languageId]}
    //               value={selectedAccount.openingDebit}
    //               type="number"
    //             />
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.currentDebit[languageId]}
    //               value={selectedAccount.currentDebit}
    //               type="number"
    //             />
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.totalDebits[languageId]}
    //               value={selectedAccount.totalDebits}
    //               type="number"
    //             />
    //           </div>
    //           <div className="flex gap-4 mb-4">
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.openingCredit[languageId]}
    //               value={selectedAccount.openingCredit}
    //               type="number"
    //             />
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.currentCredit[languageId]}
    //               value={selectedAccount.currentCredit}
    //               type="number"
    //             />
    //             <InputComponent
    //               disabled
    //               title={AccountsChartLang.totalCredits[languageId]}
    //               value={selectedAccount.totalCredits}
    //               type="number"
    //             />
    //           </div>
             
    //           <InputComponent
    //             disabled
    //             title={AccountsChartLang.notes[languageId]}
    //             value={selectedAccount.notes}
    //           />
    //         </>
    //       )}
    //     </>
    //   ) : (
    //     <p>select account </p>
    //   ),
    // },
//   ];

//   return (
//     <>
//       <div
//         dir={languageId === 1 ? "rtl" : "ltr"}
//         className="flex-col justify-around m-auto items-center overflow-y-auto"
//       >
//         <div className="flex-row justify-center  grid grid-cols-12 my-5 gap-4">
//           {/* قسم الشجرة */}
//           <div className="col-span-12 lg:col-span-5 text-textPrimary bg-surface p-4 shadow-md h-fit rounded-lg">
//             <h3 className="block border-button-warning-light dark:border-button-warning-dark border-b-2 w-fit mb-4 font-bold">
//               {AccountsChartLang.AccountsChart[languageId]}
//             </h3>

//             {rawData ? (
//               <NestedTree
//                 data={rawData}
//                 onItemSelected={(id) => setSelectedId(id)}
//               />
//             ) : (
//               <div>Loading tree data...</div>
//             )}
//           </div>

//           {/* قسم النموذج */}
//           <div
//             className="col-span-12 lg:col-span-7 shadow-md h-fit rounded-md max-h-[85svh] text-textPrimary bg-surface overflow-auto
//           [&::-webkit-scrollbar]:w-2
//           [&::-webkit-scrollbar-track]:rounded-full
//           [&::-webkit-scrollbar-track]:bg-surface
//           [&::-webkit-scrollbar-thumb]:rounded-full
//           [&::-webkit-scrollbar-thumb]:bg-bg"
//           >
//             <Tabs contents={contentsData} />
//           </div>
//         </div>
//       </div>

//       {/* ✅ المودال */}
//       <Modal
//         isOpen={modelVisible}
//         onClose={() => setModelVisible(false)}
//         title={
//           modalType == "Delete"
//             ? "حذف العنصر"
//             : modalType == "Add"
//             ? "إضافه عنصر جديد"
//             : "تعديل البيانات"
//         }
//         footer={
//           <>
//             {modalType == "Delete" ? (
//               <div className="flex gap-4 justify-center w-full">
//                 <CustomButton
//                   className="bg-danger"
//                   title={AccountsChartLang.Sure[languageId]}
//                   onClick={() => setModelVisible(false)}
//                 />
//                 <CustomButton
//                   title={AccountsChartLang.Cancel[languageId]}
//                   onClick={() => setModelVisible(false)}
//                 />
//               </div>
//             ) : (
//               <div className="flex gap-4 justify-center w-full">
//                 <CustomButton
//                   className="bg-success text-gray-100"
//                   title={AccountsChartLang.Save[languageId]}
//                   onClick={() => setModelVisible(false)}
//                 />
//                 <CustomButton
//                   className="bg-danger text-gray-100"
//                   title={AccountsChartLang.Cancel[languageId]}
//                   onClick={() => setModelVisible(false)}
//                 />
//               </div>
//             )}
//           </>
//         }
//       >
        // {modalType == "Edit" || modalType == "Add" ? (
          // <>
          //   {/* toggle checkboxes */}
          //   <div className="flex justify-start gap-4 mb-4">
          //     <Checkbox
          //       label="secondary"
          //       checked={accountType === "secondary"}
          //       onChange={() => setAccountType("secondary")}
          //     />
          //     <Checkbox
          //       label="general"
          //       checked={accountType === "general"}
          //       onChange={() => setAccountType("general")}
          //     />
          //   </div>

          //   <div className="flex gap-4 mb-4">
          //     <DropdownComponent label={"Account Type 1"} />
          //     <DropdownComponent label={"Account Type 2"} />
          //     <DropdownComponent label={"Account Type"} />
          //   </div>

          //   <div className="flex gap-4 grid grid-cols-4 mb-4">
          //     <div className="col-span-1">
          //       <InputComponent title={"Level"} />
          //     </div>
          //     <div className="col-span-3">
          //       <InputComponent title={"Account code"} />
          //     </div>
          //   </div>

          //   <InputComponent title={"Account Name (AR)"} className="mb-4" />
          //   <InputComponent title={"Account Name (En)"} className="mb-4" />

          //   {/* extra fields لو النوع secondary */}
          //   {accountType === "secondary" && (
          //     <>
          //       <div className="flex gap-4 mb-4">
          //         <InputComponent title={"phone "} />
          //         <InputComponent title={"fax"} />
          //       </div>
          //       <InputComponent title={"mobile"} className="mb-4" />
          //       <div className="flex gap-4 mb-4">
          //         <InputComponent title={"Employee "} />
          //         <InputComponent title={"sales rep"} />
          //       </div>
          //       <InputComponent title={"email"} className="mb-4" />
          //       <div className="flex gap-4 mb-4">
          //         <InputComponent title={"creation date "} />
          //         <InputComponent title={"tax number"} />
          //       </div>
          //       <InputComponent title={"debit"} />
          //     </>
          //   )}
          // </>
        // ) : (
        //   <>
        //     {/* toggle checkboxes */}

        //     <div className="flex gap-4 justify-center mb-4">
        //       <p className="text-base font-bold">
        //         هل انت متاكد من اتمام عمليه الحذف
        //       </p>
        //     </div>
        //   </>
        // )}
//       </Modal>
//     </>
//   );
// }

// import React, { useEffect, useState } from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import NestedTree from "../components/NestedTree"; // ← النسخة الجديدة اللي بتتعامل مع الداتا مباشرة
// import Tabs from "../components/Tabs";
// import CustomButton from "@/components/CustomButton";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTrashCan,
//   faSquarePlus,
//   faPenToSquare,
// } from "@fortawesome/free-solid-svg-icons";
// import AccountsChartLang from "@/constants/Lang/AccountsChart";
// import { useLanguage } from "@/context/LanguageContext";
// import AccountForm from "./AccountFormAccountsChart";
// import Checkbox from "@/components/Checkbox";
// import Modal from "@/components/Modal";
// import DropdownComponent from "@/components/ui/DropDown";
// import InputComponent from "@/components/InputComponent";
// import { FormControl, FormGroup } from "@mui/material";

// // ✅ دالة تساعدنا نجيب children من الـ rawData الأصلية (لعرضها في التاب)
// function getChildrenById(id, data) {
//   if (!Array.isArray(data)) return [];
//   for (const node of data) {
//     if (String(node.dcodE2) === String(id)) return node.children || [];
//     if (node.children && node.children.length) {
//       const found = getChildrenById(id, node.children);
//       if (found.length) return found;
//     }
//   }
//   return [];
// }

// export default function AccountsChart() {
//   const { languageId } = useLanguage();
//   const [rawData, setRawData] = useState(null); // 👈 الداتا الأصلية زي ما بترجع من الـ API
//   const [selectedId, setSelectedId] = useState(null);
//   const [modelVisible, setModelVisible] = useState(false);
//   const [general, setGeneral] = useState(true);
//   const [secondary, setSecondary] = useState(!general);
//   // ⬇️ تحميل الداتا من الـ API
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const response = await fetch("/api/Account/GetFullTree.json");
//         const raw = await response.json();
//         setRawData(raw); // 👈 خزّنها مباشرة
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     }
//     loadData();
//   }, []);

//   const childrenToDisplay = selectedId
//     ? getChildrenById(selectedId, rawData)
//     : [];

//   const contentsData = [
//     {
//       tab_title: AccountsChartLang.UnityElements[languageId],
//       tab_contents: (
//         <ul>
//           {childrenToDisplay.map((child) => (
//             <li
//               key={child.dcodE2}
//               className="w-full flex justify-between items-center border-[0.5px] rounded-md p-2 border-border my-1 text-textSecondary hover:text-textPrimary"
//             >
//               {child.dname}
//               <div className="flex gap-2">
//                 {child.secondary !== false && (
//                   <CustomButton
//                     icon={<FontAwesomeIcon icon={faSquarePlus} />}
//                     size="small"
//                     className="bg-success text-gray-100"
//                     title="اضافه"
//                     onClick={() => setModelVisible(true)}
//                   />
//                 )}
//                 <CustomButton
//                   icon={<FontAwesomeIcon icon={faPenToSquare} />}
//                   size="small"
//                   className="bg-warning text-gray-100"
//                   title="تعديل"
//                   onClick={() => setModelVisible(true)}
//                 />
//                 <CustomButton
//                   icon={<FontAwesomeIcon icon={faTrashCan} />}
//                   size="small"
//                   className="bg-danger text-gray-100"
//                   title="حذف"
//                   onClick={() => setModelVisible(true)}
//                 />
//               </div>
//             </li>
//           ))}
//         </ul>
//       ),
//     },
//     {
//       tab_title: AccountsChartLang.UnityDetails[languageId],
//       tab_contents: <div className=""></div>,
//     },
//   ];

//   return (
//     <>
//       <div
//         dir={languageId === 1 ? "rtl" : "ltr"}
//         className="flex-col justify-around m-auto items-center overflow-y-auto"
//       >
//         <div className="flex grid grid-cols-12 my-5 gap-4">
//           {/* قسم الشجرة */}
//           <div className="col-span-5 max-w-3xl text-textPrimary bg-surface p-4 shadow-md h-fit rounded-lg">
//             <h3 className="block border-button-warning-light dark:border-button-warning-dark border-b-2 w-fit mb-4 font-bold">
//               {AccountsChartLang.UnitStructure[languageId]}
//             </h3>

//             {rawData ? (
//               <NestedTree
//                 data={rawData} // 👈 مباشرة من API
//                 onItemSelected={(id) => setSelectedId(id)} // 👈 بيرجع الـ id المختار
//               />
//             ) : (
//               <div>Loading tree data...</div>
//             )}
//           </div>

//           {/* قسم النموذج */}
//           <div
//             className="col-span-7 shadow-md h-fit rounded-md max-h-[85svh] text-textPrimary bg-surface overflow-auto
//           [&::-webkit-scrollbar]:w-2
//           [&::-webkit-scrollbar-track]:rounded-full
//           [&::-webkit-scrollbar-track]:bg-surface
//           [&::-webkit-scrollbar-thumb]:rounded-full
//           [&::-webkit-scrollbar-thumb]:bg-bg"
//           >
//             <Tabs contents={contentsData} />
//           </div>
//         </div>
//       </div>
//       <Modal
//         isOpen={modelVisible}
//         onClose={() => setModelVisible(false)}
//         title={"اضافه عنصر جديد"}
//         children={
//           <>
//             <div className="flex justify-start gap-4">
//               <Checkbox
//                 label="secondary"
//                 defaultChecked={secondary}
//                 onChange={secondary}
//               />
//               <Checkbox
//                 label="general"
//                 defaultChecked={general}
//                 onChange={general}
//               />
//             </div>
//             <div className="flex gap-4">
//               <DropdownComponent label={"Account Type 1"} />
//               <DropdownComponent label={"Account Type 2"} />
//               <DropdownComponent label={"Account Type"} />
//             </div>
//             <div className="flex gap-4 grid grid-cols-4">
//               <div className="col-span-1">
//                 <InputComponent title={"Level"} />
//               </div>
//               <div className="col-span-3">
//                 <InputComponent title={"Account code"} className="" />
//               </div>
//             </div>
//             <InputComponent title={"Account Name (AR)"} className="" />

//             <InputComponent title={"Account Name (En)"} className="" />
//             {secondary &&
//               <>
//                 <div className="flex gap-4">
//                   <InputComponent title={"phone "} className="" />
//                   <InputComponent title={"fax"} className="" />
//                 </div>
//                 <InputComponent title={"mobile"} className="" />
//                 <div className="flex gap-4">
//                   <InputComponent title={"Employee "} className="" />
//                   <InputComponent title={"sales rep"} className="" />
//                 </div>
//                 <InputComponent title={"email"} className="" />
//                 <div className="flex gap-4">
//                   <InputComponent title={"creation date "} className="" />
//                   <InputComponent title={"tax number"} className="" />
//                 </div>
//                 <InputComponent title={"debit"} className="" />
//               </>
//              }
//           </>
//         }
//       />
//     </>
//   );
// }
