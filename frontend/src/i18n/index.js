import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en_translation.json";
import ta from "./locales/ta_translation.json";
import hi from "./locales/hi_translation.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ta: { translation: ta },
        hi: { translation: hi },
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
