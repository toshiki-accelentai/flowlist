import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Flowlist',
  description: 'Minimalist project management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
