/**
 * Route: Prix en Temps Réel
 *
 * Generates static price pages for each product with current price,
 * 30-day history, trend analysis, and price chart.
 * Implements ISR with 24-hour revalidation.
 *
 * URL pattern: /[locale]/prix/[product-slug]-cameroun
 * e.g. /fr/prix/cacao-cameroun
 *
 * @see Requirements 1.4, 1.15.1
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { PrefetchLink } from '@/components/seo/PrefetchLink';
import { Suspense } from 'react';
import type { Locale } from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';
import { getSEOProducts, getSEOProductBySlug, getCurrentPriceByProductSlug, getPriceHistoryByProductSlug } from '@/lib/sanity/seoQueries';
import type { PriceHistoryPoint } from '@/lib/sanity/seoQueries';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb } from '@/lib/seo/internalLinkingEngine';
import { applyLanguageFallback, generateDisclaimer } from '@/lib/seo/contentGenerator';
import { withISRRegeneration, ISRErrorType } from '@/lib/seo/isrErrorHandler';

// ============================================================================
// ISR Configuration — 24 hours (Requirement 1.15.1)
// ============================================================================

export const revalidate = 86400;

// ============================================================================
// Types
// ============================================================================

interface PageProps {
  params: Promise<{
    locale: string;
    priceSlug: string;
  }>;
}

// ============================================================================
// Helpers
// ============================================================================

/** Extract product slug from "product-slug-cameroun" pattern */
function extractProductSlug(priceSlug: string): string | null {
  if (!priceSlug.endsWith('-cameroun')) return null;
  return priceSlug.slice(0, -'-cameroun'.length);
}

/** Calculate trend label and percentage from price history */
function calculateTrend(history: PriceHistoryPoint[]): {
  trend: 'up' | 'down' | 'stable';
  percentage: number;
} {
  if (history.length < 2) {
    return { trend: 'stable', percentage: 0 };
  }
  const latest = history[0].price;
  const oldest = history[history.length - 1].price;
  if (oldest === 0) return { trend: 'stable', percentage: 0 };
  const pct = ((latest - oldest) / oldest) * 100;
  const rounded = Math.round(Math.abs(pct) * 10) / 10;
  if (pct > 0.5) return { trend: 'up', percentage: rounded };
  if (pct < -0.5) return { trend: 'down', percentage: rounded };
  return { trend: 'stable', percentage: rounded };
}

/** Format a price number for display */
function formatPrice(price: number, unit: string): string {
  return `${price.toLocaleString('fr-FR')} ${unit}`;
}

/** Format a date string for display */
function formatDate(dateStr: string, locale: Locale): string {
  try {
    return new Date(dateStr).toLocaleDateString(
      locale === 'ru' ? 'ru-RU' : locale === 'de' ? 'de-DE' : locale === 'es' ? 'es-ES' : locale === 'en' ? 'en-GB' : 'fr-FR',
      { day: '2-digit', month: 'long', year: 'numeric' }
    );
  } catch {
    return dateStr;
  }
}

// ============================================================================
// Static Params Generation (Requirement 1.4.1)
// ============================================================================

export async function generateStaticParams() {
  const products = await getSEOProducts();
  const params: { locale: string; priceSlug: string }[] = [];

  for (const product of products) {
    // Skip products with missing slugs
    if (!product.slug?.current) continue;
    for (const locale of SUPPORTED_LOCALES) {
      params.push({
        locale,
        priceSlug: `${product.slug.current}-cameroun`,
      });
    }
  }

  return params;
}

