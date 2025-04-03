import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { query } from '../lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

async function importMarkdownFiles() {
  const docsDir = path.join(process.cwd(), 'docs');
  
  // Διάβασμα όλων των αρχείων Markdown
  const files = await fs.promises.readdir(docsDir, { recursive: true });
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(docsDir, file);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      
      // Εξαγωγή των metadata από το frontmatter
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      // Μετατροπή σε HTML
      const html = await markdownToHtml(markdownContent);
      
      // Εξαγωγή της γλώσσας από το path
      const relativePath = path.relative(docsDir, filePath);
      const language = relativePath.split(path.sep)[0].toLowerCase();
      
      // Εξαγωγή του slug από το path
      const slug = path.basename(filePath, '.md');
      
      // Εισαγωγή στη βάση
      await query(
        `INSERT INTO articles (title, description, content, html_content, slug, language, category, "order")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug, language) DO UPDATE
         SET title = $1, description = $2, content = $3, html_content = $4, category = $7, "order" = $8`,
        [
          frontmatter.title,
          frontmatter.description,
          markdownContent,
          html,
          slug,
          language,
          frontmatter.category,
          frontmatter.order || 0
        ]
      );
      
      console.log(`Imported ${file}`);
    }
  }
}

// Εκτέλεση του script
importMarkdownFiles().catch(console.error); 