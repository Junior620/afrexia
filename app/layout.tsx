import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

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

// Inline script to prevent FOUC (Flash of Unstyled Content)
// This runs synchronously before React hydration to apply the correct theme
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
