import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import i18n from "@/i18n";

export type AppLanguage = "zh" | "en";

const LANGUAGE_KEY = "musicday1-language";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
    const detected = i18n.language;
    if (detected.startsWith("zh")) return "zh";
    return "en";
  });

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLangState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
    i18n.changeLanguage(lang);
  }, []);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
