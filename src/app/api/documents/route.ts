import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'el';
    const search = searchParams.get('search');

    console.log('API route - GET /api/documents', { lang, search });
    console.log('db object:', db);
    console.log('documentsQueries:', db.documentsQueries);

    let documents;
    if (search) {
      documents = await db.documentsQueries.search(search, lang);
    } else {
      documents = await db.documentsQueries.getAll(lang);
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