/**
 * Sentry Server Configuration
 * Requirements: 25.1
 * 
 * This file configures Sentry for server-side error tracking.
 */

import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry if DSN is configured
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn && dsn !== 'your_sentry_dsn' && dsn.startsWith('https://')) {
  Sentry.init({
    dsn,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter out sensitive data before sending to Sentry
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Remove sensitive data from request
    if (event.request) {
      delete event.request.cookies;
      
      // Sanitize headers
      if (event.request.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
        delete event.request.headers['x-api-key'];
      }

      // Sanitize query strings
      if (event.request.query_string) {
        event.request.query_string = '[Filtered]';
      }
    }

    // Remove PII from extra data
    if (event.extra) {
      // Remove email addresses
      if (event.extra.email) {
        event.extra.email = '[Filtered]';
      }
      // Remove phone numbers
      if (event.extra.phone) {
        event.extra.phone = '[Filtered]';
      }
      // Remove API keys
      if (event.extra.apiKey) {
        event.extra.apiKey = '[Filtered]';
      }
    }

    // Remove PII from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data) {
          // Remove email addresses
          if (breadcrumb.data.email) {
            breadcrumb.data.email = '[Filtered]';
          }
          // Remove phone numbers
          if (breadcrumb.data.phone) {
            breadcrumb.data.phone = '[Filtered]';
          }
        }
        return breadcrumb;
      });
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Network errors
    'NetworkError',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    // Rate limiting errors (expected)
    'Too many requests',
  ],

  // Set environment
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development',

  // Set release version
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
});
} else {
  console.log('Sentry server not initialized: DSN not configured');
}
