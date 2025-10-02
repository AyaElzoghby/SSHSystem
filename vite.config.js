// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// export default defineConfig({
//   plugins: [
//     react(),
//     ViteImageOptimizer({
//       png: { quality: 70 }, // قللت الجودة عشان يقل الضغط
//       jpeg: { quality: 70 },
//       jpg: { quality: 70 },
//       webp: { quality: 70 },
//       avif: false, // عطلتها مؤقتًا لأنها بتسحب RAM
//     }),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     sourcemap: false, // وقف الـ sourcemaps لتقليل الذاكرة
//     rollupOptions: {
//       output: {
//         // تقسيم كل مكتبة كبيرة لملف منفصل
//         manualChunks(id) {
//           if (id.includes("node_modules")) {
//             return id
//               .toString()
//               .split("node_modules/")[1]
//               .split("/")[0]
//               .toString();
//           }
//         },
//       },
//     },
//   },
// });


// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 70 },
      jpeg: { quality: 70 },
      jpg: { quality: 70 },
      webp: { quality: 70 },
      avif: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
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
  server: {
    proxy: {
      "/swagger": {
        target: "http://dev1ebtkar-001-site1.atempurl.com", // API بتاعك
        changeOrigin: true,
        secure: false, // مهم عشان يطنش الشهادة الـ self-signed
      },
    },
  },
});

