import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from 'pg';

neonConfig.fetchConnectionCache = true;

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not defined');
}

console.log('Database connection string:', connectionString);

// Για serverless περιβάλλον (API routes)
export const sql = neon(connectionString);

// Για server-side λειτουργίες
export const pool = new Pool({
  connectionString,
});

// Helper function για queries
export async function query(text: string, params?: any[]) {
  try {
    console.log('Executing query:', text, 'with params:', params);
    const result = await sql(text, params);
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
  description: string;
  content: string;
  slug: string;
  language: string;
  created_at: Date;
  updated_at: Date;
}

// Queries για τα documents
export const documentsQueries = {
  // Ανάκτηση όλων των εγγράφων για συγκεκριμένη γλώσσα
  getByLanguage: async (language: string): Promise<Document[]> => {
    const result = await query(
      'SELECT * FROM documents WHERE language = $1 ORDER BY created_at DESC',
      [language]
    );
    return result as Document[];
  },

  // Αναζήτηση εγγράφων
  search: async (language: string, searchTerm: string): Promise<Document[]> => {
    const result = await query(
      `SELECT * FROM documents 
       WHERE language = $1 
       AND (title ILIKE $2 OR description ILIKE $2 OR content ILIKE $2)
       ORDER BY created_at DESC`,
      [language, `%${searchTerm}%`]
    );
    return result as Document[];
  },

  // Ανάκτηση εγγράφου με βάση το slug
  getBySlug: async (slug: string, language: string): Promise<Document | null> => {
    const result = await query(
      'SELECT * FROM documents WHERE slug = $1 AND language = $2',
      [slug, language]
    );
    return result.length > 0 ? (result[0] as Document) : null;
  }
}; 