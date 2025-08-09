import React from "react";

export default function Checkbox({
  label = "",
  checked = false,
  onChange,
  disabled = false,
  size = "medium", // small | medium | large
  rtl = false,
  color = "", // لون ديناميكي لو حددته
  className = "",
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  // ألوان افتراضية لو ما حددتش لون
  const defaultColors =
    "bg-gray-100 dark:bg-inputs-dark border-gray-300 dark:border-gray-600 checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500";

  // لو فيه لون مخصص
  const customColors = color
    ? `bg-gray-100 dark:bg-inputs-dark border-gray-300 dark:border-gray-600 checked:${color} checked:border-${color} focus:ring-${color}`
    : defaultColors;

  return (
    <label
      className={`flex my-2 items-center text-sm font-semibold mb-2   text-text-light dark:text-text-dark text-start gap-2 ${
        rtl ? "flex-row-reverse" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
        disabled={disabled}
        className={`
          appearance-none rounded border relative flex-shrink-0
          ${sizeClasses[size]}
          ${customColors}
          after:content-['✔'] after:text-white 
          after:absolute after:top-1/2 after:left-1/2 
          after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm
          focus:outline-none focus:ring-2
        `}
      />
      {label && (
        <span className="text-sm text-text-light dark:text-text-dark">
          {label}
        </span>
      )}
    </label>
  );
}
