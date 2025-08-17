import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-image-gallery/styles/css/image-gallery.css";
import { LanguageProvider } from "./context/LanguageContext"; // عدلي المسار حسب مكانه
import { UserProvider } from "./context/userContext"; // عدلي المسار حسب مكانه

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </UserProvider>
  </StrictMode>
);
