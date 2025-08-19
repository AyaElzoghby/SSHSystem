import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function DropdownComponent({
  title, // العنوان الثابت فوق الحقل
  disabled = false, // ✅ جديد: التحكم في تعطيل الحقل
  label, // النص بجانب الحقل في حالة flex
  options = [], // قائمة الخيارات
  selected, // القيمة المختارة (object فيه {label, value})
  onChange, // الحدث عند التغيير
  rtl = true, // دعم الكتابة من اليمين
  placeholder = rtl ? "اختر..." : "Select...",
  flex = false, // هل الحقل في وضعية flex grid
  className = "", // كلاس إضافي للعنصر الأساسي
}) {
  return (
    <div
      className={`w-full mb-4 ${
        flex ? "flex gap-4 grid grid-cols-4 items-center" : ""
      } ${className}`}
    >
      {/* العنوان الثابت */}
      {label && (
        <p
          className={`text-sm font-semibold mb-1 ${
            flex ? "col-span-1" : ""
          } text-text-light dark:text-text-dark text-start`}
        >
          {label}
        </p>
      )}

      <Listbox value={selected} onChange={onChange} disabled={disabled}>
        <div className={`relative w-full ${flex ? "col-span-3" : ""}`}>
          <Listbox.Button
            className={`w-full rounded-md border border-gray-300 
              dark:bg-inputs-dark bg-opacity-50 dark:bg-opacity-50 
              bg-gray-100 py-2 px-3 shadow-sm focus:outline-none 
              ${rtl ? "text-right" : "text-left"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span className="block truncate">
              {selected?.label || placeholder}
            </span>
            <span
              className={`pointer-events-none absolute inset-y-0 flex items-center ${
                rtl ? "left-2" : "right-2"
              }`}
            >
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md 
                bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none 
                ${rtl ? "text-right" : "text-left"}`}
            >
              {options?.length > 0 ? (
                options.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    value={option}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 px-4 ${
                        active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-bold" : "font-normal"
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 flex items-center ${
                              rtl
                                ? "right-3 pr-1 left-auto"
                                : "left-3 pl-1 right-auto"
                            }`}
                          >
                            <CheckIcon
                              className="h-5 w-5 text-blue-600"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  {rtl ? "لا توجد خيارات" : "No options available"}
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

// import { Fragment } from "react";
// import { Listbox, Transition } from "@headlessui/react";
// import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

// export default function DropdownComponent({
//   title, // العنوان الثابت فوق الحقل
//   disabled,
//   label, // النص بجانب الحقل في حالة flex
//   options = [], // قائمة الخيارات
//   selected, // القيمة المختارة (object فيه {label, value})
//   onChange, // الحدث عند التغيير
//   rtl = true, // دعم الكتابة من اليمين
//   placeholder = rtl ? "اختر..." : "Select...",
//   flex = false, // هل الحقل في وضعية flex grid
//   className = "", // كلاس إضافي للعنصر الأساسي
// }) {
//   return (
//     <div
//       className={`w-full mb-4 ${
//         flex ? "flex gap-4 grid grid-cols-4 items-center" : ""
//       } ${className}`}
//     >
//       {/* العنوان الثابت */}
//       {label && (
//         <p
//           className={`text-sm font-semibold mb-1 ${
//             flex ? "col-span-1" : ""
//           } text-text-light dark:text-text-dark text-start`}
//         >
//           {label}
//         </p>
//       )}

//       <Listbox value={selected} onChange={onChange}>
//         <div className={`relative w-full ${flex ? "col-span-3" : ""}`}>
//           <Listbox.Button
//             className={`w-full rounded-md border border-gray-300
//               dark:bg-inputs-dark bg-opacity-50 dark:bg-opacity-50
//               bg-gray-100 py-2 px-3 shadow-sm focus:outline-none
//               ${rtl ? "text-right" : "text-left"}`}
//           >
//             <span className="block truncate">
//               {selected?.label || placeholder}
//             </span>
//             <span
//               className={`pointer-events-none absolute inset-y-0 flex items-center ${
//                 rtl ? "left-2" : "right-2"
//               }`}
//             >
//               <ChevronDownIcon
//                 className="h-5 w-5 text-gray-400"
//                 aria-hidden="true"
//               />
//             </span>
//           </Listbox.Button>

//           <Transition
//             as={Fragment}
//             leave="transition ease-in duration-100"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Listbox.Options
//               className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md
//                 bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none
//                 ${rtl ? "text-right" : "text-left"}`}
//             >
//               {options?.length > 0 ? (
//                 options.map((option, index) => (
//                   <Listbox.Option
//                     key={index}
//                     value={option}
//                     className={({ active }) =>
//                       `relative cursor-pointer select-none py-2 px-4 ${
//                         active ? "bg-blue-100 text-blue-900" : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {({ selected }) => (
//                       <>
//                         <span
//                           className={`block truncate ${
//                             selected ? "font-bold" : "font-normal"
//                           }`}
//                         >
//                           {option.label}
//                         </span>
//                         {selected && (
//                           <span
//                             className={`absolute inset-y-0 flex items-center ${
//                               rtl
//                                 ? "right-3 pr-1 left-auto"
//                                 : "left-3 pl-1 right-auto"
//                             }`}
//                           >
//                             <CheckIcon
//                               className="h-5 w-5 text-blue-600"
//                               aria-hidden="true"
//                             />
//                           </span>
//                         )}
//                       </>
//                     )}
//                   </Listbox.Option>
//                 ))
//               ) : (
//                 <div className="px-4 py-2 text-gray-500">
//                   {rtl ? "لا توجد خيارات" : "No options available"}
//                 </div>
//               )}
//             </Listbox.Options>
//           </Transition>
//         </div>
//       </Listbox>
//     </div>
//   );
// }

// import { Fragment } from "react";
// import { Listbox, Transition } from "@headlessui/react";
// import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

// export default function Dropdown({
//   label,
//   options = [],
//   selected,
//   onChange,
//   rtl = false,
//   placeholder = rtl ? "اختر..." : "Select...",
//     flex=false,

// }) {
//   return (
//     <div className={`w-full ${flex&&'flex gap-4 grid grid-cols-4 items-center'} text-sm ${rtl ? "text-right" : "text-left"}`}>
//       {label && (
//         <label className={`block mb-1 font-bold text-text-light ${flex&&'col-span-1'} dark:text-text-dark`}>
//           {label}
//         </label>
//       )}

//       <Listbox value={selected} onChange={onChange}>
//         <div className={`relativew-full ${flex&&'col-span-3'} mt-1`}>
//           <Listbox.Button
//             className={`w-full border-gray-300
//  rounded-md border  dark:bg-inputs-dark bg-opacity-50 dark:bg-opacity-50 placeholder:text-gray-900 bg-gray-100 py-2 px-3 shadow-sm  focus:outline-none ${
//    rtl ? "text-right" : "text-left"
//  }`}
//           >
//             <span className="block truncate">
//               {selected?.label || placeholder}
//             </span>
//             <span
//               className={`pointer-events-none placeholder:text-gray-900 absolute inset-y-0 flex items-center ${
//                 rtl ? "left-0" : "right-0"
//               }`}
//             >
//               <ChevronDownIcon
//                 className="h-5 w-5 text-gray-400"
//                 aria-hidden="true"
//               />
//             </span>
//           </Listbox.Button>

//           <Transition
//             as={Fragment}
//             leave="transition ease-in duration-100"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Listbox.Options
//               className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none ${
//                 rtl ? "text-right" : "text-left"
//               }`}
//             >
//               {options?.length > 0 ? (
//                 options.map((option, index) => (
//                   <Listbox.Option
//                     key={index}
//                     value={option}
//                     className={({ active }) =>
//                       `relative cursor-pointer select-none py-2 px-4 ${
//                         active ? "bg-blue-100 text-blue-900" : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {({ selected }) => (
//                       <>
//                         <span
//                           className={`block truncate ${
//                             selected ? "font-bold" : "font-normal"
//                           }`}
//                         >
//                           {option.label}
//                         </span>
//                         {selected && (
//                           <span
//                             className={`absolute inset-y-0 flex items-center ${
//                               rtl
//                                 ? "right-3 pr-1 left-auto"
//                                 : "left-3 pl-1 right-auto"
//                             }`}
//                           >
//                             <CheckIcon
//                               className="h-5 w-5 text-blue-600"
//                               aria-hidden="true"
//                             />
//                           </span>
//                         )}
//                       </>
//                     )}
//                   </Listbox.Option>
//                 ))
//               ) : (
//                 <div className="px-4 py-2 text-gray-500">
//                   {rtl ? "لا توجد خيارات" : "No options available"}
//                 </div>
//               )}
//             </Listbox.Options>
//           </Transition>
//         </div>
//       </Listbox>
//     </div>
//   );
// }

// import { Fragment } from "react";
// import { Listbox, Transition } from "@headlessui/react";
// import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

// export default function Dropdown({ label, options, selected, onChange, rtl }) {
//   return (
//     <div className={`w-full text-sm ${rtl ? "text-right" : "text-left"}`}>
//       {label && (
//         <label className="block mb-1 font-bold text-gray-700">{label}</label>
//       )}
//       <Listbox value={selected} onChange={onChange}>
//         <div className="relative mt-1">
//           <Listbox.Button
//             className={`relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//               rtl ? "text-right pr-3 pl-10" : "text-left"
//             }`}
//           >
//             <span className="block truncate">{selected?.label || "اختر..."}</span>
//             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//               <ChevronDownIcon
//                 className="h-5 w-5 text-gray-400"
//                 aria-hidden="true"
//               />
//             </span>
//           </Listbox.Button>

//           <Transition
//             as={Fragment}
//             leave="transition ease-in duration-100"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Listbox.Options
//               className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none ${
//                 rtl ? "text-right" : "text-left"
//               }`}
//             >
//               {options.map((option, index) => (
//                 <Listbox.Option
//                   key={index}
//                   value={option}
//                   className={({ active }) =>
//                     `relative cursor-pointer select-none py-2 px-4 ${
//                       active ? "bg-blue-100 text-blue-900" : "text-gray-900"
//                     }`
//                   }
//                 >
//                   {({ selected }) => (
//                     <>
//                       <span
//                         className={`block truncate ${
//                           selected ? "font-bold" : "font-normal"
//                         }`}
//                       >
//                         {option.label}
//                       </span>
//                       {selected && (
//                         <span
//                           className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
//                             rtl ? "right-0 pl-0 pr-3 left-auto" : ""
//                           }`}
//                         >
//                           <CheckIcon
//                             className="h-5 w-5 text-blue-600"
//                             aria-hidden="true"
//                           />
//                         </span>
//                       )}
//                     </>
//                   )}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Transition>
//         </div>
//       </Listbox>
//     </div>
//   );
// }

// // import React from "react";
// // import { Select, Option } from "@material-tailwind/react";

// // export default function DropDown({
// //   onChange,
// //   data = [],
// //   initialOption,
// //   title,
// //   label,
// // }) {
// //   const initialValue = initialOption ?? data[0]?.value;
// //   const selectedItem = data.find(
// //     (item) => item.value === value || item.value === initialValue
// //   );
// //   const [value, setValue] = React.useState("react");

// //   return (
// //     <div className="">
// //       {/* العنوان الثابت */}
// //       {title && (
// //         <p className="text-sm  mb-1 text-start font-bold font-tbold">{title}</p>
// //       )}

// //       {/* القيمة المختارة */}
// //       {selectedItem && (
// //         <p className="text-sm text-gray-600 mb-1 text-start font-bold">
// //           النسخة المختارة:{" "}
// //           <span className="font-semibold">{selectedItem.name}</span>
// //         </p>
// //       )}

// //       {/* الدروب داون */}
// //       <Select
// //         label={label || ""}
// //         color="blue-gray"
// //         size="lg"
// //         value={value ?? initialValue}
// //         onChange={onChange}
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           justifyItems: "center",
// //           textAlign: "center",
// //         }}
// //         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
// //         // containerProps={{ className: "relative w-full" }}
// //         // iconProps={{ className: "right-auto left-3 text-gray-700" }}
// //         // menuProps={{ className: "text-right" }}
// //       >
// //         {data.length > 0 ? (
// //           data.map((item, index) => (
// //             <Option key={index} value={item.value} className="">
// //               {item.name}
// //             </Option>
// //           ))
// //         ) : (
// //           <Option value="" disabled>
// //             لا توجد بيانات
// //           </Option>
// //         )}
// //       </Select>
// //     </div>
// //   );
// // }
