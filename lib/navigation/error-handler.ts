/**
 * Error Handler for Navigation System
 * 
 * Provides comprehensive error handling, logging, and tracking
 * for the intelligent navigation state management system.
 * 
 * Features:
 * - Silent error logging (no user-facing errors)
 * - Development mode debug logging
 * - Production error tracking integration points
 * - Error categorization and context capture
 * - Graceful degradation strategies
 * 
 * Requirements: 15.2, 21.1, 21.2, 21.3, 21.4, 21.5
 * from responsive-intelligent-navigation/requirements.md
 */

/**
 * Error categories for navigation system
 */
export enum ErrorCategory {
  STORAGE = 'storage',
  RESTORATION = 'restoration',
  CAPTURE = 'capture',
  FOCUS = 'focus',
  ANIMATION = 'animation',
  NETWORK = 'network',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',       // Minor issues, system continues normally
  MEDIUM = 'medium', // Degraded functionality, fallback used
  HIGH = 'high',     // Major feature failure, significant impact
  CRITICAL = 'critical' // System-wide failure
}

/**
 * Error context interface
 */
export interface ErrorContext {
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  error?: Error | unknown;
  metadata?: Record<string, unknown>;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

/**
 * Error tracking callback type
 */
export type ErrorTrackingCallback = (context: ErrorContext) => void;

/**
 * Configuration for error handler
 */
export interface ErrorHandlerConfig {
  /** Enable debug logging in console (default: false) */
  debug?: boolean;
  /** Enable error tracking (default: true) */
  enableTracking?: boolean;
  /** Custom error tracking callback */
  trackingCallback?: ErrorTrackingCallback;
  /** Maximum errors to track in memory (default: 100) */
  maxErrorHistory?: number;
  /** Environment (development/production) */
  environment?: 'development' | 'production';
}

/**
 * Error Handler Class
 * 
 * Central error handling service for navigation system.
 * Provides silent error logging, debug mode, and tracking integration.
 * 
 * Validates: Requirements 15.2, 21.1, 21.2, 21.3, 21.4, 21.5
 */
export class ErrorHandler {
  private config: Required<ErrorHandlerConfig>;
  private errorHistory: ErrorContext[] = [];
  private errorCounts: Map<ErrorCategory, number> = new Map();
  private isInitialized: boolean = false;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      debug: config.debug ?? (typeof process !== 'undefined' && process.env.NODE_ENV === 'development'),
      enableTracking: config.enableTracking ?? true,
      trackingCallback: config.trackingCallback ?? this.defaultTrackingCallback,
      maxErrorHistory: config.maxErrorHistory ?? 100,
      environment: config.environment ?? (typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ? 'production' : 'development')
    };

