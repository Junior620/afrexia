/**
 * Unit tests for ISR Error Handler
 *
 * Validates that ISR regeneration errors are properly logged with full context
 * and that the cached version is served by re-throwing the error.
 *
 * @see Requirements 1.15.5 - Serve cached version and log error on regeneration failure
 */

import { vi } from 'vitest';
import {
  handleISRError,
  createISRError,
  withISRErrorHandling,
  withISRRegeneration,
  logISRSuccess,
  ISRErrorType,
  type ISRError,
  type ISRRegenerationContext,
} from '../isrErrorHandler';

// ============================================================================
// Helpers
// ============================================================================

function makeISRError(overrides: Partial<ISRError> = {}): ISRError {
  return {
    type: ISRErrorType.DATA_FETCH_ERROR,
    message: 'Sanity query failed',
    path: '/fr/prix/cacao-cameroun',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    context: {
      locale: 'fr',
      pageType: 'PRICE_PAGES',
      productSlug: 'cacao',
      revalidateSeconds: 86400,
    },
    ...overrides,
  };
}

// ============================================================================
// handleISRError
// ============================================================================

describe('handleISRError', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('logs error to console by default', () => {
    const error = makeISRError();
    handleISRError(error, { sendToSentry: false });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const [label, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(label).toContain('[ISR Regeneration Error]');
    expect(payload.type).toBe(ISRErrorType.DATA_FETCH_ERROR);
    expect(payload.message).toBe('Sanity query failed');
    expect(payload.path).toBe('/fr/prix/cacao-cameroun');
  });

  it('includes locale in log payload', () => {
    const error = makeISRError({ context: { locale: 'en', pageType: 'PRICE_PAGES' } });
    handleISRError(error, { sendToSentry: false });

    const [, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.locale).toBe('en');
  });

  it('includes timestamp in log payload', () => {
    const error = makeISRError();
    handleISRError(error, { sendToSentry: false });

    const [, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.timestamp).toBe('2024-01-15T10:00:00.000Z');
  });

  it('includes regeneration context in log payload', () => {
    const context: ISRRegenerationContext = {
      locale: 'fr',
      pageType: 'PRODUCT_COUNTRY_PAGES',
      productSlug: 'cacao',
      countrySlug: 'pays-bas',
      revalidateSeconds: 604800,
    };
    const error = makeISRError({ context });
    handleISRError(error, { sendToSentry: false });

    const [, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.regenerationContext).toEqual(context);
  });

  it('includes stack trace when originalError has a stack', () => {
    const originalError = new Error('Network timeout');
    const error = makeISRError({ originalError });
    handleISRError(error, { sendToSentry: false });

    const [, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.stackTrace).toBeDefined();
    expect(typeof payload.stackTrace).toBe('string');
  });

  it('does not log to console when logToConsole is false', () => {
    const error = makeISRError();
    handleISRError(error, { logToConsole: false, sendToSentry: false });

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('calls custom handler when provided', () => {
    const customHandler = vi.fn();
    const error = makeISRError();
    handleISRError(error, { sendToSentry: false, customHandler });

    expect(customHandler).toHaveBeenCalledWith(error);
  });
});

// ============================================================================
// createISRError
// ============================================================================

describe('createISRError', () => {
  it('creates ISR error from an Error instance', () => {
    const original = new Error('Sanity timeout');
    const isrError = createISRError(original, '/fr/prix/cacao-cameroun', ISRErrorType.DATA_FETCH_ERROR);

    expect(isrError.type).toBe(ISRErrorType.DATA_FETCH_ERROR);
    expect(isrError.message).toBe('Sanity timeout');
    expect(isrError.originalError).toBe(original);
    expect(isrError.path).toBe('/fr/prix/cacao-cameroun');
    expect(isrError.timestamp).toBeInstanceOf(Date);
  });

  it('creates ISR error from a non-Error value', () => {
    const isrError = createISRError('string error', '/fr/prix/cacao-cameroun');

    expect(isrError.message).toBe('string error');
    expect(isrError.originalError).toBeInstanceOf(Error);
  });

  it('defaults to UNKNOWN_ERROR type', () => {
    const isrError = createISRError(new Error('oops'), '/fr/prix/cacao-cameroun');
    expect(isrError.type).toBe(ISRErrorType.UNKNOWN_ERROR);
  });

  it('attaches regeneration context', () => {
    const context: ISRRegenerationContext = {
      locale: 'fr',
      pageType: 'PRICE_PAGES',
      productSlug: 'cacao',
      revalidateSeconds: 86400,
    };
    const isrError = createISRError(
      new Error('fetch failed'),
      '/fr/prix/cacao-cameroun',
      ISRErrorType.DATA_FETCH_ERROR,
      context
    );

    expect(isrError.context).toEqual(context);
    expect(isrError.context?.locale).toBe('fr');
    expect(isrError.context?.pageType).toBe('PRICE_PAGES');
  });

  it('sets timestamp to current time', () => {
    const before = Date.now();
    const isrError = createISRError(new Error('err'), '/path');
    const after = Date.now();

    expect(isrError.timestamp.getTime()).toBeGreaterThanOrEqual(before);
    expect(isrError.timestamp.getTime()).toBeLessThanOrEqual(after);
  });
});

// ============================================================================
// withISRErrorHandling
// ============================================================================

describe('withISRErrorHandling', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('returns the result when the function succeeds', async () => {
    const fn = vi.fn().mockResolvedValue({ product: 'cacao' });
    const wrapped = withISRErrorHandling(fn, '/fr/prix/cacao-cameroun', ISRErrorType.DATA_FETCH_ERROR);

    const result = await wrapped();
    expect(result).toEqual({ product: 'cacao' });
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('logs error and re-throws when the function fails', async () => {
    const original = new Error('Sanity unavailable');
    const fn = vi.fn().mockRejectedValue(original);
    const wrapped = withISRErrorHandling(fn, '/fr/prix/cacao-cameroun', ISRErrorType.DATA_FETCH_ERROR);

    await expect(wrapped()).rejects.toThrow('Sanity unavailable');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toContain('[ISR Regeneration Error]');
  });

  it('includes context in the logged error', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    const context: ISRRegenerationContext = { locale: 'en', pageType: 'PRICE_PAGES' };
    const wrapped = withISRErrorHandling(fn, '/en/prix/cacao-cameroun', ISRErrorType.DATA_FETCH_ERROR, context);

    await expect(wrapped()).rejects.toThrow();
    const [, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.locale).toBe('en');
    expect(payload.regenerationContext).toEqual(context);
  });
});

// ============================================================================
// withISRRegeneration
// ============================================================================

describe('withISRRegeneration', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('returns the result when the function succeeds', async () => {
    const fn = vi.fn().mockResolvedValue([{ name: 'Cacao' }, 2500, []]);
    const result = await withISRRegeneration(fn, '/fr/prix/cacao-cameroun', ISRErrorType.DATA_FETCH_ERROR);

    expect(result).toEqual([{ name: 'Cacao' }, 2500, []]);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('logs error with full context and re-throws on failure', async () => {
    const original = new Error('CMS timeout');
    const fn = vi.fn().mockRejectedValue(original);
    const context: ISRRegenerationContext = {
      locale: 'fr',
      pageType: 'PRICE_PAGES',
      productSlug: 'cacao',
      revalidateSeconds: 86400,
    };

    await expect(
      withISRRegeneration(fn, '/fr/prix/cacao-cameroun', ISRErrorType.DATA_FETCH_ERROR, context)
    ).rejects.toThrow('CMS timeout');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const [label, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(label).toContain('[ISR Regeneration Error]');
    expect(payload.path).toBe('/fr/prix/cacao-cameroun');
    expect(payload.locale).toBe('fr');
    const rctx = payload.regenerationContext as ISRRegenerationContext;
    expect(rctx.pageType).toBe('PRICE_PAGES');
    expect(rctx.revalidateSeconds).toBe(86400);
  });

  it('re-throws the original error (not a wrapped one)', async () => {
    const original = new Error('original error');
    const fn = vi.fn().mockRejectedValue(original);

    await expect(
      withISRRegeneration(fn, '/fr/prix/cacao-cameroun')
    ).rejects.toBe(original);
  });

  it('logs error with stack trace when available', async () => {
    const original = new Error('stack trace test');
    const fn = vi.fn().mockRejectedValue(original);

    await expect(
      withISRRegeneration(fn, '/fr/prix/cacao-cameroun', ISRErrorType.DATA_FETCH_ERROR)
    ).rejects.toThrow();

    const [, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.stackTrace).toBeDefined();
  });

  it('handles all ISR error types', async () => {
    for (const errorType of Object.values(ISRErrorType)) {
      consoleSpy.mockClear();
      const fn = vi.fn().mockRejectedValue(new Error('fail'));

      await expect(
        withISRRegeneration(fn, '/fr/prix/cacao-cameroun', errorType)
      ).rejects.toThrow();

      const [, payload] = consoleSpy.mock.calls[0] as [string, Record<string, unknown>];
      expect(payload.type).toBe(errorType);
    }
  });
});

// ============================================================================
// logISRSuccess
// ============================================================================

describe('logISRSuccess', () => {
  it('accepts path, duration, and optional context without throwing', () => {
    expect(() => logISRSuccess('/fr/prix/cacao-cameroun', 500)).not.toThrow();
    expect(() => logISRSuccess('/fr/prix/cacao-cameroun', 500, { locale: 'fr' })).not.toThrow();
  });
});

// ============================================================================
// ISR error types coverage
// ============================================================================

describe('ISRErrorType enum', () => {
  it('has all expected error types', () => {
    expect(ISRErrorType.DATA_FETCH_ERROR).toBe('DATA_FETCH_ERROR');
    expect(ISRErrorType.CONTENT_GENERATION_ERROR).toBe('CONTENT_GENERATION_ERROR');
    expect(ISRErrorType.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ISRErrorType.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR');
  });
});
