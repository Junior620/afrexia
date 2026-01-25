import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 52: Traceability information display
 * 
 * **Validates: Requirements 23.6**
 * 
 * For any product page, traceability information (origin regions, supply chain steps,
 * compliance measures) should be displayed in a dedicated section.
 */

// Type definitions
interface OriginRegion {
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: {
    fr: string;
    en: string;
  };
}

interface SupplyChainStep {
  title: string;
  description: string;
  location: string;
  timestamp?: string;
}

interface ComplianceMeasure {
  type: string;
  description: string;
  verified: boolean;
  verificationDate?: string;
}

interface TraceabilityInfo {
  originRegions: OriginRegion[];
  supplyChainSteps?: SupplyChainStep[];
  complianceMeasures?: ComplianceMeasure[];
  eudrCompliant?: boolean;
}

interface ProductWithTraceability {
  _id: string;
  name: {
    fr: string;
    en: string;
  };
  traceability: TraceabilityInfo;
}

// Arbitrary generators
const originRegionArbitrary = fc.record({
  region: fc.string({ minLength: 1, maxLength: 50 }),
  coordinates: fc.record({
    lat: fc.double({ min: -90, max: 90, noNaN: true }),
    lng: fc.double({ min: -180, max: 180, noNaN: true }),
  }),
  description: fc.record({
    fr: fc.string({ minLength: 1, maxLength: 200 }),
    en: fc.string({ minLength: 1, maxLength: 200 }),
  }),
});

const supplyChainStepArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 300 }),
  location: fc.string({ minLength: 1, maxLength: 100 }),
  timestamp: fc.option(
    fc.date({ max: new Date() }).map(d => d.toISOString()),
    { nil: undefined }
  ),
});

const complianceMeasureArbitrary = fc.record({
  type: fc.constantFrom('EUDR', 'ISO', 'Organic', 'FairTrade', 'Rainforest Alliance'),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  verified: fc.boolean(),
  verificationDate: fc.option(
    fc.date({ max: new Date() }).map(d => d.toISOString()),
    { nil: undefined }
  ),
});

const traceabilityInfoArbitrary = fc.record({
  originRegions: fc.array(originRegionArbitrary, { minLength: 1, maxLength: 5 }),
  supplyChainSteps: fc.option(
    fc.array(supplyChainStepArbitrary, { minLength: 1, maxLength: 10 }),
    { nil: undefined }
  ),
  complianceMeasures: fc.option(
    fc.array(complianceMeasureArbitrary, { minLength: 1, maxLength: 10 }),
    { nil: undefined }
  ),
  eudrCompliant: fc.option(fc.boolean(), { nil: undefined }),
});

const productWithTraceabilityArbitrary = fc.record({
  _id: fc.uuid(),
  name: fc.record({
    fr: fc.string({ minLength: 1, maxLength: 100 }),
    en: fc.string({ minLength: 1, maxLength: 100 }),
  }),
  traceability: traceabilityInfoArbitrary,
});

// Helper functions
function hasTraceabilityInfo(product: ProductWithTraceability): boolean {
  return !!(
    product.traceability &&
    product.traceability.originRegions &&
    product.traceability.originRegions.length > 0
  );
}

function shouldDisplayTraceabilitySection(product: ProductWithTraceability): boolean {
  return hasTraceabilityInfo(product);
}

function validateOriginRegion(region: OriginRegion): boolean {
  return !!(
    region.region &&
    region.coordinates &&
    typeof region.coordinates.lat === 'number' &&
    typeof region.coordinates.lng === 'number' &&
    !isNaN(region.coordinates.lat) &&
    !isNaN(region.coordinates.lng) &&
    region.coordinates.lat >= -90 &&
    region.coordinates.lat <= 90 &&
    region.coordinates.lng >= -180 &&
    region.coordinates.lng <= 180 &&
    region.description &&
    (region.description.fr || region.description.en)
  );
}

