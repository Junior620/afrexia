/**
 * Animation Performance Utilities
 * 
 * Utilities to ensure animations maintain 60fps performance by:
 * - Only animating transform and opacity properties
 * - Respecting prefers-reduced-motion
 * - Monitoring frame rates during animations
 * 
 * Requirements: 18.1, 18.6
 * from responsive-intelligent-navigation/requirements.md
 */

/**
 * Properties that can be animated without triggering layout/paint
 * These properties only trigger composite operations
 */
export const PERFORMANT_PROPERTIES = ['transform', 'opacity'] as const;

/**
 * Properties that should be avoided in animations
 * These trigger layout recalculation or paint operations
 */
export const NON_PERFORMANT_PROPERTIES = [
  'width',
  'height',
  'top',
  'left',
  'right',
  'bottom',
  'margin',
  'padding',
  'border',
  'background',
  'color',
  'font-size'
] as const;

/**
 * Target frame rate for animations
 */
export const TARGET_FPS = 60;
export const TARGET_FRAME_TIME = 1000 / TARGET_FPS; // ~16.67ms

/**
 * Animation performance monitor
 */
export class AnimationPerformanceMonitor {
  private frameCount: number = 0;
  private startTime: number = 0;
  private lastFrameTime: number = 0;
  private frameTimes: number[] = [];
  private animationFrameId: number | null = null;
  private isMonitoring: boolean = false;

  /**
   * Start monitoring animation performance
   */
  public startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') {
      return;
    }

    this.isMonitoring = true;
    this.frameCount = 0;
    this.frameTimes = [];
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;

    this.monitorFrame();
  }

  /**
   * Stop monitoring and return results
   * 
   * @returns Performance metrics
   */
  public stopMonitoring(): {
    averageFps: number;
    minFps: number;
    maxFps: number;
    droppedFrames: number;
    totalFrames: number;
  } | null {
    if (!this.isMonitoring) {
      return null;
    }

    this.isMonitoring = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.frameTimes.length === 0) {
      return null;
    }

    // Calculate FPS for each frame
    const fps = this.frameTimes.map(time => 1000 / time);
    const averageFps = fps.reduce((sum, f) => sum + f, 0) / fps.length;
    const minFps = Math.min(...fps);
    const maxFps = Math.max(...fps);

    // Count dropped frames (frames that took longer than target)
    const droppedFrames = this.frameTimes.filter(time => time > TARGET_FRAME_TIME).length;

    return {
      averageFps: Math.round(averageFps),
      minFps: Math.round(minFps),
      maxFps: Math.round(maxFps),
      droppedFrames,
      totalFrames: this.frameCount
    };
  }

  /**
   * Monitor a single frame
   */
  private monitorFrame(): void {
    if (!this.isMonitoring) {
      return;
    }

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;

    this.frameTimes.push(frameTime);
    this.frameCount++;
    this.lastFrameTime = currentTime;

    this.animationFrameId = requestAnimationFrame(() => this.monitorFrame());
  }

  /**
   * Check if currently monitoring
   * 
   * @returns True if monitoring
   */
  public isActive(): boolean {
    return this.isMonitoring;
  }
}

/**
 * Check if user prefers reduced motion
 * 
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get safe animation duration based on user preferences
 * 
 * @param normalDuration - Normal animation duration in ms
 * @returns 0 if reduced motion preferred, otherwise normal duration
 */
export function getSafeAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration;
}

/**
 * Get safe scroll behavior based on user preferences
 * 
 * @returns 'auto' if reduced motion preferred, otherwise 'smooth'
 */
export function getSafeScrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

/**
 * Validate that an animation only uses performant properties
 * 
 * @param element - Element to check
 * @returns Object with validation result and details
 */
