# DocQR - Documentation QR Code Scanner

Μια εφαρμογή Next.js που επιτρέπει την προβολή τεκμηρίωσης μέσω QR codes, με υποστήριξη για πολλαπλές γλώσσες.

## Χαρακτηριστικά

- Σάρωση QR codes για άμεση πρόσβαση στην τεκμηρίωση
- Υποστήριξη για πολλαπλές γλώσσες (Αγγλικά και Ελληνικά)
- Αναζήτηση στην τεκμηρίωση
- Προβολή Markdown εγγράφων
- Δυνατότητα εγκατάστασης ως PWA

## Εγκατάσταση

1. Κλωνοποιήστε το repository:
```bash
git clone https://github.com/Kontses/QRCode.git
cd QRCode
```

2. Εγκαταστήστε τις εξαρτήσεις:
```bash
npm install
```

3. Εκκινήστε τον development server:
```bash
npm run dev
```

4. Ανοίξτε [http://localhost:3000](http://localhost:3000) στον browser σας.

## Δομή Project

- `/src/docs/en` - Έγγραφα στα Αγγλικά
- `/src/docs/gr` - Έγγραφα στα Ελληνικά
- `/src/components` - React components
- `/src/app` - Next.js pages και API routes

## Τεχνολογίες

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- html5-qrcode
- qrcode 