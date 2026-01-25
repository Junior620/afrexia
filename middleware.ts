import { NextRequest, NextResponse } from 'next/server';

const locales = ['fr', 'en'] as const;
const defaultLocale = 'fr' as const;

type Locale = (typeof locales)[number];

const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Parse Accept-Language header to extract preferred locale
 */
function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage) return null;

  // Parse Accept-Language header (e.g., "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7")
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, qValue] = lang.trim().split(';q=');
      const quality = qValue ? parseFloat(qValue) : 1.0;
      const langCode = locale.split('-')[0].toLowerCase();
      return { locale: langCode, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first matching locale
  for (const { locale } of languages) {
    if (locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }

  return null;
}

/**
 * Get locale from cookie
 */
function getLocaleFromCookie(request: NextRequest): Locale | null {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }
  return null;
}

/**
 * Get locale from pathname
 */
function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  if (potentialLocale && locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }
  return null;
}

/**
 * Determine the locale to use based on priority:
 * 1. Cookie preference
 * 2. Accept-Language header
 * 3. Default locale
 */
function determineLocale(request: NextRequest): Locale {
  // Check cookie first (user preference)
  const cookieLocale = getLocaleFromCookie(request);
  if (cookieLocale) return cookieLocale;

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  const headerLocale = getLocaleFromAcceptLanguage(acceptLanguage);
  if (headerLocale) return headerLocale;

  // Fall back to default
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameLocale = getLocaleFromPathname(pathname);

  if (pathnameLocale) {
    // Pathname has locale, ensure cookie is set
    const response = NextResponse.next();
    const cookieLocale = getLocaleFromCookie(request);
    
    // Update cookie if it doesn't match pathname locale
    if (cookieLocale !== pathnameLocale) {
      response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }
    
    return response;
  }

  // No locale in pathname, redirect to localized version
  const locale = determineLocale(request);
  const newPathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(new URL(newPathname, request.url));
  
  // Set locale cookie
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     * - api routes
     * - studio (Sanity Studio)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|studio|assets|locales).*)',
  ],
};
