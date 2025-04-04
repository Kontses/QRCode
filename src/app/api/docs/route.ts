import { NextRequest, NextResponse } from 'next/server';
import { documentsQueries } from '@/lib/db';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'el';
    const search = searchParams.get('search');

    console.log('Parameters:', { lang, search });

    if (!documentsQueries) {
      console.error('documentsQueries is undefined');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    let documents;
    if (search) {
      documents = await documentsQueries.search(search, lang);
    } else {
      documents = await documentsQueries.getAll(lang);
    }

    return NextResponse.json(documents, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error in /api/docs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 