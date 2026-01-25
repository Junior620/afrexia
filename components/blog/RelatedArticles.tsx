import { BlogPost, Locale } from '@/types';
import { getRelatedBlogPosts } from '@/lib/sanity/queries';
import { BlogPostCard } from './BlogPostCard';

interface RelatedArticlesProps {
  currentPostId: string;
  categories: string[];
  tags: string[];
  locale: Locale;
}

export async function RelatedArticles({
  currentPostId,
  categories,
  tags,
  locale,
}: RelatedArticlesProps) {
  // Fetch related posts
  const relatedPosts = await getRelatedBlogPosts(
    currentPostId,
    categories,
    tags,
    4
  );

  // Don't render if no related posts
  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  const translations = {
    fr: {
      title: 'Articles similaires',
      subtitle: 'Découvrez plus de contenu sur des sujets connexes',
    },
    en: {
      title: 'Related Articles',
      subtitle: 'Discover more content on related topics',
    },
  };

  const t = translations[locale];

  return (
    <section className="py-12 md:py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h2>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>

          {/* Related Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedPosts.slice(0, 4).map((post) => (
              <BlogPostCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
