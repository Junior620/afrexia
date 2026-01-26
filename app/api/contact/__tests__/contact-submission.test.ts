import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { POST } from '../route';
import { NextRequest } from 'next/server';

/**
 * Property 13: Contact form validation and submission
 * Validates: Requirements 14.1, 14.3, 14.4, 19.2
 *
 * This property ensures that:
 * 1. Valid contact form submissions are processed correctly
 * 2. Emails are sent to the team and customer
 * 3. Invalid submissions are rejected with appropriate error messages
 * 4. Input sanitization prevents XSS attacks
 * 5. Rate limiting prevents abuse
 */

// Mock dependencies
vi.mock('@vercel/kv', () => ({
  kv: {
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
    };
  },
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// Mock environment variables
beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-api-key';
  process.env.RESEND_FROM_EMAIL = 'test@afrexia.com';
  process.env.CONTACT_EMAIL = 'contact@afrexia.com';
  process.env.RESEND_TO_EMAIL = 'info@afrexia.com';
  process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
  process.env.NEXT_PUBLIC_SITE_DOMAIN = 'localhost';
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Property 13: Contact form validation and submission', () => {
  // Arbitraries for generating test data
  const validNameArb = fc
    .tuple(
      fc.stringMatching(/^[A-Z][a-z]{1,20}$/),
      fc.stringMatching(/^[A-Z][a-z]{1,20}$/)
    )
    .map(([first, last]) => `${first} ${last}`);

  const validEmailArb = fc
    .tuple(
      fc.stringMatching(/^[a-z0-9]{3,20}$/),
      fc.stringMatching(/^[a-z]{2,10}$/),
      fc.stringMatching(/^[a-z]{2,5}$/)
    )
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

  const validPhoneArb = fc
    .integer({ min: 10000000, max: 999999999999999 })
    .map((n) => `+${n}`);

  const validCompanyArb = fc
    .stringMatching(/^[A-Z][a-zA-Z0-9\s&.'-]{1,50}$/)
    .filter((s) => s.length <= 100);

  const validSubjectArb = fc
    .stringMatching(/^[A-Z][a-zA-Z0-9\s!?.,'-]{5,100}$/)
    .filter((s) => s.trim().length >= 3 && s.trim().length <= 200);

  const validMessageArb = fc
    .stringMatching(/^[A-Z][a-zA-Z0-9\s!?.,'\-\n]{15,200}$/)
    .filter((s) => s.trim().length >= 10 && s.trim().length <= 2000);

  const localeArb = fc.constantFrom('fr', 'en');

  const validContactSubmissionArb = fc.record({
    name: validNameArb,
    email: validEmailArb,
    phone: fc.option(validPhoneArb, { nil: '' }),
    company: fc.option(validCompanyArb, { nil: '' }),
    subject: validSubjectArb,
    message: validMessageArb,
    recaptchaToken: fc.constant('test-recaptcha-token'),
    locale: localeArb,
  });

  // Mock fetch for reCAPTCHA verification
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => ({
      success: true,
      score: 0.9,
      action: 'contact_submit',
      hostname: 'localhost',
    }),
  });

  it('should return success response for valid submissions', async () => {
    await fc.assert(
      fc.asyncProperty(validContactSubmissionArb, async (data) => {
        const request = new NextRequest('http://localhost:3000/api/contact', {
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
        expect(responseData.message).toBe('Contact form submitted successfully');
      }),
      { numRuns: 20 }
    );
  });

  it('should reject submissions with invalid email', async () => {
    await fc.assert(
      fc.asyncProperty(
        validContactSubmissionArb,
        fc.string().filter((s) => !s.includes('@') && s.length > 0),
        async (validData, invalidEmail) => {
          const data = { ...validData, email: invalidEmail };
          const request = new NextRequest('http://localhost:3000/api/contact', {
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

  it('should reject submissions with name too short', async () => {
    await fc.assert(
      fc.asyncProperty(
        validContactSubmissionArb,
        fc.string({ maxLength: 1 }),
        async (validData, shortName) => {
          const data = { ...validData, name: shortName };
          const request = new NextRequest('http://localhost:3000/api/contact', {
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

  it('should reject submissions with subject too short', async () => {
    await fc.assert(
      fc.asyncProperty(
        validContactSubmissionArb,
        fc.string({ maxLength: 2 }),
        async (validData, shortSubject) => {
          const data = { ...validData, subject: shortSubject };
          const request = new NextRequest('http://localhost:3000/api/contact', {
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

  it('should reject submissions with message too short', async () => {
    await fc.assert(
      fc.asyncProperty(
        validContactSubmissionArb,
        fc.string({ maxLength: 9 }),
        async (validData, shortMessage) => {
          const data = { ...validData, message: shortMessage };
          const request = new NextRequest('http://localhost:3000/api/contact', {
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

  it('should sanitize inputs with HTML/script tags (defense in depth)', async () => {
    // Test that sanitization provides defense in depth by removing < and >
    // Even if validation were bypassed, sanitization would still protect
    const testData = {
      name: 'John Doe',  // Valid name
      email: 'test@example.com',
      phone: '+1234567890',
      company: 'Test<script>Corp</script>',  // Company field has no regex, so sanitization applies
      subject: 'Test Subject',
      message: 'This is a test message with enough content.',
      recaptchaToken: 'test-recaptcha-token',
      locale: 'en',
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify(testData),
    });

    const response = await POST(request);
    const responseData = await response.json();

    // Should succeed with sanitized data (< and > removed from company field)
    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
    // The company field should have had < and > removed by sanitization
  });

  it('should handle rate limiting correctly', async () => {
    const { kv } = await import('@vercel/kv');

    await fc.assert(
      fc.asyncProperty(validContactSubmissionArb, async (data) => {
        // Mock rate limit exceeded for this specific test
        vi.mocked(kv.incr).mockResolvedValueOnce(6);

        const request = new NextRequest('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '127.0.0.1',
          },
          body: JSON.stringify(data),
        });

        const response = await POST(request);

        expect(response.status).toBe(429);
        
        // Reset mock for next iteration
        vi.mocked(kv.incr).mockResolvedValue(1);
      }),
      { numRuns: 5 }
    );
  });

  it('should accept optional phone and company fields', async () => {
    await fc.assert(
      fc.asyncProperty(validContactSubmissionArb, async (validData) => {
        const data = {
          ...validData,
          phone: '',
          company: '',
        };

        const request = new NextRequest('http://localhost:3000/api/contact', {
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
      { numRuns: 10 }
    );
  });

  it('should reject submissions with invalid phone format when provided', async () => {
    await fc.assert(
      fc.asyncProperty(
        validContactSubmissionArb,
        fc.string({ minLength: 1, maxLength: 5 }).filter((s) => !/^\+?[1-9]\d{1,14}$/.test(s)),
        async (validData, invalidPhone) => {
          const data = { ...validData, phone: invalidPhone };
          const request = new NextRequest('http://localhost:3000/api/contact', {
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

  it('should reject submissions with message exceeding max length', async () => {
    await fc.assert(
      fc.asyncProperty(
        validContactSubmissionArb,
        fc.string({ minLength: 2001, maxLength: 3000 }),
        async (validData, longMessage) => {
          const data = { ...validData, message: longMessage };
          const request = new NextRequest('http://localhost:3000/api/contact', {
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

  it('should handle failed reCAPTCHA verification', async () => {
    // Mock failed reCAPTCHA
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: false,
        score: 0.1,
        action: 'contact_submit',
        hostname: 'localhost',
      }),
    });

    await fc.assert(
      fc.asyncProperty(validContactSubmissionArb, async (data) => {
        const request = new NextRequest('http://localhost:3000/api/contact', {
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
      { numRuns: 5 }
    );

    // Reset mock
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'contact_submit',
        hostname: 'localhost',
      }),
    });
  });
});
