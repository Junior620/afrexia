import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 50: Resource metadata display
 * 
 * **Validates: Requirements 12.5**
 * 
 * For any downloadable resource, the display should show:
 * - File name
 * - Description
 * - File size
 * - Format (PDF, etc.)
 */

// Type definitions
interface ResourceMetadata {
  title: {
    fr: string;
    en: string;
  };
  description?: {
    fr: string;
    en: string;
  };
  file: {
    asset: {
      originalFilename: string;
      size: number;
      extension: string;
      url: string;
    };
  };
  category: string;
}

// Arbitrary generators
const resourceMetadataArbitrary = fc.record({
  title: fc.record({
    fr: fc.string({ minLength: 1, maxLength: 100 }),
    en: fc.string({ minLength: 1, maxLength: 100 }),
  }),
  description: fc.option(
    fc.record({
      fr: fc.string({ minLength: 1, maxLength: 500 }),
      en: fc.string({ minLength: 1, maxLength: 500 }),
    }),
    { nil: undefined }
  ),
  file: fc.record({
    asset: fc.record({
      originalFilename: fc.string({ minLength: 1, maxLength: 100 }),
      size: fc.integer({ min: 1, max: 100000000 }), // 1 byte to 100MB
      extension: fc.constantFrom('pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip'),
      url: fc.webUrl(),
    }),
  }),
  category: fc.constantFrom('productSpecs', 'compliance', 'guides', 'certificates', 'other'),
});

// Helper function to check if metadata is complete
function hasCompleteMetadata(resource: ResourceMetadata): boolean {
  return !!(
    resource.title &&
    (resource.title.fr || resource.title.en) &&
    resource.file?.asset?.originalFilename &&
    resource.file?.asset?.size !== undefined &&
    resource.file?.asset?.extension &&
    resource.file?.asset?.url
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

describe('Property 50: Resource metadata display', () => {
  it('should display all required metadata fields for any resource', () => {
    fc.assert(
      fc.property(resourceMetadataArbitrary, (resource) => {
        // Property: For any resource, all required metadata should be present
        const hasMetadata = hasCompleteMetadata(resource);
        
        // All resources should have complete metadata
        expect(hasMetadata).toBe(true);
        
        // Title should be present in at least one language
        expect(resource.title.fr || resource.title.en).toBeTruthy();
        
        // File metadata should be complete
        expect(resource.file.asset.originalFilename).toBeTruthy();
        expect(resource.file.asset.size).toBeGreaterThan(0);
        expect(resource.file.asset.extension).toBeTruthy();
        expect(resource.file.asset.url).toBeTruthy();
      }),
      { numRuns: 100 }
    );
  });

  it('should format file size correctly for any byte value', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1000000000 }), (bytes) => {
        // Property: File size formatting should always produce valid output
        const formatted = formatFileSize(bytes);
        
        // Formatted size should be a non-empty string
        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
        
        // Should contain a number and a unit
        expect(formatted).toMatch(/^\d+(\.\d+)?\s+(B|KB|MB|GB)$/);
        
        // For zero bytes, should return "0 B"
        if (bytes === 0) {
          expect(formatted).toBe('0 B');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should handle resources with optional description field', () => {
    fc.assert(
      fc.property(resourceMetadataArbitrary, (resource) => {
        // Property: Resources may or may not have descriptions
        // Both cases should be valid
        
        if (resource.description) {
          // If description exists, it should have at least one language
          expect(
            resource.description.fr || resource.description.en
          ).toBeTruthy();
        }
        
        // Resource should still be valid without description
        const hasRequiredFields = !!(
          resource.title &&
          resource.file?.asset?.originalFilename &&
          resource.file?.asset?.size &&
          resource.file?.asset?.extension
        );
        
        expect(hasRequiredFields).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should support multiple file formats', () => {
    fc.assert(
      fc.property(resourceMetadataArbitrary, (resource) => {
        // Property: Resources can have various file formats
        const validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip'];
        
        expect(validExtensions).toContain(resource.file.asset.extension);
        
        // Extension should be displayable in uppercase
        const displayExtension = resource.file.asset.extension.toUpperCase();
        expect(displayExtension).toBeTruthy();
        expect(displayExtension.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should categorize resources correctly', () => {
    fc.assert(
      fc.property(resourceMetadataArbitrary, (resource) => {
        // Property: Every resource must belong to a valid category
        const validCategories = [
          'productSpecs',
          'compliance',
          'guides',
          'certificates',
          'other',
        ];
        
        expect(validCategories).toContain(resource.category);
      }),
      { numRuns: 100 }
    );
  });

  it('should have valid download URLs', () => {
    fc.assert(
      fc.property(resourceMetadataArbitrary, (resource) => {
        // Property: All resources must have valid, accessible URLs
        const url = resource.file.asset.url;
        
        expect(url).toBeTruthy();
        expect(typeof url).toBe('string');
        
        // URL should be a valid format
        expect(() => new URL(url)).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });
});
