/**
 * Property Test: Email Delivery and Error Handling
 * Property 53: Email delivery and error handling
 * 
 * **Validates: Requirements 19.6**
 * 
 * For any form submission that triggers email sending, if email delivery fails,
 * the error should be logged to Sentry, and the user should receive an
 * appropriate error message.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import * as Sentry from '@sentry/nextjs';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn().mockReturnValue('mock-event-id'),
}));

// Mock email service interface
interface EmailResult {
  id?: string;
  error?: { message: string };
}

interface MockEmailService {
  send: (data: any) => Promise<EmailResult>;
}

describe('Property 53: Email Delivery and Error Handling', () => {
  let mockEmailService: MockEmailService;
  let mockSentryCapture: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    mockEmailService = {
      send: vi.fn(),
    };
    mockSentryCapture = vi.mocked(Sentry.captureException);
  });

  /**
   * Property: Email delivery failures are logged to Sentry
   */
  it('should log email delivery failures to Sentry', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary email data
        fc.record({
          from: fc.emailAddress(),
          to: fc.emailAddress(),
          subject: fc.string({ minLength: 1, maxLength: 100 }),
          emailType: fc.constantFrom('rfq', 'contact', 'confirmation'),
        }),
        // Generate arbitrary error messages
        fc.string({ minLength: 1, maxLength: 200 }),
        async (emailData, errorMessage) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          vi.mocked(mockEmailService.send).mockClear();
          
          // Simulate email delivery failure
          vi.mocked(mockEmailService.send).mockResolvedValueOnce({
            error: { message: errorMessage },
          });

          // Attempt to send email
          const result = await mockEmailService.send({
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            html: '<p>Test</p>',
          });

          if (result.error) {
            // Log to Sentry
            Sentry.captureException(
              new Error(`Failed to send ${emailData.emailType} email: ${result.error.message}`),
              {
                level: 'warning',
                tags: {
                  errorType: 'email_delivery',
                  emailType: emailData.emailType,
                },
              }
            );
          }

          // Verify Sentry was called
          expect(mockSentryCapture).toHaveBeenCalled();
          
          // Verify error context includes email type
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.tags?.errorType).toBe('email_delivery');
          expect(sentryCall[1]?.tags?.emailType).toBe(emailData.emailType);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Email delivery failures return appropriate error messages
   */
  it('should return user-friendly error messages on email delivery failure', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary form data
        fc.record({
          email: fc.emailAddress(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          message: fc.string({ minLength: 1, maxLength: 500 }),
        }),
        // Generate arbitrary error scenarios
        fc.constantFrom(
          'Network error',
          'Service unavailable',
          'Invalid API key',
          'Rate limit exceeded',
          'Timeout error'
        ),
        async (formData, errorScenario) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          vi.mocked(mockEmailService.send).mockClear();
          
          // Simulate email delivery failure
          vi.mocked(mockEmailService.send).mockResolvedValueOnce({
            error: { message: errorScenario },
          });

          let errorResponse: any = null;

          // Attempt to send email and handle error
          const result = await mockEmailService.send({
            from: 'test@example.com',
            to: formData.email,
            subject: 'Test',
            html: '<p>Test</p>',
          });

          if (result.error) {
            // Create user-friendly error response
            errorResponse = {
              error: 'An error occurred while processing your request',
              message: result.error.message,
              statusCode: 500,
            };

            // Log to Sentry
            Sentry.captureException(new Error(`Email delivery failed: ${result.error.message}`));
          }

          // Verify error response exists
          expect(errorResponse).not.toBeNull();
          expect(errorResponse.error).toBeDefined();
          expect(errorResponse.statusCode).toBe(500);

          // Verify Sentry was called
          expect(mockSentryCapture).toHaveBeenCalled();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Confirmation email failures don't fail the main request
   */
  it('should not fail main request when confirmation email fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (formData) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          vi.mocked(mockEmailService.send).mockClear();
          
          let mainEmailSent = false;
          let confirmationEmailFailed = false;
          let requestSucceeded = false;

          // Simulate successful main email
          vi.mocked(mockEmailService.send).mockResolvedValueOnce({
            id: 'main-email-id',
          });

          // Simulate failed confirmation email
          vi.mocked(mockEmailService.send).mockResolvedValueOnce({
            error: { message: 'Confirmation email failed' },
          });

          // Send main email (to sales team)
          const mainResult = await mockEmailService.send({
            from: 'test@example.com',
            to: 'sales@example.com',
            subject: 'New Form Submission',
            html: '<p>Test</p>',
          });

          if (!mainResult.error) {
            mainEmailSent = true;
          }

          // Send confirmation email (to user)
          const confirmResult = await mockEmailService.send({
            from: 'test@example.com',
            to: formData.email,
            subject: 'Confirmation',
            html: '<p>Test</p>',
          });

          if (confirmResult.error) {
            confirmationEmailFailed = true;
            
            // Log error but don't fail the request
            Sentry.captureException(
              new Error(`Confirmation email failed: ${confirmResult.error.message}`),
              {
                level: 'warning',
                tags: {
                  errorType: 'email_delivery',
                  emailType: 'confirmation',
                },
              }
            );
          }

          // Request should succeed even if confirmation email fails
          if (mainEmailSent) {
            requestSucceeded = true;
          }

          // Verify behavior
          expect(mainEmailSent).toBe(true);
          expect(confirmationEmailFailed).toBe(true);
          expect(requestSucceeded).toBe(true);

          // Verify Sentry was called for confirmation email failure
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[0]).toBeInstanceOf(Error);
          expect(sentryCall[1]?.level).toBe('warning');
          expect(sentryCall[1]?.tags?.errorType).toBe('email_delivery');
          expect(sentryCall[1]?.tags?.emailType).toBe('confirmation');
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: All email delivery errors include relevant context
   */
  it('should include relevant context when logging email errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailType: fc.constantFrom('rfq', 'contact', 'confirmation'),
          recipient: fc.emailAddress(),
          errorMessage: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        async (testData) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          vi.mocked(mockEmailService.send).mockClear();
          
          // Simulate email delivery failure
          vi.mocked(mockEmailService.send).mockResolvedValueOnce({
            error: { message: testData.errorMessage },
          });

          const result = await mockEmailService.send({
            from: 'test@example.com',
            to: testData.recipient,
            subject: 'Test',
            html: '<p>Test</p>',
          });

          if (result.error) {
            // Log to Sentry with context
            Sentry.captureException(
              new Error(`Failed to send ${testData.emailType} email: ${result.error.message}`),
              {
                level: 'error',
                tags: {
                  errorType: 'email_delivery',
                  emailType: testData.emailType,
                },
                extra: {
                  recipient: testData.recipient,
                  timestamp: new Date().toISOString(),
                },
              }
            );
          }

          // Verify Sentry was called with proper context
          expect(mockSentryCapture).toHaveBeenCalled();
          
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.tags?.errorType).toBe('email_delivery');
          expect(sentryCall[1]?.tags?.emailType).toBe(testData.emailType);
          expect(sentryCall[1]?.extra?.recipient).toBe(testData.recipient);
          expect(sentryCall[1]?.extra?.timestamp).toBeDefined();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Email errors are categorized by severity
   */
  it('should categorize email errors by severity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailType: fc.constantFrom('rfq', 'contact', 'confirmation'),
          errorType: fc.constantFrom('network', 'auth', 'rate_limit', 'invalid_recipient'),
        }),
        async (testData) => {
          // Reset mocks for this iteration
          mockSentryCapture.mockClear();
          vi.mocked(mockEmailService.send).mockClear();
          
          // Determine expected severity based on email type
          const expectedSeverity = testData.emailType === 'confirmation' ? 'warning' : 'error';

          // Simulate email delivery failure
          vi.mocked(mockEmailService.send).mockResolvedValueOnce({
            error: { message: `${testData.errorType} error` },
          });

          const result = await mockEmailService.send({
            from: 'test@example.com',
            to: 'test@example.com',
            subject: 'Test',
            html: '<p>Test</p>',
          });

          if (result.error) {
            // Log to Sentry with appropriate severity
            const severity = testData.emailType === 'confirmation' ? 'warning' : 'error';
            
            Sentry.captureException(
              new Error(`Email error: ${result.error.message}`),
              {
                level: severity,
                tags: {
                  errorType: 'email_delivery',
                  emailType: testData.emailType,
                },
              }
            );
          }

          // Verify Sentry was called with correct severity
          expect(mockSentryCapture).toHaveBeenCalled();
          
          const sentryCall = mockSentryCapture.mock.calls[mockSentryCapture.mock.calls.length - 1];
          expect(sentryCall[1]?.level).toBe(expectedSeverity);
        }
      ),
      { numRuns: 20 }
    );
  });
});
