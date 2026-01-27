import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
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

  // Inline script to prevent FOUC (Flash of Unstyled Content)
  const themeScript = `
    (function() {
      try {
        var storageKey = 'afrexia-theme';
        var theme = null;
        
        // Check localStorage for saved preference
        try {
          theme = localStorage.getItem(storageKey);
        } catch (e) {
          // localStorage unavailable (private browsing, etc.)
        }
        
        // Fall back to system preference if no stored preference
        if (!theme || (theme !== 'light' && theme !== 'dark')) {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
          } else {
            theme = 'light';
          }
        }
        
        // Apply dark class to html element before first paint
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // Fail silently to prevent blocking page load
      }
    })();
  `;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mapbox.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://events.mapbox.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://plausible.io" crossOrigin="anonymous" />
        
        {/* DNS prefetch for additional third-party services */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
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
        </ErrorBoundary>
      </body>
    </html>
  );
}
