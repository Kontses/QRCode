import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const EMAIL_DOMAIN = 'traxis.gr';

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL is not defined');
  throw new Error('POSTGRES_URL is not defined');
}

const sql = neon(process.env.POSTGRES_URL);

function validateEmail(email: string): boolean {
  return email.endsWith(`@${EMAIL_DOMAIN}`);
}

export async function POST(request: Request) {
  console.log('Login API called');
  console.log('Request method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    console.log('Parsing request body...');
    const body = await request.text();
    console.log('Raw request body:', body);
    
    let email, password;
    try {
      const data = JSON.parse(body);
      email = data.email;
      password = data.password;
      console.log('Parsed email:', email);
      console.log('Password received:', password ? '[REDACTED]' : 'No password');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
        }
      );
    }

    // Validate email domain
    console.log('Validating email domain...');
    if (!validateEmail(email)) {
      console.log('Invalid email domain');
      return NextResponse.json(
        { error: `Only ${EMAIL_DOMAIN} email addresses are allowed` },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
        }
      );
    }

    // Get user
    console.log('Querying database for user...');
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    console.log('Database query result:', result.length ? 'User found' : 'No user found');

    if (result.length === 0) {
      console.log('No user found with email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
        }
      );
    }

    const user = result[0];

    // Verify password
    console.log('Verifying password...');
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
        }
      );
    }

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    console.log('Login successful, returning user data and token');
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      }
    );
  }
} 