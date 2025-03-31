'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

interface ThemeSwitcherProps {
  className?: string;
}

export default function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.style.backgroundColor = '#111827';
    } else {
      html.classList.remove('dark');
      html.style.backgroundColor = '#ffffff';
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-200 hover:bg-gray-300'
      } ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
} 