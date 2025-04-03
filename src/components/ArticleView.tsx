import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Document } from '@/lib/db';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/router';

interface ArticleViewProps {
  article: Document;
}

export function ArticleView({ article }: ArticleViewProps) {
  const t = useTranslations('el');
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    // Δημιουργία QR code URL
    const url = `${window.location.origin}/article/${article.slug}?lang=${article.language}`;
    setQrCode(url);
  }, [article]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {article.title}
        </h1>
        
        {qrCode && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center">
            <QRCodeSVG 
              value={qrCode}
              size={200}
              level="H"
              includeMargin={true}
              className="mb-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t.scanToView}
            </p>
          </div>
        )}

        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.html_content }}
        />
      </div>
    </div>
  );
} 