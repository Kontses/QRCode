import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    
    const docsDirectory = path.join(process.cwd(), 'src/docs', lang);
    
    // Check if directory exists
    try {
      await fs.access(docsDirectory);
    } catch {
      return NextResponse.json(
        { error: `Documentation directory not found for language: ${lang}` },
        { status: 404 }
      );
    }

    // Read directory contents
    const files = await fs.readdir(docsDirectory);
    if (files.length === 0) {
      return NextResponse.json(
        { error: `No documentation files found for language: ${lang}` },
        { status: 404 }
      );
    }

    const markdownFiles = files.filter((file) => file.endsWith('.md'));
    if (markdownFiles.length === 0) {
      return NextResponse.json(
        { error: `No markdown files found for language: ${lang}` },
        { status: 404 }
      );
    }

    // Process markdown files
    const docs = await Promise.all(
      markdownFiles.map(async (file) => {
        try {
          const filePath = path.join(docsDirectory, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          if (!data.title) {
            console.warn(`Warning: Missing title in ${file}`);
          }

          return {
            title: data.title || file.replace('.md', ''),
            description: data.description || '',
            content,
            slug: file.replace('.md', ''),
          };
        } catch (fileError) {
          console.error(`Error processing file ${file}:`, fileError);
          return null;
        }
      })
    );

    // Filter out any failed files and return results
    const validDocs = docs.filter((doc): doc is NonNullable<typeof doc> => doc !== null);

    if (validDocs.length === 0) {
      return NextResponse.json(
        { error: `Failed to process any documentation files for language: ${lang}` },
        { status: 500 }
      );
    }

    return NextResponse.json(validDocs);
  } catch (error) {
    console.error('Error loading docs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to load documentation: ${errorMessage}` },
      { status: 500 }
    );
  }
} 