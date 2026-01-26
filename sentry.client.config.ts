/**
 * Sentry Client Configuration
 * Requirements: 25.1
 * 
 * This file configures Sentry for client-side error tracking.
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Replay configuration for session replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out sensitive data before sending to Sentry
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Filter out non-error events from browser extensions
    if (event.exception) {
      const exceptionValue = event.exception.values?.[0]?.value || '';
      
      // Ignore browser extension errors
      if (
        exceptionValue.includes('chrome-extension://') ||
        exceptionValue.includes('moz-extension://') ||
        exceptionValue.includes('safari-extension://')
      ) {
        return null;
      }

      // Ignore network errors that are likely user connectivity issues
      if (
        exceptionValue.includes('NetworkError') ||
        exceptionValue.includes('Failed to fetch')
      ) {
        return null;
      }
    }

    // Remove sensitive data from request
    if (event.request) {
      delete event.request.cookies;
      
      // Sanitize query strings
      if (event.request.query_string) {
        event.request.query_string = '[Filtered]';
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
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension',
    'moz-extension',
    // Random plugins/extensions
    'atomicFindClose',
    // Facebook borked
    'fb_xd_fragment',
    // ISP optimizing proxy - `Cache-Control: no-transform` seems to reduce this
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    'Can\'t find variable: ZiteReader',
    'jigsaw is not defined',
    'ComboSearch is not defined',
    // Network errors
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    // ResizeObserver errors (benign)
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ],

  // Set environment
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development',

  // Set release version
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
});
