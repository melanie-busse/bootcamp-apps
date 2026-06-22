// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NextBay - Underground Marketplace",
  description: "The storefront for the DarkBay marketplace",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="de" className="dark">
      <body className={`${geist.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>

      {/* Header oben */}
      <Navbar />

      {/* Hauptinhalt wächst dynamisch und schiebt den Footer nach unten */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer unten */}
      <Footer />

      </body>
      </html>
  );
}