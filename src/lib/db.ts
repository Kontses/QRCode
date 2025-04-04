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

// Queries για τα documents
export const documentsQueries = {
  getAll: async (language: string): Promise<Document[]> => {
    try {
      console.log('Getting all documents for language:', language);
      const result = await sqlClient.query(
        `SELECT * FROM articles 
         WHERE language = $1 
         AND is_published = true 
         ORDER BY "order" ASC, created_at DESC`,
        [language]
      );
      
      if (!result || !Array.isArray(result)) {
        console.log('No results or invalid result format');
        return [];
      }

      console.log('getAll results:', result);
      return result as Document[];
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  },
  
  getBySlug: async (slug: string, language: string): Promise<Document | null> => {
    try {
      console.log('Getting document by slug:', slug, 'language:', language);
      const result = await sqlClient.query(
        `SELECT * FROM articles 
         WHERE slug = $1 
         AND language = $2 
         AND is_published = true`,
        [slug, language]
      );
      
      if (!result || !Array.isArray(result) || result.length === 0) {
        console.log('No document found');
        return null;
      }

      console.log('getBySlug result:', result[0]);
      return result[0] as Document;
    } catch (error) {
      console.error('Error in getBySlug:', error);
      return null;
    }
  },
  
  search: async (query: string, language: string): Promise<Document[]> => {
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
      
      if (!result || !Array.isArray(result)) {
        console.log('No search results or invalid result format');
        return [];
      }

      console.log('search results:', result);
      return result as Document[];
    } catch (error) {
      console.error('Error in search:', error);
      return [];
    }
  }
}; 