// ============================================================================
// Metadata Generation (Requirement 1.4.7)
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const productSlug = extractProductSlug(resolvedParams.priceSlug);

  if (!productSlug) return { title: 'Page non trouvée' };

  const [product, currentPrice] = await Promise.all([
    getSEOProductBySlug(productSlug),
    getCurrentPriceByProductSlug(productSlug),
  ]);

  if (!product) return { title: 'Page non trouvée' };

  const productName = applyLanguageFallback(product.name, locale, 'product.name');
  const priceStr = currentPrice ? `${currentPrice.price.toLocaleString('fr-FR')} ${currentPrice.unit}` : null;

  const titles: Record<Locale, string> = {
    fr: priceStr
      ? `Prix ${productName} Cameroun ${priceStr} | Afrexia`
      : `Prix ${productName} Cameroun aujourd'hui | Afrexia`,
    en: priceStr
      ? `${productName} Price Cameroon ${priceStr} | Afrexia`
      : `${productName} Price Cameroon today | Afrexia`,
    es: priceStr
      ? `Precio ${productName} Camerún ${priceStr} | Afrexia`
      : `Precio ${productName} Camerún hoy | Afrexia`,
    de: priceStr
      ? `${productName} Preis Kamerun ${priceStr} | Afrexia`
      : `${productName} Preis Kamerun heute | Afrexia`,
    ru: priceStr
      ? `Цена ${productName} Камерун ${priceStr} | Afrexia`
      : `Цена ${productName} Камерун сегодня | Afrexia`,
  };

  const descriptions: Record<Locale, string> = {
    fr: `Prix actuel du ${productName} camerounais${priceStr ? ` : ${priceStr}` : ''}. Historique 30 jours, tendance et évolution des cours. Données mises à jour quotidiennement par Afrexia.`,
    en: `Current price of Cameroonian ${productName}${priceStr ? `: ${priceStr}` : ''}. 30-day history, trend and price evolution. Data updated daily by Afrexia.`,
    es: `Precio actual del ${productName} camerunés${priceStr ? `: ${priceStr}` : ''}. Historial 30 días, tendencia y evolución de precios. Datos actualizados diariamente por Afrexia.`,
    de: `Aktueller Preis für kamerunisches ${productName}${priceStr ? `: ${priceStr}` : ''}. 30-Tage-Verlauf, Trend und Preisentwicklung. Täglich aktualisierte Daten von Afrexia.`,
    ru: `Текущая цена камерунского ${productName}${priceStr ? `: ${priceStr}` : ''}. История за 30 дней, тренд и динамика цен. Данные обновляются ежедневно Afrexia.`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afrexia.com';
  const slug = `prix/${resolvedParams.priceSlug}`;

  const meta = generatePageMetadata({
    title: titles[locale] ?? titles.fr,
    description: descriptions[locale] ?? descriptions.fr,
    locale,
    slug,
    baseUrl,
    robots: 'index, follow',
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonical,
      languages: meta.hreflang as Record<string, string>,
    },
    openGraph: {
      title: meta.openGraph.title,
      description: meta.openGraph.description,
      url: meta.openGraph.url,
      type: 'website',
    },
    twitter: {
      card: meta.twitter.card,
      title: meta.twitter.title,
      description: meta.twitter.description,
    },
    robots: meta.robots,
  };
}

// ============================================================================
// SVG Price Chart Component (Requirement 1.4.4)
// ============================================================================

