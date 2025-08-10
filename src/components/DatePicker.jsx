import React, { useState, useEffect } from "react";

export default function DatePickerInput({
  label = "",
  value, // Controlled mode
  defaultValue = "",
  onChange,
  placeholder = "",
  disabled = false,
  size = "medium", // small | medium | large
  rtl = false,
  min,
  max,
  shape = "rounded", // rounded | square | circle
  color = "", // custom border/focus color
  error = "", // error text
  className = "",
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value || "");
    }
  }, [value, isControlled]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    if (!isControlled) setInternalValue(newVal);
    onChange?.(newVal);
  };

  // Sizing like your Input component
  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-4 py-3 text-lg",
  };

  const shapeClasses = {
    rounded: "rounded-md",
    square: "rounded-none",
    circle: "rounded-full",
  };

  // Base color system like Input/Dropdown
  const baseColors = `
    bg-white dark:bg-inputs-dark 
    border border-gray-300 dark:border-gray-600 
    focus:outline-none 
    ${color ? `focus:ring-2 focus:ring-[${color}] border-[${color}]` : "focus:ring-2 focus:ring-blue-500"}
  `;

  return (
    <div
      className={`flex flex-col gap-1  ${rtl ? "text-right" : "text-left"} ${className}`}
    >
      {label && (
        <label
          className="text-sm font-semibold text-text-light dark:text-text-dark"
        >
          {label}
        </label>
      )}

      <input
        type="date"
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
        min={min}
        max={max}
        placeholder={placeholder}
        className={`
          w-full
          ${sizeClasses[size]}
          ${shapeClasses[shape]}
          ${baseColors}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          text-text-light dark:text-text-dark
          ${error ? "border-red-500 focus:ring-red-500" : ""}
        `}
      />

      {error && (
        <span className="text-red-500 text-xs">{error}</span>
      )}
    </div>
  );
}
