import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from './middleware';

// Mock NextResponse
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      next: vi.fn(() => ({
        cookies: {
          set: vi.fn(),
        },
      })),
      redirect: vi.fn((url: URL) => ({
        cookies: {
          set: vi.fn(),
        },
        url: url.toString(),
      })),
    },
  };
});

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('URL locale recognition', () => {
    it('should recognize /es/ prefix as Spanish locale', () => {
      const request = new NextRequest('http://localhost:3000/es/products');
      const response = middleware(request);
      
      expect(response).toBeDefined();
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should recognize /de/ prefix as German locale', () => {
      const request = new NextRequest('http://localhost:3000/de/about');
      const response = middleware(request);
      
      expect(response).toBeDefined();
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should recognize /ru/ prefix as Russian locale', () => {
      const request = new NextRequest('http://localhost:3000/ru/contact');
      const response = middleware(request);
      
      expect(response).toBeDefined();
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should recognize /fr/ prefix as French locale', () => {
      const request = new NextRequest('http://localhost:3000/fr/products');
      const response = middleware(request);
      
      expect(response).toBeDefined();
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should recognize /en/ prefix as English locale', () => {
      const request = new NextRequest('http://localhost:3000/en/blog');
      const response = middleware(request);
      
      expect(response).toBeDefined();
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe('Redirect from non-localized URL', () => {
    it('should redirect non-localized URL to localized URL with default locale', () => {
      const request = new NextRequest('http://localhost:3000/products');
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toMatch(/^\/(fr|en|es|de|ru)\//);
    });

    it('should redirect root URL to localized root', () => {
      const request = new NextRequest('http://localhost:3000/');
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toMatch(/^\/(fr|en|es|de|ru)$/);
    });
  });

  describe('Cookie precedence over Accept-Language', () => {
    it('should use cookie locale over Accept-Language header', () => {
      const request = new NextRequest('http://localhost:3000/products', {
        headers: {
          'accept-language': 'en-US,en;q=0.9',
          'cookie': 'NEXT_LOCALE=es',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/es/products');
    });

    it('should use cookie locale de over Accept-Language en', () => {
      const request = new NextRequest('http://localhost:3000/about', {
        headers: {
          'accept-language': 'en-GB,en;q=0.9',
          'cookie': 'NEXT_LOCALE=de',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/de/about');
    });

    it('should use cookie locale ru over Accept-Language fr', () => {
      const request = new NextRequest('http://localhost:3000/contact', {
        headers: {
          'accept-language': 'fr-FR,fr;q=0.9',
          'cookie': 'NEXT_LOCALE=ru',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/ru/contact');
    });
  });

  describe('Accept-Language parsing', () => {
    it('should parse Spanish from Accept-Language header', () => {
      const request = new NextRequest('http://localhost:3000/products', {
        headers: {
          'accept-language': 'es-ES,es;q=0.9',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/es/products');
    });

    it('should parse German from Accept-Language header', () => {
      const request = new NextRequest('http://localhost:3000/about', {
        headers: {
          'accept-language': 'de-DE,de;q=0.9',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/de/about');
    });

    it('should parse Russian from Accept-Language header', () => {
      const request = new NextRequest('http://localhost:3000/contact', {
        headers: {
          'accept-language': 'ru-RU,ru;q=0.9',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/ru/contact');
    });

    it('should handle Spanish variant es-MX', () => {
      const request = new NextRequest('http://localhost:3000/products', {
        headers: {
          'accept-language': 'es-MX,es;q=0.9',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/es/products');
    });

    it('should handle German variant de-AT', () => {
      const request = new NextRequest('http://localhost:3000/products', {
        headers: {
          'accept-language': 'de-AT,de;q=0.9',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/de/products');
    });
  });

  describe('Cookie setting when URL contains locale prefix', () => {
    it('should set cookie when URL contains Spanish locale', () => {
      const request = new NextRequest('http://localhost:3000/es/products');
      const response = middleware(request);
      
      expect(response.cookies.set).toHaveBeenCalledWith(
        'NEXT_LOCALE',
        'es',
        expect.objectContaining({
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
        })
      );
    });

    it('should set cookie when URL contains German locale', () => {
      const request = new NextRequest('http://localhost:3000/de/about');
      const response = middleware(request);
      
      expect(response.cookies.set).toHaveBeenCalledWith(
        'NEXT_LOCALE',
        'de',
        expect.objectContaining({
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
        })
      );
    });

    it('should set cookie when URL contains Russian locale', () => {
      const request = new NextRequest('http://localhost:3000/ru/contact');
      const response = middleware(request);
      
      expect(response.cookies.set).toHaveBeenCalledWith(
        'NEXT_LOCALE',
        'ru',
        expect.objectContaining({
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
        })
      );
    });

    it('should update cookie if it does not match pathname locale', () => {
      const request = new NextRequest('http://localhost:3000/es/products', {
        headers: {
          'cookie': 'NEXT_LOCALE=fr',
        },
      });
      
      const response = middleware(request);
      
      expect(response.cookies.set).toHaveBeenCalledWith(
        'NEXT_LOCALE',
        'es',
        expect.objectContaining({
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
        })
      );
    });
  });

  describe('Default locale fallback', () => {
    it('should use default locale fr when no preference exists', () => {
      const request = new NextRequest('http://localhost:3000/products');
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/fr/products');
    });

    it('should use default locale fr when Accept-Language has no supported locales', () => {
      const request = new NextRequest('http://localhost:3000/products', {
        headers: {
          'accept-language': 'ja-JP,ja;q=0.9',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/fr/products');
    });

    it('should use default locale fr when cookie has invalid locale', () => {
      const request = new NextRequest('http://localhost:3000/products', {
        headers: {
          'cookie': 'NEXT_LOCALE=invalid',
        },
      });
      
      const response = middleware(request);
      
      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = (NextResponse.redirect as any).mock.calls[0];
      expect(redirectCall[0].pathname).toBe('/fr/products');
    });
  });
});

// Property-Based Tests
describe('Property-Based Tests', () => {
  describe('Property 8: Middleware Locale Detection Priority', () => {
    /**
     * Feature: multilingual-expansion
     * Property 8: Middleware Locale Detection Priority
     * 
     * For any request, the Middleware should determine locale in this priority order:
     * (1) Locale_Cookie if valid
     * (2) Accept-Language_Header if it contains a supported locale
     * (3) default locale 'fr'
     * 
     * Validates: Requirements 4.2, 4.3, 4.4, 4.6
     */
    it('should prioritize cookie over Accept-Language over default', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      const localeArb = fc.constantFrom(...validLocales);
      
      // Generate valid URL paths
      const pathArb = fc.oneof(
        fc.constant('/'),
        fc.constant('/products'),
        fc.constant('/about'),
        fc.constant('/contact'),
        fc.webPath()
      );
      
      fc.assert(
        fc.property(
          localeArb,
          localeArb,
          pathArb,
          (cookieLocale, headerLocale, path) => {
            // Ensure path starts with /
            const validPath = path.startsWith('/') ? path : `/${path}`;
            
            // Test 1: Cookie takes precedence over Accept-Language
            const requestWithBoth = new NextRequest(`http://localhost:3000${validPath}`, {
              headers: {
                'accept-language': `${headerLocale}-${headerLocale.toUpperCase()},${headerLocale};q=0.9`,
                'cookie': `NEXT_LOCALE=${cookieLocale}`,
              },
            });
            
            const response1 = middleware(requestWithBoth);
            
            if (NextResponse.redirect) {
              const redirectCall = (NextResponse.redirect as any).mock.calls.find(
                (call: any) => call[0].pathname.startsWith(`/${cookieLocale}`)
              );
              expect(redirectCall).toBeDefined();
            }
            
            vi.clearAllMocks();
            
            // Test 2: Accept-Language used when no cookie
            const requestWithHeader = new NextRequest(`http://localhost:3000${validPath}`, {
              headers: {
                'accept-language': `${headerLocale}-${headerLocale.toUpperCase()},${headerLocale};q=0.9`,
              },
            });
            
            const response2 = middleware(requestWithHeader);
            
            if (NextResponse.redirect) {
              const redirectCall = (NextResponse.redirect as any).mock.calls.find(
                (call: any) => call[0].pathname.startsWith(`/${headerLocale}`)
              );
              expect(redirectCall).toBeDefined();
            }
            
            vi.clearAllMocks();
            
            // Test 3: Default locale used when neither cookie nor header
            const requestWithNeither = new NextRequest(`http://localhost:3000${validPath}`);
            
            const response3 = middleware(requestWithNeither);
            
            if (NextResponse.redirect) {
              const redirectCall = (NextResponse.redirect as any).mock.calls.find(
                (call: any) => call[0].pathname.startsWith('/fr')
              );
              expect(redirectCall).toBeDefined();
            }
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should ignore invalid cookie and fall back to Accept-Language or default', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      const localeArb = fc.constantFrom(...validLocales);
      const invalidLocaleArb = fc.string().filter(s => !validLocales.includes(s as any) && s.length > 0);
      
      // Generate valid URL paths
      const pathArb = fc.oneof(
        fc.constant('/'),
        fc.constant('/products'),
        fc.constant('/about'),
        fc.constant('/contact'),
        fc.webPath()
      );
      
      fc.assert(
        fc.property(
          invalidLocaleArb,
          localeArb,
          pathArb,
          (invalidCookie, headerLocale, path) => {
            // Ensure path starts with /
            const validPath = path.startsWith('/') ? path : `/${path}`;
            
            // Invalid cookie should be ignored, Accept-Language should be used
            const request = new NextRequest(`http://localhost:3000${validPath}`, {
              headers: {
                'accept-language': `${headerLocale}-${headerLocale.toUpperCase()},${headerLocale};q=0.9`,
                'cookie': `NEXT_LOCALE=${invalidCookie}`,
              },
            });
            
            const response = middleware(request);
            
            if (NextResponse.redirect) {
              const redirectCall = (NextResponse.redirect as any).mock.calls.find(
                (call: any) => call[0].pathname.startsWith(`/${headerLocale}`)
              );
              expect(redirectCall).toBeDefined();
            }
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 9: Middleware URL Locale Recognition', () => {
    /**
     * Feature: multilingual-expansion
     * Property 9: Middleware URL Locale Recognition
     * 
     * For any URL path starting with a valid locale prefix (/fr/, /en/, /es/, /de/, /ru/),
     * the Middleware should recognize it as a localized path and set the cookie to match
     * the prefix locale.
     * 
     * Validates: Requirements 4.1, 4.5
     */
    it('should recognize all valid locale prefixes and set cookie accordingly', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      const localeArb = fc.constantFrom(...validLocales);
      
      // Generate valid URL paths
      const pathSegmentArb = fc.oneof(
        fc.constant('products'),
        fc.constant('about'),
        fc.constant('contact'),
        fc.constant('blog'),
        fc.constant('quality'),
        fc.constant('traceability')
      );
      
      fc.assert(
        fc.property(
          localeArb,
          pathSegmentArb,
          (locale, pathSegment) => {
            const url = `http://localhost:3000/${locale}/${pathSegment}`;
            const request = new NextRequest(url);
            
            const response = middleware(request);
            
            // Should call NextResponse.next (not redirect)
            expect(NextResponse.next).toHaveBeenCalled();
            
            // Should set cookie to match the locale in the URL
            expect(response.cookies.set).toHaveBeenCalledWith(
              'NEXT_LOCALE',
              locale,
              expect.objectContaining({
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
              })
            );
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle locale prefix at root path', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      const localeArb = fc.constantFrom(...validLocales);
      
      fc.assert(
        fc.property(
          localeArb,
          (locale) => {
            const url = `http://localhost:3000/${locale}`;
            const request = new NextRequest(url);
            
            const response = middleware(request);
            
            // Should call NextResponse.next (not redirect)
            expect(NextResponse.next).toHaveBeenCalled();
            
            // Should set cookie to match the locale in the URL
            expect(response.cookies.set).toHaveBeenCalledWith(
              'NEXT_LOCALE',
              locale,
              expect.objectContaining({
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
              })
            );
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should update cookie when URL locale differs from existing cookie', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      const localeArb = fc.constantFrom(...validLocales);
      
      fc.assert(
        fc.property(
          localeArb,
          localeArb,
          (urlLocale, cookieLocale) => {
            // Only test when locales are different
            if (urlLocale === cookieLocale) return;
            
            const url = `http://localhost:3000/${urlLocale}/products`;
            const request = new NextRequest(url, {
              headers: {
                'cookie': `NEXT_LOCALE=${cookieLocale}`,
              },
            });
            
            const response = middleware(request);
            
            // Should call NextResponse.next (not redirect)
            expect(NextResponse.next).toHaveBeenCalled();
            
            // Should update cookie to match the URL locale
            expect(response.cookies.set).toHaveBeenCalledWith(
              'NEXT_LOCALE',
              urlLocale,
              expect.objectContaining({
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
              })
            );
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 10: Accept-Language Parsing Fairness', () => {
    /**
     * Feature: multilingual-expansion
     * Property 10: Accept-Language Parsing Fairness
     * 
     * For any Accept-Language header containing multiple supported locales with equal
     * quality values, the Middleware should select the first matching locale without
     * bias toward any particular language.
     * 
     * Validates: Requirements 4.7
     */
    it('should select first matching locale when quality values are equal', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      
      // Generate a permutation of locales to test order independence
      const localeListArb = fc.shuffledSubarray(validLocales, { minLength: 2, maxLength: 5 });
      
      fc.assert(
        fc.property(
          localeListArb,
          (locales) => {
            // Create Accept-Language header with equal quality values
            // Use lowercase to match the languageCodeMap
            const acceptLanguage = locales.map(loc => loc).join(',');
            
            const request = new NextRequest('http://localhost:3000/products', {
              headers: {
                'accept-language': acceptLanguage,
              },
            });
            
            middleware(request);
            
            // Should redirect to the first locale in the list
            const redirectCalls = (NextResponse.redirect as any).mock.calls;
            const matchingCall = redirectCalls.find(
              (call: any) => {
                const url = call[0];
                return url.pathname === `/${locales[0]}/products`;
              }
            );
            expect(matchingCall).toBeDefined();
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should respect quality values when selecting locale', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      const localeArb = fc.constantFrom(...validLocales);
      
      fc.assert(
        fc.property(
          localeArb,
          localeArb,
          (highPriorityLocale, lowPriorityLocale) => {
            // Skip if same locale
            if (highPriorityLocale === lowPriorityLocale) return;
            
            // Create Accept-Language header with different quality values
            const acceptLanguage = `${lowPriorityLocale};q=0.5,${highPriorityLocale};q=0.9`;
            
            const request = new NextRequest('http://localhost:3000/products', {
              headers: {
                'accept-language': acceptLanguage,
              },
            });
            
            middleware(request);
            
            // Should redirect to the high priority locale
            const redirectCalls = (NextResponse.redirect as any).mock.calls;
            const matchingCall = redirectCalls.find(
              (call: any) => {
                const url = call[0];
                return url.pathname === `/${highPriorityLocale}/products`;
              }
            );
            expect(matchingCall).toBeDefined();
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle mixed supported and unsupported locales fairly', async () => {
      const { default: fc } = await import('fast-check');
      
      const validLocales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      const localeArb = fc.constantFrom(...validLocales);
      
      fc.assert(
        fc.property(
          localeArb,
          (supportedLocale) => {
            // Create Accept-Language with unsupported locales first, then supported
            const acceptLanguage = `ja-JP,zh-CN,${supportedLocale}`;
            
            const request = new NextRequest('http://localhost:3000/products', {
              headers: {
                'accept-language': acceptLanguage,
              },
            });
            
            middleware(request);
            
            // Should redirect to the first supported locale (ignoring unsupported ones)
            const redirectCalls = (NextResponse.redirect as any).mock.calls;
            const matchingCall = redirectCalls.find(
              (call: any) => {
                const url = call[0];
                return url.pathname === `/${supportedLocale}/products`;
              }
            );
            expect(matchingCall).toBeDefined();
            
            vi.clearAllMocks();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
