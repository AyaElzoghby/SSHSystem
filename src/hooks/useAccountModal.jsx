import { API } from "@/api/api";
import { useState, useEffect } from "react";
export const useAccountModal = (initialFormState, selectedId) => {
  const [modelVisible, setModelVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "Add" | "Edit" | "Delete"
  const [formState, setFormState] = useState(initialFormState);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChildCode, setSelectedChildCode] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const api = API();
  // فتح المودال
  const openModal = (type, child = null) => {
    setModalType(type);
    setSelectedChild(child);
    setSelectedChildCode(child?.dcodE1 || null);
    setModelVisible(true);

    if (type === "Add") {
      setFormState(initialFormState);
      setSelectedType(null);
    }

    if (type === "Delete") {
      setFormState(initialFormState);
      setSelectedType(null);
    }
  };

  // إغلاق المودال + reset
  const closeModal = () => {
    setModelVisible(false);
    reset();
  };

  const reset = () => {
    setFormState(initialFormState);
    setSelectedChildCode(null);
    setSelectedChild(null);
    setSelectedType(null);
    setError(null);
    setLoadingDetails(false);
  };

  // ✨ تحميل البيانات عند الفتح (Add / Edit)
  useEffect(() => {
    if (!modelVisible || modalType === "Delete") return;

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
      if (!selectedChildCode) return;
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

  return {
    // state
    modelVisible,
    modalType,
    formState,
    setFormState,
    loadingDetails,
    setLoadingDetails,
    error,
    setError,
    selectedChild,
    selectedChildCode,
    selectedType,
    setSelectedType,
    setModalType,
    // actions
    openModal,
    closeModal,
    reset,
  };
};

// import { useState } from "react";

// export const useAccountModal = (initialFormState) => {
//   const [modelVisible, setModelVisible] = useState(false);
//   const [modalType, setModalType] = useState(null); // "Add" | "Edit" | "Delete"
//   const [formState, setFormState] = useState(initialFormState);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedChildCode, setSelectedChildCode] = useState(null);
//   const [selectedChild, setSelectedChild] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);

//   // فتح المودال
//   const openModal = (type, child = null) => {
//     setModalType(type);
//     setSelectedChild(child);
//     setSelectedChildCode(child?.dcodE1 || null);
//     setModelVisible(true);

//     if (type === "Add") {
//       // reset
//       setFormState(initialFormState);
//       setSelectedType(null);
//     } else if (type === "Edit" && child) {
//       // عبي الداتا من العنصر المختار
//       setFormState({
//         ...initialFormState,
//         ...child,
//       });
//       setSelectedType(child.dacC_TYPE0 || null);
//     } else if (type === "Delete") {
//       // مش محتاج formState هنا
//       setFormState(initialFormState);
//       setSelectedType(null);
//     }
//   };

//   // إغلاق المودال + reset
//   const closeModal = () => {
//     setModelVisible(false);
//     reset();
//   };

//   const reset = () => {
//     setFormState(initialFormState);
//     setSelectedChildCode(null);
//     setSelectedChild(null);
//     setSelectedType(null);
//     setError(null);
//     setLoadingDetails(false);
//   };

//   return {
//     // state
//     modelVisible,
//     modalType,
//     formState,
//     setFormState,
//     loadingDetails,
//     setLoadingDetails,
//     error,
//     setError,
//     selectedChild,
//     selectedChildCode,
//     selectedType,
//     setSelectedType,

//     // actions
//     openModal,
//     closeModal,
//     reset,
//   };
// };
