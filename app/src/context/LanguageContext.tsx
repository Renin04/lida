import type { ReactNode } from 'react';
import { createContext, useContext, useCallback } from 'react';
import { useAuthStore } from '@/store';

interface LanguageContextValue {
  language: 'en' | 'fa';
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'fa') => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useAuthStore((state) => state.language);
  const toggleLanguage = useAuthStore((state) => state.toggleLanguage);
  const setLanguage = useAuthStore((state) => state.setLanguage);
  const isRTL = language === 'fa';

  const handleSetLanguage = useCallback(
    (lang: 'en' | 'fa') => {
      setLanguage(lang);
    },
    [setLanguage]
  );

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguage: handleSetLanguage, isRTL }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
