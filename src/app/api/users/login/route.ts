import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

const EMAIL_DOMAIN = 'traxis.gr';

function validateEmail(email: string): boolean {
  return email.endsWith(`@${EMAIL_DOMAIN}`);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate email domain
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: `Only ${EMAIL_DOMAIN} email addresses are allowed` },
        { status: 400 }
      );
    }

    // Get user
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 