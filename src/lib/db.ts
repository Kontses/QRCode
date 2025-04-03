import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined');
}

const sqlClient = neon(process.env.POSTGRES_URL);

console.log('Database connection string:', process.env.POSTGRES_URL);

// Για serverless περιβάλλον (API routes)
export const sqlServerless = sqlClient;

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

// Queries για τα documents
export const documentsQueries = {
  getAll: async (language: string) => {
    const result = await sqlClient.query(
      `SELECT * FROM articles 
       WHERE language = $1 
       AND is_published = true 
       ORDER BY "order" ASC, created_at DESC`,
      [language]
    );
    return result;
  },
  
  getBySlug: async (slug: string, language: string) => {
    const result = await sqlClient.query(
      `SELECT * FROM articles 
       WHERE slug = $1 
       AND language = $2 
       AND is_published = true`,
      [slug, language]
    );
    return result;
  },
  
  search: async (query: string, language: string) => {
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
    return result;
  }
}; 