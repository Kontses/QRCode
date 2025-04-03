-- Εισαγωγή δοκιμαστικών εγγράφων στα Ελληνικά
INSERT INTO documents (id, title, description, content, slug, language, created_at, updated_at)
VALUES 
  ('1', 'Καλωσήρθατε', 'Καλωσόρισμα', 'Καλωσήρθατε στην εφαρμογή QR Code', 'welcome', 'el', NOW(), NOW()),
  ('2', 'Οδηγίες Χρήσης', 'Βασικές οδηγίες', 'Εδώ θα βρείτε τις βασικές οδηγίες χρήσης της εφαρμογής', 'instructions', 'el', NOW(), NOW());

-- Εισαγωγή δοκιμαστικών εγγράφων στα Αγγλικά
INSERT INTO documents (id, title, description, content, slug, language, created_at, updated_at)
VALUES 
  ('3', 'Welcome', 'Welcome message', 'Welcome to the QR Code application', 'welcome', 'en', NOW(), NOW()),
  ('4', 'Usage Instructions', 'Basic instructions', 'Here you will find the basic usage instructions for the application', 'instructions', 'en', NOW(), NOW()); 