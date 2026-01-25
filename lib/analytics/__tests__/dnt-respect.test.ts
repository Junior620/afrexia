/**
 * Property-Based Tests for Do Not Track Respect
 * 
 * Property 39: Do Not Track respect
 * Validates: Requirements 15.8
 * 
 * This test verifies that the analytics system respects the user's
 * Do Not Track (DNT) preference across all tracking platforms
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  trackEvent,
  isTrackingEnabled,
  ConversionEvent,
} from '../events';

describe('Property 39: Do Not Track respect', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock window object
    global.window = {
      plausible: vi.fn(),
      gtag: vi.fn(),
      va: vi.fn(),
      localStorage: {
        getItem: vi.fn(() => 'true'), // Consent given
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      },
    } as any;
  });

  /**
   * Property: When DNT is enabled, no tracking should occur
   */
  it('should not track any events when DNT is enabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ConversionEvent>(
          'rfq_submission',
          'contact_submission',
          'resource_download',
          'product_view',
          'cta_click'
        ),
        fc.constantFrom('1', 'yes'),
        fc.record({
          stringProp: fc.string(),
          numberProp: fc.nat(),
        }),
        (eventName, dntValue, properties) => {
          vi.clearAllMocks();

          // Set DNT header
          global.navigator = {
            doNotTrack: dntValue,
          } as any;

          // Track event
          trackEvent(eventName, properties);

          // Verify no tracking occurred
          expect((window as any).plausible).not.toHaveBeenCalled();
          expect((window as any).gtag).not.toHaveBeenCalled();
          expect((window as any).va).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: When DNT is disabled, tracking should occur normally
   */
  it('should track events normally when DNT is disabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ConversionEvent>(
          'rfq_submission',
          'contact_submission',
          'resource_download',
          'product_view',
          'cta_click'
        ),
        fc.constantFrom('0', 'no', null, undefined),
        fc.record({
          stringProp: fc.string(),
          numberProp: fc.nat(),
        }),
        (eventName, dntValue, properties) => {
          vi.clearAllMocks();

          // Set DNT header
          global.navigator = {
            doNotTrack: dntValue,
          } as any;

          // Track event
          trackEvent(eventName, properties);

          // Verify tracking occurred (at least Plausible should be called)
          expect((window as any).plausible).toHaveBeenCalled();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: isTrackingEnabled should return false when DNT is enabled
   */
  it('should report tracking as disabled when DNT is enabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('1', 'yes'),
        (dntValue) => {
          // Set DNT header
          global.navigator = {
            doNotTrack: dntValue,
          } as any;

          // Check tracking status
          const enabled = isTrackingEnabled();

          // Should be disabled
          expect(enabled).toBe(false);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: isTrackingEnabled should return true when DNT is disabled
   */
  it('should report tracking as enabled when DNT is disabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('0', 'no', null, undefined),
        (dntValue) => {
          // Set DNT header
          global.navigator = {
            doNotTrack: dntValue,
          } as any;

          // Check tracking status
          const enabled = isTrackingEnabled();

          // Should be enabled
          expect(enabled).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: DNT should be respected across all tracking platforms
   */
  it('should respect DNT for all analytics platforms', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (dntEnabled) => {
          vi.clearAllMocks();

          // Set DNT header
          global.navigator = {
            doNotTrack: dntEnabled ? '1' : '0',
          } as any;

          // Track multiple events
          trackEvent('rfq_submission', {});
          trackEvent('contact_submission', {});
          trackEvent('product_view', {});

          if (dntEnabled) {
            // No platform should have been called
            expect((window as any).plausible).not.toHaveBeenCalled();
            expect((window as any).gtag).not.toHaveBeenCalled();
            expect((window as any).va).not.toHaveBeenCalled();
          } else {
            // At least Plausible should have been called
            expect((window as any).plausible).toHaveBeenCalled();
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property: DNT should work with window.doNotTrack property
   */
  it('should respect window.doNotTrack property', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('1', 'yes'),
        (dntValue) => {
          vi.clearAllMocks();

          // Set window.doNotTrack instead of navigator.doNotTrack
          global.navigator = {} as any;
          (global.window as any).doNotTrack = dntValue;

          trackEvent('product_view', {});

          // Should not track
          expect((window as any).plausible).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: DNT should work with msDoNotTrack property (IE/Edge)
   */
  it('should respect navigator.msDoNotTrack property', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('1', 'yes'),
        (dntValue) => {
          vi.clearAllMocks();

          // Set msDoNotTrack for IE/Edge compatibility
          global.navigator = {
            msDoNotTrack: dntValue,
          } as any;

          trackEvent('product_view', {});

          // Should not track
          expect((window as any).plausible).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 20 }
    );
  });
});
