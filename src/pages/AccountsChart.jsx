import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import NestedTree from "../components/NestedTree";
import Dropdown from "../components/ui/DropDown";
import InputComponent from "../components/InputComponent";
import Tabs from "../components/Tabs";
import CustomButton from "@/components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faSquarePlus,
  faFileLines,
  faPenToSquare,
  faTrash,
  faFolderTree,
  faPrint,
  faRightLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import AccountsChartLang from "@/constants/Lang/AccountsChart";
import { useLanguage } from "@/context/LanguageContext";
import AccountForm from "./AccountFormAccountsChart";
import Checkbox from "@/components/Checkbox";

export default function AccountsChart() {
  const { languageId } = useLanguage();
  const [data, setData] = useState(null);
  const [item, setItem] = useState(null);
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
  // دالة تساعدنا نجيب children بناءً على الـ id
  const getChildrenById = (id, data) => {
    for (const node of data) {
      if (node.dcodE2 === id) return node.children || [];
      if (node.children) {
        const found = getChildrenById(id, node.children);
        if (found.length) return found;
      }
    }
    return [];
  };

  const childrenToDisplay = item
    ? getChildrenById(item, rawData) // item هو selected id
    : [];

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
  const contentsData = [
    {
      tab_title: AccountsChartLang.UnityElements[languageId],
      tab_contents: (
    
        <div>
          <ul>
            {childrenToDisplay.map((child) => (
              <li
                className="w-full flex justify-between items-center border-[0.5px] rounded-md p-2 border-border my-1 text-textSecondary hover:text-textPrimary"
                key={child.dcodE2}
              >
                {child.dname}
                <div className=" flex gap-2">
                  {child.secondary != false && (
                    <CustomButton
                      icon={<FontAwesomeIcon icon={faSquarePlus} />}
                      size="small"
                      className="bg-success text-gray-100"
                      title={"اضافه"}
                    />
                  )}
                  <CustomButton
                    icon={<FontAwesomeIcon icon={faPenToSquare} />}
                    size="small"
                    className="bg-warning  text-gray-100"
                    title={"تعديل"}
                  />
                  <CustomButton
                    icon={<FontAwesomeIcon icon={faTrashCan} />}
                    size="small"
                    className="bg-danger  text-gray-100"
                    title={"حذف"}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      tab_title: AccountsChartLang.UnityDetails[languageId],
      tab_contents: (
        <>
          <div className="flex justify-between px-10 pt-4">
            <Checkbox label={AccountsChartLang.general[languageId]} />
            <Checkbox label={AccountsChartLang.partial[languageId]} />
          </div>
          <AccountForm />
        </>
      ),
    },
  ];
  return (
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
            <NestedTree
              data={data}
              initialExpanded={["root"]} // توسيع الجذر الوهمي افتراضياً
              onItemSelected={(v) => setItem(v)}
            />
          ) : (
            <div>Loading tree data...</div>
          )}
        </div>

        {/* قسم النموذج */}
        <div
          className="col-span-7 shadow-md h-fit rounded-md max-h-[85svh] text-textPrimary bg-surface overflow-auto
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-surface
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-bg
         "
        >
          <div>
            <Tabs contents={contentsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
