# StateCaptureService

## Overview

The `StateCaptureService` is responsible for capturing navigation state before page transitions. It records scroll position, current route, visible section, focused element, and other context needed to restore the user's view when they navigate back.

## Features

- **Scroll Position Capture**: Records vertical and horizontal scroll positions
- **Section Detection**: Uses IntersectionObserver to identify the currently visible section
- **Focus Tracking**: Captures the ID of the currently focused element
- **Debounced Scroll Capture**: Limits scroll position writes to once per 150ms (configurable)
- **Smart State Capture Logic**: Determines when state should be captured based on navigation type

## Requirements Validated

- **Requirement 7.1**: Captures scroll state before navigation
- **Requirement 11.1**: Records scroll position, route, timestamp, section ID, and focused element
- **Requirement 11.5**: Implements scroll capture debouncing
- **Requirement 12.5**: Debounces scroll position capture to maximum 1 write per 150ms

## Usage

### Basic Usage

```typescript
import { stateCaptureService } from '@/lib/navigation';

// Initialize the service (typically in app initialization)
stateCaptureService.initialize();

// Capture current state before navigation
const state = stateCaptureService.captureCurrentState();
console.log(state);
// {
//   key: '/products?category=electronics',
//   scrollY: 1250,
//   scrollX: 0,
//   timestamp: 1704067200000,
//   route: '/products',
//   sectionId: 'featured-products',
//   focusedElementId: 'product-card-42',
//   hash: 'details'
// }

// Check if state should be captured for a navigation
const shouldCapture = stateCaptureService.shouldCaptureState(
  '/about',
  false, // isExternal
  false  // isSamePage
);

// Debounced scroll capture (for scroll event handlers)
window.addEventListener('scroll', () => {
  stateCaptureService.debounce