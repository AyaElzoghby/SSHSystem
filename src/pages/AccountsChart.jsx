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
  const [selectedChildDetails, setSelectedChildDetails] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const setAccountType = (type) => {
    setFormState((prev) => ({
      ...prev,
      dsecondry: type === "secondary",
    }));
  };
  const [formState, setFormState] = useState({
    dcodE1: "",
    dcodE2: "",
    dname: "",
    dnamE2: "",
    num: null,
    doldacC1: 0,
    doldacC2: 0,
    doldacc: 0,
    dcurrenT1: null,
    dcurrenT2: null,
    dcacc: 0,
    ddacc: 0,
    dcaccm: 0,
    ddaccm: 0,
    ddeP_AMOUNT: 0,
    ddeP_PER: 0,
    dacC_TYPE0: "",
    dacC_TYPE: "",
    dacC_TYPE2: "",
    ddeP_CODE: null,
    dfdate: "",
    dtdate: null,
    dacC_TNAME: null,
    daddress: "",
    daddresS2: "",
    dcrediT_LIMT: 0,
    dpurchase: 0,
    dpurchasedate: "",
    ddeP_NAME: "",
    dphone: "",
    dphonE2: "",
    dvaluedate: "",
    dvalue: 0,
    dcurrency: "",
    dtelx: "",
    dpager: "",
    ddate: "",
    dlevel: 0,
    dsecondry: false,
    remark: "",
    doldacccurr: 0,
    ddacccurr: 0,
    dcacccurr: 0,
    accumulatecode: "",
    och_rate: 0,
    scur: 0,
    dstop: false,
    email: "",
    mor1: "",
    mor2: "",
    mor3: "",
    mor4: "",
    mor5: "",
    acc_Rem: "",
    accshow_Rem: false,
    dStop_Rem: "",
    u_date_a: null,
    u_time_a: null,
    dperiod_allow: 0,
    acC_TYPE: 0,
    dtelother: "",
    demployee: "",
    dslaes: "",
    emaiL_MSG: false,
    costCRelate: false,
    fixExclusion: false,
    fixExclDate: null,
    accVatNo: "",
    monDedction: 0,
    iqamaNo: "",
    iqamaExp: null,
    monDedStart: null,
    nextDedDate: null,
    dedInterval: 0,
    dbAccBfPr: 0,
    dcAccBfPr: 0,
    dOldAcc1Pr: 0,
    dOldAcc2Pr: 0,
    dOldAccPr: 0,
    dbAccDurPr: 0,
    dcAccDurPr: 0,
    currDbBlnc: 0,
    currCrBlnc: 0,
    currNetBlnc: 0,
    depAmount: 0,
    accumulateBalance: 0,
    accumulateName: "",
    dadd: 0,
    dadD_Dep: 0,
    dailyDep: 0,
    ddeP_years: 0,
    depbal: 0,
    depByTime: 0,
    depDayes: 0,
    dold: 0,
    dRem: 0,
    dRem_Dep: 0,
    endDate: null,
    finalBAL: 0,
    absCurrBlnce: 0,
    baL1: 0,
    baL2: 0,
    currNetBalance: 0,
    disp: "",
    ilCase: "",
    rColor: 0,
    stB_BACK: "",
    oriFTYPE: "",
    ftype: "",
    docTypeName: "",
    codE2: "",
    gRegNo: 0,
    onumber: 0,
    bookno: "",
    fdate: null,
    fcode: "",
    tcode: "",
    fname: "",
    tname: "",
    amount: 0,
    paid: 0,
    bamount: 0,
    change: 0,
    totdiscount: 0,
    cost: 0,
    paide: 0,
    posted: 0,
    cH_RATE: 0,
    dutY_DAY: 0,
    useR_NO: 0,
    username: "",
    seller: "",
    sellername: "",
    ref: "",
    chK_NO: "",
    chK_DATE: null,
    banK_NAME: "",
    name: "",
    cost_Center: "",
    jobNo: 0,
    orderNo: 0,
    dlvType: 0,
    paymode: "",
    paymodeno: "",
    taxcost: 0,
    shipcost: 0,
    othercost: 0,
    custAddr: "",
    custTel: "",
    custFax: "",
    invoice_Date: null,
    u_DATE_E: null,
    estUserNo: "",
    estUserName: "",
    u_TIME_E: null,
    invoicE_NO: "",
    ncust: "",
    codE3: "",
    nameref1: "",
    cash_no: "",
    unitf: 0,
    shifT_NO: "",
    nameref2: "",
    brnno: "",
    wsname: "",
    wsno: "",
    bwo: 0,
    amount2: 0,
    ch_rate2: 0,
    fileno: 0,
    cmpacc: 0,
    pantname: "",
    remark1: "",
    remark2: "",
    diq: "",
    phrdis: 0,
    inuacc: "",
    amount3: 0,
    currName: "",
    fixExcName: "",
    landNo: "",
    landName: "",
    restAccName: "",
    restAccNo: "",
    vouArrangeNo: "",
    vouDiscType: 0,
    vouDiscPer: 0,
    vouDiscAmount: 0,
    vouTotDisc: 0,
    itmTotDisc: 0,
    itmTotQnt: 0,
    invCost: 0,
    totAmntWithoutDisc: 0,
    totAmntBfDisc: 0,
    totAmntAfItmDisc: 0,
    vatAmnt: 0,
    totAmntAfVat: 0,
    selleR2: "",
    sellernamE2: "",
    cust2Accno: "",
    cust2Name: "",
    cust2Mobile: "",
    cust2Address: "",
    invCode2: "",
    gNot01: "",
    gNot02: "",
    gNot03: "",
    gNot04: "",
    gNot05: "",
    gNot06: "",
    gNot07: "",
    gNot08: "",
    gNot09: "",
    gNot10: "",
    gNot11: "",
    gNot12: "",
    gNot13: "",
    gNot14: "",
    gNot15: "",
    maturityStart: null,
    maturityEnd: null,
    rowBColor: 0,
    acc_arrang: 0,
    accGranted: false,
    dNum: 0,
    crNo: "",
    cntryName: "",
    cntryIdCode: "",
    cntrySubentity: "",
    postalCode: "",
    cityName: "",
    citySubDivsion: "",
    plotId: "",
    buildNo: "",
    streetname: "",
    addStreetname: "",
    g_Date01: null,
    g_Date02: null,
    ctActive: 0,
    curUntStr: "",
    curUntNo: 0,
    curAkrName: "",
    curAkrNo: "",
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
  
    useEffect(() => {
    if (!selectedChildCode || modalType !== "Edit") return;

    let cancelled = false;

    const loadDetails = async () => {
      setLoadingDetails(true);
      try {
        // ملاحظة: استخدم نفس شكل رجوع API بتاعك (لو api.get بيرجع الداتا مباشرة)
        const details = await api.get(
          `/Account/GetAccountDetail?code=${selectedChildCode}`
        );

        if (cancelled) return;

        setSelectedChildDetails(details);

        // عبّي الفورم بالداتا الراجعة (مع تنسيق التاريخ)
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

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedChildCode, modalType]);
  async function handleSave() {
    try {
      if (modalType === "Add") {
        await api.post(`/Account/CreateAccount`, formState);
      } else if (modalType === "Edit") {
        await api.put(`/Account/UpdateAccount`, {
          ...formState,
          dcodE1: selectedChildCode, // لازم يتبعت عشان السيرفر يعرف أي حساب يعدل
        });
        await loadDetails()
      }

      await loadData(); // إعادة تحميل البيانات بعد الحفظ
      setModelVisible(false); // قفل المودال
    } catch (error) {
      console.error("Error saving account:", error);
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
        {loadingDetails ? (
          <div className="flex items-center justify-center p-10">
            <span className="loader"></span> {/* ممكن تستخدم Spinner جاهز */}
          </div>
        ) : modalType === "Edit" || modalType === "Add" ? (
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
                  value={formState.dcodE1 || ""}
                  title={AccountsChartLang.accountCode[languageId]}
                  type="number"
                  onTextChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      dcodE1: val.replace(/[^\d]/g, ""),
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
                    value={formState.dfdate}
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
