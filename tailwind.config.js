/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4F46E5",
          dark: "#6366F1",
        },
        secondary: {
          light: "#06B6D4",
          dark: "#22D3EE",
        },
        inputs: {
          light: "#06B6D4",
          dark: "#454d55",
        },
        hover: {
          light: "#E5E7EB",
          dark: "#1F2937",
        },
        accent: {
          light: "#F59E0B",
          dark: "#FBBF24",
        },
        background: {
          light: "#f8f8f8",
          dark: "#161d30",
        },
        card: {
          light: "#F9FAFB",
          dark: "#111827",
        },
        border: {
          light: "#E5E7EB",
          dark: "#374151",
        },
        text: {
          light: "#111827",
          dark: "#F9FAFB",
        },
        heading: {
          light: "#1F2937",
          dark: "#E5E7EB",
        },
        subtext: {
          light: "#6B7280",
          dark: "#9CA3AF",
        },
        success: {
          light: "#10B981",
          dark: "#34D399",
        },
        warning: {
          light: "#F59E0B",
          dark: "#FBBF24",
        },
        danger: {
          light: "#EF4444",
          dark: "#F87171",
        },
        button: {
          primary: {
            light: "#4F46E5",
            dark: "#6366F1",
            textLight: "#FFFFFF",
            textDark: "#E0E7FF",
            hoverLight: "#4338CA",
            hoverDark: "#4F46E5",
            gradientLight: ["#4F46E5", "#6366F1"],
            gradientDark: ["#6366F1", "#818CF8"],
            glowLight: "rgba(79, 70, 229, 0.6)",
            glowDark: "rgba(99, 102, 241, 0.6)",
          },
          secondary: {
            light: "#06B6D4",
            dark: "#22D3EE",
            textLight: "#FFFFFF",
            textDark: "#E0F2FE",
            hoverLight: "#0891B2",
            hoverDark: "#06B6D4",
            gradientLight: ["#06B6D4", "#22D3EE"],
            gradientDark: ["#22D3EE", "#67E8F9"],
            glowLight: "rgba(6, 182, 212, 0.6)",
            glowDark: "rgba(34, 211, 238, 0.6)",
          },
          success: {
            light: "#10B981",
            dark: "#34D399",
            textLight: "#FFFFFF",
            textDark: "#D1FAE5",
            hoverLight: "#059669",
            hoverDark: "#10B981",
            gradientLight: ["#10B981", "#34D399"],
            gradientDark: ["#34D399", "#6EE7B7"],
            glowLight: "rgba(16, 185, 129, 0.6)",
            glowDark: "rgba(52, 211, 153, 0.6)",
          },
          warning: {
            light: "#F59E0B",
            dark: "#FBBF24",
            textLight: "#FFFFFF",
            textDark: "#FEF3C7",
            hoverLight: "#D97706",
            hoverDark: "#F59E0B",
            gradientLight: ["#F59E0B", "#FBBF24"],
            gradientDark: ["#FBBF24", "#FDE68A"],
            glowLight: "rgba(245, 158, 11, 0.6)",
            glowDark: "rgba(251, 191, 36, 0.6)",
          },
          danger: {
            light: "#EF4444",
            dark: "#F87171",
            textLight: "#FFFFFF",
            textDark: "#FEE2E2",
            hoverLight: "#DC2626",
            hoverDark: "#EF4444",
            gradientLight: ["#EF4444", "#F87171"],
            gradientDark: ["#F87171", "#FCA5A5"],
            glowLight: "rgba(239, 68, 68, 0.6)",
            glowDark: "rgba(248, 113, 113, 0.6)",
          },
          outline: {
            light: "#4B5563",
            dark: "#9CA3AF",
            textLight: "#4B5563",
            textDark: "#D1D5DB",
            borderLight: "#D1D5DB",
            borderDark: "#4B5563",
            glowLight: "rgba(75, 85, 99, 0.4)",
            glowDark: "rgba(156, 163, 175, 0.4)",
          },
          ghost: {
            light: "transparent",
            dark: "transparent",
            textLight: "#374151",
            textDark: "#D1D5DB",
            hoverLight: "#F3F4F6",
            hoverDark: "#374151",
            glowLight: "rgba(55, 65, 81, 0.2)",
            glowDark: "rgba(209, 213, 219, 0.2)",
          },
        },
        navbar: {
          bg: {
            light: "#FFFFFF",
            dark: "#283046",
          },
          text: {
            light: "#1F2937",
            dark: "#F9FAFB",
          },
          hover: {
            light: "#E5E7EB",
            dark: "#1F2937",
          },
          border: {
            light: "#E5E7EB",
            dark: "#374151",
          },
        },
        sidebar: {
          bg: {
            light: "#1e3756",
            dark: "#1e3756",
          },
          text: {
            light: "#1F2937",
            dark: "#F9FAFB",
          },
          hover: {
            light: "#E5E7EB",
            dark: "#1F2937",
          },
          border: {
            light: "#E5E7EB",
            dark: "#374151",
          },
        },
      },

      fontFamily: {
        tlight: ["Tajawal-Light", "sans-serif"],
        tregular: ["Tajawal-Regular", "sans-serif"],
        tmedium: ["Tajawal-Medium", "sans-serif"],
        tbold: ["Tajawal-Bold", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
});
