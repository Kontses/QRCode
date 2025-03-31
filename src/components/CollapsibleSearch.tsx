'use client';

import React, { useState } from 'react';

interface CollapsibleSearchProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

const CollapsibleSearch: React.FC<CollapsibleSearchProps> = ({ onSearch, placeholder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className={`
            bg-gray-700 text-white placeholder-gray-400
            border border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 ease-in-out
            ${isExpanded ? 'w-64 px-4 py-2' : 'w-40 px-3 py-1.5'}
          `}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 ease-in-out"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default CollapsibleSearch; 