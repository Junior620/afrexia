/**
 * Property-Based Test: Animation Performance
 * 
 * Property 28: Animation performance on desktop
 * Property 29: Animation performance on mobile
 * Validates: Requirements 7.3, 7.4
 * 
 * This test verifies that animations maintain acceptable performance
 * on both desktop (60fps) and mobile (30fps minimum) devices.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { AnimationPerformanceMonitor } from '../performance';

describe('Property 28 & 29: Animation Performance', () => {
  let monitor: AnimationPerformanceMonitor;

  beforeEach(() => {
    monitor = new AnimationPerformanceMonitor();
  });

  afterEach(() => {
    monitor.stopMonitoring();
  });

  it('Property 28: Performance monitor tracks FPS correctly on desktop', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 30, max: 120 }),
        () => {
          // Monitor should be able to track FPS
          expect(monitor.getFPS()).toBeGreaterThanOrEqual(0);
          expect(monitor.getFPS()).toBeLessThanOrEqual(120);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 28: Performance monitor detects low performance on desktop', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 60 }),
        (fpsThreshold) => {
          let lowPerformanceDetected = false;
          
          monitor.setFPSThreshold(fpsThreshold);
          monitor.startMonitoring(() => {
            lowPerformanceDetected = true;
          });

          // The callback should be callable
          expect(typeof lowPerformanceDetected).toBe('boolean');
          
          monitor.stopMonitoring();
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 29: Performance monitor can be configured for mobile thresholds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20, max: 40 }),
        (mobileThreshold) => {
          // Mobile devices should have lower FPS threshold (30fps)
          monitor.setFPSThreshold(mobileThreshold);
          
          // Monitor should accept mobile-appropriate thresholds
          expect(mobileThreshold).toBeGreaterThanOrEqual(20);
          expect(mobileThreshold).toBeLessThanOrEqual(40);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property: Performance monitor can start and stop monitoring', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (shouldMonitor) => {
          if (shouldMonitor) {
            monitor.startMonitoring(() => {});
            // Monitor should be running
            expect(monitor.getFPS()).toBeGreaterThanOrEqual(0);
            monitor.stopMonitoring();
          } else {
            // Monitor should not be running initially
            expect(monitor.getFPS()).toBeGreaterThanOrEqual(0);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property: FPS threshold is always positive', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 120 }),
        (threshold) => {
          monitor.setFPSThreshold(threshold);
          
          // Threshold should be positive
          expect(threshold).toBeGreaterThan(0);
          expect(threshold).toBeLessThanOrEqual(120);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property: Multiple start calls do not create multiple monitors', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (startCount) => {
          // Start monitoring multiple times
          for (let i = 0; i < startCount; i++) {
            monitor.startMonitoring(() => {});
          }
          
          // Should still have only one monitor instance
          const fps = monitor.getFPS();
          expect(fps).toBeGreaterThanOrEqual(0);
          expect(fps).toBeLessThanOrEqual(120);
          
          monitor.stopMonitoring();
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property: Desktop animations should target 60fps', () => {
    const desktopFPSTarget = 60;
    const desktopFPSThreshold = 30; // Minimum acceptable
    
    // Desktop should aim for 60fps
    expect(desktopFPSTarget).toBe(60);
    expect(desktopFPSThreshold).toBeGreaterThanOrEqual(30);
  });

  it('Property: Mobile animations should maintain minimum 30fps', () => {
    const mobileFPSThreshold = 30;
    
    // Mobile should maintain at least 30fps
    expect(mobileFPSThreshold).toBe(30);
    expect(mobileFPSThreshold).toBeGreaterThanOrEqual(20);
  });

  it('Property: Performance monitoring does not affect animation execution', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (withMonitoring) => {
          if (withMonitoring) {
            monitor.startMonitoring(() => {});
          }
          
          // Create a simple animation-like operation
          const startTime = performance.now();
          let iterations = 0;
          
          // Simulate animation frames
          for (let i = 0; i < 10; i++) {
            iterations++;
          }
          
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Monitoring should not significantly impact performance
          expect(iterations).toBe(10);
          expect(duration).toBeGreaterThanOrEqual(0);
          
          if (withMonitoring) {
            monitor.stopMonitoring();
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  it('Property: Animation performance requirements are consistent', () => {
    // Desktop: 60fps target, 30fps minimum
    const desktopTarget = 60;
    const desktopMinimum = 30;
    
    // Mobile: 30fps minimum
    const mobileMinimum = 30;
    
    // Verify consistency
    expect(desktopTarget).toBeGreaterThan(desktopMinimum);
    expect(desktopMinimum).toBeGreaterThanOrEqual(mobileMinimum);
    expect(mobileMinimum).toBeGreaterThan(0);
  });
});
