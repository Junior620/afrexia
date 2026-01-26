import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/types';
import { getAllBlogPosts } from '@/lib/sanity/queries';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { generateMetaTags } from '@/lib/seo/metadata';

interface BlogPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = params;

  const title =
    locale === 'fr'
      ? 'Blog - Actualités et Expertise | Afrexia'
      : 'Blog - News and Expertise | Afrexia';

  const description =
    locale === 'fr'
      ? 'Découvrez nos articles sur le commerce de commodités agricoles africaines, les tendances du marché, et les meilleures pratiques de traçabilité et qualité.'
      : 'Discover our articles on African agricultural commodity trading, market trends, and best practices in traceability and quality.';

  return generateMetaTags({
    title,
    description,
    canonical: `/${locale}/blog`,
    locale,
    alternateLocales: [
      { locale: 'fr', url: `/fr/blog` },
      { locale: 'en', url: `/en/blog` },
    ],
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = params;

  // Validate locale
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  // Fetch all blog posts
  const posts = await getAllBlogPosts();

  const translations = {
    fr: {
      title: 'Blog',
      subtitle:
        'Actualités, tendances du marché et expertise en commodités agricoles',
      noPosts: 'Aucun article disponible pour le moment.',
    },
    en: {
      title: 'Blog',
      subtitle: 'News, market trends and expertise in agricultural commodities',
      noPosts: 'No articles available at the moment.',
    },
  };

  const t = translations[locale];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90">{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid with Search */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t.noPosts}</p>
            </div>
          ) : (
            <BlogSearch posts={posts} locale={locale} />
          )}
        </div>
      </section>
    </main>
  );
}
