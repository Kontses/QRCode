---
title: "Getting Started"
description: "Learn how to get started with QRCode Wiki"
category: "Installation"
order: 1
---

# Getting Started

Welcome to QRCode Wiki! This guide will help you get started.

## Requirements

- Node.js 18+
- PostgreSQL 15+
- Neon.tech account

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` file:
   ```
   POSTGRES_URL=your-neon-connection-string
   JWT_SECRET=your-secret-key
   ```
4. Run the import script:
   ```bash
   npm run import-docs
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Scan the QR code to view the article
2. Use the search bar to find articles
3. Change language using the language button 