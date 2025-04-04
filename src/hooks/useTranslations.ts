type Language = 'el' | 'en';

interface Translations {
  search: string;
  noResults: string;
  loading: string;
  error: string;
  retry: string;
  scanQR: string;
  searchResults: string;
  availableDocs: string;
  loginTitle: string;
  email: string;
  password: string;
  login: string;
  loggingIn: string;
  loginError: string;
  noInternet: string;
  logout: string;
  submit: string;
  offlineMode: string;
  fetchError: string;
  scanToView: string;
  showScanner: string;
  hideScanner: string;
}

const translations: Record<Language, Translations> = {
  el: {
    search: 'Αναζήτηση...',
    noResults: 'Δεν βρέθηκαν αποτελέσματα',
    loading: 'Φόρτωση...',
    error: 'Προέκυψε σφάλμα',
    retry: 'Δοκιμάστε ξανά',
    scanQR: 'Σάρωση QR',
    searchResults: 'Αποτελέσματα Αναζήτησης',
    availableDocs: 'Διαθέσιμα Έγγραφα',
    loginTitle: 'Σύνδεση',
    email: 'Email',
    password: 'Κωδικός',
    login: 'Σύνδεση',
    loggingIn: 'Σύνδεση...',
    loginError: 'Λάθος email ή κωδικός',
    noInternet: 'Απαιτείται σύνδεση στο διαδίκτυο',
    logout: 'Αποσύνδεση',
    submit: 'Υποβολή',
    offlineMode: 'Είστε εκτός σύνδεσης. Χρησιμοποιούνται αποθηκευμένα δεδομένα.',
    fetchError: 'Αποτυχία λήψης εγγράφων',
    scanToView: 'Σαρώστε για να δείτε στο κινητό',
    showScanner: 'Εμφάνιση Scanner',
    hideScanner: 'Απόκρυψη Scanner'
  },
  en: {
    search: 'Search...',
    noResults: 'No results found',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Try again',
    scanQR: 'Scan QR',
    searchResults: 'Search Results',
    availableDocs: 'Available Documents',
    loginTitle: 'Login',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    loggingIn: 'Logging in...',
    loginError: 'Invalid email or password',
    noInternet: 'Internet connection required',
    logout: 'Logout',
    submit: 'Submit',
    offlineMode: 'You are offline. Using cached data.',
    fetchError: 'Failed to fetch documents',
    scanToView: 'Scan to view on mobile',
    showScanner: 'Show Scanner',
    hideScanner: 'Hide Scanner'
  }
};

export function useTranslations(lang: Language): Translations {
  return translations[lang];
} 