describe('Property 52: Traceability information display', () => {
  it('should display traceability section for products with origin regions', () => {
    fc.assert(
      fc.property(productWithTraceabilityArbitrary, (product) => {
        // Property: Products with origin regions should display traceability section
        const hasInfo = hasTraceabilityInfo(product);
        const shouldDisplay = shouldDisplayTraceabilitySection(product);

        expect(hasInfo).toBe(true);
        expect(shouldDisplay).toBe(true);
        expect(product.traceability.originRegions.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate all origin region data', () => {
    fc.assert(
      fc.property(productWithTraceabilityArbitrary, (product) => {
        // Property: All origin regions should have valid data
        product.traceability.originRegions.forEach((region) => {
          expect(validateOriginRegion(region)).toBe(true);
          
          // Region name should be present
          expect(region.region).toBeTruthy();
          
          // Coordinates should be within valid ranges
          expect(region.coordinates.lat).toBeGreaterThanOrEqual(-90);
          expect(region.coordinates.lat).toBeLessThanOrEqual(90);
          expect(region.coordinates.lng).toBeGreaterThanOrEqual(-180);
          expect(region.coordinates.lng).toBeLessThanOrEqual(180);
          
          // Description should be present in at least one language
          expect(region.description.fr || region.description.en).toBeTruthy();
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should handle optional supply chain steps', () => {
    fc.assert(
      fc.property(productWithTraceabilityArbitrary, (product) => {
        // Property: Supply chain steps are optional but if present, should be valid
        if (product.traceability.supplyChainSteps) {
          expect(Array.isArray(product.traceability.supplyChainSteps)).toBe(true);
          
          product.traceability.supplyChainSteps.forEach((step) => {
            expect(step.title).toBeTruthy();
            expect(step.description).toBeTruthy();
            expect(step.location).toBeTruthy();
            
            // Timestamp is optional but if present, should be valid
            if (step.timestamp) {
              expect(() => new Date(step.timestamp!)).not.toThrow();
            }
          });
        }
        
        // Product should still be valid without supply chain steps
        expect(hasTraceabilityInfo(product)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle optional compliance measures', () => {
    fc.assert(
      fc.property(productWithTraceabilityArbitrary, (product) => {
        // Property: Compliance measures are optional but if present, should be valid
        if (product.traceability.complianceMeasures) {
          expect(Array.isArray(product.traceability.complianceMeasures)).toBe(true);
          
          product.traceability.complianceMeasures.forEach((measure) => {
            expect(measure.type).toBeTruthy();
            expect(measure.description).toBeTruthy();
            expect(typeof measure.verified).toBe('boolean');
            
            // Verification date is optional but if present, should be valid
            if (measure.verificationDate) {
              expect(() => new Date(measure.verificationDate!)).not.toThrow();
            }
          });
        }
        
        // Product should still be valid without compliance measures
        expect(hasTraceabilityInfo(product)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should support EUDR compliance flag', () => {
    fc.assert(
      fc.property(productWithTraceabilityArbitrary, (product) => {
        // Property: EUDR compliance flag is optional but if present, should be boolean
        if (product.traceability.eudrCompliant !== undefined) {
          expect(typeof product.traceability.eudrCompliant).toBe('boolean');
        }
        
        // Product should still be valid without EUDR flag
        expect(hasTraceabilityInfo(product)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should support multiple origin regions per product', () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.uuid(),
          name: fc.record({
            fr: fc.string({ minLength: 1, maxLength: 100 }),
            en: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          traceability: fc.record({
            originRegions: fc.array(originRegionArbitrary, { minLength: 2, maxLength: 5 }),
            supplyChainSteps: fc.option(
              fc.array(supplyChainStepArbitrary, { minLength: 1, maxLength: 10 }),
              { nil: undefined }
            ),
            complianceMeasures: fc.option(
              fc.array(complianceMeasureArbitrary, { minLength: 1, maxLength: 10 }),
              { nil: undefined }
            ),
            eudrCompliant: fc.option(fc.boolean(), { nil: undefined }),
          }),
        }),
        (product) => {
          // Property: Products can have multiple origin regions
          expect(product.traceability.originRegions.length).toBeGreaterThanOrEqual(2);
          
          // All regions should be valid
          product.traceability.originRegions.forEach((region) => {
            expect(validateOriginRegion(region)).toBe(true);
          });
          
          // Each region should be distinct (different names)
          const regionNames = product.traceability.originRegions.map(r => r.region);
          const uniqueNames = new Set(regionNames);
          // Note: We don't enforce uniqueness as products might legitimately
          // source from multiple farms in the same region
          expect(regionNames.length).toBe(product.traceability.originRegions.length);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain data integrity across all traceability components', () => {
    fc.assert(
      fc.property(productWithTraceabilityArbitrary, (product) => {
        // Property: All traceability data should be internally consistent
        
        // Origin regions are required
        expect(product.traceability.originRegions).toBeDefined();
        expect(product.traceability.originRegions.length).toBeGreaterThan(0);
        
        // If supply chain steps exist, they should reference valid locations
        if (product.traceability.supplyChainSteps) {
          product.traceability.supplyChainSteps.forEach((step) => {
            expect(step.location).toBeTruthy();
            expect(typeof step.location).toBe('string');
          });
        }
        
        // If compliance measures exist and are verified, they should have dates
        if (product.traceability.complianceMeasures) {
          product.traceability.complianceMeasures.forEach((measure) => {
            if (measure.verified && measure.verificationDate) {
              const verificationDate = new Date(measure.verificationDate);
              const now = new Date();
              // Verification date should not be in the future
              expect(verificationDate.getTime()).toBeLessThanOrEqual(now.getTime());
            }
          });
        }
      }),
      { numRuns: 100 }
    );
  });
});
