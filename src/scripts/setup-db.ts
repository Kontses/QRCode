import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

// Φόρτωση των μεταβλητών περιβάλλοντος από το .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function setupDatabase() {
  try {
    // Δημιουργία του πίνακα users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Ο πίνακας users δημιουργήθηκε επιτυχώς');

    // Δημιουργία του χρήστη δοκιμής
    const testUser = {
      name: 'Test User',
      email: 'test@traxis.gr',
      password: 'test123'
    };

    // Δημιουργία του hash του κωδικού
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(testUser.password, salt);

    // Προσθήκη του χρήστη στη βάση
    await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${testUser.name}, ${testUser.email}, ${passwordHash})
      ON CONFLICT (email) DO UPDATE
      SET password_hash = ${passwordHash};
    `;
    console.log('✅ Ο χρήστης δοκιμής δημιουργήθηκε επιτυχώς');

  } catch (error) {
    console.error('❌ Σφάλμα κατά τη ρύθμιση της βάσης δεδομένων:', error);
  } finally {
    process.exit();
  }
}

setupDatabase(); 