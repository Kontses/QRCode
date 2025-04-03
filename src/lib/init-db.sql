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

-- Δημιουργία του πίνακα articles
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    html_content TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    language VARCHAR(2) NOT NULL,
    category VARCHAR(255),
    order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT true
);

-- Δημιουργία του πίνακα qr_codes
CREATE TABLE IF NOT EXISTS qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id),
    code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Δημιουργία index για γρηγορότερη αναζήτηση
CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug); 