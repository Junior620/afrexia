import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 12: Spam prevention
 * Validates: Requirements 3.5
 *
 * This property ensures that the RFQ form correctly prevents spam submissions
 * through reCAPTCHA verification and rate limiting.
 */

// Create mock functions
const mockKvIncr = vi.fn();
const mockKvExpire = vi.fn();
const mockEmailSend = vi.fn();
const mockCaptureException = vi.fn();

// Mock dependencies before importing the route
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

// Import after mocks are set up
const { POST } = await import('../route');
const { NextRequest } = await import('next/server');

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-api-key';
  process.env.RESEND_FROM_EMAIL = 'test@afrexia.com';
  process.env.SALES_EMAIL = 'sales@afrexia.com';
  process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
  process.env.NEXT_PUBLIC_SITE_DOMAIN = 'localhost';
  process.env.KV_REST_API_URL = 'https://test-kv.upstash.io';
  process.env.KV_REST_API_TOKEN = 'test-token';

  // Reset mocks
  mockKvIncr.mockResolvedValue(1);
  mockKvExpire.mockResolvedValue(true);
  mockEmailSend.mockResolvedValue({ data: { id: 'test-email-id' }, error: null });
  mockCaptureException.mockReturnValue(undefined);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Property 12: Spam prevention', () => {
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

  it('should reject submissions with low reCAPTCHA score', async () => {
    // Mock reCAPTCHA with low score
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.3, // Below threshold of 0.5
        action: 'rfq_submit',
        hostname: 'localhost',
      }),
    });

    await fc.assert(
      fc.asyncProperty(validRFQDataArb, async (data) => {
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
        const responseData = await response.json();
        expect(responseData.error).toContain('reCAPTCHA');
      }),
      { numRuns: 20 }
    );
  });

  it('should reject submissions with failed reCAPTCHA verification', async () => {
    // Mock reCAPTCHA failure
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: false,
        score: 0,
        action: 'rfq_submit',
        hostname: 'localhost',
      }),
    });

    await fc.assert(
      fc.asyncProperty(validRFQDataArb, async (data) => {
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
      { numRuns: 20 }
    );
  });

  it('should reject submissions with wrong action in reCAPTCHA', async () => {
    // Mock reCAPTCHA with wrong action
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'wrong_action', // Should be 'rfq_submit'
        hostname: 'localhost',
      }),
    });

    await fc.assert(
      fc.asyncProperty(validRFQDataArb, async (data) => {
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
      { numRuns: 20 }
    );
  });

  it('should reject submissions from wrong hostname', async () => {
    // Mock reCAPTCHA with wrong hostname
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'rfq_submit',
        hostname: 'evil-site.com', // Should be localhost or configured domain
      }),
    });

    await fc.assert(
      fc.asyncProperty(validRFQDataArb, async (data) => {
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
      { numRuns: 20 }
    );
  });

  it('should enforce rate limiting after threshold', async () => {
    // Mock successful reCAPTCHA
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'rfq_submit',
        hostname: 'localhost',
      }),
    });

    await fc.assert(
      fc.asyncProperty(
        validRFQDataArb,
        fc.integer({ min: 6, max: 20 }),
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

          const response = await POST(request);

          expect(response.status).toBe(429);
          const responseData = await response.json();
          expect(responseData.error).toContain('Too many requests');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should allow submissions within rate limit', async () => {
    // Mock successful reCAPTCHA
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'rfq_submit',
        hostname: 'localhost',
      }),
    });

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

          const response = await POST(request);

          // Should not be rate limited (but may fail validation)
          expect(response.status).not.toBe(429);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should track rate limit per IP address', async () => {
    // Mock successful reCAPTCHA
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'rfq_submit',
        hostname: 'localhost',
      }),
    });

    await fc.assert(
      fc.asyncProperty(
        validRFQDataArb,
        fc.ipV4(),
        async (data, ipAddress) => {
          mockKvIncr.mockResolvedValueOnce(1);

          const request = new NextRequest('http://localhost:3000/api/rfq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-forwarded-for': ipAddress,
            },
            body: JSON.stringify(data),
          });

          await POST(request);

          // Verify that rate limit key includes IP address
          expect(mockKvIncr).toHaveBeenCalledWith(
            expect.stringContaining(ipAddress)
          );
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should set TTL on first request from IP', async () => {
    // Mock successful reCAPTCHA
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'rfq_submit',
        hostname: 'localhost',
      }),
    });

    await fc.assert(
      fc.asyncProperty(validRFQDataArb, async (data) => {
        // First request from this IP
        mockKvIncr.mockResolvedValueOnce(1);

        const request = new NextRequest('http://localhost:3000/api/rfq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '127.0.0.1',
          },
          body: JSON.stringify(data),
        });

        await POST(request);

        // Verify that TTL is set
        expect(mockKvExpire).toHaveBeenCalledWith(
          expect.stringContaining('rate_limit:rfq:127.0.0.1'),
          60 // 60 seconds
        );
      }),
      { numRuns: 20 }
    );
  });
});
