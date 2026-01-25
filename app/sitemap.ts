import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrexia.com';

type Locale = 'fr' | 'en';

interface SanityDocument {
  slug: {
    fr: { current: string };
    en: { current: string };
  };
  _updatedAt: string;
}

/**
 * Fetch all products from Sanity
 */
async function getProducts(): Promise<SanityDocument[]> {
  try {
    const query = `*[_type == "product" && !(_id in path("drafts.**"))] {
      "slug": slug,
      _updatedAt
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

/**
 * Fetch all blog posts from Sanity
 */
async function getBlogPosts(): Promise<SanityDocument[]> {
  try {
    const query = `*[_type == "blogPost" && !(_id in path("drafts.**"))] {
      "slug": slug,
      _updatedAt
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

/**
 * Generate sitemap entries for a list of documents
 */
function generateDocumentEntries(
  documents: SanityDocument[],
  basePath: string
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const locales: Locale[] = ['fr', 'en'];

  for (const doc of documents) {
    for (const locale of locales) {
      const slug = doc.slug?.[locale]?.current;
      if (slug) {
        entries.push({
          url: `${SITE_URL}/${locale}${basePath}/${slug}`,
          lastModified: new Date(doc._updatedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}

/**
 * Generate static page entries
 */
function generateStaticEntries(): MetadataRoute.Sitemap {
  const locales: Locale[] = ['fr', 'en'];
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const }, // Homepage
    { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/solutions', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/quality', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/traceability', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/resources', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/rfq', priority: 0.9, changeFrequency: 'monthly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}

/**
 * Generate complete sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content
  const [products, blogPosts] = await Promise.all([
    getProducts(),
    getBlogPosts(),
  ]);

  // Generate entries
  const staticEntries = generateStaticEntries();
  const productEntries = generateDocumentEntries(products, '/products');
  const blogEntries = generateDocumentEntries(blogPosts, '/blog');

  // Combine all entries
  return [...staticEntries, ...productEntries, ...blogEntries];
}
