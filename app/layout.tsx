import "./globals.css";

import type { Metadata } from "next";

import Providers from "@/app/components/Providers";

export const metadata: Metadata = {
  title: "Tamagochi World",
  description: "A multiplayer virtual pet game with Convex",
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
