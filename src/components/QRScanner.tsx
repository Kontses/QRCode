'use client';

import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onResult: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode('qr-reader');
        }

        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          // Επιλέγουμε την πίσω κάμερα (συνήθως είναι η τελευταία)
          const backCamera = devices[devices.length - 1];
          
          await scannerRef.current.start(
            backCamera.id,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              onResult(decodedText);
            },
            (error) => {
              console.warn('QR Code scanning error:', error);
            }
          );
        }
      } catch (err) {
        console.error('Error starting scanner:', err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
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