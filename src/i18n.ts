
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    fallbackLng: "en",
    lng: localStorage.getItem("preferred-language") || "en", // Load saved preference
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Set initial direction based on language
const currentLang = i18n.language || "en";
document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
document.documentElement.lang = currentLang;

export default i18n;
