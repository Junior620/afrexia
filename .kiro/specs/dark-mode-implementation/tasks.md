# Implementation Plan: Dark Mode Implementation

## Overview

This implementation plan breaks down the dark mode feature into discrete, incremental coding tasks. Each task builds on previous work, starting with core theme management infrastructure, then adding UI components, styling, and finally comprehensive testing. The approach ensures that functionality is validated early and integrated continuously.

## Tasks

- [x] 1. Set up theme management infrastructure
  - [x] 1.1 Create ThemeProvider component with context
    - Implement ThemeContext with theme state and setter functions
    - Add localStorage persistence logic with error handling
    - Implement system preference detection using matchMedia API
    - Add listener for system preference changes
    - Apply theme class to document root element
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.4, 5.5_
  
  - [x] 1.2 Create useTheme custom hook
    - Implement hook to access ThemeContext
    - Add error handling for usage outside provider
    - Export theme state and control functions
    - _Requirements: 1.2_
  
  - [x] 1.3 Write property test for theme toggle state transition
    - **Property 1: Theme Toggle State Transition**
    - **Validates: Requirements 1.2, 3.1**
  
  - [x] 1.4 Write property test for theme persistence round trip
    - **Property 2: Theme Persistence Round Trip**
    - **Validates: Requirements 4.1, 4.2**
  
  - [x] 1.5 Write unit tests for localStorage error handling
    - Test behavior when localStorage is unavailable
    - Test behavior when localStorage throws errors
    - Verify fallback to in-memory state
    - _Requirements: 4.4_

- [x] 2. Create theme initialization script
  - [x] 2.1 Implement inline script for preventing FOUC
    - Write synchronous script to detect and apply theme
    - Check localStorage for saved preference
    - Fall back to system preference detection
    - Apply dark class to html element before first paint
    - _Requirements: 8.1_
  
  - [x] 2.2 Integrate script into root layout
    - Add script to head section of app/layout.tsx
    - Wrap application with ThemeProvider
    - Add suppressHydrationWarning to html element
    - _Requirements: 8.1_
  
  - [x] 2.3 Write unit test for theme initialization
    - Test that initialization script applies correct theme
    - Test localStorage preference takes priority
    - Test system preference fallback
    - _Requirements: 8.1_

- [x] 3. Implement ThemeToggle UI component
  - [x] 3.1 Create ThemeToggle button component
    - Implement button with sun/moon icons
    - Add click handler to toggle theme
    - Implement icon transition animation
    - Add proper ARIA labels and keyboard accessibility
    - Style with hover and focus states
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 7.5_
  
  - [x] 3.2 Integrate ThemeToggle into Header component
    - Import and place ThemeToggle between LanguageSwitcher and RFQ button
    - Ensure responsive layout on mobile and desktop
    - _Requirements: 1.1_
  
  - [x] 3.3 Write property test for icon state correspondence
    - **Property 7: Icon State Correspondence**
    - **Validates: Requirements 1.4**
  
  - [x] 3.4 Write unit tests for ThemeToggle accessibility
    - Test ARIA labels are correct for each theme
    - Test keyboard navigation (Tab, Enter, Space)
    - Test focus indicators are visible
    - _Requirements: 7.5_

- [ ] 4. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Define dark mode color palette
  - [x] 5.1 Update Tailwind configuration with dark mode colors
    - Add dark mode background colors (primary, secondary, tertiary)
    - Add dark mode text colors (primary, secondary, muted)
    - Add dark mode border colors
    - Update brand color variants for dark mode
    - Configure CSS custom properties for dynamic switching
    - _Requirements: 2.1, 2.3, 2.4_
  
  - [x] 5.2 Create global CSS for theme transitions
    - Define transition properties for color changes
    - Set transition duration to 300ms
    - Add prefers-reduced-motion support
    - _Requirements: 6.2, 6.4_
  
  - [x] 5.3 Write property test for WCAG contrast compliance
    - **Property 8: WCAG Contrast Compliance**
    - **Validates: Requirements 7.1, 7.2, 7.3**
  
  - [x] 5.4 Write unit tests for color palette definition
    - Test all required dark mode colors are defined
    - Test CSS transition configuration exists
    - _Requirements: 2.1, 6.2_

- [x] 6. Update components with dark mode styles
  - [x] 6.1 Update Header component with dark mode classes
    - Add dark mode background and border colors
    - Update text colors for dark mode
    - Ensure logo switches between light and dark variants
    - _Requirements: 3.1, 3.6_
  
  - [x] 6.2 Update card components with dark mode styles
    - Add dark:bg-dark-bg-secondary to card backgrounds
    - Update text colors with dark mode variants
    - Add dark mode border colors
    - _Requirements: 3.1_
  
  - [x] 6.3 Update form components with dark mode styles
    - Add dark mode input backgrounds and borders
    - Update placeholder text colors
    - Style focus states for dark mode
    - _Requirements: 3.1_
  
  - [x] 6.4 Update navigation components with dark mode styles
    - Add dark mode colors to navigation links
    - Update hover and active states
    - Ensure mobile menu works in dark mode
    - _Requirements: 3.1_
  
  - [x] 6.5 Write property test for logo variant selection
    - **Property 6: Logo Variant Selection**
    - **Validates: Requirements 3.6**
  
  - [x] 6.6 Write unit tests for component dark mode integration
    - Test Header renders with dark mode classes
    - Test cards render with dark mode classes
    - Test forms render with dark mode classes
    - _Requirements: 3.1_

- [x] 7. Handle image and logo assets
  - [x] 7.1 Create dark mode logo variant
    - Export light-colored logo for dark backgrounds
    - Save as /public/assets/logo-dark.png
    - Ensure dimensions match original logo
    - _Requirements: 3.6_
  
  - [x] 7.2 Implement conditional logo rendering
    - Update Header to use theme-based logo selection
    - Add error handling for missing logo variants
    - Add CSS fallback filters if needed
    - _Requirements: 3.6_
  
  - [x] 7.3 Add dark mode styling for product images
    - Add subtle borders to images in dark mode
    - Ensure images remain visible on dark backgrounds
    - _Requirements: 3.6_

- [x] 8. Implement system preference change detection
  - [x] 8.1 Add media query change listener in ThemeProvider
    - Listen for prefers-color-scheme changes
    - Update theme only when no user preference exists
    - Clean up listener on unmount
    - _Requirements: 5.5_
  
  - [x] 8.2 Write property test for system preference detection
    - **Property 3: System Preference Detection**
    - **Validates: Requirements 5.1**
  
  - [x] 8.3 Write property test for user preference priority
    - **Property 4: User Preference Priority**
    - **Validates: Requirements 5.4**
  
  - [x] 8.4 Write property test for system preference change response
    - **Property 5: System Preference Change Response**
    - **Validates: Requirements 5.5**
  
  - [x] 8.5 Write unit tests for preference priority logic
    - Test user preference overrides system preference
    - Test system preference used when no user preference
    - Test system preference changes are detected
    - _Requirements: 5.1, 5.4, 5.5_

- [x] 9. Final checkpoint - Comprehensive testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows an incremental approach: infrastructure → UI → styling → testing
- All components must use Tailwind's dark mode utilities (dark: prefix)
- Theme transitions are handled via CSS for performance
- Accessibility is validated through both automated tests and manual review
