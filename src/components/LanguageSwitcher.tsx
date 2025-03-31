'use client';

import React from 'react';

interface LanguageSwitcherProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange }) => {
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'gr' : 'en';
    localStorage.setItem('preferredLanguage', newLang);
    onLanguageChange(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 
                transition-all duration-200 ease-in-out transform hover:scale-105
                font-medium tracking-wide"
    >
      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {currentLang === 'en' ? 'ΕΛ' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher; 