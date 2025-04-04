import { NextRequest, NextResponse } from 'next/server';
import { documentsQueries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('API route - GET /api/docs');
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'el';
    const search = searchParams.get('search');
    
    console.log('Parameters:', { lang, search });
    console.log('documentsQueries:', documentsQueries);

    if (!documentsQueries) {
      console.error('documentsQueries is undefined');
      return NextResponse.json(
        { error: 'Internal server error - documentsQueries not found' },
        { status: 500 }
      );
    }

    const documents = search 
      ? await documentsQueries.search(search, lang)
      : await documentsQueries.getAll(lang);

    console.log('Documents fetched:', documents);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
} 