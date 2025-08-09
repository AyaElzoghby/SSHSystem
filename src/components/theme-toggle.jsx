import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Toggle } from "../components/ui/toggle";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // نقرأ الثيم من localStorage أو من النظام لو مفيش اختيار محفوظ
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    // نضيف/نشيل الـ class على الـ html
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // نحفظ الاختيار
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="w-9 h-9 rounded-full shadow-md flex justify-center items-center">
      <Toggle
        variant="outline"
        className="group data-[state=on]:hover:bg-muted text-muted-foreground 
                  data-[state=on]:text-muted-foreground data-[state=on]:hover:text-foreground 
                  size-8 rounded-full border-none shadow-none data-[state=on]:bg-transparent"
        pressed={theme === "dark"}
        onPressedChange={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <MoonIcon
          size={16}
          className="shrink-0 scale-0 opacity-0 transition-all 
                     group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all 
                     group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}

// import { useState } from "react"
// import { MoonIcon, SunIcon } from "lucide-react"

// import { Toggle } from "../components/ui/toggle"

// export default function ThemeToggle() {
//   const [theme, setTheme] = useState("light")

//   return (
//     <div className="w-9 h-9 rounded-full shadow-md flex justify-center items-center" >
//       <Toggle
//         variant="outline"
//         className="group data-[state=on]:hover:bg-muted text-muted-foreground data-[state=on]:text-muted-foreground data-[state=on]:hover:text-foreground size-8 rounded-full border-none shadow-none data-[state=on]:bg-transparent"
//         pressed={theme === "dark"}
//         onPressedChange={() =>
//           setTheme((prev) => (prev === "dark" ? "light" : "dark"))
//         }
//         aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
//         {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
//         <MoonIcon
//           size={16}
//           className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
//           aria-hidden="true" />
//         <SunIcon
//           size={16}
//           className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
//           aria-hidden="true" />
//       </Toggle>
//     </div>
//   );
// }
