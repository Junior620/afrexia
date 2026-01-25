import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/sanity/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrexia.com';
const SITE_NAME = 'Afrexia';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const posts = await getAllBlogPosts();

    // Generate RSS feed for both languages
    const rssFeeds = {
      fr: generateRssFeed(posts, 'fr'),
      en: generateRssFeed(posts, 'en'),
    };

    // Return combined feed or default to French
    const rssFeed = rssFeeds.fr;

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

function generateRssFeed(posts: any[], locale: 'fr' | 'en'): string {
  const languageCode = locale === 'fr' ? 'fr-FR' : 'en-US';
  const title =
    locale === 'fr'
      ? `${SITE_NAME} - Blog`
      : `${SITE_NAME} - Blog`;
  const description =
    locale === 'fr'
      ? 'Actualités et expertise en commodités agricoles africaines'
      : 'News and expertise in African agricultural commodities';

  const items = posts
    .map((post) => {
      const postTitle = escapeXml(post.title[locale]);
      const postDescription = escapeXml(post.excerpt[locale]);
      const postUrl = `${SITE_URL}/${locale}/blog/${post.slug[locale].current}`;
      const pubDate = new Date(post.publishedAt).toUTCString();

      // Build image URL from Sanity asset reference
      let imageUrl = '';
      if (post.featuredImage?.asset?._ref) {
        const ref = post.featuredImage.asset._ref;
        const imageId = ref.replace('image-', '').replace(/-(\w+)$/, '.$1');
        imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${imageId}`;
      }

      const categories = post.categories
        ?.map((cat: any) => `<category>${escapeXml(cat.name[locale])}</category>`)
        .join('\n      ') || '';

      const enclosure = imageUrl
        ? `<enclosure url="${imageUrl}" type="image/jpeg" />`
        : '';

      return `
    <item>
      <title>${postTitle}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${postDescription}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author?.name || SITE_NAME)}</author>
      ${categories}
      ${enclosure}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${SITE_URL}/${locale}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>${languageCode}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
