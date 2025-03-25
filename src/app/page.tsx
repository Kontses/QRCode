'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DocViewer from '../components/DocViewer';
import QRCodeGenerator from '../components/QRCodeGenerator';
import QRScanner from '../components/QRScanner';
import LanguageSwitcher from '../components/LanguageSwitcher';
import CollapsibleSearch from '../components/CollapsibleSearch';
import { translations } from '../translations';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentLang, setCurrentLang] = useState('en');
  const router = useRouter();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    // Get preferred language from localStorage or default to 'en'
    const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLang(preferredLang);
  }, []);

  useEffect(() => {
    const loadDocs = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/docs?lang=${currentLang}`);
        if (!response.ok) {
          throw new Error(`Failed to load docs: ${response.statusText}`);
        }
        const docsData = await response.json();
        if (!Array.isArray(docsData)) {
          throw new Error('Invalid data format received from server');
        }
        setDocs(docsData);
      } catch (error) {
        console.error('Error loading docs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load documents');
        setDocs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocs();
  }, [currentLang]);

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-gray-100 dark:bg-gray-800 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documentation</h1>
          <div className="flex items-center gap-4">
            <CollapsibleSearch
              onSearch={setSearchQuery}
              placeholder={t.search}
            />
            <LanguageSwitcher currentLang={currentLang} />
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-600 dark:text-gray-400">{t.loading}</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 dark:text-red-400">{t.error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t.retry}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Scanner Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.scanQR}</h2>
              <QRScanner onResult={handleQRCodeResult} />
            </div>

            {/* Search Results Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {searchQuery ? t.searchResults : t.availableDocs}
              </h2>
              {filteredDocs.length > 0 ? (
                <ul className="space-y-2">
                  {filteredDocs.map((doc) => (
                    <li key={doc.slug}>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="w-full text-left px-4 py-2 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  {t.noDocs}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Document View */}
        {selectedDoc && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="mb-8">
              <QRCodeGenerator url={`${baseUrl}/docs/${selectedDoc.slug}`} />
            </div>
            <DocViewer content={selectedDoc.content} />
          </div>
        )}
      </main>
    </div>
  );
} 