import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

const EMAIL_DOMAIN = 'traxis.gr';

function validateEmail(email: string): boolean {
  return email.endsWith(`@${EMAIL_DOMAIN}`);
}

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate email domain
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: `Only ${EMAIL_DOMAIN} email addresses are allowed` },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${password_hash})
      RETURNING id, name, email, created_at
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 