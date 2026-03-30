/**
 * ISR Error Handler
 *
 * This module handles errors during ISR regeneration and implements
 * fallback strategies to serve cached content when regeneration fails.
 *
 * When a regeneration fails, Next.js ISR automatically serves the last
 * successfully cached version. This module ensures errors are properly
 * logged with full context so the team can investigate and fix issues.
 *
 * @see Requirements 1.15 - ISR Error Handling
 * @see Requirements 1.15.5 - Serve cached version and log error on regeneration failure
 */

/**
 * ISR error types
 */
export enum ISRErrorType {
  /**
   * Data fetch failed (e.g., Sanity CMS unavailable)
   */
  DATA_FETCH_ERROR = 'DATA_FETCH_ERROR',

  /**
   * Content generation failed
   */
  CONTENT_GENERATION_ERROR = 'CONTENT_GENERATION_ERROR',

  /**
   * Validation failed (e.g., data completeness below threshold)
   */
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  /**
   * Unknown error during regeneration
   */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * ISR regeneration context — captures all relevant information about
 * the page being regenerated when an error occurs.
 */
export interface ISRRegenerationContext {
  /**
   * The locale of the page being regenerated (e.g., 'fr', 'en')
   */
  locale?: string;

  /**
   * The page type (e.g., 'PRICE_PAGES', 'PRODUCT_COUNTRY_PAGES')
   */
  pageType?: string;

  /**
   * Product slug if applicable
   */
  productSlug?: string;

  /**
   * Country slug if applicable
   */
  countrySlug?: string;

  /**
   * Comparison type slug if applicable
   */
  comparisonType?: string;

  /**
   * Price slug if applicable
   */
  priceSlug?: string;

  /**
   * Revalidation interval in seconds
   */
  revalidateSeconds?: number;

  /**
   * Any additional context key-value pairs
   */
  [key: string]: unknown;
}

/**
 * ISR error details — full context for a regeneration failure
 */
export interface ISRError {
  /**
   * Error type
   */
  type: ISRErrorType;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Original error object
   */
  originalError?: Error;

  /**
   * Page path that failed to regenerate (e.g., '/fr/prix/cacao-cameroun')
   */
  path: string;

  /**
   * Timestamp of the error
   */
  timestamp: Date;

  /**
   * Full regeneration context (locale, pageType, slugs, etc.)
   */
  context?: ISRRegenerationContext;
}

/**
 * ISR error handler options
 */
export interface ISRErrorHandlerOptions {
  /**
   * Whether to log errors to console (default: true)
   */
  logToConsole?: boolean;

  /**
   * Whether to send errors to Sentry (default: true in production)
   */
  sendToSentry?: boolean;