    // Initialize error counts
    Object.values(ErrorCategory).forEach(category => {
      this.errorCounts.set(category, 0);
    });
  }

  /**
   * Initialize the error handler
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.log('ErrorHandler initialized', {
      debug: this.config.debug,
      enableTracking: this.config.enableTracking,
      environment: this.config.environment
    });

    this.isInitialized = true;
  }

  /**
   * Handle a storage error
   * 
   * @param message - Error message
   * @param error - Error object
   * @param metadata - Additional context
   * 
   * Validates: Requirement 15.2
   */
  public handleStorageError(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.handleError({
      category: ErrorCategory.STORAGE,
      severity: this.determineStorageSeverity(error),
      message,
      error,
      metadata
    });
  }

  /**
   * Handle a restoration error
   * 
   * @param message - Error message
   * @param error - Error object
   * @param metadata - Additional context
   * 
   * Validates: Requirement 21.2
   */
  public handleRestorationError(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.handleError({
      category: ErrorCategory.RESTORATION,
      severity: ErrorSeverity.MEDIUM,
      message,
      error,
      metadata
    });
  }

  /**
   * Handle a capture error
   * 
   * @param message - Error message
   * @param error - Error object
   * @param metadata - Additional context
   * 
   * Validates: Requirement 21.2
   */
  public handleCaptureError(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.handleError({
      category: ErrorCategory.CAPTURE,
      severity: ErrorSeverity.MEDIUM,
      message,
      error,
      metadata
    });
  }

  /**
   * Handle a focus restoration error
   * 
   * @param message - Error message
   * @param error - Error object
   * @param metadata - Additional context
   * 
   * Validates: Requirement 21.2
   */
  public handleFocusError(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.handleError({
      category: ErrorCategory.FOCUS,
      severity: ErrorSeverity.LOW,
      message,
      error,
      metadata
    });
  }

  /**
   * Handle an animation error
   * 
   * @param message - Error message
   * @param error - Error object
   * @param metadata - Additional context
   * 
   * Validates: Requirement 21.2
   */
  public handleAnimationError(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.handleError({
      category: ErrorCategory.ANIMATION,
      severity: ErrorSeverity.LOW,
      message,
      error,
      metadata
    });
  }

  /**
   * Handle a network/loading error
   * 
   * @param message - Error message
   * @param error - Error object
   * @param metadata - Additional context
   * 
   * Validates: Requirement 21.2
   */
  public handleNetworkError(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.handleError({
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message,
      error,
      metadata
    });
  }

  /**
   * Handle a validation error
   * 
   * @param message - Error message
   * @param error - Error object
   * @param metadata - Additional context
   * 
   * Validates: Requirement 21.2
   */
  public handleValidationError(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.handleError({
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      message,
      error,
      metadata
    });
  }

  /**
   * Handle a generic error
   * 
   * @param context - Partial error context
   * 
   * Validates: Requirements 21.1, 21.2, 21.3
   */
  private handleError(context: Omit<ErrorContext, 'timestamp' | 'userAgent' | 'url'>): void {
    // Build complete error context
    const fullContext: ErrorContext = {
      ...context,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    };

    // Update error counts
    const currentCount = this.errorCounts.get(context.category) || 0;
    this.errorCounts.set(context.category, currentCount + 1);

    // Add to error history (with limit)
    this.errorHistory.push(fullContext);
    if (this.errorHistory.length > this.config.maxErrorHistory) {
      this.errorHistory.shift(); // Remove oldest
    }

    // Log error based on mode
    this.logError(fullContext);

    // Track error if enabled
    if (this.config.enableTracking) {
      this.trackError(fullContext);
    }
  }

  /**
   * Log error to console
   * 
   * Development mode: Detailed logging with stack traces
   * Production mode: Silent logging (errors only, no details to user)
   * 
   * Validates: Requirements 21.1, 21.2
   */
  private logError(context: ErrorContext): void {
    const prefix = `[NavigationError:${context.category}]`;
    
    if (this.config.debug || this.config.environment === 'development') {
      // Development mode: Detailed logging
      console.group(`${prefix} ${context.message}`);
      console.error('Severity:', context.severity);
      console.error('Timestamp:', new Date(context.timestamp).toISOString());
      
      if (context.error) {
        console.error('Error:', context.error);
      }
      
      if (context.metadata) {
        console.error('Metadata:', context.metadata);
      }
      
      if (context.url) {
        console.error('URL:', context.url);
      }
      
      console.groupEnd();
    } else {
      // Production mode: Silent logging (console.error only, no details)
      console.error(`${prefix} ${context.message}`);
    }
  }

  /**
   * Track error to monitoring service
   * 
   * Validates: Requirements 21.4, 21.5
   */
  private trackError(context: ErrorContext): void {
    try {
      // Call custom tracking callback
      this.config.trackingCallback(context);
    } catch (error) {
      // Prevent tracking errors from breaking the system
      console.error('[ErrorHandler] Failed to track error:', error);
    }
  }

  /**
   * Default error tracking callback
   * Provides integration point for monitoring services (Sentry, etc.)
   * 
   * @param context - Error context
   * 
   * Validates: Requirements 21.4, 21.5
   */
  private defaultTrackingCallback(context: ErrorContext): void {
    // Integration point for error tracking services
    // Example: Sentry, LogRocket, Datadog, etc.
    
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      // Sentry integration example
      (window as any).Sentry.captureException(context.error || new Error(context.message), {
        level: this.mapSeverityToSentryLevel(context.severity),
        tags: {
          category: context.category,
          severity: context.severity
        },
        extra: {
          ...context.metadata,
          timestamp: context.timestamp,
          url: context.url
        }
      });
    }

    // Add other monitoring service integrations here
    // Example: LogRocket, Datadog, custom analytics, etc.
  }

  /**
   * Map error severity to Sentry level
   */
  private mapSeverityToSentryLevel(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'info';
      case ErrorSeverity.MEDIUM:
        return 'warning';
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.CRITICAL:
        return 'fatal';
      default:
        return 'error';
    }
  }

  /**
   * Determine storage error severity based on error type
   */
  private determineStorageSeverity(error: Error | unknown): ErrorSeverity {
    if (error instanceof Error) {
      // QuotaExceededError is medium severity (can retry with cleanup)
      if (error.name === 'QuotaExceededError') {
        return ErrorSeverity.MEDIUM;
      }
      
      // SecurityError (private browsing) is high severity (no fallback)
      if (error.name === 'SecurityError') {
        return ErrorSeverity.HIGH;
      }
    }
    
    // Default to medium for storage errors
    return ErrorSeverity.MEDIUM;
  }

  /**
   * Log debug message if debug mode is enabled
   * 
   * @param message - Message to log
   * @param data - Optional data to log
   * 
   * Validates: Requirement 21.1
   */
  public log(message: string, data?: unknown): void {
    if (this.config.debug) {
      if (data !== undefined) {
        console.log(`[NavigationDebug] ${message}`, data);
      } else {
        console.log(`[NavigationDebug] ${message}`);
      }
    }
  }

  /**
   * Get error statistics
   * 
   * @returns Object with error counts by category
   */
  public getErrorStats(): Record<ErrorCategory, number> {
    const stats: Record<string, number> = {};
    
    this.errorCounts.forEach((count, category) => {
      stats[category] = count;
    });
    
    return stats as Record<ErrorCategory, number>;
  }

  /**
   * Get recent error history
   * 
   * @param limit - Maximum number of errors to return
   * @returns Array of recent error contexts
   */
  public getErrorHistory(limit?: number): ErrorContext[] {
    if (limit) {
      return this.errorHistory.slice(-limit);
    }
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  public clearErrorHistory(): void {
    this.errorHistory = [];
    this.errorCounts.forEach((_, category) => {
      this.errorCounts.set(category, 0);
    });
  }

  /**
   * Check if error handler is initialized
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Set custom tracking callback
   * 
   * @param callback - Custom tracking callback function
   */
  public setTrackingCallback(callback: ErrorTrackingCallback): void {
    this.config.trackingCallback = callback;
  }

  /**
   * Enable or disable debug mode
   * 
   * @param enabled - Whether to enable debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.config.debug = enabled;
    this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Enable or disable error tracking
   * 
   * @param enabled - Whether to enable error tracking
   */
  public setTrackingEnabled(enabled: boolean): void {
    this.config.enableTracking = enabled;
    this.log(`Error tracking ${enabled ? 'enabled' : 'disabled'}`);
  }
}

