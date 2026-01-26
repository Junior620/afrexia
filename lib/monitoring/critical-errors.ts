/**
 * Critical Error Detection and Alerting
 * Requirements: 25.3
 * 
 * This module provides utilities for detecting and alerting on critical errors
 * that require immediate attention.
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Critical error categories
 */
export enum CriticalErrorCategory {
  EMAIL_DELIVERY = 'email_delivery',
  PAYMENT_PROCESSING = 'payment_processing',
  DATA_LOSS = 'data_loss',
  SECURITY_BREACH = 'security_breach',
  SERVICE_OUTAGE = 'service_outage',
  API_FAILURE = 'api_failure',
}

/**
 * Determine if an error is critical
 */
export function isCriticalError(error: Error): boolean {
  const errorMessage = error.message.toLowerCase();
  
  // Critical error patterns
  const criticalPatterns = [
    'failed to send sales email',
    'failed to send rfq email',
    'database connection failed',
    'payment failed',
    'data corruption',
    'security violation',
    'unauthorized access',
    'service unavailable',
  ];

  return criticalPatterns.some(pattern => errorMessage.includes(pattern));
}

/**
 * Determine error severity
 */
export function getErrorSeverity(error: Error): ErrorSeverity {
  if (isCriticalError(error)) {
    return ErrorSeverity.CRITICAL;
  }

  const errorMessage = error.message.toLowerCase();

  // High severity patterns
  if (
    errorMessage.includes('external service error') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('rate limit exceeded')
  ) {
    return ErrorSeverity.HIGH;
  }

  // Medium severity patterns
  if (
    errorMessage.includes('validation') ||
    errorMessage.includes('not found') ||
    errorMessage.includes('invalid')
  ) {
    return ErrorSeverity.MEDIUM;
  }

  return ErrorSeverity.LOW;
}

/**
 * Categorize critical errors
 */
export function categorizeCriticalError(error: Error): CriticalErrorCategory | null {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('email') || errorMessage.includes('resend')) {
    return CriticalErrorCategory.EMAIL_DELIVERY;
  }

  if (errorMessage.includes('payment') || errorMessage.includes('transaction')) {
    return CriticalErrorCategory.PAYMENT_PROCESSING;
  }

  if (errorMessage.includes('data loss') || errorMessage.includes('corruption')) {
    return CriticalErrorCategory.DATA_LOSS;
  }

  if (
    errorMessage.includes('security') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('breach')
  ) {
    return CriticalErrorCategory.SECURITY_BREACH;
  }

  if (
    errorMessage.includes('service unavailable') ||
    errorMessage.includes('outage') ||
    errorMessage.includes('down')
  ) {
    return CriticalErrorCategory.SERVICE_OUTAGE;
  }

  if (errorMessage.includes('api') || errorMessage.includes('external service')) {
    return CriticalErrorCategory.API_FAILURE;
  }

  return null;
}

/**
 * Report critical error with enhanced context
 */
export function reportCriticalError(
  error: Error,
  context?: Record<string, any>
): string {
  const severity = getErrorSeverity(error);
  const category = categorizeCriticalError(error);

  const eventId = Sentry.captureException(error, {
    level: severity === ErrorSeverity.CRITICAL ? 'fatal' : 'error',
    tags: {
      severity,
      category: category || 'uncategorized',
      critical: isCriticalError(error) ? 'true' : 'false',
    },
    extra: {
      ...context,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    fingerprint: [
      error.name,
      error.message,
      category || 'uncategorized',
    ],
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Critical Error Reported:', {
      eventId,
      severity,
      category,
      error: error.message,
      stack: error.stack,
      context,
    });
  }

  return eventId;
}

/**
 * Report email delivery failure (critical)
 */
export function reportEmailDeliveryFailure(
  emailType: 'rfq' | 'contact' | 'confirmation',
  recipient: string,
  error: Error,
  context?: Record<string, any>
): string {
  const enhancedError = new Error(
    `Failed to send ${emailType} email to ${recipient}: ${error.message}`
  );
  enhancedError.name = 'EmailDeliveryError';
  enhancedError.stack = error.stack;

  return reportCriticalError(enhancedError, {
    ...context,
    emailType,
    recipient,
    originalError: error.message,
  });
}

/**
 * Report external service failure
 */
export function reportExternalServiceFailure(
  serviceName: string,
  operation: string,
  error: Error,
  context?: Record<string, any>
): string {
  const enhancedError = new Error(
    `External service failure: ${serviceName} - ${operation}: ${error.message}`
  );
  enhancedError.name = 'ExternalServiceError';
  enhancedError.stack = error.stack;

  return reportCriticalError(enhancedError, {
    ...context,
    serviceName,
    operation,
    originalError: error.message,
  });
}

/**
 * Report security violation
 */
export function reportSecurityViolation(
  violationType: string,
  details: string,
  context?: Record<string, any>
): string {
  const error = new Error(`Security violation: ${violationType} - ${details}`);
  error.name = 'SecurityViolation';

  return Sentry.captureException(error, {
    level: 'fatal',
    tags: {
      severity: ErrorSeverity.CRITICAL,
      category: CriticalErrorCategory.SECURITY_BREACH,
      violationType,
    },
    extra: {
      ...context,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
  });
}

/**
 * Check if error rate is above threshold
 * This would typically be used with a time-series database or monitoring service
 */
export function isErrorRateHigh(
  errorCount: number,
  timeWindowMinutes: number,
  threshold: number = 10
): boolean {
  const errorsPerMinute = errorCount / timeWindowMinutes;
  return errorsPerMinute > threshold;
}

/**
 * Create alert context for better debugging
 */
export function createAlertContext(
  request?: Request,
  additionalContext?: Record<string, any>
): Record<string, any> {
  const context: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    ...additionalContext,
  };

  if (request) {
    context.request = {
      url: request.url,
      method: request.method,
      headers: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
      },
    };
  }

  return context;
}