  /**
   * Custom error handler callback
   */
  customHandler?: (error: ISRError) => void;
}

/**
 * Default error handler options
 */
const DEFAULT_OPTIONS: ISRErrorHandlerOptions = {
  logToConsole: true,
  sendToSentry: process.env.NODE_ENV === 'production',
};

/**
 * Handle ISR regeneration errors.
 *
 * Logs the error with full context (path, locale, message, stack trace,
 * timestamp, regeneration context) and optionally sends to Sentry.
 *
 * Next.js ISR will automatically serve the last cached version when a
 * regeneration throws — this function ensures the failure is observable.
 *
 * @param error - The ISR error with full context
 * @param options - Error handler options
 *
 * @example
 * ```typescript
 * try {
 *   const data = await fetchProductData(slug);
 *   return generatePage(data);
 * } catch (err) {
 *   handleISRError({
 *     type: ISRErrorType.DATA_FETCH_ERROR,
 *     message: 'Failed to fetch product data',
 *     originalError: err as Error,
 *     path: `/fr/produits/${slug}/export-${countrySlug}`,
 *     timestamp: new Date(),
 *     context: { locale: 'fr', productSlug: slug, countrySlug, pageType: 'PRODUCT_COUNTRY_PAGES' },
 *   });
 *   // Re-throw so Next.js serves the cached version
 *   throw err;
 * }
 * ```
 */
export function handleISRError(
  error: ISRError,
  options: ISRErrorHandlerOptions = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (opts.logToConsole) {
    const logPayload: Record<string, unknown> = {
      type: error.type,
      message: error.message,
      path: error.path,
      timestamp: error.timestamp.toISOString(),
    };

    // Include locale prominently if available
    if (error.context?.locale) {
      logPayload.locale = error.context.locale;
    }

    // Include regeneration context
    if (error.context) {
      logPayload.regenerationContext = error.context;
    }

    // Include stack trace for debugging
    if (error.originalError?.stack) {
      logPayload.stackTrace = error.originalError.stack;
    }

    console.error('[ISR Regeneration Error] Serving cached version.', logPayload);
  }

  // Send to Sentry in production
  if (opts.sendToSentry) {
    try {
      // Dynamic import to avoid hard dependency on Sentry
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Sentry = require('@sentry/nextjs');
      Sentry.captureException(error.originalError || new Error(error.message), {
        tags: {
          errorType: error.type,
          isrPath: error.path,
          locale: error.context?.locale ?? 'unknown',
          pageType: error.context?.pageType ?? 'unknown',
        },
        contexts: {
          isr: {
            type: error.type,
            path: error.path,
            timestamp: error.timestamp.toISOString(),
            ...error.context,
          },
        },
      });
    } catch {
      // Sentry not available — silently skip
    }
  }

  // Call custom handler if provided
  if (opts.customHandler) {
    opts.customHandler(error);
  }
}

/**
 * Create an ISR error from a caught exception.
 *
 * @param err - The caught error (unknown type)
 * @param path - The page path that failed
 * @param type - The error type (defaults to UNKNOWN_ERROR)
 * @param context - Full regeneration context (locale, pageType, slugs, etc.)
 * @returns ISR error object ready for handleISRError()
 *
 * @example
 * ```typescript
 * try {
 *   await fetchData();
 * } catch (err) {
 *   const isrError = createISRError(
 *     err,
 *     '/fr/prix/cacao-cameroun',
 *     ISRErrorType.DATA_FETCH_ERROR,
 *     { locale: 'fr', productSlug: 'cacao', pageType: 'PRICE_PAGES', revalidateSeconds: 86400 }
 *   );
 *   handleISRError(isrError);
 * }
 * ```
 */
export function createISRError(
  err: unknown,
  path: string,
  type: ISRErrorType = ISRErrorType.UNKNOWN_ERROR,
  context?: ISRRegenerationContext
): ISRError {
  const error = err instanceof Error ? err : new Error(String(err));

  return {
    type,
    message: error.message,
    originalError: error,
    path,
    timestamp: new Date(),
    context,
  };
}

/**
 * Wrap an async function with ISR error handling.
 *
 * The wrapped function logs the error with full context and re-throws,
 * allowing Next.js to serve the cached version automatically.
 *
 * @param fn - The async function to wrap
 * @param path - The page path
 * @param errorType - The error type for failures
 * @param context - Regeneration context (locale, pageType, slugs, etc.)
 * @returns Wrapped function with error handling
 *
 * @example
 * ```typescript
 * const fetchWithErrorHandling = withISRErrorHandling(
 *   async () => await fetchProductData(slug),
 *   `/fr/produits/${slug}/export-${countrySlug}`,
 *   ISRErrorType.DATA_FETCH_ERROR,
 *   { locale: 'fr', productSlug: slug, countrySlug, pageType: 'PRODUCT_COUNTRY_PAGES' }
 * );
 *
 * const data = await fetchWithErrorHandling();
 * ```
 */
export function withISRErrorHandling<T>(
  fn: () => Promise<T>,
  path: string,
  errorType: ISRErrorType,
  context?: ISRRegenerationContext
): () => Promise<T> {
  return async () => {
    try {
      return await fn();
    } catch (err) {
      const isrError = createISRError(err, path, errorType, context);
      handleISRError(isrError);
      throw err; // Re-throw so Next.js serves the cached version
    }
  };
}

/**
 * Log successful ISR regeneration.
 *
 * @param path - The page path that was regenerated
 * @param duration - Regeneration duration in milliseconds
 * @param context - Additional context
 *
 * @example
 * ```typescript
 * const startTime = Date.now();
 * await regeneratePage();
 * logISRSuccess('/fr/prix/cacao-cameroun', Date.now() - startTime, {
 *   locale: 'fr',
 *   productSlug: 'cacao',
 *   priceUpdated: true,
 * });
 * ```
 */
export function logISRSuccess(
  path: string,
  duration: number,
  context?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[ISR Success]', {
      path,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }
}

/**
 * ISR regeneration wrapper with error handling, logging, and cached-version fallback.
 *
 * Wraps a regeneration function so that:
 * 1. Errors are logged with full context (path, locale, stack trace, timestamp)
 * 2. The error is re-thrown so Next.js ISR serves the last cached version
 * 3. Successful regenerations are logged in development
 *
 * @param fn - The regeneration function
 * @param path - The page path
 * @param errorType - The error type for failures
 * @param context - Regeneration context (locale, pageType, slugs, etc.)
 * @returns Result of the regeneration function
 *
 * @example
 * ```typescript
 * // In a Next.js page component:
 * export default async function PricePage({ params }) {
 *   const path = `/${params.locale}/prix/${params.priceSlug}`;
 *
 *   const data = await withISRRegeneration(
 *     () => fetchPriceData(params.priceSlug),
 *     path,
 *     ISRErrorType.DATA_FETCH_ERROR,
 *     { locale: params.locale, priceSlug: params.priceSlug, pageType: 'PRICE_PAGES', revalidateSeconds: 86400 }
 *   );
 *
 *   // If fetchPriceData throws, the error is logged and Next.js serves the cache.
 *   // If no cache exists yet, Next.js returns a 500.
 * }
 * ```
 */
export async function withISRRegeneration<T>(
  fn: () => Promise<T>,
  path: string,
  errorType: ISRErrorType = ISRErrorType.UNKNOWN_ERROR,
  context?: ISRRegenerationContext
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await fn();
    logISRSuccess(path, Date.now() - startTime, context as Record<string, unknown>);
    return result;
  } catch (err) {
    const isrError = createISRError(err, path, errorType, context);
    handleISRError(isrError);
    // Re-throw: Next.js ISR will serve the last cached version automatically
    throw err;
  }
}
