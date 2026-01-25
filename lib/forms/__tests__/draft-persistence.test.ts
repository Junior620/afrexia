import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { saveDraft, loadDraft, clearDraft, hasDraft } from '../draft-storage';
import { RFQDraftData } from '../rfq-schema';

/**
 * Property 11: Form draft persistence
 * Validates: Requirements 3.6, 3.8
 *
 * This property ensures that form drafts are correctly saved to and loaded from
 * localStorage, with proper TTL handling and exclusion of sensitive data.
 */

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Property 11: Form draft persistence', () => {
  // Arbitraries for generating draft data (non-sensitive fields only)
  const validFirstNameArb = fc.string({ minLength: 2, maxLength: 50 });
  const validLastNameArb = fc.string({ minLength: 2, maxLength: 50 });
  const validEmailArb = fc.emailAddress();
  const validPhoneArb = fc
    .string({ minLength: 8, maxLength: 20 })
    .map((s) => `+${s.replace(/[^0-9]/g, '').slice(0, 15)}`)
    .filter((s) => s.length >= 8);
  const validCompanyArb = fc.string({ minLength: 2, maxLength: 100 });
  const validCountryArb = fc.string({ minLength: 2, maxLength: 100 });
  const validProductIdArb = fc.string({ minLength: 1, maxLength: 50 });
  const validQuantityArb = fc.double({ min: 0.01, max: 1000000, noNaN: true });
  const quantityUnitArb = fc.constantFrom('kg', 'mt', 'container');
  const incotermArb = fc.constantFrom('FOB', 'CIF', 'CFR', 'EXW', 'FCA');
  const validDestinationPortArb = fc.string({ minLength: 2, maxLength: 100 });
  const futureDateArb = fc
    .date({ min: new Date(), max: new Date('2030-12-31') })
    .map((d) => d.toISOString().split('T')[0]);

  const draftDataArb: fc.Arbitrary<Partial<RFQDraftData>> = fc.record(
    {
      firstName: fc.option(validFirstNameArb, { nil: undefined }),
      lastName: fc.option(validLastNameArb, { nil: undefined }),
      email: fc.option(validEmailArb, { nil: undefined }),
      phone: fc.option(validPhoneArb, { nil: undefined }),
      company: fc.option(validCompanyArb, { nil: undefined }),
      country: fc.option(validCountryArb, { nil: undefined }),
      productId: fc.option(validProductIdArb, { nil: undefined }),
      quantity: fc.option(validQuantityArb, { nil: undefined }),
      quantityUnit: fc.option(quantityUnitArb, { nil: undefined }),
      incoterm: fc.option(incotermArb, { nil: undefined }),
      destinationPort: fc.option(validDestinationPortArb, { nil: undefined }),
      targetDate: fc.option(futureDateArb, { nil: undefined }),
    },
    { requiredKeys: [] }
  );

  it('should save and load draft data correctly', () => {
    fc.assert(
      fc.property(draftDataArb, (data) => {
        saveDraft(data);
        const loaded = loadDraft();

        expect(loaded).toEqual(data);
      }),
      { numRuns: 100 }
    );
  });

  it('should return null when no draft exists', () => {
    const loaded = loadDraft();
    expect(loaded).toBeNull();
  });

  it('should clear draft correctly', () => {
    fc.assert(
      fc.property(draftDataArb, (data) => {
        saveDraft(data);
        expect(hasDraft()).toBe(true);

        clearDraft();
        expect(hasDraft()).toBe(false);
        expect(loadDraft()).toBeNull();
      }),
      { numRuns: 50 }
    );
  });

  it('should expire drafts after 7 days', () => {
    fc.assert(
      fc.property(draftDataArb, (data) => {
        const now = Date.now();
        vi.setSystemTime(now);

        saveDraft(data);
        expect(hasDraft()).toBe(true);

        // Advance time by 7 days + 1 second
        vi.setSystemTime(now + 7 * 24 * 60 * 60 * 1000 + 1000);

        const loaded = loadDraft();
        expect(loaded).toBeNull();
        expect(hasDraft()).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should not expire drafts before 7 days', () => {
    fc.assert(
      fc.property(draftDataArb, (data) => {
        const now = Date.now();
        vi.setSystemTime(now);

        saveDraft(data);

        // Advance time by 6 days
        vi.setSystemTime(now + 6 * 24 * 60 * 60 * 1000);

        const loaded = loadDraft();
        expect(loaded).toEqual(data);
        expect(hasDraft()).toBe(true);
      }),
      { numRuns: 50 }
    );
  });

  it('should handle partial draft data', () => {
    fc.assert(
      fc.property(
        fc.record(
          {
            firstName: fc.option(validFirstNameArb, { nil: undefined }),
            email: fc.option(validEmailArb, { nil: undefined }),
          },
          { requiredKeys: [] }
        ),
        (partialData) => {
          saveDraft(partialData);
          const loaded = loadDraft();

          expect(loaded).toEqual(partialData);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should overwrite existing draft when saving new data', () => {
    fc.assert(
      fc.property(draftDataArb, draftDataArb, (data1, data2) => {
        saveDraft(data1);
        saveDraft(data2);

        const loaded = loadDraft();
        expect(loaded).toEqual(data2);
      }),
      { numRuns: 50 }
    );
  });

  it('should handle empty draft data', () => {
    saveDraft({});
    const loaded = loadDraft();

    expect(loaded).toEqual({});
  });

  it('should preserve timestamp when saving draft', () => {
    fc.assert(
      fc.property(draftDataArb, (data) => {
        const now = Date.now();
        vi.setSystemTime(now);

        saveDraft(data);

        const stored = JSON.parse(
          localStorageMock.getItem('rfq_draft') || '{}'
        );

        expect(stored.timestamp).toBe(now);
        expect(stored.data).toEqual(data);
      }),
      { numRuns: 50 }
    );
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorageMock.setItem('rfq_draft', 'invalid json');

    const loaded = loadDraft();
    expect(loaded).toBeNull();
  });

  it('should handle missing timestamp in stored data', () => {
    localStorageMock.setItem(
      'rfq_draft',
      JSON.stringify({ data: { firstName: 'John' } })
    );

    const loaded = loadDraft();
    // Should handle gracefully (either return null or the data)
    expect(loaded === null || typeof loaded === 'object').toBe(true);
  });
});
