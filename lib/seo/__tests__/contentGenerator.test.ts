import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  applyLanguageFallback,
  markContentSource,
  calculateContentLength,
  meetsMinimumLength,
  calculateFallbackPercentage,
  logContentDistribution,
  generateDisclaimer,
  generateProductCountryIntro,
  generateContextualFAQs,
} from '../contentGenerator';
import type { Product, ExportCountry, ContentBlock, LocalizedString } from '@/types/seo';

// ============================================================================
// Fixtures
// ============================================================================

const fullLocalizedString: LocalizedString = {
  fr: 'Cacao',
  en: 'Cocoa',
  es: 'Cacao',
  de: 'Kakao',
  ru: 'Какао',
};

const frEnOnlyString: LocalizedString = {
  fr: 'Café',
  en: 'Coffee',
};

const product: Product = {
  _id: 'prod-1',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
  certifications: [
    {
      _id: 'cert-1',
      _type: 'certification',
      name: { fr: 'Bio', en: 'Organic' },
      slug: { current: 'organic' },
    },
  ],
};

const country: ExportCountry = {
  _id: 'country-1',
  _type: 'exportCountry',
  name: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Países Bajos', de: 'Niederlande', ru: 'Нидерланды' },
  slug: { current: 'netherlands' },
  code: 'NL',
  dataCompleteness: 85,
  approvedForSEO: true,
  averageTransitTime: { days: 21 },
  targetMarkets: ['food industry', 'chocolate manufacturers'],
};

function makeBlock(sourceType: ContentBlock['sourceType'], wordCount = 100): ContentBlock {
  return {
    content: 'word '.repeat(wordCount).trim(),
    sourceType,
    locale: 'fr',
    wordCount,
  };
}

// ============================================================================
// applyLanguageFallback
// ============================================================================

describe('applyLanguageFallback', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns the value for the requested locale when available', () => {
    expect(applyLanguageFallback(fullLocalizedString, 'fr')).toBe('Cacao');
    expect(applyLanguageFallback(fullLocalizedString, 'de')).toBe('Kakao');
    expect(applyLanguageFallback(fullLocalizedString, 'ru')).toBe('Какао');
  });

  it('falls back to English when the requested locale is missing', () => {
    const result = applyLanguageFallback(frEnOnlyString, 'de');
    expect(result).toBe('Coffee');
    expect(console.warn).toHaveBeenCalledOnce();
  });

  it('logs a warning when fallback is used', () => {
    applyLanguageFallback(frEnOnlyString, 'ru', 'product.name');
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('product.name')
    );
  });

  it('falls back to French as last resort when both locale and English are missing', () => {
    const frOnly: LocalizedString = { fr: 'Café', en: '' };
    // en is empty string — falsy, so should fall back to fr
    const result = applyLanguageFallback(frOnly, 'de');
    expect(result).toBe('Café');
  });
});

// ============================================================================
// markContentSource
// ============================================================================

describe('markContentSource', () => {
  it('creates a ContentBlock with correct sourceType and locale', () => {
    const block = markContentSource('Hello world test content here', 'sanity', 'en');
    expect(block.sourceType).toBe('sanity');
    expect(block.locale).toBe('en');
    expect(block.content).toBe('Hello world test content here');
  });

  it('calculates wordCount correctly', () => {
    const block = markContentSource('one two three four five', 'template', 'fr');
    expect(block.wordCount).toBe(5);
  });

  it('handles empty content', () => {
    const block = markContentSource('', 'editorial', 'es');
    expect(block.wordCount).toBe(0);
  });
});

// ============================================================================
// calculateContentLength
// ============================================================================

describe('calculateContentLength', () => {
  it('sums word counts across all blocks', () => {
    const blocks = [makeBlock('sanity', 200), makeBlock('template', 150), makeBlock('calculated', 100)];
    expect(calculateContentLength(blocks)).toBe(450);
  });

  it('returns 0 for empty array', () => {
    expect(calculateContentLength([])).toBe(0);
  });
});

// ============================================================================
// meetsMinimumLength
// ============================================================================

describe('meetsMinimumLength', () => {
  it('returns true when total words >= 500', () => {
    const blocks = [makeBlock('template', 300), makeBlock('sanity', 200)];
    expect(meetsMinimumLength(blocks)).toBe(true);
  });

  it('returns false when total words < 500', () => {
    const blocks = [makeBlock('template', 499)];
    expect(meetsMinimumLength(blocks)).toBe(false);
  });

  it('returns true at exactly 500 words', () => {
    const blocks = [makeBlock('template', 500)];
    expect(meetsMinimumLength(blocks)).toBe(true);
  });

  it('respects custom minWords parameter', () => {
    const blocks = [makeBlock('template', 100)];
    expect(meetsMinimumLength(blocks, 100)).toBe(true);
    expect(meetsMinimumLength(blocks, 101)).toBe(false);
  });
});

// ============================================================================
// calculateFallbackPercentage
// ============================================================================

