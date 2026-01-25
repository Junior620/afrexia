/**
 * Property-Based Test: Reduced Motion Respect
 * 
 * Property 27: Reduced motion respect
 * Validates: Requirements 7.5
 * 
 * This test verifies that the animation system respects the user's
 * prefers-reduced-motion preference by disabling or simplifying animations.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';

describe('Property 27: Reduced Motion Respect', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Save original matchMedia
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
    
    // Clear module cache to reset GSAP state
    vi.resetModules();
  });

  /**
   * Mock matchMedia to simulate reduced motion preference
   */
  function mockMatchMedia(prefersReducedMotion: boolean) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' && prefersReducedMotion,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  it('Property: shouldReduceMotion returns true when prefers-reduced-motion is set', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (prefersReducedMotion) => {
        mockMatchMedia(prefersReducedMotion);
        
        // Dynamically import to get fresh module with current matchMedia mock
        const { shouldReduceMotion } = await import('../gsap-config');
        const result = shouldReduceMotion();
        expect(result).toBe(prefersReducedMotion);
      })
    );
  });

  it('Property: Animation presets respect reduced motion preference', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        fc.constantFrom('fadeIn', 'slideInLeft', 'slideInRight', 'scaleIn', 'staggerFadeIn'),
        async (prefersReducedMotion, presetName) => {
          mockMatchMedia(prefersReducedMotion);

          // Dynamically import modules
          const { animationPresets } = await import('../presets');

          // Create a test element
          const element = document.createElement('div');
          document.body.appendChild(element);

          // Apply animation preset
          if (presetName === 'counterAnimation') {
            // Counter animation requires additional parameters
            animationPresets.counterAnimation(element, 100, 2, '');
          } else {
            type NonCounterPreset = Exclude<keyof typeof animationPresets, 'counterAnimation'>;
            const preset = animationPresets[presetName as NonCounterPreset];
            if (typeof preset === 'function') {
              preset(element);
            }
          }

          // When reduced motion is preferred, element should be immediately visible
          if (prefersReducedMotion) {
            const computedStyle = window.getComputedStyle(element);
            // Element should be visible (opacity 1) and in final position
            expect(parseFloat(computedStyle.opacity)).toBeGreaterThanOrEqual(0.9);
          }

          // Cleanup
          document.body.removeChild(element);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property: createScrollTrigger returns null when reduced motion is preferred', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (prefersReducedMotion) => {
        mockMatchMedia(prefersReducedMotion);

        // Dynamically import modules
        const { createScrollTrigger } = await import('../gsap-config');
        const { gsap } = await import('gsap');

        const element = document.createElement('div');
        document.body.appendChild(element);

        const animation = gsap.from(element, { opacity: 0, y: 30 });
        const trigger = createScrollTrigger(element, animation);

        if (prefersReducedMotion) {
          // Should return null when reduced motion is preferred
          expect(trigger).toBeNull();
          // Element should be immediately visible
          const computedStyle = window.getComputedStyle(element);
          expect(parseFloat(computedStyle.opacity)).toBeGreaterThanOrEqual(0.9);
        } else {
          // Should create a ScrollTrigger when reduced motion is not preferred
          expect(trigger).not.toBeNull();
        }

        // Cleanup
        if (trigger) {
          trigger.kill();
        }
        animation.kill();
        document.body.removeChild(element);
      })
    );
  });

  it('Property: Counter animation respects reduced motion by showing final value immediately', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        fc.integer({ min: 0, max: 10000 }),
        fc.string({ minLength: 0, maxLength: 5 }),
        async (prefersReducedMotion, endValue, suffix) => {
          mockMatchMedia(prefersReducedMotion);

          // Dynamically import modules
          const { animationPresets } = await import('../presets');

          const element = document.createElement('div');
          document.body.appendChild(element);

          animationPresets.counterAnimation(element, endValue, 2, suffix);

          if (prefersReducedMotion) {
            // When reduced motion is preferred, final value should be shown immediately
            const expectedText = `${Math.round(endValue).toLocaleString()}${suffix}`;
            expect(element.textContent).toBe(expectedText);
          }

          // Cleanup
          document.body.removeChild(element);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property: All animation types respect reduced motion consistently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        fc.constantFrom('fadeIn', 'slideInLeft', 'slideInRight', 'scaleIn'),
        async (prefersReducedMotion, animationType) => {
          mockMatchMedia(prefersReducedMotion);

          // Dynamically import modules
          const { animationPresets } = await import('../presets');

          const element = document.createElement('div');
          document.body.appendChild(element);

          // Apply animation (animationType is always one of the non-counter animations)
          type NonCounterPreset = Exclude<keyof typeof animationPresets, 'counterAnimation'>;
          const preset = animationPresets[animationType as NonCounterPreset];
          if (typeof preset === 'function') {
            preset(element);
          }

          // Check that element is in final state when reduced motion is preferred
          if (prefersReducedMotion) {
            const computedStyle = window.getComputedStyle(element);
            const opacity = parseFloat(computedStyle.opacity);
            
            // Element should be fully visible
            expect(opacity).toBeGreaterThanOrEqual(0.9);
          }

          // Cleanup
          document.body.removeChild(element);
        }
      ),
      { numRuns: 50 }
    );
  });
});
