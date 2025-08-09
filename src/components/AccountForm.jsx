import React, { useState } from "react";
import Dropdown from "./ui/DropDown";
import InputComponent from "./InputComponent";
import Tabs from "./Tabs"; // تأكد من مسار الملف حسب مكانه
import { Checkbox } from "@mui/material";

export default function ArabicForm() {
  const [formData, setFormData] = useState({
    agency: "",
    name: "",
    country: "",
    province: "",
    city: "",
    address: "",
  });
  const contentsData = [
    {
      tab_title: "معلومات",
      tab_contents: (
        <div className="flex-col gap-x-6 gap-y-4" dir="rtl">
          <InputComponent flex label={"عنوان 1"} title={"عنوان 1"} />
          <InputComponent flex label={"عنوان 2"} title={"عنوان 2"} />
          <InputComponent flex label={"فاكس/هاتف"} title={"فاكس/هاتف"} />
          <InputComponent flex label={"جوال/اخرى"} title={"جوال/اخرى"} />
          <InputComponent
            flex
            label={"بريد إلكتروني"}
            title={"بريد إلكتروني"}
          />
          <InputComponent flex label={"رقم ضريبي"} title={"رقم ضريبي"} />
          <InputComponent
            flex
            label={"بريد إلكتروني"}
            title={"بريد إلكتروني"}
          />
          <InputComponent
            flex
            label={" تاريخ الحساب"}
            title={" تاريخ الحساب"}
          />
        </div>
      ),
    },
    {
      tab_title: "الرصيد الافتتاحى",
      tab_contents: (
        <div className="gap-x-6 gap-y-4 sm:grid-cols-6" dir="rtl">
          <p className=" font-medium  text-gray-900">
            الرصيد الافتتاحى للحساب بالعمله الاساسيه{" "}
          </p>
          <InputComponent flex label={"مدين"} title={"مدين"} />
          <InputComponent flex label={"دائن"} title={"دائن"} />

          <p className=" font-medium  text-gray-900">
            العملات الاجنبيه و الرصيد الافتتاحى بها{" "}
          </p>
          <Dropdown flex rtl={true} label={"اختر العمله"} />
          <InputComponent flex label={"مدين"} title={"مدين"} />
          <InputComponent flex label={"دائن"} title={"دائن"} />
        </div>
      ),
    },
    {
      tab_title: "التحكم بالحساب",
      tab_contents: (
        <div className="gap-x-6 gap-y-4 sm:grid-cols-6" dir="rtl">
          <div className="flex">
            <label
              htmlFor="TxtFax"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              حد الائتمان
            </label>
            <InputComponent flex label={"مدين"} title={"حد الائتمان"} />
            <InputComponent flex label={"دائن"} title={""} />
          </div>

          <div
            className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between"
            dir="rtl"
          >
            {" "}
            <label
              htmlFor="Txtparaccname"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              الاطلاع على{" "}
            </label>
            <select
              id="Combtype0"
              name="Combtype0"
              autoComplete="country-name"
              value={"roomId"}
              //   onChange={e => setRoomId(e.target.value)}
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            >
              <option value="real">عام</option>
              <option value="denar">رئيسي</option>
              <option value="eg">قطاع</option>
            </select>
            {/* <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                /> */}
          </div>
          <div className="col-span-full flex items-center gap-x-6 " dir="rtl">
            <Checkbox id="ChkMobileMssg" />
            <label
              htmlFor="TxtAdress2"
              className="text-sm/6 font-medium text-gray-900"
            >
              اخطار العميل عند تعدى حد الائتمان بالايميل{" "}
            </label>
          </div>
          <div className="col-span-full flex items-center gap-x-6 " dir="rtl">
            <Checkbox id="ChkAccStop" />
            <label
              htmlFor="TxtAdress2"
              className="text-sm/6 font-medium text-gray-900"
            >
              ايقاف التعامل مع الحساب{" "}
            </label>
          </div>
          <div className="col-span-full flex items-center gap-x-6 " dir="rtl">
            <input
              id="TxtAccStop"
              name="TxtAccStop"
              type="text"
              placeholder="سبب  ايقاف التعامل مع الحساب"
              className=" min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full flex items-center gap-x-6 " dir="rtl">
            <Checkbox id="ChkAccNotes" />
            <label
              htmlFor="TxtAdress2"
              className="text-sm/6 font-medium text-gray-900"
            >
              ملاحظات التعامل مع الحساب{" "}
            </label>
          </div>
          <div className="col-span-full flex items-center gap-x-6 " dir="rtl">
            <input
              id="TxtAccNotes"
              name="TxtAccNotes"
              type="text"
              placeholder="  ملاحظات التعامل مع الحساب"
              className=" min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full flex items-center gap-x-6 " dir="rtl">
            <Checkbox id="ChkCostNeeded " />
            <label
              htmlFor="TxtAdress2"
              className="text-sm/6 font-medium text-gray-900"
            >
              يلزم ربط الحساب مع مركز التكلفه{" "}
            </label>
          </div>
        </div>
      ),
    },
    {
      tab_title: "معلومات#1",
      tab_contents: (
        <div
          className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6"
          dir="rtl"
        >
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtCountry"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              البلد/الرمز{" "}
            </label>
            <input
              id="TxtCountry"
              name="TxtCountry"
              type="number"
              placeholder="000 0000 000"
              className="col-span-6 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />{" "}
            <input
              id="TxtCountrySign"
              name="TxtCountrySign"
              type="number"
              placeholder="+00"
              className="col-span-3 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />{" "}
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtCntSubEnƟty"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              منطقه/محافظه{" "}
            </label>
            <input
              id="TxtCntSubEnƟty"
              name="TxtCntSubEnƟty"
              type="text"
              placeholder=" ادخل المنطقه"
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />{" "}
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtPostalZone"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              رقم بريدى{" "}
            </label>
            <input
              id="TxtPostalZone"
              name="TxtPostalZone"
              type="number"
              placeholder="الرقم البريدى"
              className="col-span-3 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
            <label
              htmlFor="TxtBuildNo"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              رقم المبنى{" "}
            </label>
            <input
              id="TxtBuildNo"
              name="TxtBuildNo"
              type="text"
              placeholder="رقم المبنى"
              className="col-span-3 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtCity"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              المدينه
            </label>
            <input
              id="TxtCity"
              name="TxtCity"
              type="text"
              placeholder="المدينه"
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtCityDiv"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              الحي
            </label>
            <input
              id="TxtCityDiv"
              name="TxtCityDiv"
              type="text"
              placeholder="الحي"
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtPlotId"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              PIot ID{" "}
            </label>
            <input
              id="TxtPlotId"
              name="TxtPlotId"
              type="number"
              placeholder=" PIot ID"
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtCr"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              سجل تجارى{" "}
            </label>
            <input
              id="TxtCr"
              name="TxtCr"
              type="number"
              placeholder=" سجل تجارى"
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtStretName"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              اسم الشارع{" "}
            </label>
            <input
              id="TxtStretName"
              name="TxtStretName"
              type="text"
              placeholder=" اسم الشارع "
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
          <div className="col-span-full grid grid-cols-12 flex items-center gap-x-6 justify-between">
            <label
              htmlFor="TxtAddStretName"
              className="col-span-3 text-sm/6 font-medium text-gray-900"
            >
              شارع اضافي{" "}
            </label>
            <input
              id="TxtAddStretName"
              name="TxtAddStretName"
              type="text"
              placeholder="   شارع اضافي  "
              className="col-span-9 min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
            />
          </div>
        </div>
      ),
    },
  ];
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("تم الحفظ:", formData);
  };

  const handleNew = () => {
    setFormData({
      agency: "",
      name: "",
      country: "",
      province: "",
      city: "",
      address: "",
    });
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-6 rounded-md shadow-md">
      <div className="">
        <InputComponent flex label={" رقم الحساب"} title={" رقم الحساب"} />
        <InputComponent
          flex
          label={" عربي / اسم الحساب"}
          title={" عربي / اسم الحساب"}
        />
        <InputComponent
          flex
          label={"انجليزى / اسم الحساب"}
          title={"انجليزى / اسم الحساب"}
        />
        <InputComponent
          flex
          label={"الحساب الرئيسي"}
          title={"الحساب الرئيسي"}
        />

        <Dropdown flex label={"نوع الحساب"} />
      </div>

      <div className="">
        <div>
          <Tabs contents={contentsData} />
        </div>
      </div>
    </div>
  );
}
