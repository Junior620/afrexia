# Implementation Plan: Responsive Design & Intelligent Navigation

## Overview

This implementation plan breaks down the responsive design system and intelligent navigation feature into discrete, incremental tasks. The approach follows a mobile-first strategy, implementing core responsive functionality first, then adding intelligent navigation with state preservation. Each task builds on previous work and includes testing to validate correctness early.

## Tasks

- [x] 1. Set up responsive design foundation
  - Create Tailwind CSS configuration with custom breakpoints (640px, 768px, 1024px, 1280px)
  - Define container max-widths and padding scales
  - Configure typography scale with responsive font sizes
  - Set up CSS custom properties for dynamic values (header height, safe-area-inset)
  - _Requirements: 1.1, 1.3, 1.4, 2.1_

- [ ]* 1.1 Write property tests for breakpoint configuration
  - **Property 1: Container Constraints Across Breakpoints**
  - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

- [x] 2. Implement responsive grid system
  - [x] 2.1 Create grid utility classes for 4, 8, and 12 column layouts
    - Implement responsive column spanning utilities
    - Configure column gaps (16px mobile, 24px tablet, 32px desktop)
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_
  
  - [ ]* 2.2 Write property tests for grid system
    - **Property 2: Responsive Layout Transitions**
    - **Validates: Requirements 1.2**

- [ ] 3. Implement responsive typography system
  - [x] 3.1 Create typography scale with clamp() for fluid sizing
    - Configure heading hierarchy (h1-h6) with responsive sizes
    - Set line-heights (1.5 body, 1.2 headings) and letter-spacing
    - Implement font loading strategy with font-display: swap
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.7_
  
  - [ ]* 3.2 Write property tests for typography
    - **Property 3: Typography Hierarchy Preservation**
    - **Property 4: Font Loading Without Layout Shift**
    - **Validates: Requirements 2.2, 2.3, 2.5, 2.7**

- [x] 4. Implement responsive Header/Navigation component
  - [x] 4.1 Create desktop navigation bar
    - Implement sticky header with dynamic height calculation
    - Add navigation links with hover states
    - Ensure minimum touch target sizes (44x44px)
    - _Requirements: 3.1, 6.2_
  
  - [x] 4.2 Create mobile hamburger menu
    - Implement hamburger button with ARIA labels
    - Create slide-in menu overlay with transform animation (300ms)
    - Add focus trap functionality
    - Implement body scroll lock when menu open
    - Handle ESC key, outside click, and link click to close
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 4.3 Write property tests for mobile menu
    - **Property 8: Mobile Menu Focus Trap**
    - **Property 9: Mobile Menu Interaction Closure**
    - **Property 10: Body Scroll Prevention When Menu Open**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

- [x] 5. Implement responsive component adaptations
  - [x] 5.1 Adapt Hero component for responsive layouts
    - Vertical stack on mobile, horizontal on desktop
    - Responsive image sizing with 16:9 aspect ratio
    - Priority loading for hero images
    - _Requirements: 3.3, 4.2, 4.4_
  
  - [x] 5.2 Adapt Card grid components
    - 1 column mobile, 2 tablet, 3-4 desktop
    - Maintain 4:3 aspect ratio for product cards
    - Implement lazy loading for card images
    - _Requirements: 3.2, 4.3, 4.4_
  
  - [x] 5.3 Adapt Form components
    - Full-width inputs on mobile, constrained on desktop
    - Responsive button sizing
    - _Requirements: 3.4_
  
  - [x] 5.4 Adapt Footer component
    - Vertical stack on mobile, horizontal on tablet+
    - _Requirements: 3.5_
  
  - [ ]* 5.5 Write property tests for component adaptation
    - **Property 5: Component Responsive Adaptation**
    - **Property 6: Image Optimization and Lazy Loading**
    - **Property 7: Image Aspect Ratio Preservation**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 6. Checkpoint - Responsive design validation
  - Test all breakpoint transitions manually
  - Verify mobile menu functionality on mobile devices
  - Check typography scaling across viewports
  - Ensure all tests pass
  - Ask user if questions arise

