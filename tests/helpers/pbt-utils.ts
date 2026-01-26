import * as fc from 'fast-check';

/**
 * Arbitrary for generating valid email addresses
 */
export const emailArbitrary = fc
  .tuple(
    fc.stringMatching(/^[a-z0-9]+$/),
    fc.stringMatching(/^[a-z0-9]+$/),
    fc.constantFrom('com', 'org', 'net', 'io', 'co')
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

/**
 * Arbitrary for generating valid phone numbers
 */
export const phoneArbitrary = fc
  .tuple(
    fc.constantFrom('+1', '+33', '+44', '+237'),
    fc.integer({ min: 100000000, max: 999999999 })
  )
  .map(([code, number]) => `${code}${number}`);

/**
 * Arbitrary for generating valid URLs
 */
export const urlArbitrary = fc
  .tuple(
    fc.constantFrom('http', 'https'),
    fc.stringMatching(/^[a-z0-9-]+$/),
    fc.constantFrom('com', 'org', 'net', 'io'),
    fc.option(fc.stringMatching(/^[a-z0-9/-]+$/), { nil: '' })
  )
  .map(([protocol, domain, tld, path]) => 
    `${protocol}://${domain}.${tld}${path ? '/' + path : ''}`
  );

/**
 * Arbitrary for generating valid locale codes
 */
export const localeArbitrary = fc.constantFrom('en', 'fr');

/**
 * Arbitrary for generating valid product categories
 */
export const productCategoryArbitrary = fc.constantFrom(
  'cocoa',
  'coffee',
  'pepper',
  'wood',
  'corn'
);

/**
 * Arbitrary for generating valid Incoterms
 */
export const incotermsArbitrary = fc.constantFrom(
  'FOB',
  'CIF',
  'CFR',
  'EXW',
  'FCA',
  'DAP',
  'DDP'
);

/**
 * Arbitrary for generating valid country codes
 */
export const countryCodeArbitrary = fc.constantFrom(
  'US',
  'GB',
  'FR',
  'DE',
  'CM',
  'CN',
  'JP',
  'BR',
  'IN'
);

/**
 * Arbitrary for generating valid color hex codes
 */
export const colorHexArbitrary = fc
  .hexaString({ minLength: 6, maxLength: 6 })
  .map((hex) => `#${hex}`);

/**
 * Arbitrary for generating valid RGB colors
 */
export const rgbColorArbitrary = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map(([r, g, b]) => ({ r, g, b }));

/**
 * Arbitrary for generating valid viewport dimensions
 */
export const viewportArbitrary = fc.record({
  width: fc.integer({ min: 320, max: 3840 }),
  height: fc.integer({ min: 568, max: 2160 }),
});

/**
 * Arbitrary for generating valid image dimensions
 */
export const imageDimensionsArbitrary = fc.record({
  width: fc.integer({ min: 100, max: 4000 }),
  height: fc.integer({ min: 100, max: 4000 }),
});

/**
 * Arbitrary for generating valid file sizes (in bytes)
 */
export const fileSizeArbitrary = fc.integer({ min: 1024, max: 10485760 }); // 1KB to 10MB

/**
 * Arbitrary for generating valid dates in the future
 */
export const futureDateArbitrary = fc
  .integer({ min: 1, max: 365 })
  .map((days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  });

/**
 * Arbitrary for generating valid dates in the past
 */
export const pastDateArbitrary = fc
  .integer({ min: 1, max: 365 })
  .map((days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  });

/**
 * Arbitrary for generating valid quantity values
 */
export const quantityArbitrary = fc.record({
  value: fc.integer({ min: 1, max: 10000 }),
  unit: fc.constantFrom('kg', 'mt', 'container', 'ton'),
});

/**
 * Arbitrary for generating valid coordinates
 */
export const coordinatesArbitrary = fc.record({
  latitude: fc.double({ min: -90, max: 90 }),
  longitude: fc.double({ min: -180, max: 180 }),
});

/**
 * Arbitrary for generating valid HTML element IDs
 */
export const htmlIdArbitrary = fc
  .stringMatching(/^[a-z][a-z0-9-]*$/)
  .filter((id) => id.length >= 2 && id.length <= 50);

/**
 * Arbitrary for generating valid CSS class names
 */
export const cssClassArbitrary = fc
  .stringMatching(/^[a-z][a-z0-9-]*$/)
  .filter((className) => className.length >= 2 && className.length <= 50);
