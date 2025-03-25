'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLang: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang }) => {
  const router = useRouter();

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'gr' : 'en';
    localStorage.setItem('preferredLanguage', newLang);
    router.push(`/${newLang}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    >
      {currentLang === 'en' ? 'ΕΛ' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher; 