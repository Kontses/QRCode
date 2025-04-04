import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined');
}

const sqlClient = neon(process.env.POSTGRES_URL);

console.log('Database connection string:', process.env.POSTGRES_URL);

// Για server-side λειτουργίες
export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Helper function για queries
export async function query(text: string, params?: any[]) {
  try {
    console.log('Executing query:', text, 'with params:', params);
    const result = await sqlClient.query(text, params);
    console.log('Query result:', result);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Τύποι για τα documents
export interface Document {
  id: string;
  title: string;
  description?: string;
  content: string;
  html_content: string;
  slug: string;
  language: string;
  category?: string;
  order?: number;
  created_at: string;
  updated_at: string;
  version: number;
  is_published: boolean;
}

interface QueryResult<T> {
  rows: T[];
  [key: string]: any;
}

// Queries για τα documents
export const documentsQueries = {
  getAll: async (language: string) => {
    try {
      console.log('Getting all documents for language:', language);
      const result = await sqlClient.query(
        `SELECT * FROM articles 
         WHERE language = $1 
         AND is_published = true 
         ORDER BY "order" ASC, created_at DESC`,
        [language]
      );
      console.log('Query result:', result);
      return result || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  },
  
  getBySlug: async (slug: string, language: string) => {
    try {
      console.log('Getting document by slug:', slug, 'language:', language);
      const result = await sqlClient.query(
        `SELECT * FROM articles 
         WHERE slug = $1 
         AND language = $2 
         AND is_published = true`,
        [slug, language]
      );
      console.log('Query result:', result);
      return result?.[0] || null;
    } catch (error) {
      console.error('Error in getBySlug:', error);
      return null;
    }
  },
  
  search: async (query: string, language: string) => {
    try {
      console.log('Searching documents:', query, 'language:', language);
      const result = await sqlClient.query(
        `SELECT * FROM articles 
         WHERE language = $1 
         AND is_published = true 
         AND (
           title ILIKE $2 
           OR description ILIKE $2 
           OR content ILIKE $2
         )
         ORDER BY "order" ASC, created_at DESC`,
        [language, `%${query}%`]
      );
      console.log('Query result:', result);
      return result || [];
    } catch (error) {
      console.error('Error in search:', error);
      return [];
    }
  }
};

// Εξαγωγή του documentsQueries ως default export
const db = {
  documentsQueries,
  sqlClient,
  pool,
  query
};

export default db; 