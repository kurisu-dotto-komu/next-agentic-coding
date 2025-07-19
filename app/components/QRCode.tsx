"use client";

import { useEffect, useState } from "react";

import QRCodeLib from "qrcode";

export default function QRCode() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      const url = window.location.origin;
      try {
        const dataUrl = await QRCodeLib.toDataURL(url, {
          width: 150,
          margin: 2,
        });
        setQrCodeUrl(dataUrl);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    };

    generateQR();
  }, []);

  if (!qrCodeUrl) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 rounded-lg bg-white p-2 shadow-lg" data-testid="qr-code">
      <img src={qrCodeUrl} alt="QR Code" width={150} height={150} />
      <p className="mt-2 text-center text-xs text-gray-600">Scan to join</p>
    </div>
  );
}
