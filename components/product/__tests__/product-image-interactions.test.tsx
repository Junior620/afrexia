/**
 * Property-Based Test: Product Image Interactions
 * Feature: afrexia-website-redesign
 * Property 6: Product image interactions
 * 
 * For any product image in the gallery, clicking should open a lightbox with
 * full-resolution image, keyboard navigation support, and proper alt text.
 * 
 * Validates: Requirements 2.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import { ProductGallery } from '../ProductGallery';

// Valid Sanity image reference format
const validImageRefArbitrary = fc.tuple(
  fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'), { minLength: 20, maxLength: 30 }),
  fc.integer({ min: 100, max: 5000 }),
  fc.integer({ min: 100, max: 5000 }),
  fc.constantFrom('jpg', 'png', 'webp')
).map(([id, width, height, format]) => `image-${id}-${width}x${height}-${format}`);

const validImageArbitrary = fc.record({
  asset: fc.record({
    _ref: validImageRefArbitrary,
    _type: fc.constant('reference'),
  }),
  alt: fc.string({ minLength: 1, maxLength: 100 }),
  caption: fc.record({
    fr: fc.string({ minLength: 0, maxLength: 200 }),
    en: fc.string({ minLength: 0, maxLength: 200 }),
  }),
});

describe('Property 6: Product Image Interactions', () => {
  it('should display proper alt text for all images', () => {
    fc.assert(
      fc.property(
        fc.array(validImageArbitrary, { minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (images, productName, locale) => {
          const { container } = render(
            <ProductGallery images={images} productName={productName} locale={locale} />
          );

          // Main image should have alt text
          const mainImage = container.querySelector('img');
          expect(mainImage).toBeTruthy();
          
          const altText = mainImage?.getAttribute('alt');
          expect(altText).toBeTruthy();
          expect(altText!.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should open lightbox when main image is clicked', () => {
    fc.assert(
      fc.property(
        fc.array(validImageArbitrary, { minLength: 1, maxLength: 3 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (images, productName, locale) => {
          const { container } = render(
            <ProductGallery images={images} productName={productName} locale={locale} />
          );

          // Click on main image
          const mainImage = container.querySelector('img');
          expect(mainImage).toBeTruthy();
          
          fireEvent.click(mainImage!);

          // Lightbox should be visible (check for fixed positioning or z-50 class)
          const lightbox = container.querySelector('[class*="fixed"]');
          expect(lightbox).toBeTruthy();
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should support keyboard navigation in lightbox', () => {
    fc.assert(
      fc.property(
        fc.array(validImageArbitrary, { minLength: 2, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (images, productName, locale) => {
          const { container } = render(
            <ProductGallery images={images} productName={productName} locale={locale} />
          );

          // Open lightbox
          const mainImage = container.querySelector('img');
          fireEvent.click(mainImage!);

          // Simulate Escape key
          fireEvent.keyDown(window, { key: 'Escape' });

          // Lightbox should be closed (no fixed element)
          const lightboxAfterEscape = container.querySelector('[class*="fixed"][class*="z-50"]');
          expect(lightboxAfterEscape).toBeFalsy();
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display image counter when multiple images exist', () => {
    fc.assert(
      fc.property(
        fc.array(validImageArbitrary, { minLength: 2, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (images, productName, locale) => {
          const { container } = render(
            <ProductGallery images={images} productName={productName} locale={locale} />
          );

          // Image counter should show "1 / N"
          const counterText = `1 / ${images.length}`;
          expect(container.textContent).toContain(counterText);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display thumbnails for multiple images', () => {
    fc.assert(
      fc.property(
        fc.array(validImageArbitrary, { minLength: 2, maxLength: 6 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (images, productName, locale) => {
          const { container } = render(
            <ProductGallery images={images} productName={productName} locale={locale} />
          );

          // Should have thumbnail buttons
          const thumbnails = container.querySelectorAll('button[aria-label*="image"]');
          expect(thumbnails.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });
});
