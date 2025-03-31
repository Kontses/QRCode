'use client';

import { useEffect, useState } from 'react';
import DocViewer from '../components/DocViewer';
import QRCodeGenerator from '../components/QRCodeGenerator';
import QRScanner from '../components/QRScanner';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import CollapsibleSearch from '../components/CollapsibleSearch';
import { translations } from '../translations';

// Temporary mock data
const mockDocs = {
  en: [
    {
      title: "Getting Started",
      description: "Welcome to our documentation",
      content: "# Welcome to the Documentation\n\nThis is a sample documentation page.",
      slug: "getting-started"
    }
  ],
  gr: [
    {
      title: "Ξεκινώντας",
      description: "Καλώς ήρθατε στην τεκμηρίωσή μας",
      content: "# Καλώς ήρθατε στην Τεκμηρίωση\n\nΑυτή είναι μια δοκιμαστική σελίδα τεκμηρίωσης.",
      slug: "getting-started"
    }
  ]
};

interface DocContent {
  title: string;
  description: string;
  content: string;
  slug: string;
}

export default function Home() {
  const [docs, setDocs] = useState<DocContent[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    setIsLoading(true);
    try {
      setDocs(mockDocs[currentLang as keyof typeof mockDocs]);
      setError('');
    } catch (err) {
      console.error('Error loading docs:', err);
      setError('Failed to load documents');
      setDocs([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentLang]);

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQRCodeResult = (result: string) => {
    try {
      const url = new URL(result);
      const slug = url.pathname.split('/').pop();
      const doc = docs.find(d => d.slug === slug);
      if (doc) {
        setSelectedDoc(doc);
      } else {
        console.warn('Document not found for scanned QR code');
      }
    } catch (error) {
      console.error('Invalid QR code URL:', error);
    }
  };

  const t = translations[currentLang as keyof typeof translations];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              QRCode
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
              <CollapsibleSearch
                onSearch={setSearchQuery}
                placeholder={t.search}
              />
              <LanguageSwitcher 
                currentLang={currentLang} 
                onLanguageChange={setCurrentLang}
              />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-900/20 rounded-lg border border-red-700">
            <div className="text-red-400">{t.error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 ease-in-out"
            >
              {t.retry}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* QR Scanner Section */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-lg overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {t.scanQR}
                </h2>
                <QRScanner onResult={handleQRCodeResult} />
              </div>
            </div>

            {/* Search Results Section */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {searchQuery ? t.searchResults : t.availableDocs}
              </h2>
              {filteredDocs.length > 0 ? (
                <ul className="space-y-3">
                  {filteredDocs.map((doc) => (
                    <li key={doc.slug}>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="w-full text-left p-4 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200 ease-in-out border border-[var(--border-color)] hover:border-blue-500"
                      >
                        <h3 className="font-medium text-blue-400">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{doc.description}</p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                  {t.noDocs}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Document View */}
        {selectedDoc && (
          <div className="mt-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-lg overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="mb-8">
                <QRCodeGenerator url={`${baseUrl}/docs/${selectedDoc.slug}`} />
              </div>
              <div className="prose prose-invert max-w-none">
                <DocViewer content={selectedDoc.content} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 