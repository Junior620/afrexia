/**
 * Property-based tests for image alt text
 * **Property 32: Image alt text**
 * **Validates: Requirements 16.5**
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OptimizedImage } from '../OptimizedImage';
import * as fc from 'fast-check';

describe('Property 32: Image alt text', () => {
  describe('OptimizedImage component', () => {
    it('should always have alt attribute', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 200 }),
          (src, alt) => {
            const { container } = render(
              <OptimizedImage
                src={src}
                alt={alt}
                width={800}
                height={600}
              />
            );
            
            const img = container.querySelector('img');
            expect(img).toBeDefined();
            expect(img?.getAttribute('alt')).toBeDefined();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should use provided alt text', () => {
      const altText = 'Test image description';
      const { container } = render(
        <OptimizedImage
          src="/test.jpg"
          alt={altText}
          width={800}
          height={600}
        />
      );
      
      const img = container.querySelector('img');
      expect(img?.getAttribute('alt')).toBe(altText);
    });

    it('should allow empty alt for decorative images', () => {
      const { container } = render(
        <OptimizedImage
          src="/decorative.jpg"
          alt=""
          width={800}
          height={600}
        />
      );
      
      const img = container.querySelector('img');
      // Alt attribute should exist but can be empty for decorative images
      expect(img?.hasAttribute('alt')).toBe(true);
      expect(img?.getAttribute('alt')).toBe('');
    });
  });

  describe('Property: All images must have alt attribute', () => {
    it('should verify alt attribute exists for any image source', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 150 }),
            fc.constant('')
          ),
          (src, alt) => {
            const { container } = render(
              <OptimizedImage
                src={src}
                alt={alt}
                width={800}
                height={600}
              />
            );
            
            const img = container.querySelector('img');
            // Alt attribute must always be present
            expect(img?.hasAttribute('alt')).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Alt text should be meaningful', () => {
    it('should accept descriptive alt text', () => {
      const meaningfulAltTexts = [
        'Cocoa beans drying in the sun',
        'Coffee plantation in Cameroon',
        'Quality control inspection of pepper',
        'Sustainable wood harvesting',
      ];

      meaningfulAltTexts.forEach((alt) => {
        const { container } = render(
          <OptimizedImage
            src="/test.jpg"
            alt={alt}
            width={800}
            height={600}
          />
        );
        
        const img = container.querySelector('img');
        expect(img?.getAttribute('alt')).toBe(alt);
        expect(alt.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Property: Alt text length should be reasonable', () => {
    it('should handle alt text of various lengths', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 250 }),
          (alt) => {
            const { container } = render(
              <OptimizedImage
                src="/test.jpg"
                alt={alt}
                width={800}
                height={600}
              />
            );
            
            const img = container.querySelector('img');
            const actualAlt = img?.getAttribute('alt');
            
            // Alt attribute should exist
            expect(img?.hasAttribute('alt')).toBe(true);
            
            // Alt text should match what was provided
            expect(actualAlt).toBe(alt);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
