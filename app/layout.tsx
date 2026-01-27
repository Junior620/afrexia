import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Afrexia - Premium African Agricultural Commodities',
  description:
    'Leading exporter of premium African agricultural commodities including cocoa, coffee, pepper, wood, and corn to international markets.',
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
  openGraph: {
    images: ['/assets/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
