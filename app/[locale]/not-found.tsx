/**
 * Custom 404 Page — Programmatic SEO
 *
 * Displayed when a programmatic route is invalid or a Sanity combination
 * does not exist. Next.js not-found.tsx automatically returns HTTP 404.
 *
 * Features:
 * - Server-side logging of 404 occurrences (Requirement 1.14)
 * - Search form redirecting to the products catalog
 * - Links to the most popular pages
 * - Suggestions of related/similar pages
 * - Full multilingual support (fr, en, es, de, ru)
 *
 * @see Requirements 1.14
 */

import { headers } from 'next/headers';
import Link from 'next/link';
import { PrefetchLink } from '@/components/seo/PrefetchLink';
import type { Locale } from '@/types/seo';

// ============================================================================
// Server-side 404 logging (Requirement 1.14 — logger les tentatives)
// ============================================================================

async function log404(pathname: string, locale: string) {
  // Server-side only — runs at render time
  console.warn('[404] Invalid programmatic route accessed', {
    pathname,
    locale,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// Translations
// ============================================================================

const t: Record<string, Record<Locale, string>> = {
  title: {
    fr: 'Page introuvable',
    en: 'Page not found',
    es: 'Página no encontrada',
    de: 'Seite nicht gefunden',
    ru: 'Страница не найдена',
  },
  subtitle: {
    fr: 'La page que vous cherchez n\'existe pas ou a été déplacée.',
    en: 'The page you are looking for does not exist or has been moved.',
    es: 'La página que busca no existe o ha sido movida.',
    de: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    ru: 'Страница, которую вы ищете, не существует или была перемещена.',
  },
  searchLabel: {
    fr: 'Rechercher un produit',
    en: 'Search for a product',
    es: 'Buscar un producto',
    de: 'Produkt suchen',
    ru: 'Поиск продукта',
  },
  searchPlaceholder: {
    fr: 'Cacao, café, poivre…',
    en: 'Cocoa, coffee, pepper…',
    es: 'Cacao, café, pimienta…',
    de: 'Kakao, Kaffee, Pfeffer…',
    ru: 'Какао, кофе, перец…',
  },
  searchButton: {
    fr: 'Rechercher',
    en: 'Search',
    es: 'Buscar',
    de: 'Suchen',
    ru: 'Искать',
  },
  popularTitle: {
    fr: 'Pages populaires',
    en: 'Popular pages',
    es: 'Páginas populares',
    de: 'Beliebte Seiten',
    ru: 'Популярные страницы',
  },
  suggestionsTitle: {
    fr: 'Vous cherchiez peut-être…',
    en: 'Were you looking for…',
    es: '¿Estaba buscando…',
    de: 'Meinten Sie vielleicht…',
    ru: 'Возможно, вы искали…',
  },
  backHome: {
    fr: 'Retour à l\'accueil',
    en: 'Back to home',
    es: 'Volver al inicio',
    de: 'Zurück zur Startseite',
    ru: 'На главную',
  },
  // Popular page labels
  catalogLabel: {
    fr: 'Catalogue produits',
    en: 'Product catalog',
    es: 'Catálogo de productos',
    de: 'Produktkatalog',
    ru: 'Каталог продуктов',
  },
  catalogDesc: {
    fr: 'Cacao, café, poivre, bois et maïs premium',
    en: 'Premium cocoa, coffee, pepper, wood and corn',
    es: 'Cacao, café, pimienta, madera y maíz premium',
    de: 'Premium Kakao, Kaffee, Pfeffer, Holz und Mais',
    ru: 'Премиальные какао, кофе, перец, древесина и кукуруза',
  },
  pricesLabel: {
    fr: 'Prix du cacao camerounais',
    en: 'Cameroonian cocoa prices',
    es: 'Precios del cacao camerunés',
    de: 'Kamerunische Kakaopreise',
    ru: 'Цены на камерунское какао',
  },
  pricesDesc: {
    fr: 'Cours en temps réel et historique 30 jours',
    en: 'Real-time prices and 30-day history',
    es: 'Precios en tiempo real e historial de 30 días',
    de: 'Echtzeitpreise und 30-Tage-Verlauf',
    ru: 'Цены в реальном времени и история за 30 дней',
  },
  guideLabel: {
    fr: 'Guide comparatif cacao vs café',
    en: 'Cocoa vs coffee comparison guide',
    es: 'Guía comparativa cacao vs café',
    de: 'Kakao vs Kaffee Vergleichsguide',
    ru: 'Сравнительный гид: какао vs кофе',
  },
  guideDesc: {
    fr: 'Différences, usages et recommandations',
    en: 'Differences, uses and recommendations',
    es: 'Diferencias, usos y recomendaciones',
    de: 'Unterschiede, Verwendung und Empfehlungen',
    ru: 'Различия, применение и рекомендации',
  },
  exportLabel: {
    fr: 'Export cacao vers l\'Allemagne',
    en: 'Export cocoa to Germany',
    es: 'Exportar cacao a Alemania',
    de: 'Kakao nach Deutschland exportieren',
    ru: 'Экспорт какао в Германию',
  },
  exportDesc: {
    fr: 'Certifications, délais et formalités',
    en: 'Certifications, transit times and formalities',
    es: 'Certificaciones, plazos y formalidades',
    de: 'Zertifizierungen, Transitzeiten und Formalitäten',
    ru: 'Сертификаты, сроки транзита и формальности',
  },
  contactLabel: {
    fr: 'Demander un devis',
    en: 'Request a quote',
    es: 'Solicitar cotización',
    de: 'Angebot anfordern',
    ru: 'Запросить предложение',
  },
  contactDesc: {
    fr: 'Notre équipe répond sous 24h',
    en: 'Our team responds within 24h',
    es: 'Nuestro equipo responde en 24h',
    de: 'Unser Team antwortet innerhalb von 24h',
    ru: 'Наша команда отвечает в течение 24 часов',
  },
  // Suggestions
  suggestionCocoa: {
    fr: 'Cacao camerounais — export',
    en: 'Cameroonian cocoa — export',
    es: 'Cacao camerunés — exportación',
    de: 'Kamerunischer Kakao — Export',
    ru: 'Камерунское какао — экспорт',
  },
  suggestionCoffee: {
    fr: 'Café camerounais — prix',
    en: 'Cameroonian coffee — prices',
    es: 'Café camerunés — precios',
    de: 'Kamerunischer Kaffee — Preise',
    ru: 'Камерунский кофе — цены',
  },
  suggestionPepper: {
    fr: 'Poivre camerounais — export',
    en: 'Cameroonian pepper — export',
    es: 'Pimienta camerunesa — exportación',
    de: 'Kamerunischer Pfeffer — Export',
    ru: 'Камерунский перец — экспорт',
  },
};

function tr(key: string, locale: Locale): string {
  return t[key]?.[locale] ?? t[key]?.en ?? key;
}

// ============================================================================
// Popular pages config
// ============================================================================

function getPopularPages(locale: Locale) {
  return [
    {
      href: `/${locale}/products`,
      label: tr('catalogLabel', locale),
      description: tr('catalogDesc', locale),
      icon: '🌿',
    },
    {
      href: `/${locale}/prix/cacao-cameroun`,
      label: tr('pricesLabel', locale),
      description: tr('pricesDesc', locale),
      icon: '📈',
    },
    {
      href: `/${locale}/guide/cacao-vs-cafe`,
      label: tr('guideLabel', locale),
      description: tr('guideDesc', locale),
      icon: '📖',
    },
    {
      href: `/${locale}/produits/cacao/export-allemagne`,
      label: tr('exportLabel', locale),
      description: tr('exportDesc', locale),
      icon: '🚢',
    },
    {
      href: `/${locale}/contact`,
      label: tr('contactLabel', locale),
      description: tr('contactDesc', locale),
      icon: '✉️',
    },
  ];
}

// ============================================================================
// Suggested pages (similar routes)
// ============================================================================

function getSuggestedPages(locale: Locale) {
  return [
    {
      href: `/${locale}/produits/cacao/export-france`,
      label: tr('suggestionCocoa', locale),
    },
    {
      href: `/${locale}/prix/cafe-cameroun`,
      label: tr('suggestionCoffee', locale),
    },
    {
      href: `/${locale}/produits/poivre/export-belgique`,
      label: tr('suggestionPepper', locale),
    },
  ];
}

// ============================================================================
// Page Component
// ============================================================================

export default async function NotFound() {
  // Read the current URL from request headers to log the invalid path
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? headersList.get('x-invoke-path') ?? '/unknown';
  // Detect locale from the pathname (e.g. /fr/produits/invalid)
  const localeMatch = pathname.match(/^\/(fr|en|es|de|ru)(\/|$)/);
  const locale: Locale = (localeMatch?.[1] as Locale) ?? 'fr';

  // Server-side logging (Requirement 1.14)
  await log404(pathname, locale);

  const popularPages = getPopularPages(locale);
  const suggestedPages = getSuggestedPages(locale);

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="text-8xl font-extrabold text-gray-200 select-none" aria-hidden="true">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {tr('title', locale)}
        </h1>
        <p className="mt-3 text-gray-500 text-lg">
          {tr('subtitle', locale)}
        </p>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          {tr('backHome', locale)}
        </Link>
      </div>

      {/* Search form (Requirement 1.14) */}
      <section className="mb-12" aria-labelledby="search-heading">
        <h2 id="search-heading" className="mb-4 text-xl font-semibold text-gray-800">
          {tr('searchLabel', locale)}
        </h2>
        <form
          action={`/${locale}/products`}
          method="GET"
          className="flex gap-2"
          role="search"
        >
          <label htmlFor="not-found-search" className="sr-only">
            {tr('searchLabel', locale)}
          </label>
          <input
            id="not-found-search"
            type="search"
            name="q"
            placeholder={tr('searchPlaceholder', locale)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            {tr('searchButton', locale)}
          </button>
        </form>
      </section>

      {/* Popular pages (Requirement 1.14) */}
      <section className="mb-12" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="mb-4 text-xl font-semibold text-gray-800">
          {tr('popularTitle', locale)}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {popularPages.map((page) => (
            <li key={page.href}>
              <PrefetchLink
                href={page.href}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <span className="text-2xl" aria-hidden="true">{page.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{page.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{page.description}</p>
                </div>
              </PrefetchLink>
            </li>
          ))}
        </ul>
      </section>

      {/* Similar page suggestions (Requirement 1.14) */}
      <section aria-labelledby="suggestions-heading">
        <h2 id="suggestions-heading" className="mb-4 text-xl font-semibold text-gray-800">
          {tr('suggestionsTitle', locale)}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {suggestedPages.map((page) => (
            <li key={page.href}>
              <PrefetchLink
                href={page.href}
                className="inline-block rounded-full border border-gray-200 px-4 py-1.5 text-sm text-blue-700 hover:bg-gray-50 hover:underline transition-colors"
              >
                {page.label}
              </PrefetchLink>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
