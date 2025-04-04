import { NextRequest, NextResponse } from 'next/server';
import { documentsQueries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'el';
    const search = searchParams.get('search');

    console.log('API route - GET /api/documents', { lang, search });
    console.log('documentsQueries:', documentsQueries);

    let documents;
    if (search) {
      documents = await documentsQueries.search(search, lang);
    } else {
      documents = await documentsQueries.getAll(lang);
    }

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