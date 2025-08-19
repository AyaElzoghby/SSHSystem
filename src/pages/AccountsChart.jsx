import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NestedTree from "../components/NestedTree";
import Tabs from "../components/Tabs";
import CustomButton from "@/components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faSquarePlus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import Modal from "@/components/Modal";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";

// ✅ دالة تساعدنا نجيب children من الـ rawData الأصلية (لعرضها في التاب)
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
  const [modalType, setModalType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);

  // 👇 بدل اتنين state هنستخدم واحد
  const [accountType, setAccountType] = useState("general"); // "general" | "secondary"

  // ⬇️ تحميل الداتا من الـ API
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/Account/GetFullTree.json");
        const raw = await response.json();
        setRawData(raw);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    loadData();
  }, []);

  const childrenToDisplay = selectedId
    ? getChildrenById(selectedId, rawData)
    : [];

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
      tab_contents: (
        <>
          {/* toggle checkboxes */}
          <div className="flex justify-start gap-4 mb-4">
            <Checkbox
              label="secondary"
              checked={accountType === "secondary"}
              onChange={() => setAccountType("secondary")}
            />
            <Checkbox
              label="general"
              checked={accountType === "general"}
              onChange={() => setAccountType("general")}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <DropdownComponent disabled label={"Account Type 1"} />
            <DropdownComponent disabled label={"Account Type 2"} />
            <DropdownComponent disabled label={"Account Type"} />
          </div>

          <div className="flex gap-4 grid grid-cols-4 mb-4">
            <div className="col-span-1">
              <InputComponent disabled title={"Level"} />
            </div>
            <div className="col-span-3">
              <InputComponent disabled title={"Account code"} />
            </div>
          </div>

          <InputComponent
            disabled
            title={"Account Name (AR)"}
            className="mb-4"
          />
          <InputComponent
            disabled
            title={"Account Name (En)"}
            className="mb-4"
          />

          {/* extra fields لو النوع secondary */}
          {accountType === "secondary" && (
            <>
              <div className="flex gap-4 mb-4">
                <InputComponent disabled title={"phone "} />
                <InputComponent disabled title={"fax"} />
              </div>
              <InputComponent disabled title={"mobile"} className="mb-4" />
              <div className="flex gap-4 mb-4">
                <InputComponent disabled title={"Employee "} />
                <InputComponent disabled title={"sales rep"} />
              </div>
              <InputComponent disabled title={"email"} className="mb-4" />
              <div className="flex gap-4 mb-4">
                <InputComponent disabled title={"creation date "} />
                <InputComponent disabled title={"tax number"} />
              </div>
              <InputComponent disabled title={"debit"} />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div
        dir={languageId === 1 ? "rtl" : "ltr"}
        className="flex-col justify-around m-auto items-center overflow-y-auto"
      >
        <div className="flex-row justify-center  grid grid-cols-12 my-5 gap-4">
          {/* قسم الشجرة */}
          <div className="col-span-12 lg:col-span-5 text-textPrimary bg-surface p-4 shadow-md h-fit rounded-lg">
            <h3 className="block border-button-warning-light dark:border-button-warning-dark border-b-2 w-fit mb-4 font-bold">
              {AccountsChartLang.AccountsChart[languageId]}
            </h3>

            {rawData ? (
              <NestedTree
                data={rawData}
                onItemSelected={(id) => setSelectedId(id)}
              />
            ) : (
              <div>Loading tree data...</div>
            )}
          </div>

          {/* قسم النموذج */}
          <div
            className="col-span-12 lg:col-span-7 shadow-md h-fit rounded-md max-h-[85svh] text-textPrimary bg-surface overflow-auto
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-surface
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-bg"
          >
            <Tabs contents={contentsData} />
          </div>
        </div>
      </div>

      {/* ✅ المودال */}
      <Modal
        isOpen={modelVisible}
        onClose={() => setModelVisible(false)}
        title={
          modalType == "Delete"
            ? "حذف العنصر"
            : modalType == "Add"
            ? "إضافه عنصر جديد"
            : "تعديل البيانات"
        }
        footer={
          <>
            {modalType == "Delete" ? (
              <div className="flex gap-4 justify-center w-full">
                <CustomButton
                  className="bg-danger"
                  title={AccountsChartLang.Sure[languageId]}
                  onClick={() => setModelVisible(false)}
                />
                <CustomButton
                  title={AccountsChartLang.Cancel[languageId]}
                  onClick={() => setModelVisible(false)}
                />
              </div>
            ) : (
              <div className="flex gap-4 justify-center w-full">
                <CustomButton
                  className="bg-success text-gray-100"
                  title={AccountsChartLang.Save[languageId]}
                  onClick={() => setModelVisible(false)}
                />
                <CustomButton
                  className="bg-danger text-gray-100"
                  title={AccountsChartLang.Cancel[languageId]}
                  onClick={() => setModelVisible(false)}
                />
              </div>
            )}
          </>
        }
      >
        {modalType == "Edit" || modalType == "Add" ? (
          <>
            {/* toggle checkboxes */}
            <div className="flex justify-start gap-4 mb-4">
              <Checkbox
                label="secondary"
                checked={accountType === "secondary"}
                onChange={() => setAccountType("secondary")}
              />
              <Checkbox
                label="general"
                checked={accountType === "general"}
                onChange={() => setAccountType("general")}
              />
            </div>

            <div className="flex gap-4 mb-4">
              <DropdownComponent label={"Account Type 1"} />
              <DropdownComponent label={"Account Type 2"} />
              <DropdownComponent label={"Account Type"} />
            </div>

            <div className="flex gap-4 grid grid-cols-4 mb-4">
              <div className="col-span-1">
                <InputComponent title={"Level"} />
              </div>
              <div className="col-span-3">
                <InputComponent title={"Account code"} />
              </div>
            </div>

            <InputComponent title={"Account Name (AR)"} className="mb-4" />
            <InputComponent title={"Account Name (En)"} className="mb-4" />

            {/* extra fields لو النوع secondary */}
            {accountType === "secondary" && (
              <>
                <div className="flex gap-4 mb-4">
                  <InputComponent title={"phone "} />
                  <InputComponent title={"fax"} />
                </div>
                <InputComponent title={"mobile"} className="mb-4" />
                <div className="flex gap-4 mb-4">
                  <InputComponent title={"Employee "} />
                  <InputComponent title={"sales rep"} />
                </div>
                <InputComponent title={"email"} className="mb-4" />
                <div className="flex gap-4 mb-4">
                  <InputComponent title={"creation date "} />
                  <InputComponent title={"tax number"} />
                </div>
                <InputComponent title={"debit"} />
              </>
            )}
          </>
        ) : (
          <>
            {/* toggle checkboxes */}

            <div className="flex gap-4 justify-center mb-4">
              <p className="text-base font-bold">
                هل انت متاكد من اتمام عمليه الحذف
              </p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

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
