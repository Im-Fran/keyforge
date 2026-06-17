import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from "./locales/es";
import en from "./locales/en";
import pt from "./locales/pt";

export type SupportedLang = "es" | "en" | "pt";

export const SUPPORTED_LANGS: SupportedLang[] = ["es", "en", "pt"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
    },
    fallbackLng: "es",
    supportedLngs: SUPPORTED_LANGS,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "keyforge_lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