function PriceChart({ history, unit }: { history: PriceHistoryPoint[]; unit: string }) {
  if (history.length < 2) return null;

  const prices = [...history].reverse().map((h) => h.price);
  const dates = [...history].reverse().map((h) => h.recordedAt);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const width = 600;
  const height = 200;
  const paddingX = 10;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = prices.map((price, i) => {
    const x = paddingX + (i / (prices.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((price - minPrice) / range) * chartHeight;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  // Area fill path
  const firstPoint = points[0].split(',');
  const lastPoint = points[points.length - 1].split(',');
  const areaPath = `M ${firstPoint[0]},${height - paddingY} L ${points.join(' L ')} L ${lastPoint[0]},${height - paddingY} Z`;

  // Show first and last date labels
  const firstDate = dates[0] ? new Date(dates[0]).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';
  const lastDate = dates[dates.length - 1] ? new Date(dates[dates.length - 1]).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';

  return (
    <svg
      viewBox={`0 0 ${width} ${height + 20}`}
      className="w-full h-auto"
      aria-label={`Graphique d'évolution des prix sur 30 jours (${unit})`}
      role="img"
    >
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = paddingY + chartHeight * (1 - ratio);
        const priceLabel = (minPrice + range * ratio).toFixed(0);
        return (
          <g key={ratio}>
            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={paddingX} y={y - 3} fontSize="9" fill="#9ca3af">{priceLabel}</text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="#4A9A62" fillOpacity="0.1" />

      {/* Price line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#4A9A62"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Last point dot */}
      {points.length > 0 && (() => {
        const [lx, ly] = points[points.length - 1].split(',');
        return <circle cx={lx} cy={ly} r="4" fill="#4A9A62" />;
      })()}

      {/* Date labels */}
      <text x={paddingX} y={height + 15} fontSize="10" fill="#6b7280">{firstDate}</text>
      <text x={width - paddingX} y={height + 15} fontSize="10" fill="#6b7280" textAnchor="end">{lastDate}</text>
    </svg>
  );
}

// ============================================================================
// Page Component
// ============================================================================

export default async function PricePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const productSlug = extractProductSlug(resolvedParams.priceSlug);

  if (!productSlug) notFound();

  const path = `/${locale}/prix/${resolvedParams.priceSlug}`;

  // Fetch product and price data in parallel — wrapped with ISR error handling
  // so that failures are logged with full context and Next.js serves the cached version.
  const [product, currentPrice, priceHistory] = await withISRRegeneration(
    () =>
      Promise.all([
        getSEOProductBySlug(productSlug),
        getCurrentPriceByProductSlug(productSlug),
        getPriceHistoryByProductSlug(productSlug, 30),
      ]),
    path,
    ISRErrorType.DATA_FETCH_ERROR,
    {
      locale,
      pageType: 'PRICE_PAGES',
      priceSlug: resolvedParams.priceSlug,
      productSlug,
      revalidateSeconds: 86400,
    }
  );

  if (!product) notFound();

  const productName = applyLanguageFallback(product.name, locale, 'product.name');
  const { trend, percentage } = calculateTrend(priceHistory);
  const lastUpdated = currentPrice?.lastUpdated ?? priceHistory[0]?.recordedAt;
  const priceDisclaimer = generateDisclaimer('price', locale);

  // Breadcrumb
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afrexia.com';
  const breadcrumb = generateBreadcrumb({
    type: 'price',
    product,
    locale,
  });
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumb);

  // Schema.org for price page
  const priceSchema = currentPrice
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productName,
        url: `${baseUrl}/${locale}/prix/${resolvedParams.priceSlug}`,
        offers: {
          '@type': 'Offer',
          price: currentPrice.price,
          priceCurrency: currentPrice.unit.includes('FCFA') ? 'XAF' : 'USD',
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        },
      }
    : null;

  // Localized labels
  const labels = {
    fr: {
      currentPrice: 'Prix actuel',
      priceHistory: 'Évolution des prix (30 jours)',
      trend: 'Tendance',
      trendUp: 'Hausse',
      trendDown: 'Baisse',
      trendStable: 'Stable',
      source: 'Source des données',
      lastUpdate: 'Dernière mise à jour',
      disclaimer: priceDisclaimer,
      chartTitle: 'Graphique d\'évolution',
      noData: 'Données de prix non disponibles pour le moment.',
      noHistory: 'Historique non disponible.',
      contact: 'Demander un devis',
      relatedTitle: 'Pages connexes',
      date: 'Date',
      price: 'Prix',
      variation: 'Variation',
    },
    en: {
      currentPrice: 'Current price',
      priceHistory: 'Price evolution (30 days)',
      trend: 'Trend',
      trendUp: 'Rising',
      trendDown: 'Falling',
      trendStable: 'Stable',
      source: 'Data source',
      lastUpdate: 'Last updated',
      disclaimer: priceDisclaimer,
      chartTitle: 'Price chart',
      noData: 'Price data not available at the moment.',
      noHistory: 'History not available.',
      contact: 'Request a quote',
      relatedTitle: 'Related pages',
      date: 'Date',
      price: 'Price',
      variation: 'Change',
    },
    es: {
      currentPrice: 'Precio actual',
      priceHistory: 'Evolución de precios (30 días)',
      trend: 'Tendencia',
      trendUp: 'Alza',
      trendDown: 'Baja',
      trendStable: 'Estable',
      source: 'Fuente de datos',
      lastUpdate: 'Última actualización',
      disclaimer: priceDisclaimer,
      chartTitle: 'Gráfico de evolución',
      noData: 'Datos de precios no disponibles por el momento.',
      noHistory: 'Historial no disponible.',
      contact: 'Solicitar cotización',
      relatedTitle: 'Páginas relacionadas',
      date: 'Fecha',
      price: 'Precio',
      variation: 'Variación',
    },
    de: {
      currentPrice: 'Aktueller Preis',
      priceHistory: 'Preisentwicklung (30 Tage)',
      trend: 'Trend',
      trendUp: 'Steigend',
      trendDown: 'Fallend',
      trendStable: 'Stabil',
      source: 'Datenquelle',
      lastUpdate: 'Zuletzt aktualisiert',
      disclaimer: priceDisclaimer,
      chartTitle: 'Preisdiagramm',
      noData: 'Preisdaten derzeit nicht verfügbar.',
      noHistory: 'Verlauf nicht verfügbar.',
      contact: 'Angebot anfordern',
      relatedTitle: 'Verwandte Seiten',
      date: 'Datum',
      price: 'Preis',
      variation: 'Änderung',
    },
    ru: {
      currentPrice: 'Текущая цена',
      priceHistory: 'Динамика цен (30 дней)',
      trend: 'Тренд',
      trendUp: 'Рост',
      trendDown: 'Снижение',
      trendStable: 'Стабильно',
      source: 'Источник данных',
      lastUpdate: 'Последнее обновление',
      disclaimer: priceDisclaimer,
      chartTitle: 'График цен',
      noData: 'Данные о ценах временно недоступны.',
      noHistory: 'История недоступна.',
      contact: 'Запросить коммерческое предложение',
      relatedTitle: 'Связанные страницы',
      date: 'Дата',
      price: 'Цена',
      variation: 'Изменение',
    },
  };

  const t = labels[locale] ?? labels.fr;

  const trendLabel = trend === 'up' ? t.trendUp : trend === 'down' ? t.trendDown : t.trendStable;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendBg = trend === 'up' ? 'bg-green-50 border-green-200' : trend === 'down' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200';
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '→';

  // Related price pages (other products)
  // Could be extended to link to other product price pages

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {priceSchema && (
        <Script
          id="schema-product-price"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(priceSchema) }}
        />
      )}

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex flex-wrap gap-1">
            {breadcrumb.map((item, i) => (
              <li key={item.url} className="flex items-center gap-1">
                {i < breadcrumb.length - 1 ? (
                  <>
                    <PrefetchLink href={item.url} className="hover:underline">
                      {item.name}
                    </PrefetchLink>
                    <span aria-hidden="true">/</span>
                  </>
                ) : (
                  <span aria-current="page">{item.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="mb-2 text-3xl font-bold">
          {productName} — Cameroun
        </h1>
        <p className="mb-8 text-gray-500 text-sm">
          {lastUpdated && (
            <span>{t.lastUpdate}: {formatDate(lastUpdated, locale)}</span>
          )}
        </p>

        {/* Current Price Card (Requirement 1.4.2) */}
        <section className="mb-8" aria-labelledby="current-price-heading">
          <h2 id="current-price-heading" className="mb-4 text-xl font-semibold">
            {t.currentPrice}
          </h2>
          {currentPrice ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-4xl font-extrabold text-gray-900">
                    {formatPrice(currentPrice.price, currentPrice.unit)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{t.disclaimer}</p>
                </div>
                {/* Trend badge (Requirement 1.4.5) */}
                <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${trendBg}`}>
                  <span className={`text-xl font-bold ${trendColor}`} aria-hidden="true">
                    {trendIcon}
                  </span>
                  <div>
                    <p className={`font-semibold ${trendColor}`}>{trendLabel}</p>
                    {percentage > 0 && (
                      <p className={`text-sm ${trendColor}`}>{percentage}%</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-500">
              {t.noData}
            </p>
          )}
        </section>

        {/* Price Chart (Requirement 1.4.4) */}
        {priceHistory.length >= 2 && (
          <section className="mb-8" aria-labelledby="chart-heading">
            <h2 id="chart-heading" className="mb-4 text-xl font-semibold">
              {t.priceHistory}
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <PriceChart
                history={priceHistory}
                unit={priceHistory[0]?.unit ?? ''}
              />
            </div>
          </section>
        )}

        {/* Price History Table (Requirement 1.4.3) */}
        <Suspense>
          {priceHistory.length > 0 ? (
            <section className="mb-8" aria-labelledby="history-heading">
              <h2 id="history-heading" className="mb-4 text-xl font-semibold">
                {t.priceHistory}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">{t.date}</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">{t.price}</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">{t.variation}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {priceHistory.slice(0, 30).map((entry, i) => {
                      const entryTrend = entry.trend;
                      const entryColor =
                        entryTrend === 'up'
                          ? 'text-green-600'
                          : entryTrend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-500';
                      const entryIcon =
                        entryTrend === 'up' ? '▲' : entryTrend === 'down' ? '▼' : '→';
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-700">
                            {formatDate(entry.recordedAt, locale)}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">
                            {formatPrice(entry.price, entry.unit)}
                          </td>
                          <td className={`px-4 py-2 text-right font-medium ${entryColor}`}>
                            <span aria-hidden="true">{entryIcon}</span>{' '}
                            {entry.change !== undefined ? `${Math.abs(entry.change)}%` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <p className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-500">
              {t.noHistory}
            </p>
          )}
        </Suspense>

        {/* Data Source (Requirement 1.4.6) */}
        {(currentPrice?.source || priceHistory[0]?.source) && (
          <section className="mb-8 rounded-lg border border-blue-100 bg-blue-50 p-4" aria-labelledby="source-heading">
            <h2 id="source-heading" className="mb-1 text-sm font-semibold text-blue-900">
              {t.source}
            </h2>
            <p className="text-sm text-blue-800">
              {currentPrice?.source ?? priceHistory[0]?.source}
            </p>
            {lastUpdated && (
              <p className="mt-1 text-xs text-blue-600">
                {t.lastUpdate}: {formatDate(lastUpdated, locale)}
              </p>
            )}
            <p className="mt-2 text-xs text-blue-600">{t.disclaimer}</p>
          </section>
        )}

        {/* CTA */}
        <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="mb-3 text-gray-700">
            {locale === 'fr' && `Vous souhaitez acheter du ${productName} camerounais ? Contactez notre équipe commerciale.`}
            {locale === 'en' && `Looking to buy Cameroonian ${productName}? Contact our sales team.`}
            {locale === 'es' && `¿Desea comprar ${productName} camerunés? Contacte a nuestro equipo comercial.`}
            {locale === 'de' && `Möchten Sie kamerunisches ${productName} kaufen? Kontaktieren Sie unser Vertriebsteam.`}
            {locale === 'ru' && `Хотите купить камерунский ${productName}? Свяжитесь с нашим отделом продаж.`}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            {t.contact}
          </Link>
        </div>
      </main>
    </>
  );
}
