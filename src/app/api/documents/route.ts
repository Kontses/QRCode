import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('API route - GET /api/documents');
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'el';
    const search = searchParams.get('search');
    
    console.log('Parameters:', { lang, search });
    console.log('db available:', !!db);

    if (!db || !db.documentsQueries) {
      console.error('db or documentsQueries is undefined');
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error - database not available' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const documents = search 
      ? await db.documentsQueries.search(search, lang)
      : await db.documentsQueries.getAll(lang);

    console.log('Documents fetched:', documents);
    
    return new NextResponse(
      JSON.stringify(documents),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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