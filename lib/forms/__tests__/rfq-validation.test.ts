import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { z } from 'zod';
import { rfqFormSchema, RFQFormData } from '../rfq-schema';

/**
 * Property 9: RFQ form validation
 * Validates: Requirements 3.3
 *
 * This property ensures that the RFQ form validation correctly accepts valid data
 * and rejects invalid data according to the defined schema rules.
 */

describe('Property 9: RFQ form validation', () => {
  // Arbitraries for generating test data
  const validFirstNameArb = fc.string({ minLength: 2, maxLength: 50 }).filter(
    (s) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(s) && s.trim().length >= 2
  );

  const validLastNameArb = fc.string({ minLength: 2, maxLength: 50 }).filter(
    (s) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(s) && s.trim().length >= 2
  );

  const validEmailArb = fc.emailAddress().filter(email => {
    // Ensure email passes Zod's email validation
    try {
      z.string().email().parse(email);
      return true;
    } catch {
      return false;
    }
  });

  const validPhoneArb = fc
    .integer({ min: 10000000, max: 999999999999999 })
    .map((n) => `+${n}`);

  const validCompanyArb = fc
    .string({ minLength: 1, maxLength: 100 })
    .map(s => s.trim() || 'Company')
    .filter((s) => s.length >= 1);

  const validCountryArb = fc
    .string({ minLength: 1, maxLength: 100 })
    .map(s => s.trim() || 'Country')
    .filter((s) => s.length >= 1);

  const validProductIdArb = fc
    .string({ minLength: 1, maxLength: 50 })
    .map(s => s.trim() || 'product-1')
    .filter((s) => s.length >= 1);

  const validQuantityArb = fc.double({ min: 0.01, max: 1000000, noNaN: true }).filter(n => !isNaN(n));

  const quantityUnitArb = fc.constantFrom('kg', 'mt', 'container');

  const incotermArb = fc.constantFrom('FOB', 'CIF', 'CFR', 'EXW', 'FCA');

  const validDestinationPortArb = fc
    .string({ minLength: 1, maxLength: 100 })
    .map(s => s.trim() || 'Port')
    .filter((s) => s.length >= 1);

  const futureDateArb = fc
    .date({ min: new Date(), max: new Date('2030-12-31') })
    .map((d) => d.toISOString().split('T')[0]);

  const validMessageArb = fc.string({ maxLength: 2000 });

  const validRFQDataArb: fc.Arbitrary<RFQFormData> = fc.record({
    firstName: validFirstNameArb,
    lastName: validLastNameArb,
    email: validEmailArb,
    phone: validPhoneArb,
    company: validCompanyArb,
    country: validCountryArb,
    productId: validProductIdArb,
    quantity: validQuantityArb,
    quantityUnit: quantityUnitArb,
    incoterm: incotermArb,
    destinationPort: validDestinationPortArb,
    targetDate: futureDateArb,
    message: fc.option(validMessageArb, { nil: undefined }),
    gdprConsent: fc.constant(true),
    recaptchaToken: fc.option(fc.string(), { nil: undefined }),
  });

  it('should accept all valid RFQ form data', () => {
    fc.assert(
      fc.property(validRFQDataArb, (data) => {
        const result = rfqFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject data with invalid email format', () => {
    fc.assert(
      fc.property(
        validRFQDataArb,
        fc.string().filter((s) => !s.includes('@')),
        (validData, invalidEmail) => {
          const data = { ...validData, email: invalidEmail };
          const result = rfqFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with invalid phone format', () => {
    fc.assert(
      fc.property(
        validRFQDataArb,
        fc.string({ minLength: 1, maxLength: 5 }),
        (validData, invalidPhone) => {
          const data = { ...validData, phone: invalidPhone };
          const result = rfqFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with negative quantity', () => {
    fc.assert(
      fc.property(
        validRFQDataArb,
        fc.double({ max: 0 }),
        (validData, negativeQuantity) => {
          const data = { ...validData, quantity: negativeQuantity };
          const result = rfqFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with past target date', () => {
    fc.assert(
      fc.property(validRFQDataArb, (validData) => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        const data = {
          ...validData,
          targetDate: pastDate.toISOString().split('T')[0],
        };
        const result = rfqFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should reject data without GDPR consent', () => {
    fc.assert(
      fc.property(validRFQDataArb, (validData) => {
        const data = { ...validData, gdprConsent: false };
        const result = rfqFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should reject data with invalid quantity unit', () => {
    fc.assert(
      fc.property(
        validRFQDataArb,
        fc.string().filter((s) => !['kg', 'mt', 'container'].includes(s)),
        (validData, invalidUnit) => {
          const data = { ...validData, quantityUnit: invalidUnit as any };
          const result = rfqFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with invalid Incoterm', () => {
    fc.assert(
      fc.property(
        validRFQDataArb,
        fc.string().filter((s) => !['FOB', 'CIF', 'CFR', 'EXW', 'FCA'].includes(s)),
        (validData, invalidIncoterm) => {
          const data = { ...validData, incoterm: invalidIncoterm as any };
          const result = rfqFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with too short first name', () => {
    fc.assert(
      fc.property(
        validRFQDataArb,
        fc.string({ maxLength: 1 }),
        (validData, shortName) => {
          const data = { ...validData, firstName: shortName };
          const result = rfqFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with too long message', () => {
    fc.assert(
      fc.property(
        validRFQDataArb,
        fc.string({ minLength: 2001 }),
        (validData, longMessage) => {
          const data = { ...validData, message: longMessage };
          const result = rfqFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should accept data with optional message field omitted', () => {
    fc.assert(
      fc.property(validRFQDataArb, (validData) => {
        const data = { ...validData, message: undefined };
        const result = rfqFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      }),
      { numRuns: 50 }
    );
  });
});
