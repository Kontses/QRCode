import { NextRequest, NextResponse } from 'next/server';
import { documentsQueries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('API route - GET /api/documents');
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'el';
    const search = searchParams.get('search');
    
    console.log('Parameters:', { lang, search });
    console.log('db available:', !!documentsQueries);

    if (!documentsQueries) {
      console.error('documentsQueries is undefined');
      return new NextResponse(
        JSON.stringify({ error: 'Database connection error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    let documents;
    if (search) {
      documents = await documentsQueries.search(search, lang);
    } else {
      documents = await documentsQueries.getAll(lang);
    }

    console.log('Documents fetched:', documents);
    
    return new NextResponse(
      JSON.stringify(documents),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching documents:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch documents' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 