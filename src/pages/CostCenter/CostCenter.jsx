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
import CostCenterLang from "@/constants/Lang/CostCenter";
import { useLanguage } from "@/context/LanguageContext";
import Modal from "@/components/Modal";
import { API } from "../../api/api";
import useDropdown from "@/hooks/useDropdown";
import { initialFormState, processFormData } from "./initialFormState";
import {
  CostCenterControl,
  CostCenterDetails,
  Information,
  Openingbalance,
} from "./TabsData";
import { GetAccountName } from "../../utils/GetAccountName";
import CostCenterModal from "./CostCenterModal";
import toast from "react-hot-toast";
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
export default function CostCenter() {
  const { languageId } = useLanguage();
  const [rawData, setRawData] = useState(null);
  const [modalType, setModalType] = useState(null); // Add | Edit | Delete
  const [selectedId, setSelectedId] = useState(null);
  const [selectedChildCode, setSelectedChildCode] = useState(null);
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [SelectedType, setSelectedType] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  // const [DetailedTabs, setDetailedTabs] = useState([]);

  const setCostCenterType = (type) => {
    setFormState((prev) => ({
      ...prev,
      dsecondry: type === "general", // true لو جنرال
    }));
  };

  const api = API();

  // load tree
  async function loadData() {
    try {
      const tree = await api.get("/CostCenter/GetFullCostCenterTree");
      setRawData(tree);
    } catch (err) {
      console.error("Fetch error (GetFullTree):", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // دالة مشتركة تجيب التفاصيل
  const fetchCostCenterDetails = async (code, setter) => {
    try {
      const details = await api.get(`/CostCenter/GetCostCenterDetail?code=${code}`);
      setter(details);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // استخدام في useEffect الأول (عرض الحساب الأساسي)
  useEffect(() => {
    if (!selectedId) return;
    fetchCostCenterDetails(selectedId, setSelectedCostCenter);
  }, [selectedId]);

  
  const Currencies = useDropdown("/Account/GetCurrencies", {}, [
    "dNum",
    "curr",
  ]);

  const memoParams1 = useMemo(
    () => (SelectedType ? { type0: Number(SelectedType) } : {}),
    [SelectedType]
  );


  const handleItemSelected = useCallback((id) => {
    setSelectedId(id);
  }, []);
  // ✅ handlers

  useEffect(() => {
    if (!selectedId || modalType !== "Add" || !modelVisible) return;

    let cancelled = false;

    const GetNewCostCenterData = async () => {
      setLoadingDetails(true);
      try {
        const NewCostCenterData = await api.get(
          `/CostCenter/GetNewCostCenterData?parentCode=${selectedId}`
        );

        if (cancelled) return;
        setFormState(() => ({
          ...initialFormState,

          dcodE1: NewCostCenterData?.ccCode ?? "",
          dlevel: NewCostCenterData?.ccLevel ?? 0,
          dcodE2: selectedId ?? "",
        }));
        setSelectedType(NewCostCenterData?.CostCenterType0 ?? "");
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    };

    GetNewCostCenterData();

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
          `/CostCenter/GetCostCenterDetail?code=${selectedChildCode}`
        );

        if (cancelled) return;
        setFormState({
          ...details,
          dfdate: details?.dfdate
            ? new Date(details.dfdate).toISOString().split("T")[0]
            : null,
          edDate: details?.edDate
            ? new Date(details.edDate).toISOString().split("T")[0]
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
    const toastId = toast.loading(
      modalType === "Add"
        ? CostCenterLang.AddingCostCenter[languageId]
        : CostCenterLang.EdittingCostCenter[languageId]
    );
    try {
      if (modalType === "Add") {
        const body = processFormData(formState);
        console.log(
          "Addddddd body",
          console.log("Addddddd body", JSON.stringify(body))
        );
        const response = await api.post("/CostCenter/CreateCostCenter", body);
      } else if (modalType === "Edit") {
        console.log("edit body", formState);
        await api.put(`/CostCenter/UpdateCostCenter`, {
          ...formState,
          dcodE1: selectedChildCode,
        });
        fetchCostCenterDetails(selectedId, setSelectedCostCenter);
      }
      toast.success( modalType === "Add"
        ? CostCenterLang.AddDone[languageId]
        : CostCenterLang.EditDone[languageId]
   );
      await loadData();
      setModelVisible(false);
      // reset();
    } catch (error) {
      console.error("Error saving CostCenter:", error);
    }finally{
      toast.dismiss(toastId)
    }
  }

  async function handleDelete() {
    const toastId = toast.loading(
      CostCenterLang.DeletingCostCenter[languageId]
    );
    console.log("Deleting with code:", selectedChildCode);
    try {
      await api.delete(`/CostCenter/DeleteCostCenter?code=${selectedChildCode}`);
      await loadData(); // refresh tree
      setModelVisible(false);
      toast.success(CostCenterLang.DeleteDone[languageId]);
    } catch (err) {
      toast.error("Delete failed");
      console.error("Delete error:", err.response?.data || err.message);
    } finally {
      toast.dismiss(toastId);
    }
  }
  // للأطفال
  const handleAddChild = useCallback((child) => {
    setSelectedChildCode(child.dcodE1);
    setModelVisible(true);
    setModalType("Add");
    setFormState(initialFormState);
  }, []);

  const handleEditChild = useCallback((child) => {
    setSelectedChildCode(child.dcodE1);
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
  const handleAddCostCenter = useCallback(() => {
    if (!selectedCostCenter) return;
    setSelectedChildCode(selectedCostCenter.dcodE1);
    setModelVisible(true);
    setModalType("Add");
    setFormState(initialFormState);
  }, [selectedCostCenter]);

  const handleEditCostCenter = useCallback(() => {
    if (!selectedCostCenter) return;
    setSelectedChildCode(selectedCostCenter.dcodE1);
    setModelVisible(true);
    setModalType("Edit");
  }, [selectedCostCenter]);

  const handleDeleteCostCenter = useCallback(() => {
    if (!selectedCostCenter) return;
    setSelectedChildCode(selectedCostCenter.dcodE1);
    setSelectedId(selectedCostCenter.dcodE2);
    setModelVisible(true);
    setModalType("Delete");
  }, [selectedCostCenter]);

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
          CostCenterLang.Information[languageId]
        } ${GetAccountName(selectedCostCenter, languageId)}`,
        tab_contents: (
          <Information
            key={`info-${selectedCostCenter?.dcodE1}`}
            selectedCostCenter={selectedCostCenter}
          />
        ),
      },
      {
        tab_title: `${
          CostCenterLang.Openingbalance[languageId]
        } ${GetAccountName(selectedCostCenter, languageId)}`,
        tab_contents: (
          <Openingbalance
            key={`open-${selectedCostCenter?.dcodE1}`}
            selectedCostCenter={selectedCostCenter}
            Currencies={Currencies}
          />
        ),
      },
      {
        tab_title: `${
          CostCenterLang.CostCenterControl[languageId]
        } ${GetAccountName(selectedCostCenter, languageId)}`,
        tab_contents: (
          <CostCenterControl
            key={`control-${selectedCostCenter?.dcodE1}`}
            selectedCostCenter={selectedCostCenter}
          />
        ),
      },
     
    ],
    [selectedCostCenter, languageId]
  );

  const contentsData = [
    {
      tab_title: `${
        CostCenterLang.CostCenterElements[languageId]
      } ${GetAccountName(selectedCostCenter, languageId)}`,
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
                          title={CostCenterLang.Add[languageId]}
                          onClick={() => handleAddChild(child)}
                        />
                      )}
                      <CustomButton
                        icon={<FontAwesomeIcon icon={faPenToSquare} />}
                        size="small"
                        className="bg-warning text-gray-100"
                        title={CostCenterLang.Edit[languageId]}
                        onClick={() => handleEditChild(child)}
                      />
                      <CustomButton
                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                        size="small"
                        className="bg-danger text-gray-100"
                        title={CostCenterLang.Delete[languageId]}
                        onClick={() => handleDeleteChild(child)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="text-textPrimary text-base font-bold">
                  {CostCenterLang.NoSubCostCenter[languageId]}
                </p>
              </>
            )
          ) : (
            <p className="text-textPrimary text-base font-bold">
              {" "}
              {CostCenterLang.SelelctCostCenter[languageId]}{" "}
            </p>
          )}
        </>
      ),
    },
    {
      tab_title: `${
        CostCenterLang.CostCenterDetails[languageId]
      } ${GetAccountName(selectedCostCenter, languageId)}`,
      tab_contents: (
        <>
          <CostCenterDetails
          
            DetailedTabs={DetailedTabs}
            selectedCostCenter={selectedCostCenter}
          />
          {selectedCostCenter && (
            <div className="flex justify-center gap-4 ">
              {selectedCostCenter?.dsecondry && (
                <CustomButton
                  icon={<FontAwesomeIcon icon={faSquarePlus} />}
                  className="bg-success text-gray-100"
                  title={CostCenterLang.AddCostCenter[languageId]}
                  onClick={handleAddCostCenter}
                />
              )}
              <CustomButton
                icon={<FontAwesomeIcon icon={faPenToSquare} />}
                className="bg-warning text-gray-100"
                title={CostCenterLang.EditCostCenter[languageId]}
                onClick={handleEditCostCenter}
              />
              <CustomButton
                icon={<FontAwesomeIcon icon={faTrashCan} />}
                className="bg-danger  text-gray-100"
                title={CostCenterLang.DeleteCostCenter[languageId]}
                onClick={handleDeleteCostCenter}
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
              {CostCenterLang.CostCenter[languageId]}
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
                    {CostCenterLang.loading[languageId]}
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
            ? `${CostCenterLang.DeleteCostCenter[languageId]}`
            : modalType === "Add"
            ? `${CostCenterLang.AddCostCenter[languageId]}`
            : `${CostCenterLang.EditCostCenter[languageId]}`
        }
        footer={
          modalType === "Delete" ? (
            <div className="flex gap-4 justify-center w-full">
              <CustomButton
                className="bg-danger"
                title={CostCenterLang.Sure[languageId]}
                onClick={handleDelete}
              />
              <CustomButton
                title={CostCenterLang.Cancel[languageId]}
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
                title={CostCenterLang.Save[languageId]}
                onClick={handleSave}
              />
              <CustomButton
                className="bg-danger text-gray-100"
                title={CostCenterLang.Cancel[languageId]}
                onClick={() => {
                  setModelVisible(false);
                  // reset();
                }}
              />
            </div>
          )
        }
      >
        <CostCenterModal
        
          Currencies={Currencies}
          formState={formState}
          modalType={modalType}
          setFormState={setFormState}
          loadingDetails={loadingDetails}
          setCostCenterType={setCostCenterType}
          setSelectedType={setSelectedType}
        />
      </Modal>
    </>
  );
}
