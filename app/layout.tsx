import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Or whatever font you are using
import './globals.css';

// 1. IMPORT THE PROVIDER
import { DevModeProvider } from '@/context/DevModeContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EA Game Hub',
  description: 'Next-Gen Titles & Live Stats',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        
        {/* 2. WRAP THE ENTIRE APP IN THE PROVIDER */}
        <DevModeProvider>
          {children}
        </DevModeProvider>

      </body>
    </html>
  );
}
