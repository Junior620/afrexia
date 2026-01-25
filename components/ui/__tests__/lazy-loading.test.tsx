import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { OptimizedImage } from '../OptimizedImage'
import type { Image } from 'sanity'

/**
 * Property 19: Lazy loading implementation
 * 
 * For any image not in the initial viewport (below the fold), the loading attribute
 * should be set to "lazy" to defer loading until the image approaches the viewport.
 * 
 * **Validates: Requirements 5.2**
 */

describe('Property 19: Lazy loading implementation', () => {
  // Generator for valid Sanity image objects with proper format
  const sanityImageArbitrary = fc.record({
    _type: fc.constant('image'),
    asset: fc.record({
      _ref: fc.tuple(
        fc.hexaString({ minLength: 20, maxLength: 40 }),
        fc.integer({ min: 100, max: 4000 }),
        fc.integer({ min: 100, max: 4000 }),
        fc.constantFrom('jpg', 'png', 'webp')
      ).map(([hash, width, height, format]) => 
        `image-${hash}-${width}x${height}-${format}`
      ),
      _type: fc.constant('reference'),
    }),
  }) as fc.Arbitrary<Image>

  it('should apply lazy loading when priority is false', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.integer({ min: 100, max: 2000 }),
        fc.integer({ min: 100, max: 2000 }),
        (image, alt, width, height) => {
          const { container } = render(
            <OptimizedImage
              image={image}
              alt={alt}
              width={width}
              height={height}
              priority={false}
            />
          )

          const img = container.querySelector('img')
          
          // Image should exist
          expect(img).toBeTruthy()
          
          // Loading attribute should be "lazy" when priority is false
          expect(img?.getAttribute('loading')).toBe('lazy')
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should not apply lazy loading when priority is true', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.integer({ min: 100, max: 2000 }),
        fc.integer({ min: 100, max: 2000 }),
        (image, alt, width, height) => {
          const { container } = render(
            <OptimizedImage
              image={image}
              alt={alt}
              width={width}
              height={height}
              priority={true}
            />
          )

          const img = container.querySelector('img')
          
          // Image should exist
          expect(img).toBeTruthy()
          
          // Loading attribute should not be "lazy" when priority is true
          // Next.js Image component doesn't set loading attribute when priority is true
          expect(img?.getAttribute('loading')).not.toBe('lazy')
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should apply lazy loading by default when priority is not specified', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.integer({ min: 100, max: 2000 }),
        fc.integer({ min: 100, max: 2000 }),
        (image, alt, width, height) => {
          const { container } = render(
            <OptimizedImage
              image={image}
              alt={alt}
              width={width}
              height={height}
            />
          )

          const img = container.querySelector('img')
          
          // Image should exist
          expect(img).toBeTruthy()
          
          // Loading attribute should be "lazy" by default (priority defaults to false)
          expect(img?.getAttribute('loading')).toBe('lazy')
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should apply lazy loading for fill images when priority is false', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.string({ minLength: 1, maxLength: 100 }),
        (image, alt) => {
          const { container } = render(
            <OptimizedImage
              image={image}
              alt={alt}
              fill={true}
              priority={false}
            />
          )

          const img = container.querySelector('img')
          
          // Image should exist
          expect(img).toBeTruthy()
          
          // Loading attribute should be "lazy" for fill images when priority is false
          expect(img?.getAttribute('loading')).toBe('lazy')
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should handle invalid images gracefully without lazy loading errors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(undefined, null),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.integer({ min: 100, max: 2000 }),
        fc.integer({ min: 100, max: 2000 }),
        (invalidImage, alt, width, height) => {
          const { container } = render(
            <OptimizedImage
              image={invalidImage as any}
              alt={alt}
              width={width}
              height={height}
              priority={false}
            />
          )

          const img = container.querySelector('img')
          
          // Image should still render with fallback
          expect(img).toBeTruthy()
          
          // Should still have lazy loading applied
          expect(img?.getAttribute('loading')).toBe('lazy')
        }
      ),
      { numRuns: 20 }
    )
  })

  it('should consistently apply lazy loading across different image dimensions', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.integer({ min: 50, max: 5000 }),
        fc.integer({ min: 50, max: 5000 }),
        (image, alt, width, height) => {
          const { container } = render(
            <OptimizedImage
              image={image}
              alt={alt}
              width={width}
              height={height}
              priority={false}
            />
          )

          const img = container.querySelector('img')
          
          // Lazy loading should be applied regardless of dimensions
          expect(img?.getAttribute('loading')).toBe('lazy')
        }
      ),
      { numRuns: 50 }
    )
  })
})
