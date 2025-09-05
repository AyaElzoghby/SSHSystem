import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NestedTree from "../../components/NestedTree";
import Tabs from "../../components/Tabs";
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
import { API } from "../../api/api";
import useDropdown from "@/hooks/useDropdown";
import DatePicker from "@/components/DatePicker";
import { initialFormState, processFormData } from "./initialFormState";

// ✅ helper: children by id
function getChildrenById(id, data) {
  if (!Array.isArray(data)) return [];
  for (const node of data) {
    if (String(node.dcodE1) === String(id)) return node.children || [];
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
  const [selectedChildDetails, setSelectedChildDetails] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [SelectedType, setSelectedType] = useState(null);
  const [Code, setCode] = useState(""); // لتخزين الكتابة مؤقتاً
  const [error, setError] = useState("");
  const [nameAr, setnameAr] = useState("");
  const [nameEn, setnameEn] = useState("");
  const setAccountType = (type) => {
    setFormState((prev) => ({
      ...prev,
      dsecondry: type === "general", // true لو جنرال
    }));
  };

  const [formState, setFormState] = useState(initialFormState);

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

  // دالة مشتركة تجيب التفاصيل
  const fetchAccountDetails = async (code, setter) => {
    try {
      const details = await api.get(`/Account/GetAccountDetail?code=${code}`);
      setter(details);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // استخدام في useEffect الأول (عرض الحساب الأساسي)
  useEffect(() => {
    if (!selectedId) return;
    fetchAccountDetails(selectedId, setSelectedAccount);
  }, [selectedId]);

  const Type = useDropdown("/Account/GetTask0", {}, [
    "noOfIndx",
    languageId == 1 ? "accTypeAR" : "accTypeEN",
  ]);
  const Type1 = useDropdown(
    "/Account/GetTaskOne",
    SelectedType ? { type0: Number(SelectedType) } : {},
    ["noOfIndx", languageId == 1 ? "accTypeAR" : "accTypeEN"]
  );
  const Type2 = useDropdown("/Account/GetTaskTwo", {}, [
    "noOfIndx",
    languageId == 1 ? "accTypeAR" : "accTypeEN",
  ]);
  console.log("typyyyyyyy", Type);
  console.log("typyyyyyyy1", Type1);
  console.log("typyyyyyyy2", Type2);
  const childrenToDisplay = selectedId
    ? getChildrenById(selectedId, rawData)
    : [];

  const reset = () => {
    setSelectedType(null);
    setSelectedChildCode(null);
    setSelectedChild(null);
    // setCode(null);
    // setError(null);
  };

  // ✅ handlers

  useEffect(() => {
    if (!selectedChildCode || modalType === "Delete") return;

    let cancelled = false;

    const GetNewAccountData = async () => {
      setLoadingDetails(true);
      try {
        const NewAccountData = await api.get(
          `/Account/GetNewAccountData?parentCode=${selectedId}`
        );

        if (cancelled) return;
        setFormState(() => ({
          ...initialFormState,
          dacC_TYPE0: NewAccountData?.accountType0 ?? "",
          dacC_TYPE: NewAccountData?.accountType1 ?? "",
          dacC_TYPE2: NewAccountData?.accountType2 ?? "",
          dcodE1: NewAccountData?.accountCode ?? "",
          dlevel: NewAccountData?.accountLevel ?? 0,
          dcodE2: selectedId ?? "",
        }));
        setSelectedType(NewAccountData?.accountType0 ?? "");
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
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    };

    // هنا نحدد نستدعي انهي دالة حسب الـ modalType
    if (modalType === "Add") {
      GetNewAccountData();
    } else {
      loadDetails();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedChildCode, selectedId, modalType]);

  async function handleSave() {
    try {
      // if (modalType === "Add") {
      //   console.log("Adddddd Dataaaaaaaaaa", formState);
      //   await api.post(`/Account/CreateAccount`, formState);
      if (modalType === "Add") {
        // const processedForm = processFormData(formState);
        // console.log("Processed Add Data", processedForm);
        // await api.post(`/Account/CreateAccount`, processedForm);
        const body = processFormData(formState);
        console.log("Final Body:", JSON.stringify(body, null, 2));
        const response = await api.post("/Account/CreateAccount", body);
        console.log("Created Account Response:", response);
      } else if (modalType === "Edit") {
        await api.put(`/Account/UpdateAccount`, {
          ...formState,
          dcodE1: selectedChildCode,
        });
        fetchAccountDetails(selectedId, setSelectedAccount);
      }

      await loadData();
      setModelVisible(false);
      reset();
    } catch (error) {
      console.error("Error saving account:", error);
    }
  }

  async function handleDelete() {
    try {
      console.log("Deleting:", selectedChildCode);

      await api.delete(`/Account/DeleteAccount?code=${selectedChildCode}`);

      await loadData(); // refresh tree
      setSelectedId(selectedAccount.dcodE2);
      setModelVisible(false);
      reset();
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
      tab_contents: selectedId ? (
        childrenToDisplay.length > 0 ? (
          <ul>
            {childrenToDisplay.map((child) => (
              <li
                key={child.dcodE1}
                className="w-full flex justify-between items-center border-[0.5px] rounded-md p-2 border-border my-1 text-textSecondary hover:text-textPrimary"
              >
                {languageId == 1
                  ? child.dname
                  : child.dnamE2 === ""
                  ? child.dname
                  : child.dnamE2}
                <div className="flex gap-2">
                  {child.dsecondry !== false && (
                    <CustomButton
                      icon={<FontAwesomeIcon icon={faSquarePlus} />}
                      size="small"
                      className="bg-success text-gray-100"
                      title={AccountsChartLang.Add[languageId]}
                      onClick={() => {
                        setSelectedChildCode(child.dcodE1);
                        setSelectedChild(child);
                        setModelVisible(true);
                        setModalType("Add");
                        setFormState(initialFormState);
                      }}
                    />
                  )}
                  <CustomButton
                    icon={<FontAwesomeIcon icon={faPenToSquare} />}
                    size="small"
                    className="bg-warning text-gray-100"
                    title={AccountsChartLang.Edit[languageId]}
                    onClick={() => {
                      setSelectedChildCode(child.dcodE1);
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
                      setSelectedChildCode(child.dcodE1);
                      setModelVisible(true);
                      setModalType("Delete");
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="text-textPrimary text-base font-bold">
              {AccountsChartLang.NoSubAccount[languageId]}
            </p>
          </>
        )
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {" "}
          {AccountsChartLang.SelelctAccount[languageId]}{" "}
        </p>
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
              checked={!selectedAccount.dsecondry}
              onChange={() => setAccountType("secondary")}
            />
            <Checkbox
              label={AccountsChartLang.general[languageId]}
              checked={selectedAccount.dsecondry}
              onChange={() => setAccountType("general")}
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
          {!selectedAccount.dsecondry && (
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
                <DatePicker
                  disabled
                  title={AccountsChartLang.creationdate[languageId]}
                  value={
                    selectedAccount.dfdate
                      ? new Date(selectedAccount.dfdate)
                          .toISOString()
                          .split("T")[0]
                      : ""
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

              {/* <InputComponent
                disabled
                title={AccountsChartLang.currentCredit[languageId]}
                value={selectedAccount.currentCredit}
                type="number"
              /> */}

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
          <div className="flex justify-center gap-4 ">
            <CustomButton
              icon={<FontAwesomeIcon icon={faSquarePlus} />}
              className="bg-success text-gray-100"
              title={AccountsChartLang.AddAccount[languageId]}
              onClick={() => {
                setSelectedChildCode(selectedAccount.dcodE1);
                setModelVisible(true);
                setModalType("Add");
                setFormState(initialFormState);
              }}
            />
            <CustomButton
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
              className="bg-warning text-gray-100"
              title={AccountsChartLang.EditAccount[languageId]}
              onClick={() => {
                setSelectedChildCode(selectedAccount.dcodE1);
                setModelVisible(true);
                setModalType("Edit");
              }}
            />
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
        <p className="text-textPrimary text-base font-bold">
          {AccountsChartLang.SelelctAccountDetails[languageId]}
        </p>
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
            <div className="">
              {rawData ? (
                <NestedTree
                  data={rawData}
                  onItemSelected={(id) => setSelectedId(id)}
                />
              ) : (
                <div>
                  <p className="text-textPrimary text-base">
                    {AccountsChartLang.AccountsChart[languageId]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* details */}
          <div className="col-span-12 lg:col-span-7 shadow-md h-fit rounded-md  text-textPrimary bg-surface">
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
            ? `${AccountsChartLang.DeleteAccount[languageId]}`
            : modalType === "Add"
            ? `${AccountsChartLang.AddAccount[languageId]}`
            : `${AccountsChartLang.EditAccount[languageId]}`
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
                onClick={() => {
                  setModelVisible(false);
                  reset();
                }}
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
                onClick={() => {
                  setModelVisible(false);
                  reset();
                }}
              />
            </div>
          )
        }
      >
        {loadingDetails ? (
          <div className="flex items-center justify-center p-10">
            <span className="loader"></span> {/* ممكن تستخدم Spinner جاهز */}
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
                  console.log("SelectedType:", SelectedType);
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
                  error={error}
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
            هل انت متاكد من اتمام عمليه الحذف؟
          </p>
        )}
      </Modal>
    </>
  );
}
