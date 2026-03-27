'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { pt, type Translations } from './pt';
import { en } from './en';

export type Language = 'pt' | 'en';

const translations: Record<Language, Translations> = { pt, en };

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  locale: string; // 'pt-BR' or 'en-US'
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'pt',
  setLanguage: () => {},
  t: pt,
  locale: 'pt-BR',
});

const STORAGE_KEY = 'vitalog-language';

function getLocale(lang: Language): string {
  return lang === 'pt' ? 'pt-BR' : 'en-US';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // Update html lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }, []);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
    locale: getLocale(language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

export { type Translations };
