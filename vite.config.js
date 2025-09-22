// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 70 }, // قللت الجودة عشان يقل الضغط
      jpeg: { quality: 70 },
      jpg: { quality: 70 },
      webp: { quality: 70 },
      avif: false, // عطلتها مؤقتًا لأنها بتسحب RAM
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // وقف الـ sourcemaps لتقليل الذاكرة
    rollupOptions: {
      output: {
        // تقسيم كل مكتبة كبيرة لملف منفصل
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});

// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// export default defineConfig({
//   plugins: [
//     react(),
//     ViteImageOptimizer({
//       png: { quality: 80 },
//       jpeg: { quality: 80 },
//       jpg: { quality: 80 },
//       webp: { quality: 80 },
//       avif: { quality: 50 },
//     }),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     sourcemap: true,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           react: ["react", "react-dom"],
//           mui: ["@mui/material", "@mui/icons-material"],
//           radix: ["@radix-ui/react-avatar", "@radix-ui/react-popover"],
//           fa: [
//             "@fortawesome/fontawesome-svg-core",
//             "@fortawesome/free-solid-svg-icons",
//             "@fortawesome/react-fontawesome",
//           ],
//         },
//       },
//     },
//   },
// });
