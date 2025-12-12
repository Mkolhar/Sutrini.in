import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sutrini Studio | Custom Embroidery",
  description: "Premium custom embroidery manufacturing platform.",
};

import { LocaleProvider } from '@/context/LocaleContext';

import { AuthProvider } from '@/context/AuthContext';

import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
