import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CheckIcon,
  TicketCheckIcon,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
} from "lucide-react";
export default function Checkbox({
  label = "",
  checked, // controlled
  defaultChecked = false, // uncontrolled
  onChange,
  disabled = false,
  size = "medium", // small | medium | large
  rtl = false,
  color = "", // custom active color
  shape = "square", // 'square' | 'circle'
  className = "",
}) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // keep in sync if controlled
  useEffect(() => {
    if (isControlled) setInternalChecked(checked);
  }, [checked, isControlled]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !internalChecked;
    if (!isControlled) setInternalChecked(newValue);
    onChange?.(newValue); // always send true/false
  };

  const sizeClasses = {
    small: "w-4 h-4 text-xs",
    medium: "w-5 h-5 text-sm",
    large: "w-6 h-6 text-base",
  };

  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded";

  const isChecked = internalChecked;

  return (
    <label
      className={`flex items-center gap-2 my-2 text-base font-semibold text-textPrimary
        ${rtl ? "flex-row-reverse" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}`}
    >
      <div
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={0}
        className={`
          relative flex-shrink-0
          ${sizeClasses[size]}
          border ${shapeClasses}
          bg-surfaceHover 
          border-surfaceHover
           ${isChecked && 'dark:border-blue-gray-700 border-blue-gray-300'} 
        `}
        style={{
          backgroundColor: isChecked && color ? color : "",
          borderColor: isChecked && color ? color : "",
        }}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {isChecked && (
          <span className="absolute text-textPrimary inset-0 flex items-center justify-center">
            <CheckIcon size={20} />
          </span>
        )}
      </div>
      {label && <span   className={`text-sm font-semibold mb-1 text-textPrimary text-start`}
        >{label}</span>}
    </label>
  );
}

// import React, { useState, useEffect } from "react";

// export default function Checkbox({
//   label = "",
//   checked, // if passed, component is controlled
//   defaultChecked = false, // initial value if uncontrolled
//   onChange,
//   disabled = false,
//   size = "medium", // small | medium | large
//   rtl = false,
//   color = "", // custom active color
//   shape = "square", // 'square' | 'circle'
//   className = "",
// }) {
//   const isControlled = checked !== undefined;
//   const [internalChecked, setInternalChecked] = useState(defaultChecked);

//   // Sync internal state if controlled
//   useEffect(() => {
//     if (isControlled) {
//       setInternalChecked(checked);
//     }
//   }, [checked, isControlled]);

//   const handleToggle = () => {
//     if (disabled) return;
//     const newValue = !internalChecked;
//     if (!isControlled) {
//       setInternalChecked(newValue);
//     }
//     onChange?.(newValue);
//   };

//   const sizeClasses = {
//     small: "w-4 h-4 text-xs",
//     medium: "w-5 h-5 text-sm",
//     large: "w-6 h-6 text-base",
//   };

//   const defaultColors = `
//     bg-gray-100 dark:bg-inputs-dark
//     border-gray-300 dark:border-gray-600
//     checked:bg-blue-500 checked:border-blue-500
//     focus:ring-blue-500
//   `;

//   const customColors = color
//     ? `
//       bg-gray-100 dark:bg-inputs-dark
//       border-gray-300 dark:border-gray-600
//       focus:ring-[${color}]
//     `
//     : defaultColors;

//   const shapeClasses = shape === "circle" ? "rounded-full" : "rounded";

//   const isChecked = internalChecked;

//   return (
//     <label
//       className={`flex items-center gap-2 my-2 text-base font-semibold text-textPrimary ${
//         rtl ? "flex-row-reverse" : ""
//       } ${
//         disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//       } ${className}`}
//     >
//       <div
//         role="checkbox"
//         aria-checked={isChecked}
//         tabIndex={0}
//         className={`
//           relative flex-shrink-0
//           ${sizeClasses[size]}
//           border ${shapeClasses}
//           ${customColors}
//           ${isChecked ? "bg-current text-white" : ""}
//         `}
//         style={{
//           backgroundColor: isChecked && color ? color : "",
//           borderColor: color && isChecked ? color : "",
//         }}
//         onClick={handleToggle}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") {
//             e.preventDefault();
//             handleToggle();
//           }
//         }}
//       >
//         {isChecked && (
//           <span className="absolute inset-0 flex items-center justify-center">
//             ✔
//           </span>
//         )}
//       </div>

