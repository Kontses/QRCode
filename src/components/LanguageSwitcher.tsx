'use client';

type Language = 'el' | 'en';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <button
      onClick={() => onLanguageChange(currentLang === 'el' ? 'en' : 'el')}
      className="px-2 py-1 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors duration-200"
    >
      {currentLang === 'el' ? 'EN' : 'ΕΛ'}
    </button>
  );
} 