import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['fr', 'en', 'es', 'de', 'ru'] as const;
const DEFAULT_LOCALE = 'fr';

/**
 * Middleware to redirect unsupported locales to the default French locale.
 * Requirement 1.7.8: THE Route_Manager SHALL rediriger les locales non supportées
 * vers la locale par défaut (français)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract the first path segment as potential locale
  const segments = pathname.split('/');
  const potentialLocale = segments[1]; // e.g. /xx/... → 'xx'

  // If the first segment looks like a locale (2-3 chars) but is not supported, redirect
  if (
    potentialLocale &&
    /^[a-z]{2,3}(-[A-Z]{2})?$/.test(potentialLocale) &&
    !SUPPORTED_LOCALES.includes(potentialLocale as (typeof SUPPORTED_LOCALES)[number])
  ) {
    const newPathname = '/' + DEFAULT_LOCALE + pathname.slice(potentialLocale.length + 1);
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - api routes
     * - studio routes
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap|api/|studio/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf|css|js|map)).*)',
  ],
};
