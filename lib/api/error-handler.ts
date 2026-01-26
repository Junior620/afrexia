/**
 * Centralized API Error Handler
 * Requirements: 19.6
 * 
 * This module provides utilities for handling errors in API routes
 * with consistent error responses and Sentry logging.
 */

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
  statusCode: number;
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Error types for classification
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  DATABASE = 'DATABASE_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}

/**
 * Get user-friendly error message based on error type
 */
function getUserFriendlyMessage(error: Error | APIError): string {
  if (error instanceof APIError) {
    return error.message;
  }

  // Map common error patterns to user-friendly messages
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('validation')) {
    return 'The data you provided is invalid. Please check your input and try again.';
  }

  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return 'Too many requests. Please try again later.';
  }

  if (errorMessage.includes('not found')) {
    return 'The requested resource was not found.';
  }

  if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
    return 'Authentication failed. Please check your credentials.';
  }

  if (errorMessage.includes('forbidden') || errorMessage.includes('permission')) {
    return 'You do not have permission to perform this action.';
  }

  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'A network error occurred. Please check your connection and try again.';
  }

  if (errorMessage.includes('timeout')) {
    return 'The request timed out. Please try again.';
  }

  // Default generic message
  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Determine if error should be logged to Sentry
 */
function shouldLogToSentry(error: Error | APIError): boolean {
  // Don't log validation errors or rate limit errors
  if (error instanceof APIError) {
    return error.statusCode >= 500;
  }

  const errorMessage = error.message.toLowerCase();
  
  // Don't log expected errors
  if (
    errorMessage.includes('validation') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests')
  ) {
    return false;
  }

  return true;
}

/**
 * Get appropriate HTTP status code from error
 */
function getStatusCode(error: Error | APIError): number {
  if (error instanceof APIError) {
    return error.statusCode;
  }

  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('validation')) return 400;
  if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) return 401;
  if (errorMessage.includes('forbidden') || errorMessage.includes('permission')) return 403;
  if (errorMessage.includes('not found')) return 404;
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) return 429;

  return 500;
}

/**
 * Main error handler for API routes
 * 
 * @param error - The error to handle
 * @param context - Additional context for error logging
 * @returns NextResponse with appropriate error message and status code
 */
export function handleAPIError(
  error: Error | APIError,
  context?: Record<string, any>
): NextResponse<ErrorResponse> {
  const statusCode = getStatusCode(error);
  const userMessage = getUserFriendlyMessage(error);

  // Log to Sentry if appropriate
  if (shouldLogToSentry(error)) {
    Sentry.captureException(error, {
      level: statusCode >= 500 ? 'error' : 'warning',
      tags: {
        errorType: error instanceof APIError ? 'api_error' : 'unhandled_error',
        statusCode: statusCode.toString(),
      },
      extra: {
        ...context,
        originalMessage: error.message,
      },
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      error: error.message,
      stack: error.stack,
      statusCode,
      context,
    });
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    error: userMessage,
    statusCode,
  };

  // Include details in development or for validation errors
  if (
    process.env.NODE_ENV === 'development' ||
    statusCode === 400
  ) {
    errorResponse.message = error.message;
    if (error instanceof APIError && error.details) {
      errorResponse.details = error.details;
    }
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Async error wrapper for API route handlers
 * 
 * @param handler - The async handler function
 * @returns Wrapped handler with error handling
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(
        error instanceof Error ? error : new Error('Unknown error'),
        {
          handler: handler.name,
          args: args.map((arg) => {
            // Safely stringify args, avoiding circular references
            try {
              return JSON.stringify(arg);
            } catch {
              return '[Circular or Non-Serializable]';
            }
          }),
        }
      );
    }
  }) as T;
}

/**
 * Create a validation error
 */
export function createValidationError(message: string, details?: any): APIError {
  return new APIError(message, 400, details);
}

/**
 * Create a not found error
 */
export function createNotFoundError(resource: string): APIError {
  return new APIError(`${resource} not found`, 404);
}

/**
 * Create a rate limit error
 */
export function createRateLimitError(): APIError {
  return new APIError('Too many requests. Please try again later.', 429);
}

/**
 * Create an external service error
 */
export function createExternalServiceError(service: string, originalError?: Error): APIError {
  const message = `External service error: ${service}`;
  const error = new APIError(message, 502);
  
  if (originalError) {
    error.details = {
      originalError: originalError.message,
    };
  }
  
  return error;
}
