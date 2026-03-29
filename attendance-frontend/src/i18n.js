import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en.json";
import hi from "./languages/hi.json";
import ru from "./languages/ru.json";

// refere to this for more information https://react.i18next.com/guides/quick-start

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  ru: {
    translation: ru,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("language") || "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
