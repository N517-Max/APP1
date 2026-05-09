
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { NavHeader } from '@/components/nav-header';

export const metadata: Metadata = {
  title: 'Falls Medride - Professional Medical Transport',
  description: 'Intelligent, reliable medical transport for patients and caregivers.',
};

export const viewport: Viewport = {
  themeColor: '#2273c3',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen">
            <NavHeader />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
