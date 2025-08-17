import "@fortawesome/fontawesome-free/css/all.min.css";
import NestedTree from "../components/NestedTree";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import React, { useEffect, useState } from "react";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import AccountFormAccountsChart from "./AccountFormAccountsChart";
export default function AccountsStatement() {
  const { languageId } = useLanguage();
  const [data, setData] = useState(null);
  const [rawData, setRawData] = React.useState(null);

  const normalizeTreeDataWithRoot = (array) => {
    const map = {};

    const traverse = (node) => {
      map[node.dcodE2] = {
        name: node.dname,
        children: node.children?.map((child) => child.dcodE2) || [],
      };
      node.children?.forEach(traverse);
    };

    array.forEach(traverse);

    // جذر وهمي
    map["root"] = {
      name: "Root",
      children: array.map((node) => node.dcodE2),
    };

    return map;
  };

  useEffect(() => {
    fetch("/api/Account/GetFullTree.json")
      .then((res) => res.json())
      .then((json) => {
        setRawData(json); // خزّن النسخة الأصلية
        const normalized = normalizeTreeDataWithRoot(json);
        setData(normalized);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  const hasData = data && Object.keys(data).length > 0;
  return (
    <>
      <div
        dir={languageId === 1 ? "rtl" : "ltr"}
        className="flex-col justify-around m-auto items-center overflow-y-auto"
      >
        {/* المحتوى الرئيسي */}
        <div className="flex grid grid-cols-12 my-5 gap-4">
          {/* قسم الشجرة */}
          <div className="col-span-5 max-w-3xl text-textPrimary bg-surface p-4 shadow-md h-fit rounded-lg">
            <h3 className="block mb-1 border-button-warning-light dark:border-button-warning-dark border-b-2 w-fit mb-4 font-bold">
              {AccountsChartLang.UnitStructure[languageId]}
            </h3>

            {/* شرط عرض الشجرة بعد تحميل البيانات */}
            {hasData && rawData ? (
              // <NestedTree
              //   data={data}
              //   initialExpanded={rawData.map((node) => node.dcodE2)}
              // />
              <NestedTree
                data={data}
                initialExpanded={["root"]} // توسيع الجذر الوهمي افتراضياً
              />
            ) : (
              <div>Loading tree data...</div>
            )}
          </div>

          {/* قسم النموذج */}
          <div
            className="col-span-7 shadow-md h-fit rounded-lg max-h-[75svh] text-textPrimary bg-surface overflow-y-auto
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-navbar-bg-light
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-background-light
          dark:[&::-webkit-scrollbar-track]:bg-navbar-bg-dark
          dark:[&::-webkit-scrollbar-thumb]:bg-background-dark"
          >
            <div className="flex justify-between px-10 pt-4">
              <Checkbox label={AccountsChartLang.general[languageId]} />
              <Checkbox label={AccountsChartLang.partial[languageId]} />
            </div>
            <AccountFormAccountsChart />
          </div>
        </div>
      </div>
    </>
  );
}
