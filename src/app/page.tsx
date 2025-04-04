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
    const checkAuth = () => {
      try {
        const isAuth = UserService.isAuthenticated();
        setIsAuthenticated(isAuth);
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

  const handleLogout = () => {
    UserService.logout();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm onLoginSuccess={handleLoginSuccess} currentLang={currentLang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">QRCode App</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentLang('el')}
                  className={`px-3 py-1 rounded-md ${
                    currentLang === 'el'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  EL
                </button>
                <button
                  onClick={() => setCurrentLang('en')}
                  className={`px-3 py-1 rounded-md ${
                    currentLang === 'en'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CollapsibleSearch
                value={searchQuery}
                onChange={handleSearch}
                placeholder={translations.search}
              />
              <ThemeSwitcher />
              <button
                onClick={() => setShowScanner(!showScanner)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {showScanner ? translations.hideScanner : translations.showScanner}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                {translations.logout}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showScanner && (
          <div className="mb-8">
            <QRScanner onClose={() => setShowScanner(false)} />
          </div>
        )}

        {docsError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
            {docsError}
          </div>
        )}

        {!isOnline && (
          <div className="bg-warning/10 text-warning p-4 rounded-md mb-4">
            {translations.offlineMode}
          </div>
        )}

        {docsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-card text-card-foreground rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                {doc.description && (
                  <p className="text-muted-foreground mb-4">{doc.description}</p>
                )}
                <a
                  href={`/docs/${doc.slug}?lang=${currentLang}`}
                  className="text-primary hover:text-primary/80"
                >
                  {currentLang === 'el' ? 'Διαβάστε περισσότερα' : 'Read more'}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 