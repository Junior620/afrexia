/**
 * Performance Monitor for Navigation System
 * 
 * Monitors and logs performance metrics for navigation state management:
 * - Core Web Vitals (LCP, FID, CLS)
 * - Navigation restoration timing
 * - State capture timing
 * 
 * Logs metrics in development mode for debugging and optimization.
 * 
 * Requirements: 12.1, 12.4
 * from responsive-intelligent-navigation/requirements.md
 */

/**
 * Performance metric types
 */
export enum MetricType {
  LCP = 'largest-contentful-paint',
  FID = 'first-input',
  CLS = 'layout-shift',
  RESTORATION_START = 'restoration-start',
  RESTORATION_COMPLETE = 'restoration-complete',
  STATE_CAPTURE = 'state-capture'
}

/**
 * Performance metric data
 */
export interface PerformanceMetric {
  type: MetricType;
  value: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Core Web Vitals thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: 2500,  // 2.5 seconds
  FID: 100,   // 100 milliseconds
  CLS: 0.1,   // 0.1 score
  RESTORATION: 150  // 150ms for restoration initiation
} as const;

/**
 * Configuration for PerformanceMonitor
 */
export interface PerformanceMonitorConfig {
  /** Enable performance monitoring (default: true in development) */
  enabled?: boolean;
  /** Enable console logging (default: true in development) */
  logToConsole?: boolean;
  /** Callback for custom metric handling */
  onMetric?: (metric: PerformanceMetric) => void;
}

/**
 * Performance Monitor Class
 * 
 * Monitors Core Web Vitals and navigation-specific performance metrics.
 * Provides timing measurements for restoration operations and logs
 * metrics in development mode.
 * 
 * Features:
 * - LCP (Largest Contentful Paint) monitoring
 * - FID (First Input Delay) monitoring
 * - CLS (Cumulative Layout Shift) monitoring
 * - Navigation restoration timing
 * - State capture timing
 * - Development mode logging
 * 
 * Validates: Requirements 12.1, 12.4
 */
export class PerformanceMonitor {
  private config: Required<Omit<PerformanceMonitorConfig, 'onMetric'>> & Pick<PerformanceMonitorConfig, 'onMetric'>;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private clsValue: number = 0;
  private restorationStartTime: number | null = null;
  private isInitialized: boolean = false;

  constructor(config: PerformanceMonitorConfig = {}) {
    const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
    
    this.config = {
      enabled: config.enabled ?? isDevelopment,
      logToConsole: config.logToConsole ?? isDevelopment,
      onMetric: config.onMetric
    };
  }

