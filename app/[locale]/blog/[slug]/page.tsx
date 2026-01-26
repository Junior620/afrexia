import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/types';
import {
  getBlogPostBySlug,
  getAllBlogPostSlugs,
} from '@/lib/sanity/queries';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { PortableTextRenderer } from '@/components/blog/PortableTextRenderer';
import { SocialShare } from '@/components/blog/SocialShare';
import { RelatedArticles } from '@/components/blog/RelatedArticles';
import { calculateReadingTime } from '@/lib/blog/reading-time';
import { generateMetaTags } from '@/lib/seo/metadata';
import { generateArticleSchema } from '@/lib/seo/schema';

interface BlogPostPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();

  const params: { locale: Locale; slug: string }[] = [];

  slugs.forEach((item: any) => {
    params.push(
      { locale: 'fr', slug: item.slugFr },
      { locale: 'en', slug: item.slugEn }
    );
  });

  return params;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);

  if (!post) {
    return {};
  }

  const title =
    post.seo?.metaTitle?.[locale] || `${post.title[locale]} | Afrexia Blog`;
  const description =
    post.seo?.metaDescription?.[locale] || post.excerpt[locale];

  // Build image URL from Sanity asset reference
  const imageUrl = post.featuredImage?.asset?._ref
    ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${post.featuredImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/assets/placeholder.svg`;

  return generateMetaTags({
    title,
    description,
    canonical: `/${locale}/blog/${slug}`,
    locale,
    alternateLocales: [
      { locale: 'fr', url: `/fr/blog/${post.slug.fr.current}` },
      { locale: 'en', url: `/en/blog/${post.slug.en.current}` },
    ],
    ogImage: imageUrl,
    schema: generateArticleSchema(
      {
        title: post.title[locale],
        description: post.excerpt[locale],
        image: imageUrl,
        datePublished: post.publishedAt,
        author: {
          name: post.author.name,
        },
      },
      locale,
      slug
    ),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  // Validate locale
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  // Fetch blog post
  const post = await getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const title = post.title[locale];
  const content = post.content[locale];
  const readingTime = calculateReadingTime(content);

  // Format date
  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const translations = {
    fr: {
      backToBlog: 'Retour au blog',
      readingTime: (minutes: number) => `${minutes} min de lecture`,
      publishedOn: 'Publié le',
      by: 'par',
    },
    en: {
      backToBlog: 'Back to blog',
      readingTime: (minutes: number) => `${minutes} min read`,
      publishedOn: 'Published on',
      by: 'by',
    },
  };

  const t = translations[locale];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrexia.com';
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  return (
    <main className="min-h-screen">
      {/* Back to Blog Link */}
      <div className="bg-light py-4">
        <div className="container mx-auto px-4">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t.backToBlog}
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <span
                    key={category._id}
                    className="text-sm font-semibold text-primary bg-light px-4 py-2 rounded-full"
                  >
                    {category.name[locale]}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.photo && (
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <OptimizedImage
                        image={post.author.photo}
                        alt={post.author.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {post.author.name}
                    </p>
                    {post.author.role && (
                      <p className="text-sm">{post.author.role[locale]}</p>
                    )}
                  </div>
                </div>
              )}

              <span className="text-muted-foreground">•</span>

              {/* Date */}
              <time dateTime={post.publishedAt}>
                {t.publishedOn} {publishedDate}
              </time>

              <span className="text-muted-foreground">•</span>

              {/* Reading Time */}
              <span>{t.readingTime(readingTime)}</span>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="aspect-[16/9] relative overflow-hidden rounded-xl mb-12">
                <OptimizedImage
                  image={post.featuredImage}
                  alt={post.featuredImage.alt || title}
                  width={1200}
                  height={675}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Social Share */}
            <div className="mb-12 pb-8 border-b border-border">
              <SocialShare url={postUrl} title={title} locale={locale} />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <PortableTextRenderer content={content} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12 pb-8 border-b border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share (Bottom) */}
            <div className="mb-12">
              <SocialShare url={postUrl} title={title} locale={locale} />
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <RelatedArticles
        currentPostId={post._id}
        categories={post.categories?.map((cat) => cat._id) || []}
        tags={post.tags || []}
        locale={locale}
      />
    </main>
  );
}
