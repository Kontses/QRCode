import { neon } from '@neondatabase/serverless';
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not defined');
}

// Για serverless περιβάλλον (API routes)
export const sql = neon(connectionString);

// Για server-side λειτουργίες
export const pool = new Pool({
  connectionString,
});

// Helper function για queries
export async function query(text, params) {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
} 