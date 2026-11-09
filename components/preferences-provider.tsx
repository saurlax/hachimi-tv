"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  messages, resolveLocale,
  type LanguagePreference, type Locale, type MessageKey, type ThemePreference,
} from "@/lib/i18n";

type Preferences = {
  locale: Locale;
  language: LanguagePreference;
  theme: ThemePreference;
  setLanguage: (value: LanguagePreference) => void;
  setTheme: (value: ThemePreference) => void;
  t: (key: MessageKey) => string;
};

const PreferencesContext = createContext<Preferences | null>(null);

function persist(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function PreferencesProvider({ children, initialLocale, initialLanguage, initialTheme }: {
  children: React.ReactNode;
  initialLocale: Locale;
  initialLanguage: LanguagePreference;
  initialTheme: ThemePreference;
}) {
  const [language, updateLanguage] = useState(initialLanguage);
  const [locale, updateLocale] = useState(initialLocale);
  const [theme, updateTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.querySelector('meta[name="description"]')?.setAttribute("content", messages[locale].siteDescription);
  }, [locale]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function syncTheme() {
      document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && media.matches));
    }
    syncTheme();
    media.addEventListener("change", syncTheme);
    return () => media.removeEventListener("change", syncTheme);
  }, [theme]);

  useEffect(() => {
    function syncLanguage() {
      if (language === "system") updateLocale(resolveLocale(navigator.languages));
    }
    window.addEventListener("languagechange", syncLanguage);
    return () => window.removeEventListener("languagechange", syncLanguage);
  }, [language]);

  return (
    <PreferencesContext value={{
      locale, language, theme,
      setLanguage(value) {
        updateLanguage(value);
        updateLocale(value === "system" ? resolveLocale(navigator.languages) : value);
        persist("hachimi-language", value);
      },
      setTheme(value) {
        updateTheme(value);
        document.documentElement.dataset.theme = value;
        persist("hachimi-theme", value);
      },
      t: (key) => messages[locale][key],
    }}>
      {children}
    </PreferencesContext>
  );
}

export function usePreferences() {
  const preferences = useContext(PreferencesContext);
  if (!preferences) throw new Error("usePreferences requires PreferencesProvider");
  return preferences;
}
