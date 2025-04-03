import { NextResponse } from 'next/server';
import { documentsQueries } from '@/lib/db';

export async function GET(request: Request) {
  try {
    console.log('Documents API called');
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'el';
    const searchTerm = searchParams.get('search');
    
    console.log('Language:', language);
    console.log('Search term:', searchTerm);

    let documents;
    if (searchTerm) {
      console.log('Searching documents with term:', searchTerm);
      documents = await documentsQueries.search(language, searchTerm);
    } else {
      console.log('Fetching all documents for language:', language);
      documents = await documentsQueries.getByLanguage(language);
    }

    console.log('Documents found:', documents);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
} 