//       {label && <span>{label}</span>}
//     </label>
//   );
// }

// // import React from "react";

// // export default function Checkbox({
// //   label = "",
// //   checked = false,
// //   onChange,
// //   disabled = false,
// //   size = "medium", // small | medium | large
// //   rtl = false,
// //   color = "", // custom active color
// //   shape = "square", // 'square' | 'circle'
// //   className = "",
// // }) {
// //   const sizeClasses = {
// //     small: "w-4 h-4 text-xs",
// //     medium: "w-5 h-5 text-sm",
// //     large: "w-6 h-6 text-base",
// //   };

// //   // Default colors
// //   const defaultColors = `
// //     bg-gray-100 dark:bg-inputs-dark
// //     border-gray-300 dark:border-gray-600
// //     checked:bg-blue-500 checked:border-blue-500
// //     focus:ring-blue-500
// //   `;

// //   // Custom colors if provided
// //   const customColors = color
// //     ? `
// //       bg-gray-100 dark:bg-inputs-dark
// //       border-gray-300 dark:border-gray-600
// //       checked:bg-[${color}] checked:border-[${color}]
// //       focus:ring-[${color}]
// //     `
// //     : defaultColors;

// //   // Shape classes
// //   const shapeClasses = shape === "circle" ? "rounded-full" : "rounded";

// //   return (
// //     <label
// //       className={`flex items-center gap-2 my-2 text-sm font-semibold text-textPrimary ${
// //         rtl ? "flex-row-reverse" : ""
// //       } ${
// //         disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
// //       } ${className}`}
// //     >
// //       <div
// //         className={`
// //           relative flex-shrink-0
// //           ${sizeClasses[size]}
// //           border ${shapeClasses}
// //           ${customColors}
// //           ${checked ? "bg-current text-white" : ""}
// //         `}
// //         style={{
// //           backgroundColor: checked && color ? color : "",
// //           borderColor: color && checked ? color : "",
// //         }}
// //         onClick={() => !disabled && onChange?.(!checked)}
// //       >
// //         {checked && (
// //           <span className="absolute inset-0 flex items-center justify-center">
// //             ✔
// //           </span>
// //         )}
// //       </div>

// //       {label && <span>{label}</span>}
// //     </label>
// //   );
// // }

// // import React from "react";

// // export default function Checkbox({
// //   label = "",
// //   checked = false,
// //   onChange,
// //   disabled = false,
// //   size = "medium", // small | medium | large
// //   rtl = false,
// //   color = "", // لون ديناميكي لو حددته
// //   className = "",
// // }) {
// //   const sizeClasses = {
// //     small: "w-4 h-4",
// //     medium: "w-5 h-5",
// //     large: "w-6 h-6",
// //   };

// //   // ألوان افتراضية لو ما حددتش لون
// //   const defaultColors =
// //     "bg-gray-100 dark:bg-inputs-dark border-gray-300 dark:border-gray-600 checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500";

// //   // لو فيه لون مخصص
// //   const customColors = color
// //     ? `bg-gray-100 dark:bg-inputs-dark border-gray-300 dark:border-gray-600 checked:${color} checked:border-${color} focus:ring-${color}`
// //     : defaultColors;

// //   return (
// //     <label
// //       className={`flex my-2 items-center text-sm font-semibold mb-2   text-textPrimary text-start gap-2 ${
// //         rtl ? "flex-row-reverse" : ""
// //       } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
// //     >
// //       <input
// //         type="checkbox"
// //         checked={checked}
// //         onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
// //         disabled={disabled}
// //         className={`
// //           appearance-none rounded border relative flex-shrink-0
// //           ${sizeClasses[size]}
// //           ${customColors}
// //           after:content-['✔'] after:text-white
// //           after:absolute after:top-1/2 after:left-1/2
// //           after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm
// //           focus:outline-none focus:ring-2
// //         `}
// //       />
// //       {label && (
// //         <span className="text-sm text-textPrimary">
// //           {label}
// //         </span>
// //       )}
// //     </label>
// //   );
// // }
