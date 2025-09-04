import React from "react";

export default function InputComponent({
  title,
  type = "text",
  label,
  value,
  onTextChange,
  onBlur,
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
          } text-textPrimary mb-1 text-start ${titleClass}`}
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
          onChange={(e) => onTextChange(e.target.value)} // ✅ only the string
          onBlur={(e) => onBlur?.(e.target.value)} // ✅ ارسال القيمة الحالية
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full rounded h-12  border-[0.5px] px-3 py-2 text-text-light  bg-opacity-50 bg-surfaceHover  dark:bg-opacity-50 border-surfaceHover placeholder:text-textSecondary outline-0 focus:ring-[.5px] focus:ring-blue-gray-700 dark:focus:border-blue-gray-700 focus:border-blue-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${inputClass} ${className}`}
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    </div>
  );
}
