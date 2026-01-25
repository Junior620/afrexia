/**
 * Property-Based Test: Blog post metadata display
 * 
 * Property 48: For any blog post in the listing view, the display should include
 * featured image, title, excerpt, author name, publication date, and reading time estimate.
 * 
 * Validates: Requirements 13.2
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { BlogPostCard } from '../BlogPostCard';
import { BlogPost, Locale } from '@/types';

// Helper to generate valid Sanity asset references
// Format: image-{assetId}-{width}x{height}-{format}
const sanityAssetRefArbitrary = fc
  .tuple(
    fc.hexaString({ minLength: 32, maxLength: 32 }), // Asset ID
    fc.integer({ min: 100, max: 4000 }), // Width
    fc.integer({ min: 100, max: 4000 }), // Height
    fc.constantFrom('jpg', 'png', 'webp') // Format
  )
  .map(([id, width, height, format]) => `image-${id}-${width}x${height}-${format}`);

// Arbitrary for generating test blog posts
const blogPostArbitrary = fc.record({
  _id: fc.hexaString({ minLength: 24, maxLength: 24 }),
  _type: fc.constant('blogPost' as const),
  title: fc.record({
    fr: fc.string({ minLength: 10, maxLength: 100 }).filter((s) => s.trim().length >= 5),
    en: fc.string({ minLength: 10, maxLength: 100 }).filter((s) => s.trim().length >= 5),
  }),
  slug: fc.record({
    fr: fc.record({
      current: fc
        .string({ minLength: 5, maxLength: 50 })
        .map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
        .filter((s) => s.length > 0),
    }),
    en: fc.record({
      current: fc
        .string({ minLength: 5, maxLength: 50 })
        .map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
        .filter((s) => s.length > 0),
    }),
  }),
  i18nId: fc.hexaString({ minLength: 16, maxLength: 16 }),
  excerpt: fc.record({
    fr: fc.string({ minLength: 30, maxLength: 200 }).filter((s) => s.trim().length >= 20),
    en: fc.string({ minLength: 30, maxLength: 200 }).filter((s) => s.trim().length >= 20),
  }),
  content: fc.record({
    fr: fc.array(
      fc.record({
        _type: fc.constant('block'),
        children: fc.array(
          fc.record({
            text: fc.string({ minLength: 20, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
      }),
      { minLength: 1, maxLength: 20 }
    ),
    en: fc.array(
      fc.record({
        _type: fc.constant('block'),
        children: fc.array(
          fc.record({
            text: fc.string({ minLength: 20, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
      }),
      { minLength: 1, maxLength: 20 }
    ),
  }),
  featuredImage: fc.record({
    asset: fc.record({
      _ref: sanityAssetRefArbitrary,
      _type: fc.constant('reference' as const),
    }),
    alt: fc.option(fc.string({ minLength: 5, maxLength: 50 }), { nil: undefined }),
  }),
  author: fc.record({
    _id: fc.hexaString({ minLength: 24, maxLength: 24 }),
    name: fc
      .tuple(fc.string({ minLength: 3, maxLength: 15 }), fc.string({ minLength: 3, maxLength: 15 }))
      .map(([first, last]) => `${first} ${last}`)
      .filter((s) => s.trim().length >= 5),
    role: fc.record({
      fr: fc.constantFrom('Auteur', 'Rédacteur', 'Expert', 'Analyste'),
      en: fc.constantFrom('Author', 'Writer', 'Expert', 'Analyst'),
    }),
    photo: fc.option(
      fc.record({
        asset: fc.record({
          _ref: sanityAssetRefArbitrary,
          _type: fc.constant('reference' as const),
        }),
        alt: fc.option(fc.string({ minLength: 5, maxLength: 50 }), { nil: undefined }),
      }),
      { nil: undefined }
    ),
  }),
  publishedAt: fc
    .date({ min: new Date('2020-01-01'), max: new Date() })
    .map((d) => d.toISOString()),
  categories: fc.array(
    fc.record({
      _id: fc.hexaString({ minLength: 24, maxLength: 24 }),
      name: fc.record({
        fr: fc.constantFrom('Actualités', 'Marché', 'Qualité', 'Traçabilité'),
        en: fc.constantFrom('News', 'Market', 'Quality', 'Traceability'),
      }),
      slug: fc.record({
        fr: fc.record({
          current: fc.constantFrom('actualites', 'marche', 'qualite', 'tracabilite'),
        }),
        en: fc.record({
          current: fc.constantFrom('news', 'market', 'quality', 'traceability'),
        }),
      }),
    }),
    { minLength: 0, maxLength: 3 }
  ),
  tags: fc.array(
    fc.constantFrom('cacao', 'café', 'export', 'qualité', 'EUDR', 'certification'),
    { minLength: 0, maxLength: 5 }
  ),
});

const localeArbitrary = fc.constantFrom<Locale>('fr', 'en');

describe('Property 48: Blog post metadata display', () => {
  it('should display all required metadata for any blog post', () => {
    fc.assert(
      fc.property(blogPostArbitrary, localeArbitrary, (post, locale) => {
        const { container } = render(
          <BlogPostCard post={post} locale={locale} />
        );

        // Check that the component renders
        expect(container.firstChild).toBeTruthy();

        // Property: Featured image should be present
        const images = container.querySelectorAll('img');
        expect(images.length).toBeGreaterThan(0);

        // Property: Title should be displayed
        const title = post.title[locale];
        expect(container.textContent).toContain(title);

        // Property: Excerpt should be displayed
        const excerpt = post.excerpt[locale];
        expect(container.textContent).toContain(excerpt);

        // Property: Author name should be displayed
        expect(container.textContent).toContain(post.author.name);

        // Property: Publication date should be displayed
        // The date will be formatted, so we just check that some date-related text exists
        const dateElement = container.querySelector('time');
        expect(dateElement).toBeTruthy();
        expect(dateElement?.getAttribute('dateTime')).toBe(post.publishedAt);

        // Property: Reading time should be displayed
        const readingTimeText = locale === 'fr' ? 'min de lecture' : 'min read';
        expect(container.textContent).toContain(readingTimeText);
      }),
      { numRuns: 50 }
    );
  });

  it('should display author photo when available', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary.filter((post) => post.author.photo !== undefined),
        localeArbitrary,
        (post, locale) => {
          const { container } = render(
            <BlogPostCard post={post} locale={locale} />
          );

          // Property: When author has a photo, it should be displayed
          const images = container.querySelectorAll('img');
          // At least 2 images: featured image + author photo
          expect(images.length).toBeGreaterThanOrEqual(2);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should display categories when available', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary.filter((post) => post.categories.length > 0),
        localeArbitrary,
        (post, locale) => {
          const { container } = render(
            <BlogPostCard post={post} locale={locale} />
          );

          // Property: When categories exist, at least one should be displayed
          const firstCategory = post.categories[0];
          expect(container.textContent).toContain(firstCategory.name[locale]);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should have a clickable link to the blog post', () => {
    fc.assert(
      fc.property(blogPostArbitrary, localeArbitrary, (post, locale) => {
        const { container } = render(
          <BlogPostCard post={post} locale={locale} />
        );

        // Property: The card should contain a link to the blog post
        const link = container.querySelector('a');
        expect(link).toBeTruthy();
        expect(link?.getAttribute('href')).toContain(
          `/${locale}/blog/${post.slug[locale].current}`
        );
      }),
      { numRuns: 50 }
    );
  });
});
