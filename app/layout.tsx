import "./globals.css";

import type { Metadata } from "next";

import Providers from "@/app/components/Providers";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo app with Convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
