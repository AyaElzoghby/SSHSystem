import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { format as formatDate } from "date-fns";

export default function DatePicker({
  title,
  value,
  onChange,
  flex = false,
  placeholder = "اختر تاريخ",
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
  const [date, setDate] = React.useState(value || null);
  const [open, setOpen] = React.useState(false);
  const { languageId } = useLanguage();

  // ✅ لو اللغة عربي نخلي RTL و format عربي
  const isRTL = languageId === 1;
  const dir = isRTL ? "rtl" : "ltr";
  const dateFormat = isRTL ? "yyyy/MM/dd" : "dd/MM/yyyy";

  const handleSelect = (selectedDate) => {
    if (readOnly || disabled) return;
    setDate(selectedDate);
    onChange?.(selectedDate);
    setOpen(false);
  };

  const formattedDate = date ? formatDate(date, dateFormat) : "";

  return (
    <div
      className={`w-full mb-4 ${
        flex ? "flex gap-4 items-center grid grid-cols-4" : ""
      } ${containerClass}`}
      dir={dir}
    >
      {/* العنوان */}
      {title && (
        <p
          className={`text-base font-semibold ${
            flex ? "col-span-1" : ""
          } text-textPrimary mb-1 text-start ${titleClass}`}
        >
          {title} {required && <span className="text-red-500">*</span>}
        </p>
      )}

      {/* الحقل */}
      <div className={`${flex ? "col-span-3" : "w-full"}`}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              id={id}
              name={name}
              disabled={disabled}
              className={`w-full rounded h-12 border-[0.5px] px-3 py-2 text-text-light 
                bg-opacity-50 bg-surfaceHover dark:bg-opacity-50 border-surfaceHover 
                outline-0 focus:ring-[.5px] focus:ring-blue-gray-700 
                dark:focus:border-blue-gray-700 focus:border-blue-gray-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-between font-normal
                ${readOnly ? "cursor-not-allowed opacity-70" : ""}
                ${inputClass} ${className}`}
            >
              <span
                className={`${date ? "text-text-light" : "text-textSecondary"}`}
              >
                {date ? formattedDate : placeholder}
              </span>
              <CalendarIcon className="ms-2 h-5 w-5 opacity-70" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align={isRTL ? "end" : "start"}
            className="w-auto p-2 rounded shadow-md bg-surfaceHover"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                className="rounded"
              />
            </motion.div>
          </PopoverContent>
        </Popover>

        {/* خطأ */}
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    </div>
  );
}
