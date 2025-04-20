import { useState, useEffect } from 'react';
import { Document } from '@/lib/db';

const CACHE_KEY = 'documents_cache';
const LAST_SYNC_KEY = 'last_sync';

interface DocumentsCache {
  documents: Document[];
  timestamp: number;
  language: string;
}

export function useDocuments(language: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Έλεγχος σύνδεσης στο internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Φόρτωση εγγράφων
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Έλεγχος για cached δεδομένα
        const cachedData = localStorage.getItem(CACHE_KEY);
        const lastSync = localStorage.getItem(LAST_SYNC_KEY);
        const cache: DocumentsCache | null = cachedData ? JSON.parse(cachedData) : null;

        // Αν είμαστε offline, χρησιμοποιούμε τα cached δεδομένα
        if (!isOnline) {
          if (cache && cache.language === language) {
            setDocuments(cache.documents);
            setLoading(false);
            return;
          }
          throw new Error('No cached data available offline');
        }

        // Αν είμαστε online, ελέγχουμε αν χρειάζεται συγχρονισμός
        const needsSync = !lastSync || 
          !cache || 
          cache.language !== language || 
          Date.now() - Number(lastSync) > 5 * 60 * 1000; // 5 λεπτά

        if (needsSync) {
          // Φόρτωση από το API
          const response = await fetch(`/api/documents?lang=${language}`);
          if (!response.ok) throw new Error('Failed to fetch documents');
          
          const data = await response.json();
          setDocuments(data);

          // Αποθήκευση στο cache
          const cacheData: DocumentsCache = {
            documents: data,
            timestamp: Date.now(),
            language
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
        } else {
          // Χρήση cached δεδομένων
          setDocuments(cache.documents);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Αν υπάρχει cache, το χρησιμοποιούμε σε περίπτωση σφάλματος
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const cache: DocumentsCache = JSON.parse(cachedData);
          if (cache.language === language) {
            setDocuments(cache.documents);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [language, isOnline]);

  // Αναζήτηση εγγράφων
  const searchDocuments = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!isOnline) {
        // Offline αναζήτηση στα cached δεδομένα
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const cache: DocumentsCache = JSON.parse(cachedData);
          if (cache.language === language) {
            const filteredDocs = cache.documents.filter(doc => 
              doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doc.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDocuments(filteredDocs);
          }
        }
      } else {
        // Online αναζήτηση μέσω API
        const response = await fetch(`/api/documents?lang=${language}&search=${searchTerm}`);
        if (!response.ok) throw new Error('Failed to search documents');
        
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    isOnline,
    searchDocuments
  };
} 