- [x] 7. Implement accessibility features
  - [x] 7.1 Add keyboard navigation support
    - Implement visible focus indicators for all interactive elements
    - Ensure tab order is logical
    - Support ESC key for closing modals/menus
    - _Requirements: 6.3, 6.6_
  
  - [x] 7.2 Add ARIA labels and announcements
    - Add aria-label to hamburger button and navigation
    - Implement aria-live region for menu state changes
    - Add aria-expanded for menu button
    - Localize ARIA labels to French
    - _Requirements: 6.4, 6.5, 20.2_
  
  - [ ]* 7.3 Write property tests for accessibility
    - **Property 11: Accessibility Contrast Requirements**
    - **Property 12: Touch Target Minimum Size**
    - **Property 13: Keyboard Navigation Completeness**
    - **Property 14: ARIA Label Presence**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

- [x] 8. Implement Navigation State data structures
  - [x] 8.1 Create NavigationState interface and types
    - Define NavigationState type with all required and optional fields
    - Create StateKey generation function (pathname + search)
    - Implement state validation function
    - _Requirements: 7.4, 10.3, 10.5_
  
  - [ ]* 8.2 Write property tests for state structure
    - **Property 18: Navigation State Structure**
    - **Property 25: State Key Generation**
    - **Validates: Requirements 7.4, 10.3, 10.5**

- [x] 9. Implement Storage Adapter
  - [x] 9.1 Create StorageAdapter class
    - Implement History API state save/retrieve
    - Implement sessionStorage save/retrieve with JSON serialization
    - Add error handling for storage failures (quota, unavailable)
    - Implement FIFO cache management (50 entry limit)
    - _Requirements: 10.1, 10.2, 10.7, 15.3_
  
  - [ ]* 9.2 Write property tests for storage
    - **Property 27: Storage Limit with FIFO Eviction**
    - **Property 28: PII Exclusion from Storage**
    - **Property 29: Dual Storage Strategy**
    - **Property 34: History API Fallback**
    - **Property 39: Graceful Degradation on Storage Failure**
    - **Validates: Requirements 10.1, 10.2, 10.6, 10.7, 13.3, 14.3, 15.3**

- [x] 10. Implement State Capture Service
  - [x] 10.1 Create StateCaptureService class
    - Implement captureCurrentState() to record scroll position, route, timestamp
    - Add section detection using IntersectionObserver
    - Add focused element capture
    - Implement scroll capture debouncing (150ms)
    - _Requirements: 7.1, 11.1, 11.5, 12.5_
  
  - [ ]* 10.2 Write property tests for state capture
    - **Property 15: State Capture Before Navigation**
    - **Property 33: Scroll Capture Debouncing**
    - **Validates: Requirements 7.1, 11.1, 11.5, 12.5**

- [x] 11. Implement State Restoration Service
  - [x] 11.1 Create StateRestorationService class
    - Implement priority resolution algorithm (hash > section > scroll > top)
    - Implement header height detection and offset calculation
    - Add smooth scroll with prefers-reduced-motion support
    - Implement two-pass restoration with ResizeObserver
    - Add 1000ms timeout for layout stabilization
    - _Requirements: 8.2, 8.3, 9.1, 9.2, 9.4, 9.5, 12.2, 12.3_
  
  - [ ]* 11.2 Write property tests for restoration
    - **Property 17: Scroll Restoration Accuracy**
    - **Property 19: Motion Preference Respect**
    - **Property 20: Section-Based Restoration Priority**
    - **Property 21: Section Restoration Fallback**
    - **Property 22: Hash Navigation Priority**
    - **Property 23: Hash Navigation Fallback**
    - **Property 24: Two-Pass Restoration Strategy**
    - **Validates: Requirements 7.3, 7.6, 8.2, 8.3, 8.5, 8.6, 9.1, 9.2, 9.3, 9.4, 9.5, 12.2, 12.3, 12.6, 15.4**

- [x] 12. Implement Focus Manager
  - [x] 12.1 Create FocusManager class
    - Implement focus capture (store activeElement.id)
    - Implement focus restoration with existence check
    - Add scrollIntoView for restored focus elements
    - Handle fallback when element doesn't exist
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ]* 12.2 Write property tests for focus restoration
    - **Property 42: Focus Restoration on Back Navigation**
    - **Property 43: Focus Restoration Fallback**
    - **Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5**

- [x] 13. Implement Navigation Manager (orchestration)
  - [x] 13.1 Create NavigationManager class
    - Wire together StateCaptureService, StateRestorationService, StorageAdapter, FocusManager
    - Implement link click handler to capture state before navigation
    - Implement popstate handler to restore state on back/forward
    - Implement page load handler for refresh restoration
    - Add operation queuing for concurrent navigation events
    - _Requirements: 11.2, 11.3, 15.5_
  
  - [ ]* 13.2 Write property tests for navigation manager
    - **Property 26: State Key Update Strategy**
    - **Property 30: Refresh State Restoration**
    - **Property 31: Same-Page Navigation Behavior**
    - **Property 40: Concurrent Navigation Handling**
    - **Validates: Requirements 10.4, 11.2, 11.3, 11.6, 15.5**

