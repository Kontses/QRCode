'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/services/user';
import { useTranslations } from '@/hooks/useTranslations';
import { useDocuments } from '@/hooks/useDocuments';
import LoginForm from '@/components/LoginForm';
import CollapsibleSearch from '@/components/CollapsibleSearch';
import QRScanner from '@/components/QRScanner';
import ThemeSwitcher from '@/components/ThemeSwitcher';

type Language = 'el' | 'en';

// Temporary mock data
const mockDocs = {
  en: [
    {
      id: '1',
      title: 'Document 1',
      description: 'This is document 1',
      content: 'Content of document 1',
      slug: 'doc-1'
    },
    {
      id: '2',
      title: 'Document 2',
      description: 'This is document 2',
      content: 'Content of document 2',
      slug: 'doc-2'
    }
  ],
  el: [
    {
      id: '1',
      title: 'Έγγραφο 1',
      description: 'Αυτό είναι το έγγραφο 1',
      content: 'Περιεχόμενο εγγράφου 1',
      slug: 'doc-1'
    },
    {
      id: '2',
      title: 'Έγγραφο 2',
      description: 'Αυτό είναι το έγγραφο 2',
      content: 'Περιεχόμενο εγγράφου 2',
      slug: 'doc-2'
    }
  ]
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('el');
  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const translations = useTranslations(currentLang);
  const { 
    documents, 
    loading: docsLoading, 
    error: docsError,
    isOnline,
    searchDocuments 
  } = useDocuments(currentLang);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await UserService.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setError(null);
  };

  const handleLogout = async () => {
    await UserService.logout();
    setIsAuthenticated(false);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      searchDocuments(value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{translations.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            {translations.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <LoginForm 
          onLoginSuccess={handleLoginSuccess} 
          currentLang={currentLang}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="nav-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">QRCode App</h1>
              </div>
              <div className="ml-6 flex-1 max-w-2xl">
                <CollapsibleSearch
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={translations.search}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowScanner(!showScanner)}
                className="btn-primary"
              >
                {translations.scanQR}
              </button>
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value as Language)}
                className="input-primary"
              >
                <option value="el">Ελληνικά</option>
                <option value="en">English</option>
              </select>
              <ThemeSwitcher />
              <button
                onClick={handleLogout}
                className="btn-primary"
              >
                {translations.logout}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isOnline && (
          <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
            {translations.offlineMode}
          </div>
        )}

        {showScanner && (
          <div className="mb-8">
            <QRScanner onClose={() => setShowScanner(false)} />
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          {docsLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{translations.loading}</p>
            </div>
          ) : docsError ? (
            <div className="text-red-500 text-center">
              {translations.fetchError}
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {searchQuery ? translations.searchResults : translations.availableDocs}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="card">
                    <div className="card-body">
                      <h3 className="card-title">
                        {doc.title}
                      </h3>
                      <p className="card-text">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {documents.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-8">{translations.noResults}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 