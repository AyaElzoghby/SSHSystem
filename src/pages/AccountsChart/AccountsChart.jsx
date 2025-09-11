import { useEffect, useMemo, useState, useCallback } from "react";
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
import Modal from "@/components/Modal";
import { API } from "../../api/api";
import useDropdown from "@/hooks/useDropdown";
import { initialFormState, processFormData } from "./initialFormState";
import {
  AccountControl,
  AccountDetails,
  Information,
  Information1,
  Openingbalance,
} from "./TabsData";
import { GetAccountName } from "../../utils/GetAccountName";
import AccountModal from "./AccountModal";
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
  const [formState, setFormState] = useState(initialFormState);
  // const [DetailedTabs, setDetailedTabs] = useState([]);

  const setAccountType = (type) => {
    setFormState((prev) => ({
      ...prev,
      dsecondry: type === "general", // true لو جنرال
    }));
  };

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

  const ViewOf = useDropdown("/Account/GetCombScureAccount", {}, [
    "value",
    languageId == 1 ? "nameAR" : "nameEn",
  ]);
  const Currencies = useDropdown("/Account/GetCurrencies", {}, [
    "dNum",
    "curr",
  ]);
  const Type = useDropdown("/Account/GetTask0", {}, [
    "noOfIndx",
    languageId == 1 ? "accTypeAR" : "accTypeEN",
  ]);
  const memoParams1 = useMemo(
    () => (SelectedType ? { type0: Number(SelectedType) } : {}),
    [SelectedType]
  );
  const Type1 = useDropdown("/Account/GetTaskOne", memoParams1, [
    "noOfIndx",
    languageId == 1 ? "accTypeAR" : "accTypeEN",
  ]);
  const Type2 = useDropdown("/Account/GetTaskTwo", {}, [
    "noOfIndx",
    languageId == 1 ? "accTypeAR" : "accTypeEN",
  ]);

  const handleItemSelected = useCallback((id) => {
    setSelectedId(id);
  }, []);
  // ✅ handlers

  useEffect(() => {
    if (!selectedId || modalType !== "Add" || !modelVisible) return;

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

    GetNewAccountData();

    return () => {
      cancelled = true;
    };
  }, [selectedId, modalType, modelVisible]);

  useEffect(() => {
    if (!selectedChildCode || modalType !== "Edit") return;

    let cancelled = false;

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
            : null,
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
        const body = processFormData(formState);
        console.log("Addddddd body", body);

        const response = await api.post("/Account/CreateAccount", body);
      } else if (modalType === "Edit") {
        console.log("edit body", formState);
        await api.put(`/Account/UpdateAccount`, {
          ...formState,
          dcodE1: selectedChildCode,
        });
        fetchAccountDetails(selectedId, setSelectedAccount);
      }
      await loadData();
      setModelVisible(false);
      // reset();
    } catch (error) {
      console.error("Error saving account:", error);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/Account/DeleteAccount?code=${selectedChildCode}`);
      await loadData(); // refresh tree
      setModelVisible(false);
      // reset();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // للأطفال
  const handleAddChild = useCallback((child) => {
    setSelectedChildCode(child.dcodE1);
    setSelectedChild(child);
    setModelVisible(true);
    setModalType("Add");
    setFormState(initialFormState);
  }, []);

  const handleEditChild = useCallback((child) => {
    setSelectedChildCode(child.dcodE1);
    setSelectedChild(child);
    setModelVisible(true);
    setModalType("Edit");
    setFormState(child || {});
  }, []);

  const handleDeleteChild = useCallback((child) => {
    setSelectedChildCode(child.dcodE1);
    setModelVisible(true);
    setModalType("Delete");
  }, []);

  // للأكاونت المحدد
  const handleAddAccount = useCallback(() => {
    if (!selectedAccount) return;
    setSelectedChildCode(selectedAccount.dcodE1);
    setModelVisible(true);
    setModalType("Add");
    setFormState(initialFormState);
  }, [selectedAccount]);

  const handleEditAccount = useCallback(() => {
    if (!selectedAccount) return;
    setSelectedChildCode(selectedAccount.dcodE1);
    setModelVisible(true);
    setModalType("Edit");
  }, [selectedAccount]);

  const handleDeleteAccount = useCallback(() => {
    if (!selectedAccount) return;
    setSelectedChildCode(selectedAccount.dcodE1);
    setSelectedId(selectedAccount.dcodE2);
    setModelVisible(true);
    setModalType("Delete");
  }, [selectedAccount]);

  // input change helper
  const handleInputChange = useCallback((key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const childrenToDisplay = useMemo(() => {
    return selectedId ? getChildrenById(selectedId, rawData) : [];
  }, [selectedId, rawData]);

  const DetailedTabs = useMemo(
    () => [
      {
        tab_title: `${
          AccountsChartLang.Information[languageId]
        } ${GetAccountName(selectedAccount, languageId)}`,
        tab_contents: (
          <Information
            key={`info-${selectedAccount?.dcodE1}`}
            selectedAccount={selectedAccount}
          />
        ),
      },
      {
        tab_title: `${
          AccountsChartLang.Openingbalance[languageId]
        } ${GetAccountName(selectedAccount, languageId)}`,
        tab_contents: (
          <Openingbalance
            key={`open-${selectedAccount?.dcodE1}`}
            selectedAccount={selectedAccount}
            Currencies={Currencies}
          />
        ),
      },
      {
        tab_title: `${
          AccountsChartLang.AccountControl[languageId]
        } ${GetAccountName(selectedAccount, languageId)}`,
        tab_contents: (
          <AccountControl
            key={`control-${selectedAccount?.dcodE1}`}
            selectedAccount={selectedAccount}
            ViewOf={ViewOf}
          />
        ),
      },
      {
        tab_title: `${
          AccountsChartLang.Information1[languageId]
        } ${GetAccountName(selectedAccount, languageId)}`,
        tab_contents: (
          <Information1
            key={`info1-${selectedAccount?.dcodE1}`}
            selectedAccount={selectedAccount}
          />
        ),
      },
    ],
    [selectedAccount, languageId]
  );

  const contentsData = [
    {
      tab_title: `${
        AccountsChartLang.AccountElements[languageId]
      } ${GetAccountName(selectedAccount, languageId)}`,
      tab_contents: (
        <>
          {selectedId ? (
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
                      {child.dsecondry && (
                        <CustomButton
                          icon={<FontAwesomeIcon icon={faSquarePlus} />}
                          size="small"
                          className="bg-success text-gray-100"
                          title={AccountsChartLang.Add[languageId]}
                          onClick={() => handleAddChild(child)}
                        />
                      )}
                      <CustomButton
                        icon={<FontAwesomeIcon icon={faPenToSquare} />}
                        size="small"
                        className="bg-warning text-gray-100"
                        title={AccountsChartLang.Edit[languageId]}
                        onClick={() => handleEditChild(child)}
                      />
                      <CustomButton
                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                        size="small"
                        className="bg-danger text-gray-100"
                        title={AccountsChartLang.Delete[languageId]}
                        onClick={() => handleDeleteChild(child)}
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
          )}
        </>
      ),
    },
    {
      tab_title: `${
        AccountsChartLang.AccountDetails[languageId]
      } ${GetAccountName(selectedAccount, languageId)}`,
      tab_contents: (
        <>
          <AccountDetails
            Type={Type}
            Type1={Type1}
            Type2={Type2}
            DetailedTabs={DetailedTabs}
            selectedAccount={selectedAccount}
          />
          {selectedAccount && (
            <div className="flex justify-center gap-4 ">
              {selectedAccount?.dsecondry && (
                <CustomButton
                  icon={<FontAwesomeIcon icon={faSquarePlus} />}
                  className="bg-success text-gray-100"
                  title={AccountsChartLang.AddAccount[languageId]}
                  onClick={handleAddAccount}
                />
              )}
              <CustomButton
                icon={<FontAwesomeIcon icon={faPenToSquare} />}
                className="bg-warning text-gray-100"
                title={AccountsChartLang.EditAccount[languageId]}
                onClick={handleEditAccount}
              />
              <CustomButton
                icon={<FontAwesomeIcon icon={faTrashCan} />}
                className="bg-danger  text-gray-100"
                title={AccountsChartLang.DeleteAccount[languageId]}
                onClick={handleDeleteAccount}
              />
            </div>
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
                  selectedId={selectedId} // 👈 يتحكم من عندك
                  onSelectedChange={setSelectedId} // 👈 يحدث الأب
                  onItemSelected={handleItemSelected} // 👈 لو عايزة تبني لوجيك تاني
                />
              ) : (
                <div>
                  <p className="text-textPrimary text-base">
                    {AccountsChartLang.loading[languageId]}
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
              <CustomButton
                className="bg-danger"
                title={AccountsChartLang.Sure[languageId]}
                onClick={handleDelete}
              />
              <CustomButton
                title={AccountsChartLang.Cancel[languageId]}
                onClick={() => {
                  setModelVisible(false);
                  // reset();
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
                  // reset();
                }}
              />
            </div>
          )
        }
      >
        <AccountModal
          Type={Type}
          Type1={Type1}
          Type2={Type2}
          Currencies={Currencies}
          ViewOf={ViewOf}
          formState={formState}
          modalType={modalType}
          setFormState={setFormState}
          loadingDetails={loadingDetails}
          setAccountType={setAccountType}
          setSelectedType={setSelectedType}
        />
      </Modal>
    </>
  );
}
