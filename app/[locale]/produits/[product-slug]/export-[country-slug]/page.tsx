/**
 * Route: Produit × Pays d'Export
 *
 * Generates static pages for each validated product × country combination.
 * Implements ISR with 7-day revalidation.
 *
 * @see Requirements 1.3, 1.6, 1.7, 1.8, 1.9, 1.12, 1.13
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { PrefetchLink } from '@/components/seo/PrefetchLink';
import { Suspense } from 'react';
import type { Locale } from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';
import {
  getApprovedExportCountries,
  getSEOProducts,
  getSEOProductBySlug,
  getExportCountryBySlug,
  getRelatedExportCountries,
  getRelatedSEOProducts,
} from '@/lib/sanity/seoQueries';
import { validateProductCountry, logRejectedCombination } from '@/lib/seo/routeCombinationValidator';
import {
  generateProductCountryIntro,
  generateContextualFAQs,
  markContentSource,
  logContentDistribution,
  generateDisclaimer,
  applyLanguageFallback,
} from '@/lib/seo/contentGenerator';
import { generatePageMetadata, generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb, generateRelatedLinks } from '@/lib/seo/internalLinkingEngine';
import { determineIndexability, generateRobotsMetaTag } from '@/lib/seo/indexabilityController';
import { withISRRegeneration, ISRErrorType } from '@/lib/seo/isrErrorHandler';

// ============================================================================
// ISR Configuration — 7 days (Requirement 1.15.2)
// ============================================================================

export const revalidate = 604800;

// ============================================================================
// Types
// ============================================================================

interface PageProps {
  params: Promise<{
    locale: string;
    'product-slug': string;
    'country-slug': string;
  }>;
}

// ============================================================================
// Static Params Generation (Requirement 1.3.1)
// ============================================================================

export async function generateStaticParams() {
  const [products, countries] = await Promise.all([
    getSEOProducts(),
    getApprovedExportCountries(),
  ]);

  const params: { locale: string; 'product-slug': string; 'country-slug': string }[] = [];

  for (const product of products) {
    for (const country of countries) {
      // Skip entries with missing slugs to avoid GROQ query errors
      if (!product.slug?.current || !country.slug?.current) continue;
      for (const locale of SUPPORTED_LOCALES) {
        params.push({
          locale,
          'product-slug': product.slug.current,
          'country-slug': country.slug.current,
        });
      }
    }
  }

  return params;
}

// ============================================================================
// Metadata Generation (Requirement 1.12)
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const productSlug = resolvedParams['product-slug'];
  const countrySlug = resolvedParams['country-slug'];

  if (!productSlug || !countrySlug) {
    return { title: 'Page non trouvée' };
  }

  const [product, country] = await Promise.all([
    getSEOProductBySlug(productSlug),
    getExportCountryBySlug(countrySlug),
  ]);

  if (!product || !country) {
    return { title: 'Page non trouvée' };
  }

  const validation = validateProductCountry(product, country);
  if (!validation.isValid) {
    return { title: 'Page non trouvée' };
  }

  const productName = applyLanguageFallback(product.name, locale, 'product.name');
  const countryName = applyLanguageFallback(country.name, locale, 'country.name');

  const titles: Record<Locale, string> = {
    fr: `Exporter ${productName} vers ${countryName} | Afrexia`,
    en: `Export ${productName} to ${countryName} | Afrexia`,
    es: `Exportar ${productName} a ${countryName} | Afrexia`,
    de: `${productName} nach ${countryName} exportieren | Afrexia`,
    ru: `Экспорт ${productName} в ${countryName} | Afrexia`,
  };

  const descriptions: Record<Locale, string> = {
    fr: `Découvrez comment exporter du ${productName} camerounais vers ${countryName}. Prix, certifications, délais de transit et formalités douanières avec Afrexia.`,
    en: `Learn how to export Cameroonian ${productName} to ${countryName}. Prices, certifications, transit times and customs formalities with Afrexia.`,
    es: `Descubra cómo exportar ${productName} camerunés a ${countryName}. Precios, certificaciones, tiempos de tránsito y formalidades aduaneras con Afrexia.`,
    de: `Erfahren Sie, wie Sie kamerunisches ${productName} nach ${countryName} exportieren. Preise, Zertifizierungen, Transitzeiten und Zollformalitäten mit Afrexia.`,
    ru: `Узнайте, как экспортировать камерунский ${productName} в ${countryName}. Цены, сертификаты, сроки транзита и таможенные формальности с Afrexia.`,
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afrexia.com';
  const slug = `produits/${productSlug}/export-${countrySlug}`;

  const contentBlocks = [generateProductCountryIntro(product, country, locale)];
  const indexabilityDecision = determineIndexability(country.dataCompleteness, contentBlocks);
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

export default async function ProductCountryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const productSlug = resolvedParams['product-slug'];
  const countrySlug = resolvedParams['country-slug'];

  // Guard against undefined slugs (can happen if Sanity data is incomplete)
  if (!productSlug || !countrySlug) {
    notFound();
  }

  const path = `/${locale}/produits/${productSlug}/export-${countrySlug}`;

  // Fetch data — wrapped with ISR error handling so failures are logged with
  // full context and Next.js serves the cached version automatically.
  const [product, country] = await withISRRegeneration(
    () =>
      Promise.all([
        getSEOProductBySlug(productSlug),
        getExportCountryBySlug(countrySlug),
      ]),
    path,
    ISRErrorType.DATA_FETCH_ERROR,
    {
      locale,
      pageType: 'PRODUCT_COUNTRY_PAGES',
      productSlug,
      countrySlug,
      revalidateSeconds: 604800,
    }
  );

  // Validate existence
  if (!product || !country) {
    notFound();
  }

  // Validate combination (Requirement 1.2)
  const validation = validateProductCountry(product, country);
  if (!validation.isValid) {
    logRejectedCombination(productSlug, countrySlug, validation.reason ?? 'Invalid combination');
    notFound();
  }

  // Generate content blocks (Requirement 1.6)
  const introBlock = generateProductCountryIntro(product, country, locale);
  const faqs = generateContextualFAQs(product, country, locale);
  const faqBlocks = faqs.map((faq) =>
    markContentSource(`${faq.question} ${faq.answer}`, 'template', locale)
  );
  const allBlocks = [introBlock, ...faqBlocks];

  // Log content distribution for audit (Requirement 1.8.7)
  logContentDistribution(allBlocks, `${productSlug}/export-${countrySlug}`);

  // Determine indexability (Requirement 1.9)
  const indexabilityDecision = determineIndexability(country.dataCompleteness, allBlocks);

  // Fetch related data for internal linking
  const [relatedCountries, relatedProducts] = await Promise.all([
    getRelatedExportCountries(countrySlug),
    getRelatedSEOProducts(productSlug),
  ]);

  // Generate internal links (Requirement 1.13)
  const breadcrumb = generateBreadcrumb({
    type: 'product-country',
    product,
    country,
    locale,
  });

  const relatedLinks = generateRelatedLinks(
    {
      type: 'product-country',
      product,
      country,
      locale,
      relatedCountries: relatedCountries as any,
      relatedProducts: relatedProducts as any,
    },
    new Set()
  );

  // Generate structured data (Requirement 1.12.3–1.12.6)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afrexia.com';
  const pageUrl = `${baseUrl}/${locale}/produits/${productSlug}/export-${countrySlug}`;

  const productSchema = generateProductSchema({
    product,
    locale,
    url: pageUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumb);
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  // Localized strings
  const productName = applyLanguageFallback(product.name, locale, 'product.name');
  const countryName = applyLanguageFallback(country.name, locale, 'country.name');
  const countryDescription = country.description
    ? applyLanguageFallback(country.description, locale, 'country.description')
    : null;

  const certifications = product.certifications ?? [];
  const ports = country.mainPorts ?? [];
  const transitDays = country.averageTransitTime?.days;

  const labels = {
    fr: {
      certifications: 'Certifications requises',
      ports: 'Ports de destination',
      transit: 'Délai de transit estimé',
      days: 'jours',
      faqs: 'Questions fréquentes',
      related: 'Pages connexes',
      noindex: 'Cette page est en cours de validation qualité.',
      disclaimer: generateDisclaimer('delay', locale),
    },
    en: {
      certifications: 'Required certifications',
      ports: 'Destination ports',
      transit: 'Estimated transit time',
      days: 'days',
      faqs: 'Frequently asked questions',
      related: 'Related pages',
      noindex: 'This page is undergoing quality validation.',
      disclaimer: generateDisclaimer('delay', locale),
    },
    es: {
      certifications: 'Certificaciones requeridas',
      ports: 'Puertos de destino',
      transit: 'Tiempo de tránsito estimado',
      days: 'días',
      faqs: 'Preguntas frecuentes',
      related: 'Páginas relacionadas',
      noindex: 'Esta página está en proceso de validación de calidad.',
      disclaimer: generateDisclaimer('delay', locale),
    },
    de: {
      certifications: 'Erforderliche Zertifizierungen',
      ports: 'Zielhäfen',
      transit: 'Geschätzte Transitzeit',
      days: 'Tage',
      faqs: 'Häufig gestellte Fragen',
      related: 'Verwandte Seiten',
      noindex: 'Diese Seite wird gerade qualitätsgeprüft.',
      disclaimer: generateDisclaimer('delay', locale),
    },
    ru: {
      certifications: 'Необходимые сертификаты',
      ports: 'Порты назначения',
      transit: 'Ориентировочное время транзита',
      days: 'дней',
      faqs: 'Часто задаваемые вопросы',
      related: 'Связанные страницы',
      noindex: 'Эта страница проходит проверку качества.',
      disclaimer: generateDisclaimer('delay', locale),
    },
  };

  const t = labels[locale] ?? labels.fr;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="schema-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
          {country.flag && <span className="mr-2">{country.flag}</span>}
          {productName} — {countryName}
        </h1>

        {/* Intro content */}
        <div className="prose prose-lg mb-8 max-w-none">
          {introBlock.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Country description */}
        {countryDescription && (
          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <p className="text-gray-700">{countryDescription}</p>
          </div>
        )}

        {/* Certifications (Requirement 1.3.4) */}
        {certifications.length > 0 && (
          <section className="mb-8" aria-labelledby="certifications-heading">
            <h2 id="certifications-heading" className="mb-4 text-xl font-semibold">
              {t.certifications}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <li
                  key={cert._id}
                  className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                >
                  {applyLanguageFallback(cert.name, locale, 'cert.name')}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Ports (Requirement 1.3.5) */}
        {ports.length > 0 && (
          <section className="mb-8" aria-labelledby="ports-heading">
            <h2 id="ports-heading" className="mb-4 text-xl font-semibold">
              {t.ports}
            </h2>
            <ul className="space-y-1">
              {ports.map((port) => (
                <li key={port._id} className="text-gray-700">
                  {applyLanguageFallback(port.name, locale, 'port.name')} ({port.locode})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Transit time with disclaimer (Requirement 1.10.3) */}
        {transitDays && (
          <section className="mb-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="font-medium text-blue-900">
              {t.transit}: {transitDays} {t.days}
            </p>
            <p className="mt-1 text-xs text-blue-700">{t.disclaimer}</p>
          </section>
        )}

        {/* FAQs (Requirement 1.6.5) */}
        {faqs.length > 0 && (
          <section className="mb-8" aria-labelledby="faqs-heading">
            <h2 id="faqs-heading" className="mb-4 text-xl font-semibold">
              {t.faqs}
            </h2>
            <dl className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4">
                  <dt className="font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

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
