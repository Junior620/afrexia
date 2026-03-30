/**
 * Unit tests for SitemapGenerator
 * @see Requirements 1.11
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { entriesToXML } from '@/lib/seo/sitemapGenerator';
import type { SitemapEntry, SitemapSection } from '@/types/seo';

// ============================================================================
// Fixtures
// ============================================================================

function makeEntry(overrides: Partial<SitemapEntry> = {}): SitemapEntry {
  return {
    url: 'https://afrexia.com/fr/produits/cacao/export-netherlands',
    lastmod: '2024-01-15',
    changefreq: 'weekly',
    priority: 0.8,
    locale: 'fr',
    ...overrides,
  };
}

// ============================================================================
// entriesToXML
// ============================================================================

describe('entriesToXML', () => {
  it('generates valid XML with correct declaration', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [makeEntry()],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  });

  it('includes urlset element with sitemaps.org namespace', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [makeEntry()],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  });

  it('includes url elements for each entry', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [
          makeEntry({ url: 'https://afrexia.com/fr/produits/cacao/export-netherlands' }),
          makeEntry({ url: 'https://afrexia.com/en/produits/cacao/export-netherlands' }),
        ],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('https://afrexia.com/fr/produits/cacao/export-netherlands');
    expect(xml).toContain('https://afrexia.com/en/produits/cacao/export-netherlands');
  });

  it('includes lastmod in each url element', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [makeEntry({ lastmod: '2024-01-15' })],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
  });

  it('includes changefreq in each url element', () => {
    const sections: SitemapSection[] = [
      {
        name: 'price',
        entries: [makeEntry({ changefreq: 'daily' })],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('<changefreq>daily</changefreq>');
  });

  it('includes priority in each url element', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [makeEntry({ priority: 0.8 })],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('<priority>0.8</priority>');
  });

  it('formats priority with one decimal place', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [makeEntry({ priority: 0.7 })],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('<priority>0.7</priority>');
  });

  it('handles multiple sections with section comments', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [makeEntry({ url: 'https://afrexia.com/fr/produits/cacao/export-netherlands' })],
      },
      {
        name: 'price',
        entries: [makeEntry({ url: 'https://afrexia.com/fr/prix/cacao-cameroun', changefreq: 'daily', priority: 0.7 })],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('Section: product-country');
    expect(xml).toContain('Section: price');
  });

  it('skips empty sections', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [],
      },
      {
        name: 'price',
        entries: [makeEntry({ url: 'https://afrexia.com/fr/prix/cacao-cameroun' })],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).not.toContain('Section: product-country');
    expect(xml).toContain('Section: price');
  });

  it('escapes special XML characters in URLs', () => {
    const sections: SitemapSection[] = [
      {
        name: 'test',
        entries: [makeEntry({ url: 'https://afrexia.com/fr/produits/cacao&cafe/export' })],
      },
    ];

    const xml = entriesToXML(sections);
    expect(xml).toContain('&amp;');
    expect(xml).not.toContain('cacao&cafe');
  });

  it('handles empty sections array', () => {
    const xml = entriesToXML([]);
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('</urlset>');
  });

  it('generates well-formed XML structure', () => {
    const sections: SitemapSection[] = [
      {
        name: 'product-country',
        entries: [makeEntry()],
      },
    ];

    const xml = entriesToXML(sections);
    // Should have opening and closing urlset tags
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
    // Should have url elements
    expect(xml).toContain('<url>');
    expect(xml).toContain('</url>');
    expect(xml).toContain('<loc>');
    expect(xml).toContain('</loc>');
  });
});
