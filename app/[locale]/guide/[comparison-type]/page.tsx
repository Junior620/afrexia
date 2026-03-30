/**
 * Route: Comparaisons et Guides
 *
 * Generates static comparison pages for product-vs-product combinations.
 * Supports two URL patterns:
 *   - /[locale]/guide/[product-a]-vs-[product-b]
 *   - /[locale]/guide/[product]-[origin-a]-vs-[origin-b]  (origin variant)
 *
 * Implements ISR with 7-day revalidation.
 *
 * @see Requirements 1.5, 1.15.3
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { PrefetchLink } from '@/components/seo/PrefetchLink';
import { Suspense } from 'react';
import type { Locale } from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';
import {
  getComparisonStaticParams,
  getComparisonProducts,
  getRelatedSEOProducts,
} from '@/lib/sanity/seoQueries';
import {
  generateComparisonContent,
  applyLanguageFallback,
  markContentSource,
  logContentDistribution,
  generateDisclaimer,
} from '@/lib/seo/contentGenerator';
import {
  generatePageMetadata,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb, generateRelatedLinks } from '@/lib/seo/internalLinkingEngine';
import { determineIndexability, generateRobotsMetaTag } from '@/lib/seo/indexabilityController';
import { withISRRegeneration, ISRErrorType } from '@/lib/seo/isrErrorHandler';

// ============================================================================
// ISR Configuration — 7 days (Requirement 1.15.3)
// ============================================================================

export const revalidate = 604800;

// ============================================================================
// Types
// ============================================================================

interface PageProps {
  params: Promise<{
    locale: string;
    'comparison-type': string;
  }>;
}

/**
 * Parsed comparison from the URL slug.
 * Pattern 1: [product-a]-vs-[product-b]
 * Pattern 2: [product]-[origin-a]-vs-[origin-b]
 */
interface ParsedComparison {
  type: 'product-vs-product' | 'origin-vs-origin';
  slugA: string;
  slugB: string;
  /** For origin pattern: the base product slug */
  productSlug?: string;
  /** For origin pattern: origin A and B */
  originA?: string;
  originB?: string;
}

// ============================================================================
// URL Parsing
// ============================================================================

/**
 * Parses a comparison-type slug into its components.
 *
 * Pattern 1: "cacao-vs-cafe-arabica"  → slugA="cacao", slugB="cafe-arabica"
 * Pattern 2: "cacao-cameroun-vs-ghana" → productSlug="cacao", originA="cameroun", originB="ghana"
 *
 * The "-vs-" separator is the key delimiter.
 */
export function parseComparisonSlug(slug: string): ParsedComparison | null {
  const vsIndex = slug.indexOf('-vs-');
  if (vsIndex === -1) return null;

  const left = slug.slice(0, vsIndex);
  const right = slug.slice(vsIndex + 4); // skip "-vs-"

  if (!left || !right) return null;

  // Check if left side contains a product + origin pattern
  // Heuristic: if right side has no dashes, it's likely an origin (single word)
  // and left side is "product-origin" format
  // We detect origin pattern when right side is a single token (no dashes)
  // and left side has at least one dash (product-origin)
  const rightHasDash = right.includes('-');
  const leftHasDash = left.includes('-');

  if (!rightHasDash && leftHasDash) {
    // Possible origin pattern: [product-slug]-[origin-a]-vs-[origin-b]
    // Split left at last dash to get product and originA
    const lastDash = left.lastIndexOf('-');
    const productSlug = left.slice(0, lastDash);
    const originA = left.slice(lastDash + 1);
    const originB = right;

    if (productSlug && originA && originB) {
      return {
        type: 'origin-vs-origin',
        slugA: productSlug,
        slugB: productSlug, // same product, different origins
        productSlug,
        originA,
        originB,
      };
    }
  }

  // Default: product-vs-product pattern
  return {
    type: 'product-vs-product',
    slugA: left,
    slugB: right,
  };
}

/**
 * Builds the comparison-type URL segment from two product slugs.
 */
function buildComparisonSlug(slugA: string, slugB: string): string {
  return `${slugA}-vs-${slugB}`;
}

// ============================================================================
// Static Params Generation (Requirement 1.5.1, 1.5.2)
// ============================================================================

