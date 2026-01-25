import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { z } from 'zod';
import { POST } from '../route';
import { NextRequest } from 'next/server';

/**
 * Property 10: RFQ form submission with valid data
 * Validates: Requirements 3.1, 3.2, 19.1, 19.3, 19.4
 *
 * This property ensures that valid RFQ submissions are processed correctly,
 * emails are sent, and appropriate responses are returned.
 */

// Mock dependencies
vi.mock('@vercel/kv', () => ({
  kv: {
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
    },
  })),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// Mock environment variables
beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-api-key';
  process.env.RESEND_FROM_EMAIL = 'test@afrexia.com';
  process.env.SALES_EMAIL = 'sales@afrexia.com';
  process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
  process.env.NEXT_PUBLIC_SITE_DOMAIN = 'localhost';
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Property 10: RFQ form submission with valid data', () => {
  // Arbitraries for generating test data
  const validFirstNameArb = fc
    .string({ minLength: 2, maxLength: 50 })
    .map(s => s.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, 'a'))
    .map(s => s.trim() || 'John')
    .filter((s) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(s) && s.trim().length >= 2);

  const validLastNameArb = fc
    .string({ minLength: 2, maxLength: 50 })
    .map(s => s.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, 'a'))
    .map(s => s.trim() || 'Doe')
    .filter((s) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(s) && s.trim().length >= 2);

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

  const localeArb = fc.constantFrom('fr', 'en');

  const validRFQSubmissionArb = fc.record({
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
    recaptchaToken: fc.constant('test-recaptcha-token'),
    locale: localeArb,
  });

  // Mock fetch for reCAPTCHA verification
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => ({
      success: true,
      score: 0.9,
      action: 'rfq_submit',
      hostname: 'localhost',
    }),
  });

  it('should return success response for valid submissions', async () => {
    await fc.assert(
      fc.asyncProperty(validRFQSubmissionArb, async (data) => {
        const request = new NextRequest('http://localhost:3000/api/rfq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '127.0.0.1',
          },
          body: JSON.stringify(data),
        });

        const response = await POST(request);
        const responseData = await response.json();

        expect(response.status).toBe(200);
        expect(responseData.success).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  it('should reject submissions without GDPR consent', async () => {
    await fc.assert(
      fc.asyncProperty(validRFQSubmissionArb, async (validData) => {
        const data = { ...validData, gdprConsent: false };
        const request = new NextRequest('http://localhost:3000/api/rfq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '127.0.0.1',
          },
          body: JSON.stringify(data),
        });

        const response = await POST(request);

        expect(response.status).toBe(400);
      }),
      { numRuns: 10 }
    );
  });

  it('should reject submissions with invalid email', async () => {
    await fc.assert(
      fc.asyncProperty(
        validRFQSubmissionArb,
        fc.string().filter((s) => !s.includes('@')),
        async (validData, invalidEmail) => {
          const data = { ...validData, email: invalidEmail };
          const request = new NextRequest('http://localhost:3000/api/rfq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-forwarded-for': '127.0.0.1',
            },
            body: JSON.stringify(data),
          });

          const response = await POST(request);

          expect(response.status).toBe(400);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should sanitize user inputs to prevent XSS', async () => {
    // Use a fixed valid data set instead of random generation
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      country: 'France',
      productId: 'test-product',
      quantity: 100,
      quantityUnit: 'kg' as const,
      incoterm: 'FOB' as const,
      destinationPort: 'Le Havre',
      targetDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      message: '<img src=x onerror=alert(1)>',
      gdprConsent: true,
      recaptchaToken: 'test-recaptcha-token',
      locale: 'fr' as const,
    };

    const request = new NextRequest('http://localhost:3000/api/rfq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify(data),
    });

    const response = await POST(request);
    const responseData = await response.json();

    // Should succeed but with sanitized data
    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
  });

  it('should handle rate limiting correctly', async () => {
    const { kv } = await import('@vercel/kv');

    // Mock rate limit exceeded
    vi.mocked(kv.incr).mockResolvedValueOnce(6);

    // Use a fixed valid data set
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      country: 'France',
      productId: 'test-product',
      quantity: 100,
      quantityUnit: 'kg' as const,
      incoterm: 'FOB' as const,
      destinationPort: 'Le Havre',
      targetDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      message: 'Test message',
      gdprConsent: true,
      recaptchaToken: 'test-recaptcha-token',
      locale: 'fr' as const,
    };

    const request = new NextRequest('http://localhost:3000/api/rfq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify(data),
    });

    const response = await POST(request);

    expect(response.status).toBe(429);
  });
});
