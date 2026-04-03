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
        
        {/* MY SIGNATURE BADGE */}
        <div className="absolute top-8 right-12 z-50 group">
          <a 
            href="https://github.com/marinamurads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-red-500 transition-colors duration-300"
          >
            <span className="h-[1px] w-8 bg-gray-600 group-hover:bg-red-500 transition-colors duration-300"></span>
            Engineered by <strong className="text-gray-300 group-hover:text-white font-black transition-colors duration-300">Marina Murad</strong>
          </a>
        </div>
        <DevModeProvider>
          {children}
        </DevModeProvider>

      </body>
    </html>
  );
}
