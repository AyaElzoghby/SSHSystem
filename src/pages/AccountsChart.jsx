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
import { API } from "../api/api";
import useDropdown from "@/hooks/useDropdown";

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
  const [selectedChildCode, setSelectedChildCode] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);
  const setAccountType = (type) => {
    setFormState((prev) => ({
      ...prev,
      dsecondry: type === "secondary",
    }));
  };
  const [formState, setFormState] = useState({
    dsecondry: false,
    dacC_TYPE0: null,
    dacC_TYPE: null,
    dacC_TYPE2: null,
    dlevel: "",
    dcodE2: "",
    dname: "",
    dnamE2: "",
    dphone: "",
    dphonE2: "",
    dtelx: "",
    demployee: "",
    dslaes: "",
    email: "",
    dfdate: "",
    accVatNo: "",
    openingBalance: "",
    openingDebit: "",
    currentDebit: "",
    totalDebits: "",
    openingCredit: "",
    currentCredit: "",
    totalCredits: "",
    remark: "",
  });
  const api = API();

  // load tree
  async function loadData() {
    try {
      const tree = await api.get("/Account/GetFullTree");
      setRawData(tree);
    } catch (err) {
      console.error("Fetch error (GetFullTree):", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    api
      .get(`/Account/GetAccountDetail?code=${selectedId}`)
      .then((details) => {
        setSelectedAccount(details);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [selectedId]);
  const Type = useDropdown("/Account/GetTask0", {}, ["noOfIndx", "accTypeAR"]);
  const Type1 = useDropdown("/Account/GetTaskOne", {}, [
    "noOfIndx",
    "accTypeAR",
  ]);
  const Type2 = useDropdown("/Account/GetTaskTwo", {}, [
    "noOfIndx",
    "accTypeAR",
  ]);
  const childrenToDisplay = selectedId
    ? getChildrenById(selectedId, rawData)
    : [];

  // ✅ handlers
  async function handleSave() {
    try {
      if (modalType === "Add") {
        // هنبعت الـ parents كـ query string ونبعت بيانات الحساب في الـ body
        await api.post(`/Account/CreateAccount`, formState);
      } else if (modalType === "Edit") {
        console.log(formState ,'forrrrrrrrrrrrm')
        await api.put(`/Account/UpdateAccount`, {
          ...formState,
          code: selectedChildCode,
        });
      }
      await loadData(); // إعادة تحميل الشجرة بعد الحفظ
      setModelVisible(false); // قفل المودال
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  async function handleDelete() {
    try {
      console.log("Deleting:", selectedChildCode);

      await api.delete(`/Account/DeleteAccount?code=${selectedChildCode}`);

      await loadData(); // refresh tree
      setModelVisible(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // input change helper
  function handleInputChange(key, value) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }
  useEffect(() => {
    if (modalType === "Edit" && selectedChild) {
      setFormState({
        dsecondry: selectedChild.dsecondry || false,
        dacC_TYPE0: selectedChild.dacC_TYPE0 || null,
        dacC_TYPE: selectedChild.dacC_TYPE || null,
        dacC_TYPE2: selectedChild.dacC_TYPE2 || null,
        dlevel: selectedChild.dlevel || "",
        dcodE2: selectedChild.dcodE2 || "",
        dname: selectedChild.dname || "",
        dnamE2: selectedChild.dnamE2 || "",
        dphone: selectedChild.dphone || "",
        dphonE2: selectedChild.dphonE2 || "",
        dtelx: selectedChild.dtelx || "",
        demployee: selectedChild.demployee || "",
        dslaes: selectedChild.dslaes || "",
        email: selectedChild.email || "",
        dfdate: selectedChild.dfdate || new Date().toISOString().split("T")[0],
        accVatNo: selectedChild.accVatNo || "",
        openingBalance: selectedChild.openingBalance || "",
        openingDebit: selectedChild.openingDebit || "",
        currentDebit: selectedChild.currentDebit || "",
        totalDebits: selectedChild.totalDebits || "",
        openingCredit: selectedChild.openingCredit || "",
        currentCredit: selectedChild.currentCredit || "",
        totalCredits: selectedChild.totalCredits || "",
        remark: selectedChild.remark || "",
      });
    }
  }, [modalType, selectedChild]);

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
                      setSelectedChildCode(child.dcodE2);
                      setSelectedChild(child);
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
                    setSelectedChildCode(child.dcodE2);
                    console.log(selectedChildCode);
                    setSelectedChild(child);
                    setModelVisible(true);
                    setModalType("Edit");
                    setFormState(selectedChild || {});
                  }}
                />
                <CustomButton
                  icon={<FontAwesomeIcon icon={faTrashCan} />}
                  size="small"
                  className="bg-danger text-gray-100"
                  title={AccountsChartLang.Delete[languageId]}
                  onClick={() => {
                    setSelectedChildCode(child.dcodE2);
                    console.log("Deleting:", selectedChildCode);

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
              checked={selectedAccount.dsecondry}
              onChange={() => setAccountType("secondary")}
            />
            <Checkbox
              label={AccountsChartLang.general[languageId]}
              checked={!selectedAccount.dsecondry}
              onChange={() => setAccountType("general")}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <DropdownComponent
              disabled
              selected={Type.find(
                (opt) => opt.value == selectedAccount.dacC_TYPE0
              )}
              options={Type}
              label={AccountsChartLang.primaryType[languageId]}
            />

            <DropdownComponent
              disabled
              selected={Type1.find(
                (opt) => opt.value == selectedAccount.dacC_TYPE
              )}
              options={Type1}
              label={AccountsChartLang.secondaryType[languageId]}
            />

            <DropdownComponent
              disabled
              selected={Type2.find(
                (opt) => opt.value == selectedAccount.dacC_TYPE2
              )}
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
            onTextChange={(val) =>
              setFormState((prev) => ({ ...prev, dname: val }))
            }
          />
          <InputComponent
            disabled
            title={AccountsChartLang.accountNameEnglish[languageId]}
            className="mb-4"
            value={selectedAccount.dnamE2}
            onTextChange={(val) =>
              setFormState((prev) => ({ ...prev, dnamE2: val }))
            }
          />

          {/* extra fields لو النوع secondary */}
          {selectedAccount.dsecondry && (
            <>
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.phone[languageId]}
                  value={selectedAccount.dphone}
                  type="number"
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.fax[languageId]}
                  value={selectedAccount.dphonE2}
                  type="number"
                />
              </div>
              <InputComponent
                disabled
                title={AccountsChartLang.mobile[languageId]}
                className="mb-4"
                value={selectedAccount.dtelx}
                type="number"
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.Employee[languageId]}
                  value={selectedAccount.demployee}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, demployee: val }))
                  }
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.sales[languageId]}
                  value={selectedAccount.dslaes}
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dslaes: val }))
                  }
                />
              </div>
              <InputComponent
                disabled
                title={AccountsChartLang.email[languageId]}
                className="mb-4"
                value={selectedAccount.email}
                type="email"
                onTextChange={(val) =>
                  setFormState((prev) => ({ ...prev, email: val }))
                }
              />
              <div className="flex gap-4 mb-4">
                <InputComponent
                  disabled
                  title={AccountsChartLang.creationdate[languageId]}
                  value={
                    selectedAccount.dfdate
                      ? new Date(selectedAccount.dfdate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  type="date"
                  onTextChange={(val) =>
                    setFormState((prev) => ({ ...prev, dfdate: val }))
                  }
                />
                <InputComponent
                  disabled
                  title={AccountsChartLang.taxnumber[languageId]}
                  value={selectedAccount.accVatNo}
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
                value={selectedAccount.remark}
                onTextChange={(val) =>
                  setFormState((prev) => ({ ...prev, remark: val }))
                }
              />
            </>
          )}
          <div className="flex justify-end ">
            <CustomButton
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              className="bg-danger  text-gray-100"
              title={AccountsChartLang.DeleteAccount[languageId]}
              onClick={() => {
                setSelectedChildCode(selectedAccount.dcodE1);
                console.log("Deleting:", selectedChildCode);
                setModelVisible(true);
                setModalType("Delete");
              }}
            />
          </div>
        </>
      ) : (
        <p>select account </p>
      ),
    },
  ];

  return (
    <>
      <div
        dir={languageId === 1 ? "rtl" : "ltr"}
        className="flex-col justify-around m-auto items-center overflow-y-auto"
      >
        <div className="flex-row justify-center  grid grid-cols-12 my-4 gap-4">
          {/* tree */}
          <div className="col-span-12 lg:col-span-5 text-textPrimary bg-surface p-4 shadow-md h-fit rounded-lg">
            <h3 className="block border-b-2 w-fit mb-4 font-bold">
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

          {/* details */}
          <div
            className="col-span-12 lg:col-span-7 shadow-md h-fit rounded-md max-h-[88svh] text-textPrimary bg-surface overflow-y-auto  [&::-webkit-scrollbar]:w-3
          [&::-webkit-scrollbar-track]:rounded-md
          [&::-webkit-scrollbar-track]:bg-surface
          [&::-webkit-scrollbar-thumb]:rounded-md
          [&::-webkit-scrollbar-thumb]:bg-surfaceHover"
          >
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
              {/* <button onClick={() => handleDelete(selectedChildCode)}>Sure</button> */}

              <CustomButton
                className="bg-danger"
                title={AccountsChartLang.Sure[languageId]}
                onClick={handleDelete}
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
                onClick={handleSave}
              />
              <CustomButton
                className="bg-danger text-gray-100"
                title={AccountsChartLang.Cancel[languageId]}
                onClick={() => setModelVisible(false)}
              />
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
                checked={formState.dsecondry}
                onChange={() => setAccountType("secondary")}
              />
              <Checkbox
                label={AccountsChartLang.general[languageId]}
                checked={!formState.dsecondry}
                onChange={() => setAccountType("general")}
              />
            </div>

            <div className="flex gap-4 mb-4">
              <DropdownComponent
                selected={Type.find((opt) => opt.value == formState.dacC_TYPE0)}
                options={Type}
                label={AccountsChartLang.primaryType[languageId]}
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, dacC_TYPE0: val }))
                }
              />
              <DropdownComponent
                selected={Type1.find((opt) => opt.value == formState.dacC_TYPE)}
                options={Type1}
                label={AccountsChartLang.secondaryType[languageId]}
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, dacC_TYPE: val }))
                }
              />
              <DropdownComponent
                selected={Type2.find(
                  (opt) => opt.value == formState.dacC_TYPE2
                )}
                options={Type2}
                label={AccountsChartLang.tertiaryType[languageId]}
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, dacC_TYPE2: val }))
                }
              />
            </div>

            <div className="flex gap-4 grid grid-cols-4 mb-4">
              <div className="col-span-1">
                <InputComponent
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
                  value={formState.dcodE2 || ""}
                  title={AccountsChartLang.accountCode[languageId]}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      dcodE2: val.replace(/[^\d]/g, ""),
                    }))
                  }
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
            {formState.dsecondry && (
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
                  <InputComponent
                    title={AccountsChartLang.creationdate[languageId]}
                    value={
                      formState.dfdate
                        ? new Date(formState.dfdate).toISOString().split("T")[0]
                        : new Date(formState.dfdate).toISOString().split("T")[0]
                    }
                    type="date"
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
                  title={AccountsChartLang.openingBalance[languageId]}
                  value={formState.openingBalance}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      openingBalance: val.replace(/[^\d]/g, ""),
                    }))
                  }
                />
                <div className="flex gap-4 mb-4">
                  <InputComponent
                    title={AccountsChartLang.openingDebit[languageId]}
                    value={formState.openingDebit}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        openingDebit: val.replace(/[^\d]/g, ""),
                      }))
                    }
                  />
                  <InputComponent
                    title={AccountsChartLang.currentDebit[languageId]}
                    value={formState.currentDebit}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        currentDebit: val.replace(/[^\d]/g, ""),
                      }))
                    }
                  />
                  <InputComponent
                    title={AccountsChartLang.totalDebits[languageId]}
                    value={formState.totalDebits}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        totalDebits: val.replace(/[^\d]/g, ""),
                      }))
                    }
                  />
                </div>
                <div className="flex gap-4 mb-4">
                  <InputComponent
                    title={AccountsChartLang.openingCredit[languageId]}
                    value={formState.openingCredit}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        openingCredit: val.replace(/[^\d]/g, ""),
                      }))
                    }
                  />
                  <InputComponent
                    title={AccountsChartLang.currentCredit[languageId]}
                    value={formState.currentCredit}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        currentCredit: val.replace(/[^\d]/g, ""),
                      }))
                    }
                  />
                  <InputComponent
                    title={AccountsChartLang.totalCredits[languageId]}
                    value={formState.totalCredits}
                    type="number"
                    onTextChange={(val) =>
                      setFormState((prev) => ({
                        ...prev,
                        totalCredits: val.replace(/[^\d]/g, ""),
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
      </Modal>
    </>
  );
}
