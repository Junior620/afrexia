# Error Handling and Observability

This document describes the comprehensive error handling and observability system for the intelligent navigation state management.

## Overview

The error handling system provides:
- **Silent error logging** - No user-facing errors, graceful degradation
- **Development mode debug logging** - Detailed logging for debugging
- **Production error tracking** - Integration points for monitoring services
- **Error categorization** - Organized by error type and severity
- **Graceful degradation** - System continues functioning when errors occur

## Architecture

### Error Handler

The `ErrorHandler` class is the central error handling service that:
- Categorizes errors by type (storage, restoration, capture, focus, animation, network, validation)
- Assigns severity levels (low, medium, high, critical)
- Logs errors appropriately based on environment (development/production)
- Tracks error statistics and history
- Provides integration points for monitoring services (Sentry, LogRocket, etc.)

### Error Categories

```typescript
enum ErrorCategory {
  STORAGE = 'storage',        // sessionStorage, History API errors
  RESTORATION = 'restoration', // Scroll/state restoration errors
  CAPTURE = 'capture',        // State capture errors
  FOCUS = 'focus',            // Focus restoration errors
  ANIMATION = 'animation',    // Animation/transition errors
  NETWORK = 'network',        // Loading/network errors
  VALIDATION = 'validation',  // Data validation errors
  UNKNOWN = 'unknown'         // Uncategorized errors
}
```

### Error Severity Levels

```typescript
enum ErrorSeverity {
  LOW = 'low',           // Minor issues, system continues normally
  MEDIUM = 'medium',     // Degraded functionality, fallback used
  HIGH = 'high',         // Major feature failure, significant impact
  CRITICAL = 'critical'  // System-wide failure
}
```

## Usage

### Basic Error Handling

```typescript
import { errorHandler } from '@/lib/navigation';

// Handle a storage error
try {
  sessionStorage.setItem(key, value);
} catch (error) {
  errorHandler.handleStorageError('Failed to save state', error, {
    key,
    context: 'saveToSession'
  });
}

// Handle a restoration error
try {
  await restoreState(state);
} catch (error) {
  errorHandler.handleRestorationError('Failed to restore state', error, {
    stateKey: state.key,
    scrollY: state.scrollY
  });
}
```

### Using Error Handling Utilities

```typescript
import { withErrorHandling, ErrorCategory } from '@/lib/navigation';

// Wrap async operations
const result = await withErrorHandling(
  async () => {
    return await someAsyncOperation();
  },
  ErrorCategory.STORAGE,
  'Operation failed',
  fallbackValue
);

// Wrap sync operations
const result = withErrorHandlingSync(
  () => {
    return someSyncOperation();
  },
  ErrorCategory.CAPTURE,
  'Operation failed',
  fallbackValue
);
```

### Debug Logging

```typescript
import { errorHandler } from '@/lib/navigation';

// Enable debug mode
errorHandler.setDebugMode(true);

// Log debug messages
errorHandler.log('State captured', { scrollY: 1000 });
```

### Error Statistics

```typescript
import { navigationManager } from '@/lib/navigation';

// Get error statistics
const stats = navigationManager.getErrorStats();
console.log('Storage errors:', stats.storage);
console.log('Restoration errors:', stats.restoration);

// Get recent error history
const recentErrors = navigationManager.getErrorHistory(10);
console.log('Last 10 errors:', recentErrors);
```

## Integration with Monitoring Services

### Sentry Integration

The error handler provides a default integration with Sentry. If Sentry is available on the window object, errors will automatically be sent to Sentry with appropriate context.

```typescript
// Sentry is automatically detected and used if available
// No additional configuration needed

// Custom tracking callback (optional)
errorHandler.setTrackingCallback((context) => {
  // Send to your monitoring service
  if (window.Sentry) {
    window.Sentry.captureException(context.error, {
      level: mapSeverity(context.severity),
      tags: {
        category: context.category
      },
      extra: context.metadata
    });
  }
});
```

### Custom Monitoring Service

```typescript
import { errorHandler, ErrorContext } from '@/lib/navigation';

// Set custom tracking callback
errorHandler.setTrackingCallback((context: ErrorContext) => {
  // Send to LogRocket
  if (window.LogRocket) {
    window.LogRocket.captureException(context.error, {
      tags: {
        category: context.category,
        severity: context.severity
      },
      extra: context.metadata
    });
  }

  // Send to custom analytics
  analytics.track('navigation_error', {
    category: context.category,
    severity: context.severity,
    message: context.message,
    url: context.url,
    timestamp: context.timestamp
  });
});
```

## Error Handling Strategies

### Storage Errors

**Scenarios:**
- sessionStorage quota exceeded
- sessionStorage unavailable (private browsing)
- JSON serialization failure
- History API not supported

**Strategy:**
- Catch all storage operations in try-catch blocks
- Log error silently
- Disable state preservation for current session
- Continue normal navigation without restoration
- Display no error message to user

### Restoration Errors

**Scenarios:**
- Stored state is corrupted or invalid
- Target section/element no longer exists
- Scroll position exceeds page height
- Layout stabilization timeout

**Strategy:**
- Validate state structure before restoration
- Fall back through priority chain: hash → section → scroll → top
- If all restoration attempts fail, scroll to top
- Log failure for debugging
- Never throw error to user

### Focus Restoration Errors

**Scenarios:**
- Focused element no longer exists
- Element is not focusable
- Element is hidden or disabled

