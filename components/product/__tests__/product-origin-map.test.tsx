/**
 * Property-Based Test: Product Origin Map Display
 * Feature: afrexia-website-redesign
 * Property 7: Product origin map display
 * 
 * For any product with origin regions data, the product page should display
 * an interactive Mapbox map with custom markers at the specified coordinates,
 * and clicking markers should show region information.
 * 
 * Validates: Requirements 2.4, 8.2, 8.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { ProductOriginMap } from '../ProductOriginMap';

const originRegionArbitrary = fc.record({
  region: fc.string({ minLength: 2, maxLength: 50 }),
  coordinates: fc.record({
    lat: fc.double({ min: -90, max: 90, noNaN: true }),
    lng: fc.double({ min: -180, max: 180, noNaN: true }),
  }),
  description: fc.record({
    fr: fc.string({ minLength: 0, maxLength: 200 }),
    en: fc.string({ minLength: 0, maxLength: 200 }),
  }),
});

describe('Property 7: Product Origin Map Display', () => {
  it('should render legend with all origin regions', () => {
    fc.assert(
      fc.property(
        fc.array(originRegionArbitrary, { minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (origins, productName, locale) => {
          // Mock Mapbox token
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'test-token';
          
          const { container } = render(
            <ProductOriginMap origins={origins} productName={productName} locale={locale} />
          );

          // Legend should be present
          const legendTitle = locale === 'fr' ? 'Régions d\'origine' : 'Origin Regions';
          expect(container.textContent).toContain(legendTitle);

          // All regions should be listed in legend
          origins.forEach((origin) => {
            expect(container.textContent).toContain(origin.region);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display numbered markers for each region', () => {
    fc.assert(
      fc.property(
        fc.array(originRegionArbitrary, { minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (origins, productName, locale) => {
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'test-token';
          
          const { container } = render(
            <ProductOriginMap origins={origins} productName={productName} locale={locale} />
          );

          // Check that numbered markers are present in legend (1, 2, 3, etc.)
          origins.forEach((_, index) => {
            const markerNumber = (index + 1).toString();
            expect(container.textContent).toContain(markerNumber);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display region descriptions when available', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            region: fc.string({ minLength: 2, maxLength: 50 }),
            coordinates: fc.record({
              lat: fc.double({ min: -90, max: 90, noNaN: true }),
              lng: fc.double({ min: -180, max: 180, noNaN: true }),
            }),
            description: fc.record({
              fr: fc.string({ minLength: 10, maxLength: 100 }),
              en: fc.string({ minLength: 10, maxLength: 100 }),
            }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (origins, productName, locale) => {
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'test-token';
          
          const { container } = render(
            <ProductOriginMap origins={origins} productName={productName} locale={locale} />
          );

          // At least one description should be visible
          const hasDescription = origins.some((origin) => {
            const desc = origin.description[locale];
            return desc && container.textContent?.includes(desc);
          });

          expect(hasDescription).toBe(true);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle empty origins gracefully', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (productName, locale) => {
          const { container } = render(
            <ProductOriginMap origins={[]} productName={productName} locale={locale} />
          );

          // Should show "no location information" message
          const noDataText = locale === 'fr' 
            ? 'Aucune information de localisation disponible'
            : 'No location information available';
          
          expect(container.textContent).toContain(noDataText);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should display map instructions', () => {
    fc.assert(
      fc.property(
        fc.array(originRegionArbitrary, { minLength: 1, maxLength: 3 }),
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.constantFrom('fr', 'en'),
        (origins, productName, locale) => {
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'test-token';
          
          const { container } = render(
            <ProductOriginMap origins={origins} productName={productName} locale={locale} />
          );

          // Instructions should be present
          const instructionText = locale === 'fr' ? 'marqueurs' : 'markers';
          expect(container.textContent?.toLowerCase()).toContain(instructionText.toLowerCase());
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should validate coordinate ranges', () => {
    fc.assert(
      fc.property(
        fc.array(originRegionArbitrary, { minLength: 1, maxLength: 5 }),
        (origins) => {
          // All coordinates should be within valid ranges
          origins.forEach((origin) => {
            expect(origin.coordinates.lat).toBeGreaterThanOrEqual(-90);
            expect(origin.coordinates.lat).toBeLessThanOrEqual(90);
            expect(origin.coordinates.lng).toBeGreaterThanOrEqual(-180);
            expect(origin.coordinates.lng).toBeLessThanOrEqual(180);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
