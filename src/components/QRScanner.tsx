'use client';

import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onResult: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          onResult(decodedText);
        },
        (error) => {
          console.warn('QR Code scanning error:', error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onResult]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div id="qr-reader" className="rounded-lg overflow-hidden" />
    </div>
  );
};

export default QRScanner; 