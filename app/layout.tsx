export const metadata = {
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

// Inline script to prevent FOUC (Flash of Unstyled Content) - Default to dark mode
const themeScript = `(function(){try{var storageKey='afrexia-theme';var theme=null;try{theme=localStorage.getItem(storageKey);}catch(e){}if(!theme||(theme!=='light'&&theme!=='dark')){theme='dark';}if(theme==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This root layout provides HTML structure for all routes
  return (
    <html lang="en" suppressHydrationWarning>
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
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
