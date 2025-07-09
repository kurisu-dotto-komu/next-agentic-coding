"use client";

import QRCodeLib from "react-qr-code";

interface QRCodeProps {
  url: string;
  size?: number;
}

export default function QRCode({ url, size = 200 }: QRCodeProps) {
  return (
    <div data-testid="qr-code" className="bg-white p-4 rounded-lg shadow-md">
      <QRCodeLib
        value={url}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 256 256`}
      />
      <p className="text-xs text-gray-600 mt-2 text-center">
        Scan to vote on mobile
      </p>
    </div>
  );
}
