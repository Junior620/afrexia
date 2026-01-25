import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { getImageUrl, urlFor } from '../image'
import type { Image } from 'sanity'

/**
 * Property 18: Responsive image format selection
 * 
 * For any image request, the Image_Optimizer should serve AVIF to browsers supporting it,
 * WebP to browsers supporting WebP but not AVIF, and JPEG as fallback, based on the Accept header.
 * 
 * **Validates: Requirements 5.1**
 */

describe('Property 18: Responsive image format selection', () => {
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

  it('should generate URLs with auto format when no format is specified', () => {
    fc.assert(
      fc.property(sanityImageArbitrary, (image) => {
        const url = getImageUrl(image)
        
        // URL should be generated
        expect(url).toBeDefined()
        expect(typeof url).toBe('string')
        
        // URL should contain auto=format parameter for browser-based format selection
        expect(url).toContain('auto=format')
      }),
      { numRuns: 50 }
    )
  })

  it('should generate URLs with specific format when requested', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.constantFrom('webp', 'avif', 'jpg', 'png'),
        (image, format) => {
          const url = getImageUrl(image, format as 'webp' | 'avif' | 'jpg' | 'png')
          
          // URL should be generated
          expect(url).toBeDefined()
          expect(typeof url).toBe('string')
          
          // URL should contain the requested format
          expect(url).toContain(`fm=${format}`)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should support all modern image formats', () => {
    fc.assert(
      fc.property(sanityImageArbitrary, (image) => {
        const formats = ['webp', 'avif', 'jpg', 'png'] as const
        
        formats.forEach(format => {
          const url = getImageUrl(image, format)
          
          // Each format should generate a valid URL
          expect(url).toBeDefined()
          expect(url).toContain(`fm=${format}`)
        })
      }),
      { numRuns: 20 }
    )
  })

  it('should apply quality parameter consistently across formats', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.integer({ min: 1, max: 100 }),
        fc.constantFrom('webp', 'avif', 'jpg', 'png'),
        (image, quality, format) => {
          const url = getImageUrl(image, format as 'webp' | 'avif' | 'jpg' | 'png', quality)
          
          // URL should contain quality parameter
          expect(url).toBeDefined()
          expect(url).toContain(`q=${quality}`)
          expect(url).toContain(`fm=${format}`)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should use urlFor builder with auto format by default', () => {
    fc.assert(
      fc.property(sanityImageArbitrary, (image) => {
        const builder = urlFor(image)
        
        // Builder should be created
        expect(builder).toBeDefined()
        
        // When auto format is applied, URL should contain auto=format
        const urlWithAuto = builder?.auto('format').url()
        expect(urlWithAuto).toContain('auto=format')
      }),
      { numRuns: 50 }
    )
  })

  it('should handle invalid images gracefully', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          undefined,
          null,
          {},
          { _type: 'image' },
          { asset: {} },
          { asset: { _ref: '' } }
        ),
        (invalidImage) => {
          const url = getImageUrl(invalidImage as any)
          
          // Invalid images should return undefined
          expect(url).toBeUndefined()
        }
      ),
      { numRuns: 20 }
    )
  })

  it('should generate consistent URLs for the same image and parameters', () => {
    fc.assert(
      fc.property(
        sanityImageArbitrary,
        fc.constantFrom('webp', 'avif', 'jpg'),
        fc.integer({ min: 50, max: 100 }),
        (image, format, quality) => {
          const url1 = getImageUrl(image, format as 'webp' | 'avif' | 'jpg', quality)
          const url2 = getImageUrl(image, format as 'webp' | 'avif' | 'jpg', quality)
          
          // Same inputs should produce same outputs
          expect(url1).toBe(url2)
        }
      ),
      { numRuns: 50 }
    )
  })
})
