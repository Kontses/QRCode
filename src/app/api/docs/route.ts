import { NextResponse } from 'next/server';
import { documentsQueries } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'el';
    const search = searchParams.get('search');

    let documents;
    if (search) {
      documents = await documentsQueries.search(lang, search);
    } else {
      documents = await documentsQueries.getByLanguage(lang);
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
} 