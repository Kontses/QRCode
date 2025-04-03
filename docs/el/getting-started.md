---
title: "Γρήγορη Εκκίνηση"
description: "Μάθετε πώς να ξεκινήσετε με το QRCode Wiki"
category: "Εγκατάσταση"
order: 1
---

# Γρήγορη Εκκίνηση

Καλώς ήρθατε στο QRCode Wiki! Αυτός ο οδηγός θα σας βοηθήσει να ξεκινήσετε.

## Απαιτήσεις

- Node.js 18+
- PostgreSQL 15+
- Neon.tech λογαριασμός

## Εγκατάσταση

1. Κλωνοποιήστε το repository
2. Εγκαταστήστε τις εξαρτήσεις:
   ```bash
   npm install
   ```
3. Δημιουργήστε το αρχείο `.env.local`:
   ```
   POSTGRES_URL=your-neon-connection-string
   JWT_SECRET=your-secret-key
   ```
4. Εκτελέστε το script εισαγωγής:
   ```bash
   npm run import-docs
   ```
5. Ξεκινήστε τον development server:
   ```bash
   npm run dev
   ```

## Χρήση

1. Σαρώστε το QR code για να δείτε το άρθρο
2. Χρησιμοποιήστε τη μπάρα αναζήτησης για να βρείτε άρθρα
3. Αλλάξτε γλώσσα χρησιμοποιώντας το κουμπί γλώσσας 