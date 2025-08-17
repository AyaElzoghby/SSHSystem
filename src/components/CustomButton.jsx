import React from "react";
import { Loader2 } from "lucide-react";

export default function CustomButton({
  title,
  icon,
  onClick,
  width,
  color = "text-textPrimary bg-bg",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  size = "medium", // small | medium | large
  variant = "solid", // solid | outline | ghost
}) {
  // تحديد حجم الزر
  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  // تحديد ألوان الزر حسب الـ variant
  const variantClasses = {
    solid: color,
    outline: color,
    ghost: `bg-transparent ${color}`,
  };

  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2 rounded-md font-medium transition-all
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : width ? `w-[${width}]` : "w-fit"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {title && <span>{title}</span>}
    </button>
  );
}
// import React from "react";
// import { Loader2 } from "lucide-react";
// import { buttonColors } from "@/theme/ButtonColors"; // ملف الألوان اللي فيه السيستم

// export default function CustomButton({
//   title,
//   icon,
//   onClick,
//   width,
//   color = "Primary",
//   type = "button",
//   disabled = false,
//   loading = false,
//   fullWidth = false,
//   className = "",
//   size = "medium", // small | medium | large
//   variant = "solid", // solid | gradient | outline | ghost
//     glow = false, // تشغيل تأثير الجلو
//   darkMode = false, // تقدر تجيبه من Theme Hook
// }) {
//   // تحديد حجم الزر
//   const sizeClasses = {
//     small: "px-3 py-1 text-sm",
//     medium: "px-4 py-2 text-base",
//     large: "px-6 py-3 text-lg",
//   };

//   const themeColors = buttonColors[color] || buttonColors.primary;
//   // اختيار ألوان الـ Light أو Dark
//   const modeKey = darkMode ? "dark" : "light";
//   const textColor = darkMode ? themeColors.textDark : themeColors.textLight;
//   const hoverColor = darkMode ? themeColors.hoverDark : themeColors.hoverLight;
  
//   // تحديد ألوان الزر حسب الـ variant
//    const variantClasses = {
//     solid: `bg-[${themeColors[modeKey]}] hover:bg-[${hoverColor}] text-[${textColor}]`,
//     gradient: `bg-gradient-to-r from-[${themeColors[`gradient${darkMode ? "Dark" : "Light"}`][0]}] to-[${themeColors[`gradient${darkMode ? "Dark" : "Light"}`][1]}] text-[${textColor}] hover:opacity-90`,
//     outline: `border border-[${darkMode ? themeColors.borderDark : themeColors.borderLight}] text-[${darkMode ? themeColors.textDark : themeColors.textLight}] hover:bg-[${hoverColor}]`,
//     ghost: `bg-transparent text-[${darkMode ? themeColors.textDark : themeColors.textLight}] hover:bg-[${hoverColor}]`,
//   };
//     // جلو (Glow)
//   const glowStyle = glow
//     ? `shadow-[0_0_10px_${darkMode ? themeColors.glowDark : themeColors.glowLight}]`
//     : "";
//   return (
//     <button
//       type={type}
//       onClick={!disabled && !loading ? onClick : undefined}
//       disabled={disabled || loading}
//       className={`
//         flex items-center justify-center gap-2 rounded-md font-medium transition-all
//         ${sizeClasses[size]}
//         ${variantClasses[variant]}
//         ${glowStyle}
//         ${fullWidth ? "w-full" : width ? `w-[${width}]` : "w-fit"}
//         ${disabled ? "opacity-50 cursor-not-allowed" : ""}
//         ${className}
//       `}
//       style={{
//     background: variant === "gradient" 
//       ? `linear-gradient(to right, ${themeColors.gradientLight[0]}, ${themeColors.gradientLight[1]})` 
//       : themeColors[modeKey],
//     color: textColor,
//     // border: variant === "outline" ? `1px solid ${themeColors.borderLight}` : "none",
//     // boxShadow: glow ? `0 0 10px ${themeColors.glowLight}` : "none"
//   }}
//     >
//       {loading ? (
//         <Loader2 className="animate-spin" size={18} />
//       ) : (
//         icon && <span className="flex-shrink-0">{icon}</span>
//       )}
//       {title && <span>{title}</span>}
//     </button>
//   );
// }

