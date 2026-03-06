import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from './providers';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevLens - AI GitHub Profile Analyzer',
  description: 'Analyze your GitHub profile with AI to optimize your resume and career prospects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-900`}>
        <SessionProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100/30 to-green-100/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-teal-100/20 to-blue-100/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}} />
            </div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-20 w-2 h-2 bg-green-400/60 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
              <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400/60 rounded-full animate-ping" style={{animationDelay: '1.5s'}} />
              <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-teal-400/60 rounded-full animate-ping" style={{animationDelay: '2.5s'}} />
              <div className="absolute top-1/2 right-20 w-1 h-1 bg-green-500/60 rounded-full animate-ping" style={{animationDelay: '3.5s'}} />
            </div>
            
            <div className="relative z-10">
              {children}
              <Footer />
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}