export async function generateStaticParams() {
  const pairs = await getComparisonStaticParams();
  const params: { locale: string; 'comparison-type': string }[] = [];

  for (const { slugA, slugB } of pairs) {
    // Skip entries with missing slugs
    if (!slugA || !slugB) continue;
    for (const locale of SUPPORTED_LOCALES) {
      params.push({
        locale,
        'comparison-type': buildComparisonSlug(slugA, slugB),
      });
    }
  }

  return params;
}

// ============================================================================
// Metadata Generation (Requirement 1.5.6)
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const comparisonType = resolvedParams['comparison-type'];

  const parsed = parseComparisonSlug(comparisonType);
  if (!parsed) return { title: 'Page non trouvée' };

  const { productA, productB } = await getComparisonProducts(parsed.slugA, parsed.slugB);
  if (!productA || !productB) return { title: 'Page non trouvée' };

  const nameA = applyLanguageFallback(productA.name, locale, 'productA.name');
  const nameB = applyLanguageFallback(productB.name, locale, 'productB.name');

  const titles: Record<Locale, string> = {
    fr: `${nameA} vs ${nameB} : Comparaison complète | Afrexia`,
    en: `${nameA} vs ${nameB}: Complete Comparison | Afrexia`,
    es: `${nameA} vs ${nameB}: Comparación completa | Afrexia`,
    de: `${nameA} vs ${nameB}: Vollständiger Vergleich | Afrexia`,
    ru: `${nameA} vs ${nameB}: Полное сравнение | Afrexia`,
  };

  const descriptions: Record<Locale, string> = {
    fr: `Comparez ${nameA} et ${nameB} camerounais : prix, qualité, certifications, disponibilité et recommandations d'usage. Guide complet par Afrexia pour choisir la meilleure matière première.`,
    en: `Compare Cameroonian ${nameA} and ${nameB}: price, quality, certifications, availability and usage recommendations. Complete guide by Afrexia to choose the best commodity.`,
    es: `Compare ${nameA} y ${nameB} cameruneses: precio, calidad, certificaciones, disponibilidad y recomendaciones de uso. Guía completa de Afrexia para elegir la mejor materia prima.`,
    de: `Vergleichen Sie kamerunisches ${nameA} und ${nameB}: Preis, Qualität, Zertifizierungen, Verfügbarkeit und Nutzungsempfehlungen. Vollständiger Leitfaden von Afrexia.`,
    ru: `Сравните камерунские ${nameA} и ${nameB}: цена, качество, сертификаты, доступность и рекомендации по использованию. Полное руководство от Afrexia.`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afrexia.com';
  const slug = `guide/${comparisonType}`;

  // Estimate indexability with a minimal content block
  const introBlock = markContentSource(descriptions[locale] ?? descriptions.fr, 'template', locale);
  const indexabilityDecision = determineIndexability(100, [introBlock]);
  const robotsValue = generateRobotsMetaTag(indexabilityDecision);

  const meta = generatePageMetadata({
    title: titles[locale] ?? titles.fr,
    description: descriptions[locale] ?? descriptions.fr,
    locale,
    slug,
    baseUrl,
    robots: robotsValue,
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
// Page Component
// ============================================================================

export default async function ComparisonPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const comparisonType = resolvedParams['comparison-type'];

  // Parse the comparison slug (Requirement 1.5.1, 1.5.2)
  const parsed = parseComparisonSlug(comparisonType);
  if (!parsed) notFound();

  const path = `/${locale}/guide/${comparisonType}`;

  // Fetch both products — wrapped with ISR error handling so failures are logged
  // with full context and Next.js serves the cached version automatically.
  const { productA, productB } = await withISRRegeneration(
    () => getComparisonProducts(parsed.slugA, parsed.slugB),
    path,
    ISRErrorType.DATA_FETCH_ERROR,
    {
      locale,
      pageType: 'COMPARISON_PAGES',
      comparisonType,
      slugA: parsed.slugA,
      slugB: parsed.slugB,
      revalidateSeconds: 604800,
    }
  );

  if (!productA || !productB) notFound();

  // Generate comparison content (Requirement 1.5.3, 1.5.4, 1.5.5)
  const content = generateComparisonContent(productA, productB, locale);
  const allBlocks = [
    content.intro,
    content.tasteSection,
    content.qualitySection,
    content.applicationsSection,
    content.recommendations,
  ];

  // Log content distribution for audit
  logContentDistribution(allBlocks, `guide/${comparisonType}`);

  // Determine indexability
  const indexabilityDecision = determineIndexability(100, allBlocks);

  // Fetch related products for internal linking
  const relatedProducts = await getRelatedSEOProducts(parsed.slugA);

  // Generate internal links (Requirement 1.13)
  const breadcrumb = generateBreadcrumb({
    type: 'comparison',
    productA,
    productB,
    locale,
  });

  const relatedLinks = generateRelatedLinks(
    {
      type: 'comparison',
      productA,
      productB,
      locale,
      relatedProducts: relatedProducts as any,
    },
    new Set()
  );

  // Structured data
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumb);
  const faqSchema = content.faqs.length > 0 ? generateFAQSchema(content.faqs) : null;

  const nameA = applyLanguageFallback(productA.name, locale, 'productA.name');
  const nameB = applyLanguageFallback(productB.name, locale, 'productB.name');
  const priceDisclaimer = generateDisclaimer('price', locale);

  // Localized labels
  const labels = {
    fr: {
      comparisonTable: 'Tableau comparatif',
      criterion: 'Critère',
      taste: 'Différences de goût et profil aromatique',
      quality: 'Qualité et certifications',
      applications: 'Applications et usages industriels',
      recommendations: 'Recommandations selon votre cas d\'usage',
      faqs: 'Questions fréquentes',
      related: 'Pages connexes',
      noindex: 'Cette page est en cours de validation qualité.',
      contact: 'Demander un devis',
      contactText: `Vous souhaitez acheter du ${nameA} ou du ${nameB} camerounais ? Contactez notre équipe commerciale.`,
      disclaimer: priceDisclaimer,
      originVariant: `Comparaison des origines pour`,
    },
    en: {
      comparisonTable: 'Comparison table',
      criterion: 'Criterion',
      taste: 'Taste differences and aromatic profile',
      quality: 'Quality and certifications',
      applications: 'Applications and industrial uses',
      recommendations: 'Recommendations based on your use case',
      faqs: 'Frequently asked questions',
      related: 'Related pages',
      noindex: 'This page is undergoing quality validation.',
      contact: 'Request a quote',
      contactText: `Looking to buy Cameroonian ${nameA} or ${nameB}? Contact our sales team.`,
      disclaimer: priceDisclaimer,
      originVariant: `Origin comparison for`,
    },
    es: {
      comparisonTable: 'Tabla comparativa',
      criterion: 'Criterio',
      taste: 'Diferencias de sabor y perfil aromático',
      quality: 'Calidad y certificaciones',
      applications: 'Aplicaciones y usos industriales',
      recommendations: 'Recomendaciones según su caso de uso',
      faqs: 'Preguntas frecuentes',
      related: 'Páginas relacionadas',
      noindex: 'Esta página está en proceso de validación de calidad.',
      contact: 'Solicitar cotización',
      contactText: `¿Desea comprar ${nameA} o ${nameB} camerunés? Contacte a nuestro equipo comercial.`,
      disclaimer: priceDisclaimer,
      originVariant: `Comparación de orígenes para`,
    },
    de: {
      comparisonTable: 'Vergleichstabelle',
      criterion: 'Kriterium',
      taste: 'Geschmacksunterschiede und aromatisches Profil',
      quality: 'Qualität und Zertifizierungen',
      applications: 'Anwendungen und industrielle Nutzung',
      recommendations: 'Empfehlungen basierend auf Ihrem Anwendungsfall',
      faqs: 'Häufig gestellte Fragen',
      related: 'Verwandte Seiten',
      noindex: 'Diese Seite wird gerade qualitätsgeprüft.',
      contact: 'Angebot anfordern',
      contactText: `Möchten Sie kamerunisches ${nameA} oder ${nameB} kaufen? Kontaktieren Sie unser Vertriebsteam.`,
      disclaimer: priceDisclaimer,
      originVariant: `Herkunftsvergleich für`,
    },
    ru: {
      comparisonTable: 'Сравнительная таблица',
      criterion: 'Критерий',
      taste: 'Различия вкуса и ароматический профиль',
      quality: 'Качество и сертификаты',
      applications: 'Применения и промышленное использование',
      recommendations: 'Рекомендации по вашему случаю использования',
      faqs: 'Часто задаваемые вопросы',
      related: 'Связанные страницы',
      noindex: 'Эта страница проходит проверку качества.',
      contact: 'Запросить коммерческое предложение',
      contactText: `Хотите купить камерунский ${nameA} или ${nameB}? Свяжитесь с нашим отделом продаж.`,
      disclaimer: priceDisclaimer,
      originVariant: `Сравнение происхождения для`,
    },
  };

  const t = labels[locale] ?? labels.fr;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Non-indexable notice */}
        {!indexabilityDecision.isIndexable && (
          <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
            {t.noindex}
          </div>
        )}

        {/* Breadcrumb (Requirement 1.13.4) */}
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
        <h1 className="mb-4 text-3xl font-bold">
          {parsed.type === 'origin-vs-origin'
            ? `${t.originVariant} ${nameA}: ${parsed.originA} vs ${parsed.originB}`
            : `${nameA} vs ${nameB}`}
        </h1>

        {/* Intro */}
        <div className="prose prose-lg mb-8 max-w-none">
          {content.intro.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Comparison Table (Requirement 1.5.3) */}
        <section className="mb-8" aria-labelledby="comparison-table-heading">
          <h2 id="comparison-table-heading" className="mb-4 text-xl font-semibold">
            {t.comparisonTable}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">{t.criterion}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">{nameA}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">{nameB}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {content.comparisonTable.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{row.criterion}</td>
                    <td className="px-4 py-3 text-gray-600">{row.valueA}</td>
                    <td className="px-4 py-3 text-gray-600">{row.valueB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-400">{t.disclaimer}</p>
        </section>

        {/* Taste Differences (Requirement 1.5.5) */}
        <section className="mb-8" aria-labelledby="taste-heading">
          <h2 id="taste-heading" className="mb-3 text-xl font-semibold">
            {t.taste}
          </h2>
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-5">
            <p className="text-gray-700">{content.tasteSection.content}</p>
          </div>
        </section>

        {/* Quality & Certifications (Requirement 1.5.3, 1.5.5) */}
        <section className="mb-8" aria-labelledby="quality-heading">
          <h2 id="quality-heading" className="mb-3 text-xl font-semibold">
            {t.quality}
          </h2>
          <div className="rounded-lg bg-green-50 border border-green-100 p-5">
            <p className="text-gray-700">{content.qualitySection.content}</p>
          </div>
        </section>

        {/* Applications (Requirement 1.5.5) */}
        <section className="mb-8" aria-labelledby="applications-heading">
          <h2 id="applications-heading" className="mb-3 text-xl font-semibold">
            {t.applications}
          </h2>
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-5">
            <p className="text-gray-700">{content.applicationsSection.content}</p>
          </div>
        </section>

        {/* Recommendations (Requirement 1.5.4) */}
        <section className="mb-8" aria-labelledby="recommendations-heading">
          <h2 id="recommendations-heading" className="mb-3 text-xl font-semibold">
            {t.recommendations}
          </h2>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-5">
            <p className="text-gray-700">{content.recommendations.content}</p>
          </div>
        </section>

        {/* FAQs (Requirement 1.6.5) */}
        {content.faqs.length > 0 && (
          <section className="mb-8" aria-labelledby="faqs-heading">
            <h2 id="faqs-heading" className="mb-4 text-xl font-semibold">
              {t.faqs}
            </h2>
            <dl className="space-y-4">
              {content.faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4">
                  <dt className="font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* CTA */}
        <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="mb-3 text-gray-700">{t.contactText}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            {t.contact}
          </Link>
        </div>

        {/* Related links (Requirement 1.13.5) */}
        {relatedLinks.length > 0 && (
          <Suspense>
            <section className="mt-10 border-t pt-6" aria-labelledby="related-heading">
              <h2 id="related-heading" className="mb-4 text-lg font-semibold text-gray-700">
                {t.related}
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {relatedLinks.map((link) => (
                  <li key={link.url}>
                    <PrefetchLink
                      href={link.url}
                      className="block rounded border border-gray-200 px-4 py-2 text-sm text-blue-700 hover:bg-gray-50 hover:underline"
                    >
                      {link.anchorText}
                    </PrefetchLink>
                  </li>
                ))}
              </ul>
            </section>
          </Suspense>
        )}
      </main>
    </>
  );
}
