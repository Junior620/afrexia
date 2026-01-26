/**
 * Property Test: Critical Error Alerting
 * Property 55: Critical error alerting
 * 
 * **Validates: Requirements 25.3**
 * 
 * For any critical error (500 errors, unhandled exceptions, failed API calls),
 * an error report should be sent to Sentry with full context
 * (user, page, stack trace).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import * as Sentry from '@sentry/nextjs';
import {
  reportCriticalError,
  isCriticalError,
  getErrorSeverity,
  categorizeCriticalError,
  reportEmailDeliveryFailure,
  reportExternalServiceFailure,
  reportSecurityViolation,
  ErrorSeverity,
  CriticalErrorCategory,
} from '../critical-errors';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn().mockReturnValue('mock-event-id'),
}));

describe('Property 55: Critical Error Alerting', () => {
  let mockSentryCapture: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSentryCapture = vi.mocked(Sentry.captureException);
  });

  /**
   * Property: All critical errors are reported to Sentry
   */
  it('should report all critical errors to Sentry', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate critical error messages
        fc.constantFrom(
          'Failed to send sales email',
          'Failed to send RFQ email',
          'Database connection failed',
          'Payment failed',
          'Data corruption detected',
          'Security violation detected',
          'Unauthorized access attempt',
          'Service unavailable'
        ),
        // Generate error context
        fc.record({
          userId: fc.option(fc.uuid(), { nil: undefined }),
          page: fc.option(fc.webUrl(), { nil: undefined }),
          timestamp: fc.date(),
        }),
        async (errorMessage, context) => {
          const error = new Error(errorMessage);
          
          // Report critical error
          const eventId = reportCriticalError(error, context);

          // Verify Sentry was called
          expect(mockSentryCapture).toHaveBeenCalled();
          expect(eventId).toBe('mock-event-id');

          // Verify error was classified as critical
          expect(isCriticalError(error)).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Critical errors include full context
   */
  it('should include full context when reporting critical errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Failed to send sales email',
          'Database connection failed',
          'Security violation detected'
        ),
        fc.record({
          userId: fc.uuid(),
          page: fc.webUrl(),
          userAgent: fc.string({ minLength: 10, maxLength: 100 }),
          ipAddress: fc.ipV4(),
        }),
        async (errorMessage, context) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          
          const error = new Error(errorMessage);
          
          // Report critical error with context
          reportCriticalError(error, context);

          // Verify Sentry was called with context
          expect(mockSentryCapture).toHaveBeenCalled();
          
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.extra).toBeDefined();
          expect(sentryCall[1]?.extra?.userId).toBe(context.userId);
          expect(sentryCall[1]?.extra?.page).toBe(context.page);
          expect(sentryCall[1]?.extra?.userAgent).toBe(context.userAgent);
          expect(sentryCall[1]?.extra?.ipAddress).toBe(context.ipAddress);
          expect(sentryCall[1]?.extra?.timestamp).toBeDefined();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Critical errors are tagged with appropriate severity
   */
  it('should tag critical errors with appropriate severity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          { message: 'Failed to send sales email', expectedSeverity: ErrorSeverity.CRITICAL },
          { message: 'Database connection failed', expectedSeverity: ErrorSeverity.CRITICAL },
          { message: 'External service error: Resend', expectedSeverity: ErrorSeverity.HIGH },
          { message: 'Validation failed', expectedSeverity: ErrorSeverity.MEDIUM },
          { message: 'Not found', expectedSeverity: ErrorSeverity.MEDIUM }
        ),
        async (testCase) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          
          const error = new Error(testCase.message);
          
          // Get error severity
          const severity = getErrorSeverity(error);
          
          // Verify severity matches expected
          expect(severity).toBe(testCase.expectedSeverity);

          // Report error
          reportCriticalError(error);

          // Verify Sentry was called with correct severity level
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          const expectedLevel = 
            testCase.expectedSeverity === ErrorSeverity.CRITICAL ? 'fatal' : 'error';
          expect(sentryCall[1]?.level).toBe(expectedLevel);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Critical errors are categorized correctly
   */
  it('should categorize critical errors correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          { message: 'Failed to send email', expectedCategory: CriticalErrorCategory.EMAIL_DELIVERY },
          { message: 'Payment processing failed', expectedCategory: CriticalErrorCategory.PAYMENT_PROCESSING },
          { message: 'Data loss detected', expectedCategory: CriticalErrorCategory.DATA_LOSS },
          { message: 'Security breach detected', expectedCategory: CriticalErrorCategory.SECURITY_BREACH },
          { message: 'Service unavailable', expectedCategory: CriticalErrorCategory.SERVICE_OUTAGE },
          { message: 'External service API failed', expectedCategory: CriticalErrorCategory.API_FAILURE }
        ),
        async (testCase) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          
          const error = new Error(testCase.message);
          
          // Categorize error
          const category = categorizeCriticalError(error);
          
          // Verify category matches expected
          expect(category).toBe(testCase.expectedCategory);

          // Report error
          reportCriticalError(error);

          // Verify Sentry was called with correct category tag
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.tags?.category).toBe(testCase.expectedCategory);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Email delivery failures are reported with specific context
   */
  it('should report email delivery failures with specific context', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('rfq', 'contact', 'confirmation'),
        fc.emailAddress(),
        fc.string({ minLength: 1, maxLength: 100 }),
        async (emailType, recipient, errorMessage) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          
          const error = new Error(errorMessage);
          
          // Report email delivery failure
          const eventId = reportEmailDeliveryFailure(
            emailType as 'rfq' | 'contact' | 'confirmation',
            recipient,
            error,
            { additionalInfo: 'test' }
          );

          // Verify Sentry was called
          expect(mockSentryCapture).toHaveBeenCalled();
          expect(eventId).toBe('mock-event-id');

          // Verify context includes email-specific information
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.extra?.emailType).toBe(emailType);
          expect(sentryCall[1]?.extra?.recipient).toBe(recipient);
          expect(sentryCall[1]?.extra?.originalError).toBe(errorMessage);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: External service failures are reported with service details
   */
  it('should report external service failures with service details', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('Resend', 'Sanity', 'Mapbox', 'Vercel KV'),
        fc.constantFrom('send_email', 'fetch_data', 'render_map', 'rate_limit'),
        fc.string({ minLength: 1, maxLength: 100 }),
        async (serviceName, operation, errorMessage) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          
          const error = new Error(errorMessage);
          
          // Report external service failure
          const eventId = reportExternalServiceFailure(
            serviceName,
            operation,
            error,
            { additionalInfo: 'test' }
          );

          // Verify Sentry was called
          expect(mockSentryCapture).toHaveBeenCalled();
          expect(eventId).toBe('mock-event-id');

          // Verify context includes service-specific information
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.extra?.serviceName).toBe(serviceName);
          expect(sentryCall[1]?.extra?.operation).toBe(operation);
          expect(sentryCall[1]?.extra?.originalError).toBe(errorMessage);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Security violations are reported with critical severity
   */
  it('should report security violations with critical severity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'unauthorized_access',
          'csrf_attack',
          'sql_injection',
          'xss_attempt',
          'rate_limit_abuse'
        ),
        fc.string({ minLength: 10, maxLength: 200 }),
        fc.record({
          ipAddress: fc.ipV4(),
          userAgent: fc.string({ minLength: 10, maxLength: 100 }),
        }),
        async (violationType, details, context) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          
          // Report security violation
          const eventId = reportSecurityViolation(
            violationType,
            details,
            context
          );

          // Verify Sentry was called
          expect(mockSentryCapture).toHaveBeenCalled();
          expect(eventId).toBe('mock-event-id');

          // Verify severity is critical (fatal level)
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.level).toBe('fatal');
          expect(sentryCall[1]?.tags?.severity).toBe(ErrorSeverity.CRITICAL);
          expect(sentryCall[1]?.tags?.category).toBe(CriticalErrorCategory.SECURITY_BREACH);
          expect(sentryCall[1]?.tags?.violationType).toBe(violationType);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: All critical errors include stack traces
   */
  it('should include stack traces for all critical errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Failed to send sales email',
          'Database connection failed',
          'Security violation detected'
        ),
        async (errorMessage) => {
          const error = new Error(errorMessage);
          
          // Ensure error has a stack trace
          expect(error.stack).toBeDefined();

          // Report critical error
          reportCriticalError(error);

          // Verify Sentry was called with the error (which includes stack trace)
          expect(mockSentryCapture).toHaveBeenCalledWith(
            expect.objectContaining({
              message: errorMessage,
              stack: expect.any(String),
            }),
            expect.any(Object)
          );
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Critical errors are fingerprinted for grouping
   */
  it('should fingerprint critical errors for proper grouping', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Failed to send sales email',
          'Database connection failed',
          'External service error: Resend'
        ),
        async (errorMessage) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          
          const error = new Error(errorMessage);
          error.name = 'CriticalError';
          
          // Report critical error
          reportCriticalError(error);

          // Verify Sentry was called with fingerprint
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.fingerprint).toBeDefined();
          expect(Array.isArray(sentryCall[1]?.fingerprint)).toBe(true);
          expect(sentryCall[1]?.fingerprint).toContain(error.name);
          // Note: fingerprint may contain error message or category, not necessarily the full message
          expect(sentryCall[1]?.fingerprint?.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Critical errors include environment information
   */
  it('should include environment information in critical error reports', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Failed to send sales email',
          'Database connection failed'
        ),
        async (errorMessage) => {
          const error = new Error(errorMessage);
          
          // Report critical error
          reportCriticalError(error);

          // Verify Sentry was called with environment info
          const sentryCall = mockSentryCapture.mock.calls[0];
          expect(sentryCall[1]?.extra?.timestamp).toBeDefined();
          expect(sentryCall[1]?.extra?.environment).toBeDefined();
        }
      ),
      { numRuns: 20 }
    );
  });
});
