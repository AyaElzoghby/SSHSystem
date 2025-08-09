import React from "react";

export default function InputComponent({
  title,
  type = "text",
  label,
  value,
  onTextChange,
  flex = false,
  placeholder = "",
  disabled = false,
  error = "",
  required = false,
  readOnly = false,
  className = "",
  containerClass = "",
  labelClass = "",
  inputClass = "",
  titleClass = "",
  id,
  name,
}) {
  return (
    <div
      className={`w-full mb-4 ${
        flex ? "flex gap-4 items-center grid grid-cols-4" : ""
      } ${containerClass}`}
    >
      {/* العنوان فوق الحقل */}
      {title && (
        <p
          className={`text-sm font-semibold ${
            flex ? "col-span-1" : ""
          } text-text-light dark:text-text-dark mb-1 text-start ${titleClass}`}
        >
          {title} {required && <span className="text-red-500">*</span>}
        </p>
      )}

      <div className={`${flex ? "col-span-3" : "w-full"}`}>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onTextChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full rounded-md border px-3 py-2 text-text-light dark:text-text-dark bg-gray-100 bg-opacity-50 dark:bg-inputs-dark dark:bg-opacity-50 border-gray-300 placeholder:text-text-light placeholder:dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${inputClass} ${className}`}
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    </div>
  );
}

// import React from "react";
// import { Input } from "@material-tailwind/react";

// export default function InputComponent({
//   title,
//   type = "text",
//   label,
//   value,
//   onTextChange,
//   flex = false,
//   placeholder = "",
//   disabled = false,
//   error = "",
//   required = false,
//   readOnly = false,
//   className = "",
//   containerClass = "",
//   labelClass = "",
//   inputClass = "",
//   titleClass = "",
//   id,
//   name,
// }) {
//   return (
//     <div
//       className={`w-full mb-4 ${
//         flex ? "flex gap-4 items-center grid grid-cols-4" : ""
//       } ${containerClass}`}
//     >
//       {/* العنوان فوق الحقل */}
//       {title && (
//         <p
//           className={`text-sm font-semibold ${
//             flex ? "col-span-1" : ""
//           } text-text-light dark:text-text-dark mb-1 text-start ${titleClass}`}
//         >
//           {title} {required && <span className="text-red-500">*</span>}
//         </p>
//       )}

//       <Input
//         id={id}
//         name={name}
//         type={type}
//         label={label}
//         value={value}
//         onChange={onTextChange}
//         placeholder={placeholder}
//         disabled={disabled}
//         readOnly={readOnly}
//         crossOrigin="" // لإزالة التحذير
//         className={`w-full rounded-md border ${
//           flex ? "col-span-3" : ""
//         } text-text-light dark:text-text-dark bg-gray-100 bg-opacity-50 dark:bg-inputs-dark dark:bg-opacity-50 border-gray-300 ${className}`}
//         containerProps={{
//           className: "w-full",
//         }}
//         labelProps={{
//           className: `text-text-light dark:text-text-dark ${labelClass}`,
//         }}
//         inputClassName={`!border !border-gray-300 text-text-light dark:text-text-dark placeholder:text-text-light placeholder:dark:text-text-dark focus:!border-blue-500 ${inputClass}`}
//       />

//       {/* رسالة الخطأ */}
//       {error && (
//         <span className="col-span-4 text-red-500 text-xs mt-1">{error}</span>
//       )}
//     </div>
//   );
// }

// import { Input } from "@material-tailwind/react";

// export default function InputComponent({
//   title,
//   type = "text",
//   label,
//   value,
//   onTextChange,
//   flex=false,
// }) {
//   return (

//     <div className={`w-full bg-black mb-4 ${flex&&'flex gap-4 grid grid-cols-4 items-center'}`}>
//       {/* العنوان فوق الحقل */}
//       {title && (
//         <p className={`text-sm font-semibold ${flex&&'col-span-1'} text-text-light dark:text-text-dark  mb-1 text-start`}>
//           {title}
//         </p>
//       )}
//       <Input
//         type={type}
//         label={label}
//         value={value}
//         onChange={onTextChange}
//         className={`w-full rounded-md border ${flex&&'col-span-3'} text-text-light dark:text-text-dark dark:bg-inputs-dark bg-opacity-50 dark:bg-opacity-50 bg-gray-100  border-gray-300`}
//         crossOrigin="" // لإزالة التحذير
//         containerProps={{
//           className: `w-full`,
//         }}
//         labelProps={{
//           className: "text-text-light dark:text-text-dark",
//         }}
//         inputClassName="!border !border-gray-300 text-text-light dark:text-text-dark placeholder:text-text-light placeholder:dark:text-text-dark focus:!border-blue-500"
//       />
//     </div>
//   );
// }
