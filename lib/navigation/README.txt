Navigation Module Documentation

This module provides intelligent navigation state management with scroll position preservation, section detection, and focus restoration.

Components:

1. StorageAdapter
   - Manages dual storage strategy (History API + sessionStorage)
   - Implements FIFO cache with 50 entry limit
   - Handles storage errors gracefully

2. StateCaptureService
   - Captures navigation state before transitions
   - Tracks scroll position with debouncing (150ms)
   - Detects current section using IntersectionObserver
   - Captures focused element ID
   - Generates unique state keys from pathname + search params

Usage Example:

import { stateCaptureService } from '@/lib/navigation';

// Initialize the service
stateCaptureService.initialize();

// Capture current state before navigation
const state = stateCaptureService.captureCurrentState();
// Returns: { key, scrollY, scrollX, timestamp, route, sectionId?, focusedElementId?, hash? }

// Check if state should be captured
const shouldCapture = stateCaptureService.shouldCaptureState(url, isExternal, isSamePage);

// Debounced scroll capture
stateCaptureService.debounceScrollCapture((scrollY, scrollX) => {
  console.log('Scroll position:', scrollY, scrollX);
});

// Get current section
const sectionId = stateCaptureService.getCurrentSectionId();

// Cleanup when done
stateCaptureService.destroy();

Configuration:

const service = new StateCaptureService({
  scrollDebounceDelay: 150,        // Debounce delay in ms
  sectionVisibilityThreshold: 0.5, // 50% visibility threshold
  sectionAttribute: 'data-section' // Attribute for section IDs
});

Section Detection:

Sections are identified by:
- data-section attribute (priority)
- id attribute (fallback)

A section is "current" when >50% visible in viewport.
If multiple sections are visible, the highest one is selected.

Requirements Validated:
- 7.1: State capture before navigation
- 11.1: Scroll position and section capture
- 11.5: Focused element capture
- 12.5: Scroll capture debouncing (150ms)
