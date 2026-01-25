'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { BlogPost, Locale } from '@/types';
import { BlogPostCard } from './BlogPostCard';

interface BlogSearchProps {
  posts: BlogPost[];
  locale: Locale;
}

export function BlogSearch({ posts, locale }: BlogSearchProps) {
  const [query, setQuery] = useState('');

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: [
        `title.${locale}`,
        `excerpt.${locale}`,
        'tags',
        `categories.name.${locale}`,
      ],
      threshold: 0.3, // Lower = more strict matching
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [posts, locale]);

  // Get search results
  const results = useMemo(() => {
    if (query.length === 0) {
      return posts;
    }

    if (query.length < 2) {
      return posts;
    }

    return fuse.search(query).map((result) => result.item);
  }, [query, fuse, posts]);

  const translations = {
    fr: {
      placeholder: 'Rechercher des articles...',
      resultsCount: (count: number) =>
        count === 0
          ? 'Aucun article trouvé'
          : count === 1
            ? '1 article trouvé'
            : `${count} articles trouvés`,
      clearSearch: 'Effacer la recherche',
    },
    en: {
      placeholder: 'Search articles...',
      resultsCount: (count: number) =>
        count === 0
          ? 'No articles found'
          : count === 1
            ? '1 article found'
            : `${count} articles found`,
      clearSearch: 'Clear search',
    },
  };

  const t = translations[locale];

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full px-6 py-4 pr-12 text-lg border-2 border-neutral rounded-lg focus:outline-none focus:border-primary transition-colors"
            aria-label={t.placeholder}
          />
          {/* Search Icon */}
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Clear button */}
        {query.length > 0 && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
            aria-label={t.clearSearch}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Results Count */}
      {query.length >= 2 && (
        <div className="text-center text-gray-600">
          <p className="text-sm font-medium">{t.resultsCount(results.length)}</p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((post) => (
          <BlogPostCard key={post._id} post={post} locale={locale} />
        ))}
      </div>

      {/* No Results Message */}
      {query.length >= 2 && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {locale === 'fr'
              ? 'Aucun article ne correspond à votre recherche.'
              : 'No articles match your search.'}
          </p>
          <button
            onClick={() => setQuery('')}
            className="mt-4 text-primary hover:underline"
          >
            {t.clearSearch}
          </button>
        </div>
      )}
    </div>
  );
}
