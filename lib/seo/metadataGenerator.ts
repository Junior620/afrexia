/**
 * Metadata Generator
 *
 * Generates SEO metadata and structured data (schema.org) for programmatic
 * SEO pages. Handles title/description optimization, canonical URLs, hreflang
 * tags, and JSON-LD schemas for Products, Breadcrumbs, and FAQs.
 *
 * @see Requirements 1.12
 */

import type {
  Locale,
  PageMetadata,
  SchemaOrgData,
  FAQ,
  BreadcrumbItem,
  Product,
} from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';
import { applyLanguageFallback } from '@/lib/seo/contentGenerator';

// ============================================================================
// Local Interfaces
// ============================================================================

/**
 * Parameters for generating page metadata.
 */
interface PageMetadataParams {
  /** Raw title — will be optimized to 50–60 chars */
  title: string;
  /** Raw description — will be optimized to 150–160 chars */
  description: string;
  locale: Locale;
  /** Page slug used to build the canonical URL */
  slug: string;
  /** Base URL, e.g. "https://afrexia.com" */
  baseUrl: string;
  /** Optional Open Graph image URL */
  image?: string;
  robots?: 'index, follow' | 'noindex, follow';
}

/**
 * Parameters for generating a schema.org Product structured data block.
 */
interface ProductSchemaParams {
  product: Product;
  locale: Locale;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  image?: string;
}

// ============================================================================
// Title & Description Optimization
// ============================================================================

/**
 * Optimizes a title string to fit within the target character range.
 *
 * - If within [targetMin, targetMax], returns as-is.
 * - If too long, truncates at the last word boundary before targetMax and
 *   appends "..." to signal truncation.
 * - If too short, returns as-is (caller should provide a richer title) and
 *   logs a warning.
 *
 * @param title - The raw title string
 * @param targetMin - Minimum desired length (default 50)
 * @param targetMax - Maximum desired length (default 60)
 * @returns Optimized title string
 */
export function optimizeTitle(title: string, targetMin = 50, targetMax = 60): string {
  const len = title.length;

  if (len >= targetMin && len <= targetMax) {
    return title;
  }

  if (len < targetMin) {
    console.warn(
      `[metadataGenerator] Title too short (${len} chars, min ${targetMin}): "${title}"`
    );
    return title;
  }

  // Too long — truncate at last word boundary before targetMax
  console.warn(
    `[metadataGenerator] Title too long (${len} chars, max ${targetMax}): truncating.`
  );
  return truncateAtWordBoundary(title, targetMax);
}

/**
 * Optimizes a description string to fit within the target character range.
 *
 * - If within [targetMin, targetMax], returns as-is.
 * - If too long, truncates at the last word boundary before targetMax and
 *   appends "...".
 * - If too short, returns as-is and logs a warning.
 *
 * @param description - The raw description string
 * @param targetMin - Minimum desired length (default 150)
 * @param targetMax - Maximum desired length (default 160)
 * @returns Optimized description string
 */
export function optimizeDescription(
  description: string,
  targetMin = 150,
  targetMax = 160
): string {
  const len = description.length;

  if (len >= targetMin && len <= targetMax) {
    return description;
  }

  if (len < targetMin) {
    console.warn(
      `[metadataGenerator] Description too short (${len} chars, min ${targetMin}): "${description.slice(0, 60)}..."`
    );
    return description;
  }

  // Too long — truncate at last word boundary before targetMax
  console.warn(
    `[metadataGenerator] Description too long (${len} chars, max ${targetMax}): truncating.`
  );
  return truncateAtWordBoundary(description, targetMax);
}

// ============================================================================
// Page Metadata
// ============================================================================

/**
 * Generates complete SEO page metadata including canonical URL, hreflang
 * tags, Open Graph, Twitter card, and robots directive.
 *
 * Titles are optimized to 50–60 chars and descriptions to 150–160 chars.
 * The x-default hreflang points to the French (fr) URL per site convention.
 *
 * @param params - Page metadata parameters
 * @returns Complete PageMetadata object
 */
export function generatePageMetadata(params: PageMetadataParams): PageMetadata {
  const { title, description, locale, slug, baseUrl, image, robots } = params;

  const optimizedTitle = optimizeTitle(title);
  const optimizedDescription = optimizeDescription(description);

  const canonical = `${baseUrl}/${locale}/${slug}`;

  // Build hreflang for all supported locales + x-default pointing to French (fr)
  const hreflang = SUPPORTED_LOCALES.reduce(
    (acc, loc) => {
      acc[loc] = `${baseUrl}/${loc}/${slug}`;
      return acc;
    },
    {} as Record<Locale | 'x-default', string>
  );
  hreflang['x-default'] = `${baseUrl}/fr/${slug}`;

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    canonical,
    hreflang,
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: canonical,
      ...(image ? { image } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: optimizedTitle,
      description: optimizedDescription,
      ...(image ? { image } : {}),
    },
    robots: robots ?? 'index, follow',
  };
}

// ============================================================================
// Structured Data Schemas
// ============================================================================

/**
 * Generates a schema.org Product structured data block with a nested Offer.
 *
 * The product name and description are resolved using language fallback so
 * that missing locale translations gracefully fall back to English.
 *
 * @param params - Product schema parameters
 * @returns SchemaOrgData for a Product with an embedded Offer
 */
export function generateProductSchema(params: ProductSchemaParams): SchemaOrgData {
  const {
    product,
    locale,
    price,
    currency = 'USD',
    availability = 'InStock',
    url,
    image,
  } = params;

  const name = applyLanguageFallback(product.name, locale, 'product.name');
  const description = product.description
    ? applyLanguageFallback(product.description, locale, 'product.description')
    : undefined;

  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    priceCurrency: currency,
    availability: `https://schema.org/${availability}`,
    url,
  };

  if (price !== undefined) {
    offer.price = price;
  }

  const schema: SchemaOrgData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url,
    offers: offer,
  };

  if (description) {
    schema.description = description;
  }

  if (image) {
    schema.image = image;
  }

  return schema;
}

/**
 * Generates a schema.org BreadcrumbList structured data block.
 *
 * Each BreadcrumbItem maps to a ListItem with position, name, and item (URL).
 *
 * @param items - Ordered list of breadcrumb items
 * @returns SchemaOrgData for a BreadcrumbList
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): SchemaOrgData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates a schema.org FAQPage structured data block.
 *
 * Each FAQ maps to a Question entity with an acceptedAnswer containing the
 * answer text.
 *
 * @param faqs - List of FAQ items
 * @returns SchemaOrgData for a FAQPage
 */
export function generateFAQSchema(faqs: FAQ[]): SchemaOrgData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Truncates a string at the last word boundary at or before maxLength,
 * appending "..." to indicate truncation.
 *
 * If no word boundary is found within maxLength, hard-truncates at maxLength - 3
 * to accommodate the ellipsis.
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  // Reserve 3 chars for "..."
  const limit = maxLength - 3;
  const slice = text.slice(0, limit);
  const lastSpace = slice.lastIndexOf(' ');

  if (lastSpace > 0) {
    return slice.slice(0, lastSpace) + '...';
  }

  // No word boundary found — hard truncate
  return slice + '...';
}
