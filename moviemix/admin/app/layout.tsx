import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MovieMix Admin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-white">{children}</body>
    </html>
  );
}
