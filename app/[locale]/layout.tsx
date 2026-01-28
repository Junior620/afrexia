import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { locales, isValidLocale } from '@/lib/i18n/config';

// Temporarily disabled Google Fonts due to network issues
// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: 'Afrexia - Premium African Agricultural Commodities',
  description:
    'Leading exporter of premium African agricultural commodities including cocoa, coffee, pepper, wood, and corn to international markets.',
};

/**
 * Generate static params for all supported locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  // Get locale from params (async in Next.js 15)
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AnalyticsProvider>
          <SkipToContent />
          <div className="flex min-h-screen flex-col">
            <Header locale={locale} />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer locale={locale} />
            <CookieConsent locale={locale} />
          </div>
        </AnalyticsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
