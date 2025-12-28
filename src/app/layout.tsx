import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Catatan Harian Komisi Treatment",
  description: "Aplikasi pencatatan komisi treatment terapis - OREA 85",
  keywords: ["treatment", "komisi", "catatan", "Next.js", "React", "TypeScript"],
  authors: [{ name: "OREA 85" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id-ID" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
