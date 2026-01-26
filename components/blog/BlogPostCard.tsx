import Link from 'next/link';
import { BlogPost, Locale } from '@/types';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { calculateReadingTime } from '@/lib/blog/reading-time';

interface BlogPostCardProps {
  post: BlogPost;
  locale: Locale;
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const title = post.title[locale];
  const excerpt = post.excerpt[locale];
  const slug = post.slug[locale].current;
  const readingTime = calculateReadingTime(post.content[locale]);

  // Format date
  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
      <Link href={`/${locale}/blog/${slug}`}>
        {/* Featured Image */}
        <div className="aspect-[16/9] relative overflow-hidden">
          <OptimizedImage
            image={post.featuredImage}
            alt={post.featuredImage.alt || title}
            width={800}
            height={450}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category._id}
                  className="text-xs font-semibold text-primary bg-light px-3 py-1 rounded-full"
                >
                  {category.name[locale]}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-support mb-4 line-clamp-3">{excerpt}</p>

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-support">
            <div className="flex items-center gap-4">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.photo && (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <OptimizedImage
                        image={post.author.photo}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}

              {/* Date */}
              <time dateTime={post.publishedAt}>{publishedDate}</time>
            </div>

            {/* Reading time */}
            <span>
              {readingTime} {locale === 'fr' ? 'min de lecture' : 'min read'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