describe('calculateFallbackPercentage', () => {
  it('returns 0 for empty array', () => {
    expect(calculateFallbackPercentage([])).toBe(0);
  });

  it('returns 100 when all blocks are template', () => {
    const blocks = [makeBlock('template'), makeBlock('template')];
    expect(calculateFallbackPercentage(blocks)).toBe(100);
  });

  it('returns 0 when no blocks are template', () => {
    const blocks = [makeBlock('sanity'), makeBlock('editorial')];
    expect(calculateFallbackPercentage(blocks)).toBe(0);
  });

  it('calculates correct percentage for mixed blocks', () => {
    const blocks = [makeBlock('template'), makeBlock('sanity'), makeBlock('sanity'), makeBlock('sanity')];
    expect(calculateFallbackPercentage(blocks)).toBe(25);
  });
});

// ============================================================================
// logContentDistribution
// ============================================================================

describe('logContentDistribution', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('logs distribution info to console', () => {
    const blocks = [makeBlock('sanity'), makeBlock('template'), makeBlock('calculated')];
    logContentDistribution(blocks, 'test-page');
    expect(console.info).toHaveBeenCalledOnce();
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('test-page'));
  });

  it('handles empty blocks gracefully', () => {
    logContentDistribution([], 'empty-page');
    expect(console.info).toHaveBeenCalled();
  });
});

// ============================================================================
// generateDisclaimer
// ============================================================================

describe('generateDisclaimer', () => {
  it('returns French price disclaimer', () => {
    const d = generateDisclaimer('price', 'fr');
    expect(d).toContain('Prix indicatif');
  });

  it('returns English delay disclaimer', () => {
    const d = generateDisclaimer('delay', 'en');
    expect(d).toContain('Indicative transit times');
  });

  it('returns German logistics disclaimer', () => {
    const d = generateDisclaimer('logistics', 'de');
    expect(d).toContain('Kosten');
  });

  it('returns disclaimers for all locales and types', () => {
    const locales = ['fr', 'en', 'es', 'de', 'ru'] as const;
    const types = ['price', 'delay', 'logistics'] as const;
    for (const locale of locales) {
      for (const type of types) {
        expect(generateDisclaimer(type, locale)).toBeTruthy();
      }
    }
  });
});

// ============================================================================
// generateProductCountryIntro
// ============================================================================

describe('generateProductCountryIntro', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns a ContentBlock with sourceType "template"', () => {
    const block = generateProductCountryIntro(product, country, 'fr');
    expect(block.sourceType).toBe('template');
  });

  it('returns content in the requested locale', () => {
    const block = generateProductCountryIntro(product, country, 'fr');
    expect(block.locale).toBe('fr');
  });

  it('includes product and country names in the content', () => {
    const block = generateProductCountryIntro(product, country, 'en');
    expect(block.content).toContain('Cocoa');
    expect(block.content).toContain('Netherlands');
  });

  it('generates different content for different product/country combinations', () => {
    const country2: ExportCountry = {
      ...country,
      _id: 'country-2',
      name: { fr: 'Allemagne', en: 'Germany' },
      slug: { current: 'germany' },
      code: 'DE',
    };
    const block1 = generateProductCountryIntro(product, country, 'fr');
    const block2 = generateProductCountryIntro(product, country2, 'fr');
    // Different countries → different content (at minimum different country names)
    expect(block1.content).not.toBe(block2.content);
  });

  it('has a meaningful word count', () => {
    const block = generateProductCountryIntro(product, country, 'fr');
    expect(block.wordCount).toBeGreaterThan(30);
  });
});

// ============================================================================
// generateContextualFAQs
// ============================================================================

describe('generateContextualFAQs', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns between 3 and 5 FAQs by default', () => {
    const faqs = generateContextualFAQs(product, country, 'fr');
    expect(faqs.length).toBeGreaterThanOrEqual(3);
    expect(faqs.length).toBeLessThanOrEqual(5);
  });

  it('clamps count to minimum 3', () => {
    const faqs = generateContextualFAQs(product, country, 'fr', 1);
    expect(faqs.length).toBe(3);
  });

  it('clamps count to maximum 5', () => {
    const faqs = generateContextualFAQs(product, country, 'fr', 10);
    expect(faqs.length).toBe(5);
  });

  it('returns FAQs with the correct locale', () => {
    const faqs = generateContextualFAQs(product, country, 'en');
    faqs.forEach((faq) => expect(faq.locale).toBe('en'));
  });

  it('each FAQ has a non-empty question and answer', () => {
    const faqs = generateContextualFAQs(product, country, 'fr');
    faqs.forEach((faq) => {
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.answer.length).toBeGreaterThan(0);
    });
  });

  it('generates FAQs for all supported locales', () => {
    const locales = ['fr', 'en', 'es', 'de', 'ru'] as const;
    for (const locale of locales) {
      const faqs = generateContextualFAQs(product, country, locale);
      expect(faqs.length).toBeGreaterThanOrEqual(3);
    }
  });
});