export function validateAnimationProperties(element: HTMLElement): {
  isValid: boolean;
  animatedProperties: string[];
  nonPerformantProperties: string[];
} {
  if (typeof window === 'undefined') {
    return {
      isValid: true,
      animatedProperties: [],
      nonPerformantProperties: []
    };
  }

  const computedStyle = window.getComputedStyle(element);
  const transition = computedStyle.transition;
  const animation = computedStyle.animation;

  const animatedProperties: string[] = [];
  const nonPerformantProperties: string[] = [];

  // Parse transition properties
  if (transition && transition !== 'none' && transition !== 'all 0s ease 0s') {
    const transitionProps = transition.split(',').map(t => {
      const parts = t.trim().split(' ');
      return parts[0]; // First part is the property name
    });

    animatedProperties.push(...transitionProps);
  }

  // Check for non-performant properties
  animatedProperties.forEach(prop => {
    if (NON_PERFORMANT_PROPERTIES.includes(prop as any)) {
      nonPerformantProperties.push(prop);
    }
  });

  return {
    isValid: nonPerformantProperties.length === 0,
    animatedProperties,
    nonPerformantProperties
  };
}

/**
 * Log animation performance warning if non-performant properties detected
 * 
 * @param element - Element to check
 * @param elementName - Name for logging
 */
export function warnNonPerformantAnimation(element: HTMLElement, elementName: string = 'element'): void {
  const validation = validateAnimationProperties(element);

  if (!validation.isValid) {
    console.warn(
      `[Animation Performance] ${elementName} is animating non-performant properties:`,
      validation.nonPerformantProperties,
      '\nConsider using only transform and opacity for 60fps animations.'
    );
  }
}

/**
 * Create a performance-optimized animation configuration
 * 
 * @param config - Animation configuration
 * @returns Optimized configuration
 */
export function createOptimizedAnimation(config: {
  duration?: number;
  easing?: string;
  properties?: string[];
}): {
  duration: number;
  easing: string;
  properties: string[];
  willChange: string;
} {
  const duration = getSafeAnimationDuration(config.duration ?? 300);
  const properties = config.properties ?? ['transform', 'opacity'];

  // Validate properties
  const nonPerformant = properties.filter(prop =>
    NON_PERFORMANT_PROPERTIES.includes(prop as any)
  );

  if (nonPerformant.length > 0) {
    console.warn(
      '[Animation Performance] Non-performant properties detected:',
      nonPerformant,
      '\nReplacing with performant alternatives.'
    );
  }

  // Filter to only performant properties
  const performantProps = properties.filter(prop =>
    PERFORMANT_PROPERTIES.includes(prop as any)
  );

  return {
    duration,
    easing: config.easing ?? 'ease-out',
    properties: performantProps.length > 0 ? performantProps : ['transform', 'opacity'],
    willChange: performantProps.join(', ')
  };
}

/**
 * Apply will-change hint for upcoming animation
 * Should be called before animation starts and removed after
 * 
 * @param element - Element to optimize
 * @param properties - Properties that will be animated
 */
export function applyWillChange(element: HTMLElement, properties: string[] = ['transform', 'opacity']): void {
  if (typeof window === 'undefined') {
    return;
  }

  element.style.willChange = properties.join(', ');
}

/**
 * Remove will-change hint after animation completes
 * 
 * @param element - Element to clean up
 */
export function removeWillChange(element: HTMLElement): void {
  if (typeof window === 'undefined') {
    return;
  }

  element.style.willChange = 'auto';
}

/**
 * Measure animation performance
 * 
 * @param callback - Animation function to measure
 * @param duration - Expected animation duration in ms
 * @returns Promise with performance metrics
 */
export async function measureAnimationPerformance(
  callback: () => void | Promise<void>,
  duration: number
): Promise<{
  averageFps: number;
  minFps: number;
  maxFps: number;
  droppedFrames: number;
  totalFrames: number;
} | null> {
  const monitor = new AnimationPerformanceMonitor();

  monitor.startMonitoring();

  try {
    await callback();

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, duration + 100));
  } finally {
    return monitor.stopMonitoring();
  }
}

// Export singleton monitor for global use
export const globalAnimationMonitor = new AnimationPerformanceMonitor();
