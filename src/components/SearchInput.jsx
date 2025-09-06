import React from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

export default function SearchInput({
  id,
  value = "",
  onChange = () => {},
  onSearch = () => {},
  placeholderAr = "بحث...",
  placeholderEn = "Search...",
  className = "",
  disabled = false,
}) {
  const { languageId } = useLanguage();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(value); // trigger API search when pressing Enter
    }
  };

  return (
    <div
      className={`relative shadow-md border border-surface h-8 rounded-md w-full ${className}`}
      dir={languageId == 1 ? "rtl" : "ltr"}
    >
      {/* Search Button */}
      <Button
        type="button"
        disabled={disabled}
        className={`absolute rounded-sm top-4 h-8 flex justify-center items-center -translate-y-1/2 border-1 border-surfaceHover bg-surfaceHover text-muted-foreground pointer-events-auto 
              ${languageId == 1 ? "right-0" : "left-0"}`}
        onClick={() => onSearch(value)}
      >
        <SearchIcon size={14} />
      </Button>

      {/* Input */}
      <Input
        id={id}
        type="search"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={languageId == 1 ? placeholderAr : placeholderEn}
        className={`h-8 border-none text-gray-800 text-base font-medium focus:border-none ps-14 focus:outline-none rounded-md outline-none
          ${languageId == 1 ? "text-right " : "text-left"}`}
      />
    </div>
  );
}

// import React from "react";
// import { SearchIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Input from "@/components/ui/input";
// import { useLanguage } from "@/context/LanguageContext";

// export default function SearchInput({
//   id,
//   placeholderAr = "بحث...",
//   placeholderEn = "Search...",
//   onSearch = () => {},
//   value = "",
//   onChange = () => {},
//   className = "",
// }) {
//   const { languageId } = useLanguage();

//   return (
//     <div
//       className={`relative shadow-md border border-surface h-8 rounded-md w-full max-w-2xl ${className}`}
//       dir={languageId == 1 ? "rtl" : "ltr"}
//     >
//       {/* Search Button */}
//       <Button
//         type="button"
//         className={`absolute  rounded-sm  top-4 h-8 flex justify-center items-center -translate-y-1/2 border-1 border-surfaceHover bg-surfaceHover text-muted-foreground pointer-events-auto 
//               ${languageId == 1 ? "right-0" : "left-0"}`}
//         onClick={onSearch}
//       >
//         <SearchIcon size={14} />
//       </Button>

//       {/* Input */}
//       <Input
//         id={id}
//         type="search"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={languageId == 1 ? placeholderAr : placeholderEn}
//         className={`h-8 border-none focus:border-none ps-14 focus:outline-none rounded-md outline-none
//           ${languageId == 1 ? "text-right " : "text-left"}`}
//       />
//     </div>
//   );
// }
