import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 41: Rate limiting
 * Validates: Requirements 20.3
 *
 * This property ensures that rate limiting is correctly implemented across
 * all API endpoints to prevent abuse and protect the system from excessive requests.
 */

// Create mock functions
const mockKvIncr = vi.fn();
const mockKvExpire = vi.fn();
const mockEmailSend = vi.fn();
const mockCaptureException = vi.fn();

// Mock dependencies before importing routes
vi.mock('@vercel/kv', () => ({
  kv: {
    incr: (...args: any[]) => mockKvIncr(...args),
    expire: (...args: any[]) => mockKvExpire(...args),
  },
}));

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = {
      send: (...args: any[]) => mockEmailSend(...args),
    };
  },
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: (...args: any[]) => mockCaptureException(...args),
}));

// Import routes after mocks are set up
const rfqModule = await import('../rfq/route');
const contactModule = await import('../contact/route');
const { NextRequest } = await import('next/server');

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-api-key';
  process.env.RESEND_FROM_EMAIL = 'test@afrexia.com';
  process.env.SALES_EMAIL = 'sales@afrexia.com';
  process.env.CONTACT_EMAIL = 'contact@afrexia.com';
  process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
  process.env.NEXT_PUBLIC_SITE_DOMAIN = 'localhost';
  process.env.KV_REST_API_URL = 'https://test-kv.upstash.io';
  process.env.KV_REST_API_TOKEN = 'test-token';

  // Reset mocks
  mockKvIncr.mockResolvedValue(1);
  mockKvExpire.mockResolvedValue(true);
  mockEmailSend.mockResolvedValue({ data: { id: 'test-email-id' }, error: null });
  mockCaptureException.mockReturnValue(undefined);

  // Mock successful reCAPTCHA by default
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => ({
      success: true,
      score: 0.9,
      action: 'rfq_submit',
      hostname: 'localhost',
    }),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Property 41: Rate limiting', () => {
  // Arbitraries for generating test data
  const validRFQDataArb = fc.record({
    firstName: fc.string({ minLength: 2, maxLength: 50 }),
    lastName: fc.string({ minLength: 2, maxLength: 50 }),
    email: fc.emailAddress(),
    phone: fc
      .string({ minLength: 8, maxLength: 20 })
      .map((s) => `+${s.replace(/[^0-9]/g, '').slice(0, 15)}`)
      .filter((s) => s.length >= 8),
    company: fc.string({ minLength: 2, maxLength: 100 }),
    country: fc.string({ minLength: 2, maxLength: 100 }),
    productId: fc.string({ minLength: 1, maxLength: 50 }),
    quantity: fc.double({ min: 0.01, max: 1000000 }),
    quantityUnit: fc.constantFrom('kg', 'mt', 'container'),
    incoterm: fc.constantFrom('FOB', 'CIF', 'CFR', 'EXW', 'FCA'),
    destinationPort: fc.string({ minLength: 2, maxLength: 100 }),
    targetDate: fc
      .date({ min: new Date() })
      .map((d) => d.toISOString().split('T')[0]),
    message: fc.option(fc.string({ maxLength: 2000 }), { nil: undefined }),
    gdprConsent: fc.constant(true),
    recaptchaToken: fc.constant('test-recaptcha-token'),
    locale: fc.constantFrom('fr', 'en'),
  });

  const validContactDataArb = fc.record({
    name: fc.string({ minLength: 2, maxLength: 100 }),
    email: fc.emailAddress(),
    phone: fc.option(
      fc
        .string({ minLength: 8, maxLength: 20 })
        .map((s) => `+${s.replace(/[^0-9]/g, '').slice(0, 15)}`)
        .filter((s) => s.length >= 8),
      { nil: undefined }
    ),
    company: fc.option(fc.string({ minLength: 2, maxLength: 100 }), {
      nil: undefined,
    }),
    subject: fc.string({ minLength: 5, maxLength: 200 }),
    message: fc.string({ minLength: 10, maxLength: 2000 }),
    recaptchaToken: fc.constant('test-recaptcha-token'),
    locale: fc.constantFrom('fr', 'en'),
  });

  describe('Rate limit enforcement', () => {
    it('should enforce rate limit of 5 requests per minute on RFQ endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          validRFQDataArb,
          fc.integer({ min: 6, max: 100 }),
          async (data, requestCount) => {
            // Mock rate limit exceeded
            mockKvIncr.mockResolvedValueOnce(requestCount);

            const request = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': '127.0.0.1',
              },
              body: JSON.stringify(data),
            });

            const response = await rfqModule.POST(request);

            // Property: Requests exceeding rate limit must return 429
            expect(response.status).toBe(429);
            const responseData = await response.json();
            expect(responseData.error).toContain('Too many requests');
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should enforce rate limit of 5 requests per minute on Contact endpoint', async () => {
      // Mock successful reCAPTCHA for contact form
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({
          success: true,
          score: 0.9,
          action: 'contact_submit',
          hostname: 'localhost',
        }),
      });

      await fc.assert(
        fc.asyncProperty(
          validContactDataArb,
          fc.integer({ min: 6, max: 100 }),
          async (data, requestCount) => {
            // Mock rate limit exceeded
            mockKvIncr.mockResolvedValueOnce(requestCount);

            const request = new NextRequest('http://localhost:3000/api/contact', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': '127.0.0.1',
              },
              body: JSON.stringify(data),
            });

            const response = await contactModule.POST(request);

            // Property: Requests exceeding rate limit must return 429
            expect(response.status).toBe(429);
            const responseData = await response.json();
            expect(responseData.error).toContain('Too many requests');
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should allow requests within rate limit threshold', async () => {
      await fc.assert(
        fc.asyncProperty(
          validRFQDataArb,
          fc.integer({ min: 1, max: 5 }),
          async (data, requestCount) => {
            // Mock rate limit not exceeded
            mockKvIncr.mockResolvedValueOnce(requestCount);

            const request = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': '127.0.0.1',
              },
              body: JSON.stringify(data),
            });

            const response = await rfqModule.POST(request);

            // Property: Requests within rate limit must not return 429
            expect(response.status).not.toBe(429);
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Rate limit isolation per IP', () => {
    it('should track rate limits separately for different IP addresses', async () => {
      await fc.assert(
        fc.asyncProperty(
          validRFQDataArb,
          fc.ipV4(),
          fc.ipV4(),
          async (data, ip1, ip2) => {
            // Ensure IPs are different
            fc.pre(ip1 !== ip2);

            mockKvIncr.mockResolvedValue(1);

            // Request from first IP
            const request1 = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': ip1,
              },
              body: JSON.stringify(data),
            });

            await rfqModule.POST(request1);

            // Request from second IP
            const request2 = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': ip2,
              },
              body: JSON.stringify(data),
            });

            await rfqModule.POST(request2);

            // Property: Each IP should have its own rate limit key
            const calls = mockKvIncr.mock.calls;
            const keys = calls.map((call) => call[0]);

            expect(keys.some((key) => key.includes(ip1))).toBe(true);
            expect(keys.some((key) => key.includes(ip2))).toBe(true);
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should use correct rate limit key format for each endpoint', async () => {
      await fc.assert(
        fc.asyncProperty(
          validRFQDataArb,
          validContactDataArb,
          fc.ipV4(),
          async (rfqData, contactData, ipAddress) => {
            mockKvIncr.mockResolvedValue(1);

            // RFQ request
            const rfqRequest = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': ipAddress,
              },
              body: JSON.stringify(rfqData),
            });

            await rfqModule.POST(rfqRequest);

            // Contact request
            global.fetch = vi.fn().mockResolvedValue({
              json: async () => ({
                success: true,
                score: 0.9,
                action: 'contact_submit',
                hostname: 'localhost',
              }),
            });

            const contactRequest = new NextRequest(
              'http://localhost:3000/api/contact',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-forwarded-for': ipAddress,
                },
                body: JSON.stringify(contactData),
              }
            );

            await contactModule.POST(contactRequest);

            // Property: Rate limit keys should include endpoint identifier
            const calls = mockKvIncr.mock.calls;
            const keys = calls.map((call) => call[0]);

            expect(keys.some((key) => key.includes('rate_limit:rfq:'))).toBe(true);
            expect(keys.some((key) => key.includes('rate_limit:contact:'))).toBe(
              true
            );
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Rate limit window management', () => {
    it('should set TTL of 60 seconds on first request from IP', async () => {
      await fc.assert(
        fc.asyncProperty(
          validRFQDataArb,
          fc.ipV4(),
          async (data, ipAddress) => {
            // First request from this IP (count = 1)
            mockKvIncr.mockResolvedValueOnce(1);

            const request = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': ipAddress,
              },
              body: JSON.stringify(data),
            });

            await rfqModule.POST(request);

            // Property: TTL must be set to 60 seconds on first request
            expect(mockKvExpire).toHaveBeenCalledWith(
              expect.stringContaining(`rate_limit:rfq:${ipAddress}`),
              60
            );
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should not set TTL on subsequent requests within window', async () => {
      await fc.assert(
        fc.asyncProperty(
          validRFQDataArb,
          fc.integer({ min: 2, max: 5 }),
          async (data, requestCount) => {
            // Subsequent request (count > 1)
            mockKvIncr.mockResolvedValueOnce(requestCount);
            mockKvExpire.mockClear();

            const request = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': '127.0.0.1',
              },
              body: JSON.stringify(data),
            });

            await rfqModule.POST(request);

            // Property: TTL should not be set on subsequent requests
            expect(mockKvExpire).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Rate limit error handling', () => {
    it('should handle rate limiting failures gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(validRFQDataArb, async (data) => {
          // Mock KV failure
          mockKvIncr.mockRejectedValueOnce(new Error('KV connection failed'));

          const request = new NextRequest('http://localhost:3000/api/rfq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-forwarded-for': '127.0.0.1',
            },
            body: JSON.stringify(data),
          });

          const response = await rfqModule.POST(request);

          // Property: Rate limiting failures should not block valid requests
          // (but request may still fail validation)
          expect(response.status).not.toBe(429);

          // Property: Error should be logged to Sentry
          expect(mockCaptureException).toHaveBeenCalled();
        }),
        { numRuns: 20 }
      );
    });
  });

  describe('Rate limit consistency', () => {
    it('should maintain consistent rate limit threshold across all endpoints', async () => {
      const EXPECTED_RATE_LIMIT = 5;

      await fc.assert(
        fc.asyncProperty(
          validRFQDataArb,
          validContactDataArb,
          async (rfqData, contactData) => {
            // Test RFQ endpoint at threshold
            mockKvIncr.mockResolvedValueOnce(EXPECTED_RATE_LIMIT);
            const rfqRequest = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': '127.0.0.1',
              },
              body: JSON.stringify(rfqData),
            });
            const rfqResponse = await rfqModule.POST(rfqRequest);

            // Test Contact endpoint at threshold
            global.fetch = vi.fn().mockResolvedValue({
              json: async () => ({
                success: true,
                score: 0.9,
                action: 'contact_submit',
                hostname: 'localhost',
              }),
            });

            mockKvIncr.mockResolvedValueOnce(EXPECTED_RATE_LIMIT);
            const contactRequest = new NextRequest(
              'http://localhost:3000/api/contact',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-forwarded-for': '127.0.0.1',
                },
                body: JSON.stringify(contactData),
              }
            );
            const contactResponse = await contactModule.POST(contactRequest);

            // Property: Both endpoints should allow requests at threshold
            expect(rfqResponse.status).not.toBe(429);
            expect(contactResponse.status).not.toBe(429);

            // Test both endpoints above threshold
            mockKvIncr.mockResolvedValueOnce(EXPECTED_RATE_LIMIT + 1);
            const rfqRequest2 = new NextRequest('http://localhost:3000/api/rfq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': '127.0.0.1',
              },
              body: JSON.stringify(rfqData),
            });
            const rfqResponse2 = await rfqModule.POST(rfqRequest2);

            mockKvIncr.mockResolvedValueOnce(EXPECTED_RATE_LIMIT + 1);
            const contactRequest2 = new NextRequest(
              'http://localhost:3000/api/contact',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-forwarded-for': '127.0.0.1',
                },
                body: JSON.stringify(contactData),
              }
            );
            const contactResponse2 = await contactModule.POST(contactRequest2);

            // Property: Both endpoints should block requests above threshold
            expect(rfqResponse2.status).toBe(429);
            expect(contactResponse2.status).toBe(429);
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
