
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    
    // Persist language choice in localStorage
    localStorage.setItem("preferred-language", newLanguage);
    
    // Handle RTL/LTR direction
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  React.useEffect(() => {
    // Set initial direction and language on mount
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Button
      variant="secondary"
      className="rounded-full px-3 font-bold"
      onClick={toggleLanguage}
      aria-label="Switch language"
    >
      {i18n.language === "ar" ? "🇬🇧 English" : "🇸🇦 العربية"}
    </Button>
  );
};

export default LanguageSwitcher;
