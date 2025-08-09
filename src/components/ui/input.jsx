import React from "react";

export default function Input({
  label,
  value,
  onChange,
  placeholder = "أدخل القيمة...",
  type = "text",
  rtl = false,
  error = "",
  className = "",
}) {
  return (
    <div className={`w-full text-sm ${rtl ? "text-right" : "text-left"} ${className}`}>
      {label && (
        <label className="block mb-1 font-bold text-gray-700">{label}</label>
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full  border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          rtl ? "text-right" : "text-left"
        }`}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Input({
//   className,
//   type,
//   ...props
// }) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
//         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//         type === "search" &&
//           "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
//         type === "file" &&
//           "text-muted-foreground/70 file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic",
//         className
//       )}
//       {...props} />
//   );
// }

// export { Input }
