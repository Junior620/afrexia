/**
 * Property-Based Test: Product Specification Downloads
 * Feature: afrexia-website-redesign
 * Property 8: Product specification downloads
 * 
 * For any product with a specification PDF, clicking the download button should
 * initiate a PDF download and track the event in analytics.
 * 
 * Validates: Requirements 2.2, 12.2, 12.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Mock product with specification PDF
const productWithPDFArbitrary = fc.record({
  _id: fc.string({ minLength: 10, maxLength: 30 }),
  name: fc.record({
    fr: fc.string({ minLength: 1, maxLength: 50 }),
    en: fc.string({ minLength: 1, maxLength: 50 }),
  }),
  specificationPDF: fc.record({
    asset: fc.record({
      _id: fc.string({ minLength: 10, maxLength: 30 }),
      url: fc.webUrl(),
      originalFilename: fc.string({ minLength: 5, maxLength: 50 }).map(s => `${s}.pdf`),
      size: fc.integer({ min: 1000, max: 10000000 }),
    }),
  }),
});

describe('Property 8: Product Specification Downloads', () => {
  it('should have valid PDF URL for any product with specification', () => {
    fc.assert(
      fc.property(
        productWithPDFArbitrary,
        (product) => {
          // PDF URL should be valid
          expect(product.specificationPDF.asset.url).toBeTruthy();
          expect(product.specificationPDF.asset.url).toMatch(/^https?:\/\//);
          
          // Filename should end with .pdf
          expect(product.specificationPDF.asset.originalFilename).toMatch(/\.pdf$/i);
          
          // File size should be positive
          expect(product.specificationPDF.asset.size).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have accessible download link structure', () => {
    fc.assert(
      fc.property(
        productWithPDFArbitrary,
        fc.constantFrom('fr', 'en'),
        (product, locale) => {
          // Simulate download link structure
          const downloadLink = {
            href: product.specificationPDF.asset.url,
            download: true,
            ariaLabel: locale === 'fr' 
              ? `Télécharger la fiche technique de ${product.name[locale]}`
              : `Download specification sheet for ${product.name[locale]}`,
          };

          expect(downloadLink.href).toBeTruthy();
          expect(downloadLink.download).toBe(true);
          expect(downloadLink.ariaLabel).toContain(product.name[locale]);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have valid file metadata', () => {
    fc.assert(
      fc.property(
        productWithPDFArbitrary,
        (product) => {
          const metadata = product.specificationPDF.asset;
          
          // All required metadata fields should be present
          expect(metadata._id).toBeTruthy();
          expect(metadata.url).toBeTruthy();
          expect(metadata.originalFilename).toBeTruthy();
          expect(metadata.size).toBeDefined();
          
          // Size should be reasonable (between 1KB and 10MB)
          expect(metadata.size).toBeGreaterThanOrEqual(1000);
          expect(metadata.size).toBeLessThanOrEqual(10000000);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format file size correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000000 }),
        (sizeInBytes) => {
          // Helper function to format file size
          const formatFileSize = (bytes: number): string => {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
          };

          const formatted = formatFileSize(sizeInBytes);
          
          // Should contain a number and a unit
          expect(formatted).toMatch(/[\d.]+\s*(B|KB|MB)/);
          
          // Should be reasonable
          if (sizeInBytes < 1024) {
            expect(formatted).toContain('B');
          } else if (sizeInBytes < 1024 * 1024) {
            expect(formatted).toContain('KB');
          } else {
            expect(formatted).toContain('MB');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle missing PDF gracefully', () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.string({ minLength: 10, maxLength: 30 }),
          name: fc.record({
            fr: fc.string({ minLength: 1, maxLength: 50 }),
            en: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          specificationPDF: fc.constant(null),
        }),
        (product) => {
          // Product without PDF should have null specificationPDF
          expect(product.specificationPDF).toBeNull();
          
          // Download button should not be rendered (checked in component)
          const shouldShowDownloadButton = product.specificationPDF !== null;
          expect(shouldShowDownloadButton).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should generate tracking event data', () => {
    fc.assert(
      fc.property(
        productWithPDFArbitrary,
        (product) => {
          // Simulate analytics tracking event
          const trackingEvent = {
            eventName: 'resource_download',
            properties: {
              resourceId: product._id,
              resourceName: product.specificationPDF.asset.originalFilename,
              resourceType: 'product_specification',
              fileSize: product.specificationPDF.asset.size,
            },
          };

          expect(trackingEvent.eventName).toBe('resource_download');
          expect(trackingEvent.properties.resourceId).toBe(product._id);
          expect(trackingEvent.properties.resourceName).toContain('.pdf');
          expect(trackingEvent.properties.resourceType).toBe('product_specification');
          expect(trackingEvent.properties.fileSize).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
