import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Publicações | Sistema de Comparação de Prazos",
  description: "Compare prazos entre Seven iPrazos e Lig Contato. Sincronize dados de publicações e processos judiciais.",
  keywords: ["publicações", "prazos", "seven iprazos", "lig contato", "processos"],
  authors: [{ name: "Serur Advogados" }],
  creator: "Serur Advogados",
  publisher: "Serur Advogados",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
