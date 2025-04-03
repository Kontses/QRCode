import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined');
}

const sql = neon(process.env.POSTGRES_URL);

export async function GET(request: Request) {
  try {
    // Παίρνουμε το token από το header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Επαληθεύουμε το token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key') as { userId: number, email: string };

    // Παίρνουμε τα στοιχεία του χρήστη από τη βάση
    const result = await sql`
      SELECT id, name, email
      FROM users
      WHERE id = ${decoded.userId}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Επιστρέφουμε τα στοιχεία του χρήστη
    const user = result[0];
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 