/**
 * Singleton instance of ErrorHandler
 * Use this for consistent error handling across the navigation system
 */
export const errorHandler = new ErrorHandler();

/**
 * Utility function to wrap async operations with error handling
 * 
 * @param operation - Async operation to execute
 * @param category - Error category
 * @param message - Error message prefix
 * @param fallback - Fallback value on error
 * @returns Result of operation or fallback value
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  category: ErrorCategory,
  message: string,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Handle error based on category
    switch (category) {
      case ErrorCategory.STORAGE:
        errorHandler.handleStorageError(message, error);
        break;
      case ErrorCategory.RESTORATION:
        errorHandler.handleRestorationError(message, error);
        break;
      case ErrorCategory.CAPTURE:
        errorHandler.handleCaptureError(message, error);
        break;
      case ErrorCategory.FOCUS:
        errorHandler.handleFocusError(message, error);
        break;
      case ErrorCategory.ANIMATION:
        errorHandler.handleAnimationError(message, error);
        break;
      case ErrorCategory.NETWORK:
        errorHandler.handleNetworkError(message, error);
        break;
      case ErrorCategory.VALIDATION:
        errorHandler.handleValidationError(message, error);
        break;
      default:
        errorHandler.handleError({
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.MEDIUM,
          message,
          error
        });
    }
    
    return fallback;
  }
}

/**
 * Utility function to wrap sync operations with error handling
 * 
 * @param operation - Sync operation to execute
 * @param category - Error category
 * @param message - Error message prefix
 * @param fallback - Fallback value on error
 * @returns Result of operation or fallback value
 */
export function withErrorHandlingSync<T>(
  operation: () => T,
  category: ErrorCategory,
  message: string,
  fallback: T
): T {
  try {
    return operation();
  } catch (error) {
    // Handle error based on category
    switch (category) {
      case ErrorCategory.STORAGE:
        errorHandler.handleStorageError(message, error);
        break;
      case ErrorCategory.RESTORATION:
        errorHandler.handleRestorationError(message, error);
        break;
      case ErrorCategory.CAPTURE:
        errorHandler.handleCaptureError(message, error);
        break;
      case ErrorCategory.FOCUS:
        errorHandler.handleFocusError(message, error);
        break;
      case ErrorCategory.ANIMATION:
        errorHandler.handleAnimationError(message, error);
        break;
      case ErrorCategory.NETWORK:
        errorHandler.handleNetworkError(message, error);
        break;
      case ErrorCategory.VALIDATION:
        errorHandler.handleValidationError(message, error);
        break;
      default:
        errorHandler.handleError({
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.MEDIUM,
          message,
          error
        });
    }
    
    return fallback;
  }
}