- [x] 14. Checkpoint - Navigation state management validation
  - Test state capture on navigation
  - Test state restoration on back button
  - Test hash navigation priority
  - Test section-based restoration
  - Ensure all tests pass
  - Ask user if questions arise

- [x] 15. Implement performance optimizations
  - [x] 15.1 Add performance monitoring
    - Implement Performance Observer for LCP, FID, CLS
    - Add timing measurements for restoration operations
    - Log metrics in development mode
    - _Requirements: 12.1, 12.4_
  
  - [x] 15.2 Optimize animations
    - Ensure only transform and opacity are animated
    - Verify 60fps during animations
    - _Requirements: 18.1, 18.6_
  
  - [ ]* 15.3 Write property tests for performance
    - **Property 16: State Restoration Timing**
    - **Property 32: Layout Shift Prevention**
    - **Property 41: Animation Performance Constraints**
    - **Validates: Requirements 7.2, 12.1, 12.4, 18.1, 18.6**

- [x] 16. Implement mobile browser compatibility fixes
  - [x] 16.1 Add iOS Safari specific handling
    - Use document.scrollingElement for scroll calculations
    - Add safe-area-inset support for notched devices
    - Handle address bar show/hide transitions
    - _Requirements: 13.1, 13.4, 13.5, 13.6_
  
  - [ ]* 16.2 Write property tests for mobile compatibility
    - **Property 35: Document-Based Scroll Calculation**
    - **Property 36: Mobile Address Bar Stability**
    - **Validates: Requirements 13.4, 13.6**

- [x] 17. Implement internationalization (i18n)
  - [x] 17.1 Create French translations
    - Add French error messages
    - Add French ARIA labels
    - Add French placeholder text
    - Implement locale detection and message selection
    - _Requirements: 20.1, 20.2, 20.3, 20.4_
  
  - [ ]* 17.2 Write property tests for i18n
    - **Property 44: Locale-Based Message Adaptation**
    - **Validates: Requirements 20.1, 20.2, 20.3, 20.4**

- [x] 18. Implement error handling and observability
  - [x] 18.1 Add comprehensive error handling
    - Wrap all storage operations in try-catch
    - Implement silent error logging
    - Add development mode debug logging
    - Create error tracking integration points
    - _Requirements: 15.2, 21.1, 21.2, 21.3, 21.4, 21.5_
  
  - [ ]* 18.2 Write property tests for error handling
    - **Property 45: Silent Error Logging**
    - **Validates: Requirements 21.2**

- [x] 19. Implement optional form state preservation (Phase 2)
  - [x] 19.1 Create form state capture with consent
    - Implement opt-in UI for form draft saving
    - Capture non-PII form fields only
    - Add 30-minute expiration
    - Clear on successful submit
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ]* 19.2 Write property tests for form preservation
    - **Property 37: Form Data Expiration**
    - **Property 38: Form Data Clearance on Submit**
    - **Validates: Requirements 14.4, 14.5**

- [x] 20. Integration and wiring
  - [x] 20.1 Integrate NavigationManager into Next.js App Router
    - Add NavigationManager initialization in root layout
    - Wire up to Next.js router events
    - Ensure compatibility with [locale] routing
    - Test with all existing pages
    - _Requirements: All navigation requirements_
  
  - [x] 20.2 Apply responsive styles to all pages
    - Update all page components with responsive classes
    - Verify breakpoint behavior on all pages
    - Test image optimization on all pages
    - _Requirements: All responsive requirements_
  
  - [ ]* 20.3 Write integration tests
    - Test complete navigation flows (forward, back, refresh)
    - Test responsive behavior across all breakpoints
    - Test accessibility with keyboard and screen readers
    - Test on iOS Safari, Chrome Mobile, desktop browsers

- [ ] 21. Final checkpoint - Comprehensive validation
  - Run full test suite (unit, property, integration)
  - Perform manual testing on all target devices/browsers
  - Verify Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
  - Check accessibility with automated tools (axe, Lighthouse)
  - Ensure all requirements validated
  - Ask user for final approval

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows
- Phase 2 features (task 19) can be deferred if needed
- All TypeScript code should use strict mode
- All components should be tested on mobile devices before considering complete
