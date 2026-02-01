/**
 * Navigation Module
 * 
 * Exports navigation-related utilities and services
 */

export { StorageAdapter, storageAdapter } from './storage-adapter';
export { StateCaptureService, stateCaptureService, type StateCaptureConfig } from './state-capture-service';
export { StateRestorationService, stateRestorationService, type StateRestorationConfig } from './state-restoration-service';
export { FocusManager, focusManager, type FocusManagerConfig } from './focus-manager';
export { NavigationManager, navigationManager, type NavigationManagerConfig } from './navigation-manager';
export { 
  PerformanceMonitor, 
  performanceMonitor, 
  type PerformanceMonitorConfig,
  type PerformanceMetric,
  MetricType,
  WEB_VITALS_THRESHOLDS
} from './performance-monitor';
export {
  AnimationPerformanceMonitor,
  globalAnimationMonitor,
  prefersReducedMotion,
  getSafeAnimationDuration,
  getSafeScrollBehavior,
  validateAnimationProperties,
  warnNonPerformantAnimation,
  createOptimizedAnimation,
  applyWillChange,
  removeWillChange,
  measureAnimationPerformance,
  PERFORMANT_PROPERTIES,
  NON_PERFORMANT_PROPERTIES,
  TARGET_FPS,
  TARGET_FRAME_TIME
} from './animation-performance';
export {
  isIOSSafari,
  isMobileBrowser,
  getScrollingElement,
  getScrollPosition,
  setScrollPosition,
  getSafeAreaInsets,
  MobileAddressBarHandler,
  mobileAddressBarHandler,
  getHeaderHeightWithSafeArea,
  supportsSmoothScroll,
  getViewportDimensions,
  initializeMobileBrowserCompat,
  destroyMobileBrowserCompat
} from './mobile-browser-compat';
export {
  getCurrentLocale,
  getNavigationTranslation,
  announceToScreenReader,
  NavigationErrors,
  NavigationAriaLabels,
  NavigationPlaceholders
} from './i18n-integration';
export {
  ErrorHandler,
  errorHandler,
  ErrorCategory,
  ErrorSeverity,
  withErrorHandling,
  withErrorHandlingSync,
  type ErrorContext,
  type ErrorHandlerConfig,
  type ErrorTrackingCallback
} from './error-handler';
