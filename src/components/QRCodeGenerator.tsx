'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url, size = 200 }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      if (!url) {
        setError('URL is required');
        return;
      }

      setIsLoading(true);
      setError('');
      
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code. Please try again.');
        setQrDataUrl('');
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [url, size]);

  return (
    <div className="flex flex-col items-center gap-4">
      {isLoading && (
        <div className="text-gray-600 dark:text-gray-400">Generating QR code...</div>
      )}
      {error && (
        <div className="text-red-600 dark:text-red-400">{error}</div>
      )}
      {qrDataUrl && !error && (
        <>
          <img src={qrDataUrl} alt={`QR Code for ${url}`} />
          <p className="text-sm text-gray-600 dark:text-gray-400">{url}</p>
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator; 