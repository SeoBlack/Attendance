import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en.json";
import ar from "./languages/ar.json";
import ru from "./languages/ru.json";

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  ru: {
    translation: ru,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
