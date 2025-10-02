import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLanguage } from "@/context/LanguageContext";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useCallback, useMemo } from "react";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";

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
  const gridRef = useRef();

  // بيانات مبدئية
  const [rowData, setRowData] = useState([
    { id: 1, make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { id: 2, make: "Ford", model: "F-Series", price: 33850, electric: false },
    { id: 3, make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { id: 4, make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { id: 5, make: "Fiat", model: "500", price: 15774, electric: false },
    { id: 6, make: "Nissan", model: "Juke", price: 20675, electric: false },
    { id: 7, make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { id: 8, make: "Ford", model: "F-Series", price: 33850, electric: false },
    { id: 9, make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { id: 10, make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { id: 11, make: "Fiat", model: "500", price: 15774, electric: false },
    { id: 12, make: "Nissan", model: "Juke", price: 20675, electric: false },
    { id: 13, make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { id: 14, make: "Ford", model: "F-Series", price: 33850, electric: false },
  ]);

  // تعريف الأعمدة (ديناميك حسب اللغة)
  const colDefs = useMemo(() => {
    const columns = [
      {
        field: "make",
        headerName: languageId === 1 ? "الشركة المصنعة" : "Make",
        editable: true,
      },
      {
        field: "model",
        headerName: languageId === 1 ? "الموديل" : "Model",
        editable: true,
      },
      {
        field: "price",
        headerName: languageId === 1 ? "السعر" : "Price",
        editable: true,
      },
      {
        field: "electric",
        headerName: languageId === 1 ? "كهربائي" : "Electric",
        editable: true,
      },
      {
        headerName: languageId === 1 ? "إجراءات" : "Actions",
        cellRenderer: (params) => {
          return (
            <button
              onClick={() => handleDelete(params.data.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              {languageId === 1 ? "حذف" : "Delete"}
            </button>
          );
        },
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

  // إضافة صف جديد
  const handleAdd = () => {
    const newId = rowData.length
      ? Math.max(...rowData.map((r) => r.id)) + 1
      : 1;
    const newRow = {
      id: newId,
      make: languageId === 1 ? "شركة جديدة" : "New Make",
      model: languageId === 1 ? "موديل جديد" : "New Model",
      price: 0,
      electric: false,
    };
    setRowData((prev) => [...prev, newRow]);
  };

  // تعديل (بيتم بعد ما المستخدم يخلص تعديل الصف)
  const onRowValueChanged = useCallback((params) => {
    const updatedRow = params.data;
    setRowData((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
  }, []);

  // حذف
  const handleDelete = (id) => {
    setRowData((prev) => prev.filter((row) => row.id !== id));
  };

  // اختيار الترجمة
  const localeText = languageId === 1 ? localeAr : localeEn ;

  return (
    <div
      dir={languageId === 1 ? "rtl" : "ltr"}
      className="flex-col justify-around m-auto items-center overflow-y-auto"
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
      
      <div className="grid grid-cols-12 my-5 gap-4">
          <div className="col-span-12 text-textPrimary bg-surface p-4 shadow-md h-fit rounded-lg">
            <div className="max-w-96">
              <DropdownComponent label={"ytr"} flex/>
            </div>
          {/* زر إضافة */}
          <div className="mb-3">
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {languageId === 1 ? "إضافة صف" : "Add Row"}
            </button>
          </div>

          {/* الجدول */}
          <div
            className={`rtl-grid `}
            style={{
              width: "100%",
              height: 400,
              direction: languageId === 1 ? "rtl" : "ltr",
            }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              editType="fullRow"
              onRowValueChanged={onRowValueChanged}
              getRowId={(params) => params.data.id}
              localeText={localeEn}
              pagination={true}
              paginationPageSize={5}
            />
          </div>
          <div className="flex gap-4 mt-4 max-w-[700px]">
            <InputComponent flex title={'gh'}/>
            <InputComponent flex title={'fg'}/>
            <InputComponent flex title={'ghj'}/>
          </div>
        </div>
      </div>
    </div>
  );
}