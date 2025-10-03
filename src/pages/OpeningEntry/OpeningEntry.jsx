import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLanguage } from "@/context/LanguageContext";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";
import useDropdown from "@/hooks/useDropdown";
import { API } from "@/api/api";
import toast from "react-hot-toast";

ModuleRegistry.registerModules([AllCommunityModule]);
// ترجمة AG Grid
const localeAr = {
  page: "صفحة",
  more: "المزيد",
  to: "إلى",
  of: "من",
  next: "التالي",
  last: "الأخير",
  first: "الأول",
  previous: "السابق",
  loadingOoo: "جار التحميل...",
  searchOoo: "ابحث...",
};
const localeEn = {
  page: "Page",
  more: "More",
  to: "to",
  of: "of",
  next: "Next",
  last: "Last",
  first: "First",
  previous: "Previous",
  loadingOoo: "Loading...",
  searchOoo: "Search...",
};

export default function OpeningEntry() {
  const { languageId } = useLanguage();
  const [rowData, setRowData] = useState([]);
  const [totals, setTotals] = useState({ acc1: 0, acc2: 0, doldAcc: 0 });
  const [editedRows, setEditedRows] = useState([]);
  const [SelectedAccountType, setSelectedAccountType] = useState(null);
  const gridRef = useRef();
  const AccountType = useDropdown("/OpeningEntry/GetComboAccountOption", {}, [
    "value",
    languageId == 1 ? "nameAR" : "nameEn",
  ]);
  const api = API();
  useEffect(() => {
    if (AccountType.length > 0 && !SelectedAccountType) {
      setSelectedAccountType(AccountType[0].value);
    }
  }, [AccountType]);
  // load tableData
  async function loadData() {
    try {
      const tableData = await api.get(
        `/OpeningEntry/GetOpenningEntry?value=${SelectedAccountType}`
      );
      setRowData(tableData);
    } catch (err) {
      console.error("Fetch error (tableData):", err);
    }
  }
  useEffect(() => {
    loadData();
  }, [SelectedAccountType]);
  // حساب المجموعات كل ما rowData يتغير
  useEffect(() => {
    const sum1 = rowData.reduce(
      (sum, row) => sum + (Number(row.doldAcc1) || 0),
      0
    );
    const sum2 = rowData.reduce(
      (sum, row) => sum + (Number(row.doldAcc2) || 0),
      0
    );
    const sum3 = sum2 - sum1;
    setTotals({ acc1: sum1, acc2: sum2, doldAcc: sum3 });
  }, [rowData]);
  // تعريف الأعمدة (ديناميك حسب اللغة)
  const colDefs = useMemo(() => {
    const columns = [
      {
        field: "dnum",
        headerName: languageId === 1 ? " الكود" : "code",
        editable: false,
      },
      {
        field: "dCode01",
        headerName: languageId === 1 ? "كود الحساب" : "Acccount Code",
        editable: false,
      },
      {
        field: "dName",
        headerName: languageId === 1 ? "الاسم عربي" : "Name (ar)",
        editable: false,
      },
      {
        field: "dName2",
        headerName: languageId === 1 ? "الاسم انجليزى" : "Name (en)",
        editable: false,
      },
      {
        field: "doldAcc1",
        headerName: languageId === 1 ? "دائن" : "creditor",
        valueParser: (params) => parseFloat(params.newValue) || 0,
        valueFormatter: (params) => params.value?.toFixed(2), // يعرض برقمين عشريين
        editable: true,
      },
      {
        field: "doldAcc2",
        headerName: languageId === 1 ? "مدين" : "debtor",
        editable: true,
        valueParser: (params) => parseFloat(params.newValue) || 0,
        valueFormatter: (params) => params.value?.toFixed(2), // يعرض برقمين عشريين
      },
      {
        field: "doldAcc",
        headerName: languageId === 1 ? "الفرق" : "difference",
        editable: false, // ❌ ممنوع يتعدل
        valueGetter: (params) =>
          (parseFloat(params.data.doldAcc2) || 0) -
          (parseFloat(params.data.doldAcc1) || 0),
        valueFormatter: (params) => params.value?.toFixed(2),
      },
      {
        field: "notes",
        headerName: languageId === 1 ? "ملاحظات" : "notes",
        editable: true,
      },
      {
        field: "remark",
        headerName: languageId === 1 ? "تعليق" : "remark",
        editable: true,
      },
    ];
    // عكس ترتيب الأعمدة في حالة العربي
    return languageId === 1 ? [...columns].reverse() : columns;
  }, [languageId]);

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };

  // لما خلية تتغير → نعمل logic التصفير
  const onCellValueChanged = (params) => {
    let updatedRow = { ...params.data };

    if (params.colDef.field === "doldAcc1" && Number(updatedRow.doldAcc1) > 0) {
      updatedRow.doldAcc2 = 0;
    }

    if (params.colDef.field === "doldAcc2" && Number(updatedRow.doldAcc2) > 0) {
      updatedRow.doldAcc1 = 0;
    }

    setRowData((prev) =>
      prev.map((row) => (row.dnum === updatedRow.dnum ? updatedRow : row))
    );
  };

  // لما الصف كله يتغير → نحدث قائمة الصفوف المعدلة
  const onRowValueChanged = (params) => {
    const updatedRow = { ...params.data };

    setEditedRows((prev) => {
      const exists = prev.find((r) => r.dnum === updatedRow.dnum);
      if (exists) {
        return prev.map((r) => (r.dnum === updatedRow.dnum ? updatedRow : r));
      }
      return [...prev, updatedRow];
    });
  };

  // إرسال التعديلات
  const handleSave = async () => {
    if (editedRows.length === 0) {
      toast.error("لا توجد تعديلات للحفظ");
      return;
    }

    if (Math.abs(totals.doldAcc) > 0.01) {
      toast.error(
        "الشرط غير متحقق: يجب أن يكون مجموع المدين - مجموع الدائن = 0"
      );
      return;
    }

    const cleanedData = editedRows
      .map((editedRow) => {
        const originalRow = rowData.find((r) => r.dnum === editedRow.dnum);

        if (!originalRow) {
          console.error("Row not found:", editedRow.dnum);
          return null;
        }

        const acc1 = parseFloat(editedRow.doldAcc1) || 0;
        const acc2 = parseFloat(editedRow.doldAcc2) || 0;
        const diff = acc2 - acc1;

        return {
          ...originalRow, // ✅ خد كل الحقول من الصف الأصلي
          doldAcc1: parseFloat(acc1.toFixed(2)),
          doldAcc2: parseFloat(acc2.toFixed(2)),
          doldAcc: parseFloat(diff.toFixed(2)),
          // ✅ احتفظ بـ null لو مفيش قيمة
          notes:
            editedRow.notes !== undefined && editedRow.notes !== ""
              ? editedRow.notes
              : originalRow.notes || "", // ✅ null أو القيمة الأصلية
          remark:
            editedRow.remark !== undefined && editedRow.remark !== ""
              ? editedRow.remark
              : originalRow.remark || "", // ✅ null أو القيمة الأصلية
        };
      })
      .filter((row) => row !== null);

    console.log("Sending data:", cleanedData);

    try {
      await api.put("/OpeningEntry/UpdateAccountGrid", cleanedData);
      toast.success("تم الحفظ بنجاح");
      setEditedRows([]);
      loadData();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "فشل الحفظ");
    }
  };
  // const handleSave = async () => {
  //   if (editedRows.length === 0) {
  //     toast.error("لا توجد تعديلات للحفظ");
  //     return;
  //   }

  //   if (Math.abs(totals.doldAcc) > 0.01) {
  //     toast.error(
  //       "الشرط غير متحقق: يجب أن يكون مجموع المدين - مجموع الدائن = 0"
  //     );
  //     return;
  //   }

  //   // ✅ ابعت كل الحقول من rowData مع التعديلات
  //   const cleanedData = editedRows
  //     .map((editedRow) => {
  //       // جيب الصف الأصلي من rowData
  //       const originalRow = rowData.find((r) => r.dnum === editedRow.dnum);

  //       if (!originalRow) {
  //         console.error("Row not found:", editedRow.dnum);
  //         return null;
  //       }

  //       const acc1 = parseFloat(editedRow.doldAcc1) || 0;
  //       const acc2 = parseFloat(editedRow.doldAcc2) || 0;
  //       const diff = acc2 - acc1;

  //       return {
  //         ...originalRow, // ✅ خد كل الحقول من الصف الأصلي (ID, timestamps, etc.)
  //         // ✅ override بالقيم المعدلة بس
  //         doldAcc1: parseFloat(acc1.toFixed(2)),
  //         doldAcc2: parseFloat(acc2.toFixed(2)),
  //         doldAcc: parseFloat(diff.toFixed(2)),
  //         notes: editedRow.notes || originalRow.notes || "",
  //         remark: editedRow.remark || originalRow.remark || "",
  //       };
  //     })
  //     .filter((row) => row !== null); // ✅ امسح أي null values

  //   console.log("Sending data:", cleanedData);
  //   console.log("Original row sample:", rowData[0]); // ✅ شوف كل الحقول الموجودة

  //   try {
  //     await api.put("/OpeningEntry/UpdateAccountGrid", cleanedData);
  //     toast.success("تم الحفظ بنجاح");
  //     setEditedRows([]);
  //     loadData();
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     toast.error(err.response?.data?.message || "فشل الحفظ");
  //   }
  // };
  //   const handleSave = async () => {
  //   // ✅ تحقق من وجود تعديلات
  //   if (editedRows.length === 0) {
  //     toast.error("لا توجد تعديلات للحفظ");
  //     return;
  //   }

  //   // ✅ تحقق من الشرط
  //   if (totals.doldAcc !== 0) {
  //     toast.error("الشرط غير متحقق: يجب أن يكون مجموع المدين - مجموع الدائن = 0");
  //     return;
  //   }

  //   // ✅ تنظيف البيانات قبل الإرسال
  //   const cleanedData = editedRows.map(row => ({
  //     dnum: row.dnum,
  //     dCode01: row.dCode01 || "",
  //     dName: row.dName || "",
  //     dName2: row.dName2 || "",
  //     doldAcc1: parseFloat(row.doldAcc1) || 0,  // ✅ تحويل لرقم
  //     doldAcc2: parseFloat(row.doldAcc2) || 0,  // ✅ تحويل لرقم
  //     doldAcc: 0,
  //     notes: row.notes || "",
  //     remark: row.remark || "",
  //     // أضف أي حقول تانية الـ Backend محتاجها
  //   }));

  //   console.log("Sending data:", cleanedData); // ✅ للتأكد من الداتا

  //   try {
  //     await api.put("/OpeningEntry/UpdateAccountGrid", cleanedData);
  //     toast.success("تم الحفظ بنجاح");
  //     setEditedRows([]); // ✅ مهم: تفريغ الصفوف المعدلة بعد الحفظ
  //     loadData();
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     // ✅ عرض رسالة الخطأ من الـ Backend
  //     toast.error(err.response?.data?.message || "فشل الحفظ");
  //   }
  // };
  // const handleSave = async () => {
  //   if (totals.doldAcc !== 0) {
  //     alert("⚠️ الشرط غير متحقق: يجب أن يكون مجموع الدائن - مجموع المدين = 0");
  //     toast.error(
  //       " الشرط غير متحقق: يجب أن يكون مجموع المدين - مجموع الدائن = 0"
  //     );
  //     return;
  //   }
  //   console.log("editedRows",editedRows)
  //   try {
  //     await api.put("/OpeningEntry/UpdateAccountGrid", editedRows);

  //     toast.success(" تم الحفظ بنجاح");
  //     loadData();
  //   } catch (err) {
  //     console.error("Save error:", err.message);
  //     toast.error("فشل الحفظ");
  //   }
  // };

  return (
    <div
      dir={languageId === 1 ? "rtl" : "ltr"}
      className="flex-col justify-around m-auto items-center"
    >
      <style>{`
        /* تحريك أيقونة الفلتر في RTL */
        .ag-theme-alpine-rtl .ag-header-cell-menu-button {
          margin-left: 0 !important;
          margin-right: 12px !important;
        }
        
        /* تحريك أيقونات الترتيب في RTL */
        .ag-theme-alpine-rtl .ag-sort-indicator-container {
          margin-left: 0 !important;
          margin-right: 4px !important;
        }
        
        /* عكس ترتيب محتويات الهيدر في RTL */
        .ag-theme-alpine-rtl .ag-header-cell-comp-wrapper {
          flex-direction: row-reverse !important;
        }
        
        /* محاذاة النص لليمين في RTL */
        .ag-theme-alpine-rtl .ag-header-cell,
        .ag-theme-alpine-rtl .ag-cell {
          text-align: right !important;
        }
      `}</style>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 text-textPrimary mt-4 bg-surface p-4 shadow-md rounded-lg">
          <div className="max-w-96">
            <DropdownComponent
              initialValue={AccountType[0]}
              value={SelectedAccountType}
              onChange={(v) => setSelectedAccountType(v.value)}
              options={AccountType}
              label={"نوع الحساب"}
              flex
            />
          </div>

          {/* الجدول */}
          <div
            className={`rtl-grid `}
            style={{
              width: "100%",
              height: 660,
              direction: languageId === 1 ? "rtl" : "ltr",
            }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              editType="fullRow"
              onCellValueChanged={onCellValueChanged} // ✅ للتصفير
              onRowValueChanged={onRowValueChanged}
              getRowId={(params) => params.data.dnum}
              localeText={localeEn}
              pagination={true}
              paginationPageSize={20}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 mt-4 max-w-[700px]">
              <InputComponent
                disabled
                flex
                value={parseFloat(totals.acc1).toFixed(2)}
                title={"مجموع الدائن:"}
              />
              <InputComponent
                disabled
                flex
                value={parseFloat(totals.acc2).toFixed(2)}
                title={"مجموع المدين:"}
              />
              <InputComponent
                disabled
                flex
                value={parseFloat(totals.doldAcc)}
                title={"الفرق:"}
              />
            </div>
            {/* زر الحفظ */}
            <div className="mt-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
