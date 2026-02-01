/**
 * Tests for Animation Performance Utilities
 * 
 * Validates: Requirements 18.1, 18.6
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  AnimationPerformanceMonitor,
  prefersReducedMotion,
  getSafeAnimationDuration,
  getSafeScrollBehavior,
  validateAnimationProperties,
  createOptimizedAnimation,
  PERFORMANT_PROPERTIES,
  NON_PERFORMANT_PROPERTIES,
  TARGET_FPS
} from '../animation-performance';

describe('Animation Performance Utilities', () => {
  describe('AnimationPerformanceMonitor', () => {
    let monitor: AnimationPerformanceMonitor;

    beforeEach(() => {
      monitor = new AnimationPerformanceMonitor();
    });

    afterEach(() => {
      if (monitor.isActive()) {
        monitor.stopMonitoring();
      }
    });

    it('should start and stop monitoring', () => {
      expect(monitor.isActive()).toBe(false);

      monitor.startMonitoring();
      expect(monitor.isActive()).toBe(true);

      monitor.stopMonitoring();
      expect(monitor.isActive()).toBe(false);
    });

    it('should not start monitoring twice', () => {
      monitor.startMonitoring();
      const firstActive = monitor.isActive();

      monitor.startMonitoring(); // Try to start again
      const secondActive = monitor.isActive();

      expect(firstActive).toBe(true);
      expect(secondActive).toBe(true);

      monitor.stopMonitoring();
    });

    it('should return null when stopping without starting', () => {
      const results = monitor.stopMonitoring();
      expect(results).toBeNull();
    });

    it('should collect frame metrics', async () => {
      monitor.startMonitoring();

      // Wait for a few frames
      await new Promise(resolve => setTimeout(resolve, 100));

      const results = monitor.stopMonitoring();

      expect(results).not.toBeNull();
      expect(results!.totalFrames).toBeGreaterThan(0);
      expect(results!.averageFps).toBeGreaterThan(0);
      expect(results!.minFps).toBeGreaterThan(0);
      expect(results!.maxFps).toBeGreaterThan(0);
      expect(results!.droppedFrames).toBeGreaterThanOrEqual(0);
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return false when matchMedia not available', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });

    it('should check prefers-reduced-motion media query', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const result = prefersReducedMotion();

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
      expect(result).toBe(true);
    });
  });

  describe('getSafeAnimationDuration', () => {
    it('should return 0 when reduced motion is preferred', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const duration = getSafeAnimationDuration(300);
      expect(duration).toBe(0);
    });

    it('should return normal duration when reduced motion is not preferred', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const duration = getSafeAnimationDuration(300);
      expect(duration).toBe(300);
    });
  });

  describe('getSafeScrollBehavior', () => {
    it('should return "auto" when reduced motion is preferred', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const behavior = getSafeScrollBehavior();
      expect(behavior).toBe('auto');
    });

    it('should return "smooth" when reduced motion is not preferred', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const behavior = getSafeScrollBehavior();
      expect(behavior).toBe('smooth');
    });
  });

  describe('validateAnimationProperties', () => {
    it('should validate performant properties', () => {
      const element = document.createElement('div');
      element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

      const validation = validateAnimationProperties(element);

      expect(validation.isValid).toBe(true);
      expect(validation.nonPerformantProperties).toHaveLength(0);
    });

    it('should detect non-performant properties', () => {
      const element = document.createElement('div');
      element.style.transition = 'width 0.3s ease, height 0.3s ease';

      const validation = validateAnimationProperties(element);

      expect(validation.isValid).toBe(false);
      expect(validation.nonPerformantProperties).toContain('width');
      expect(validation.nonPerformantProperties).toContain('height');
    });

    it('should handle mixed performant and non-performant properties', () => {
      const element = document.createElement('div');
      element.style.transition = 'transform 0.3s ease, width 0.3s ease';

      const validation = validateAnimationProperties(element);

      expect(validation.isValid).toBe(false);
      expect(validation.animatedProperties).toContain('transform');
      expect(validation.animatedProperties).toContain('width');
      expect(validation.nonPerformantProperties).toContain('width');
      expect(validation.nonPerformantProperties).not.toContain('transform');
    });
  });

  describe('createOptimizedAnimation', () => {
    it('should create optimized animation with defaults', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const config = createOptimizedAnimation({});

      expect(config.duration).toBe(300);
      expect(config.easing).toBe('ease-out');
      expect(config.properties).toEqual(['transform', 'opacity']);
      expect(config.willChange).toBe('transform, opacity');
    });

    it('should respect custom duration', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const config = createOptimizedAnimation({ duration: 500 });

      expect(config.duration).toBe(500);
    });

    it('should filter out non-performant properties', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config = createOptimizedAnimation({
        properties: ['transform', 'width', 'opacity', 'height']
      });

      expect(config.properties).toEqual(['transform', 'opacity']);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should use defaults if all properties are non-performant', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      global.window.matchMedia = mockMatchMedia;

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config = createOptimizedAnimation({
        properties: ['width', 'height', 'margin']
      });

      expect(config.properties).toEqual(['transform', 'opacity']);

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Constants', () => {
    it('should define performant properties', () => {
      expect(PERFORMANT_PROPERTIES).toContain('transform');
      expect(PERFORMANT_PROPERTIES).toContain('opacity');
      expect(PERFORMANT_PROPERTIES).toHaveLength(2);
    });

    it('should define non-performant properties', () => {
      expect(NON_PERFORMANT_PROPERTIES).toContain('width');
      expect(NON_PERFORMANT_PROPERTIES).toContain('height');
      expect(NON_PERFORMANT_PROPERTIES).toContain('margin');
      expect(NON_PERFORMANT_PROPERTIES).toContain('padding');
    });

    it('should define target FPS', () => {
      expect(TARGET_FPS).toBe(60);
    });
  });
});