  /**
   * Initialize performance monitoring
   * Sets up PerformanceObserver instances for Core Web Vitals
   * 
   * Validates: Requirements 12.1, 12.4
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    if (!this.config.enabled) {
      return;
    }

    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not available');
      return;
    }

    this.log('Initializing PerformanceMonitor');

    // Monitor LCP (Largest Contentful Paint)
    this.observeLCP();

    // Monitor FID (First Input Delay)
    this.observeFID();

    // Monitor CLS (Cumulative Layout Shift)
    this.observeCLS();

    this.isInitialized = true;
    this.log('PerformanceMonitor initialized');
  }

  /**
   * Clean up observers
   */
  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.clsValue = 0;
    this.restorationStartTime = null;
    this.isInitialized = false;
  }

  /**
   * Observe Largest Contentful Paint (LCP)
   * 
   * LCP measures loading performance - should be < 2.5s
   * 
   * Validates: Requirement 12.4
   */
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        
        if (lastEntry) {
          const value = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
          
          this.recordMetric({
            type: MetricType.LCP,
            value,
            timestamp: Date.now(),
            metadata: {
              element: (lastEntry as any).element?.tagName,
              url: (lastEntry as any).url
            }
          });

          // Log if exceeds threshold
          if (value > WEB_VITALS_THRESHOLDS.LCP) {
            this.log(`⚠️ LCP exceeded threshold: ${value.toFixed(2)}ms (threshold: ${WEB_VITALS_THRESHOLDS.LCP}ms)`);
          } else {
            this.log(`✓ LCP: ${value.toFixed(2)}ms`);
          }
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Failed to observe LCP:', error);
    }
  }

  /**
   * Observe First Input Delay (FID)
   * 
   * FID measures interactivity - should be < 100ms
   * 
   * Validates: Requirement 12.4
   */
  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number };
          const value = fidEntry.processingStart ? fidEntry.processingStart - entry.startTime : 0;
          
          this.recordMetric({
            type: MetricType.FID,
            value,
            timestamp: Date.now(),
            metadata: {
              name: entry.name
            }
          });

          // Log if exceeds threshold
          if (value > WEB_VITALS_THRESHOLDS.FID) {
            this.log(`⚠️ FID exceeded threshold: ${value.toFixed(2)}ms (threshold: ${WEB_VITALS_THRESHOLDS.FID}ms)`);
          } else {
            this.log(`✓ FID: ${value.toFixed(2)}ms`);
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Failed to observe FID:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift (CLS)
   * 
   * CLS measures visual stability - should be < 0.1
   * 
   * Validates: Requirement 12.4
   */
  private observeCLS(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          
          // Only count layout shifts without recent user input
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            this.clsValue += layoutShiftEntry.value;
            
            this.recordMetric({
              type: MetricType.CLS,
              value: this.clsValue,
              timestamp: Date.now(),
              metadata: {
                shiftValue: layoutShiftEntry.value
              }
            });

            // Log if exceeds threshold
            if (this.clsValue > WEB_VITALS_THRESHOLDS.CLS) {
              this.log(`⚠️ CLS exceeded threshold: ${this.clsValue.toFixed(4)} (threshold: ${WEB_VITALS_THRESHOLDS.CLS})`);
            }
          }
        });
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Failed to observe CLS:', error);
    }
  }

  /**
   * Mark the start of a restoration operation
   * 
   * @param metadata - Optional metadata about the restoration
   * 
   * Validates: Requirement 12.1
   */
  public markRestorationStart(metadata?: Record<string, unknown>): void {
    if (!this.config.enabled) {
      return;
    }

    this.restorationStartTime = performance.now();
    
    this.recordMetric({
      type: MetricType.RESTORATION_START,
      value: this.restorationStartTime,
      timestamp: Date.now(),
      metadata
    });

    this.log('Restoration started', metadata);
  }

  /**
   * Mark the completion of a restoration operation
   * Calculates and logs the duration
   * 
   * @param metadata - Optional metadata about the restoration
   * @returns Duration in milliseconds
   * 
   * Validates: Requirement 12.1
   */
  public markRestorationComplete(metadata?: Record<string, unknown>): number | null {
    if (!this.config.enabled || this.restorationStartTime === null) {
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - this.restorationStartTime;
    
    this.recordMetric({
      type: MetricType.RESTORATION_COMPLETE,
      value: duration,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        startTime: this.restorationStartTime,
        endTime
      }
    });

    // Log if exceeds threshold
    if (duration > WEB_VITALS_THRESHOLDS.RESTORATION) {
      this.log(`⚠️ Restoration exceeded threshold: ${duration.toFixed(2)}ms (threshold: ${WEB_VITALS_THRESHOLDS.RESTORATION}ms)`, metadata);
    } else {
      this.log(`✓ Restoration completed in ${duration.toFixed(2)}ms`, metadata);
    }

    // Reset start time
    this.restorationStartTime = null;

    return duration;
  }

  /**
   * Measure and record state capture timing
   * 
   * @param callback - Function to measure
   * @param metadata - Optional metadata
   * @returns Result of the callback
   * 
   * Validates: Requirement 12.1
   */
  public measureStateCapture<T>(callback: () => T, metadata?: Record<string, unknown>): T {
    if (!this.config.enabled) {
      return callback();
    }

    const startTime = performance.now();
    const result = callback();
    const duration = performance.now() - startTime;

    this.recordMetric({
      type: MetricType.STATE_CAPTURE,
      value: duration,
      timestamp: Date.now(),
      metadata
    });

    this.log(`State capture took ${duration.toFixed(2)}ms`, metadata);

    return result;
  }

  /**
   * Record a performance metric
   * 
   * @param metric - Metric to record
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Call custom handler if provided
    if (this.config.onMetric) {
      try {
        this.config.onMetric(metric);
      } catch (error) {
        console.error('Error in onMetric callback:', error);
      }
    }
  }

  /**
   * Get all recorded metrics
   * 
   * @returns Array of performance metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by type
   * 
   * @param type - Metric type to filter by
   * @returns Array of metrics of the specified type
   */
  public getMetricsByType(type: MetricType): PerformanceMetric[] {
    return this.metrics.filter(m => m.type === type);
  }

  /**
   * Get current CLS value
   * 
   * @returns Current cumulative layout shift score
   */
  public getCurrentCLS(): number {
    return this.clsValue;
  }

  /**
   * Get summary of Core Web Vitals
   * 
   * @returns Object with latest values for each vital
   */
  public getWebVitalsSummary(): {
    lcp: number | null;
    fid: number | null;
    cls: number;
    restorationAvg: number | null;
  } {
    const lcpMetrics = this.getMetricsByType(MetricType.LCP);
    const fidMetrics = this.getMetricsByType(MetricType.FID);
    const restorationMetrics = this.getMetricsByType(MetricType.RESTORATION_COMPLETE);

    const lcp = lcpMetrics.length > 0 ? lcpMetrics[lcpMetrics.length - 1].value : null;
    const fid = fidMetrics.length > 0 ? fidMetrics[0].value : null;
    const cls = this.clsValue;
    
    const restorationAvg = restorationMetrics.length > 0
      ? restorationMetrics.reduce((sum, m) => sum + m.value, 0) / restorationMetrics.length
      : null;

    return { lcp, fid, cls, restorationAvg };
  }

  /**
   * Clear all recorded metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
    this.clsValue = 0;
    this.restorationStartTime = null;
  }

  /**
   * Log message if console logging is enabled
   * 
   * @param message - Message to log
   * @param data - Optional data to log
   */
  private log(message: string, data?: unknown): void {
    if (this.config.logToConsole) {
      if (data !== undefined) {
        console.log(`[PerformanceMonitor] ${message}`, data);
      } else {
        console.log(`[PerformanceMonitor] ${message}`);
      }
    }
  }

  /**
   * Check if monitoring is enabled
   * 
   * @returns True if enabled
   */
  public isEnabled(): boolean {
    return this.config.enabled;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
