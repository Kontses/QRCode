'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onClose: () => void;
}

export default function QRScanner({ onClose }: QRScannerProps) {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText: string) => {
        setScanResult(decodedText);
        scanner.clear();
      },
      (error: any) => {
        console.error('QR scan error:', error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      {scanResult ? (
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-4">QR Code Scanned!</p>
          <p className="text-sm text-gray-500 mb-4">{scanResult}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div id="qr-reader" className="w-full max-w-md mx-auto" />
      )}
    </div>
  );
} 