**Strategy:**
- Check element existence before focus attempt
- Verify element is focusable (not disabled, not hidden)
- If restoration fails, allow natural focus flow
- Do not force focus on inappropriate elements

### Animation Errors

**Scenarios:**
- Smooth scroll not supported
- Animation interrupted by user
- Performance degradation

**Strategy:**
- Feature detect smooth scroll support
- Fall back to instant scroll if unsupported
- Respect prefers-reduced-motion
- Allow user interaction to interrupt animations

## Development vs Production

### Development Mode

- Detailed console logging with stack traces
- Error context and metadata displayed
- Debug messages enabled
- Error history tracked in memory

```typescript
// Development mode is automatically enabled when NODE_ENV === 'development'
// Or manually enable:
errorHandler.setDebugMode(true);
```

### Production Mode

- Silent error logging (console.error only, no details)
- Errors sent to monitoring service
- No debug messages
- Minimal console output

```typescript
// Production mode is automatically enabled when NODE_ENV === 'production'
// Or manually disable debug:
errorHandler.setDebugMode(false);
```

## Best Practices

1. **Always use error handler methods** instead of console.log/console.error
2. **Provide context** in metadata for better debugging
3. **Choose appropriate category** for each error
4. **Use utility functions** (withErrorHandling) for consistent error handling
5. **Test error scenarios** to ensure graceful degradation
6. **Monitor error rates** in production to identify issues
7. **Never expose errors to users** - handle silently and provide fallbacks

## Error Context

Every error is logged with comprehensive context:

```typescript
interface ErrorContext {
  category: ErrorCategory;      // Error type
  severity: ErrorSeverity;      // Impact level
  message: string;              // Human-readable message
  error?: Error | unknown;      // Original error object
  metadata?: Record<string, unknown>; // Additional context
  timestamp: number;            // When error occurred
  userAgent?: string;           // Browser information
  url?: string;                 // Current page URL
}
```

## Requirements Validation

This error handling system validates the following requirements:

- **Requirement 15.2**: Graceful degradation on storage failure
- **Requirement 21.1**: Development mode debug logging
- **Requirement 21.2**: Silent error logging (no user-facing errors)
- **Requirement 21.3**: System continues functioning when errors occur
- **Requirement 21.4**: Error tracking integration points
- **Requirement 21.5**: Error frequency monitoring

## API Reference

### ErrorHandler

```typescript
class ErrorHandler {
  // Initialize the error handler
  initialize(): void;

  // Handle specific error types
  handleStorageError(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  handleRestorationError(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  handleCaptureError(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  handleFocusError(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  handleAnimationError(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  handleNetworkError(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  handleValidationError(message: string, error?: Error, metadata?: Record<string, unknown>): void;

  // Debug logging
  log(message: string, data?: unknown): void;

  // Statistics and history
  getErrorStats(): Record<ErrorCategory, number>;
  getErrorHistory(limit?: number): ErrorContext[];
  clearErrorHistory(): void;

  // Configuration
  setDebugMode(enabled: boolean): void;
  setTrackingEnabled(enabled: boolean): void;
  setTrackingCallback(callback: ErrorTrackingCallback): void;

  // Status
  isReady(): boolean;
}
```

### Utility Functions

```typescript
// Wrap async operations with error handling
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  category: ErrorCategory,
  message: string,
  fallback: T
): Promise<T>;

// Wrap sync operations with error handling
function withErrorHandlingSync<T>(
  operation: () => T,
  category: ErrorCategory,
  message: string,
  fallback: T
): T;
```

## Examples

### Complete Error Handling Example

```typescript
import { 
  errorHandler, 
  ErrorCategory, 
  withErrorHandling 
} from '@/lib/navigation';

// Initialize error handler
errorHandler.initialize();

// Set custom tracking
errorHandler.setTrackingCallback((context) => {
  // Send to your monitoring service
  myMonitoringService.trackError(context);
});

// Use in async operations
async function saveNavigationState(state: NavigationState) {
  return await withErrorHandling(
    async () => {
      sessionStorage.setItem('nav_state', JSON.stringify(state));
      return true;
    },
    ErrorCategory.STORAGE,
    'Failed to save navigation state',
    false // fallback value
  );
}

// Check error statistics
const stats = errorHandler.getErrorStats();
if (stats.storage > 10) {
  console.warn('High storage error rate detected');
}
```

## Troubleshooting

### Errors not being logged

1. Check if error handler is initialized: `errorHandler.isReady()`
2. Verify debug mode is enabled: `errorHandler.setDebugMode(true)`
3. Check browser console for any initialization errors

### Errors not sent to monitoring service

1. Verify tracking is enabled: `errorHandler.setTrackingEnabled(true)`
2. Check if monitoring service is loaded (e.g., `window.Sentry`)
3. Verify custom tracking callback is set correctly
4. Check network tab for failed requests to monitoring service

### Too many errors in production

1. Review error statistics: `errorHandler.getErrorStats()`
2. Check error history: `errorHandler.getErrorHistory()`
3. Identify patterns in error categories and metadata
4. Implement fixes for common error scenarios
5. Consider adjusting error severity levels

## Related Documentation

- [Navigation Manager](./README.md)
- [Storage Adapter](./storage-adapter.ts)
- [State Restoration Service](./state-restoration-service.ts)
- [Performance Monitoring](./performance-monitor.ts)
