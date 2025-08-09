import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [languageId, setLanguageId] = useState(1); // 1 = Arabic, 2 = English

  const toggleLanguage = () => {
    setLanguageId((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <LanguageContext.Provider value={{ languageId, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
