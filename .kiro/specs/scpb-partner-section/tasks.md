# Implementation Plan: SCPB Partner Section

## Overview

This implementation plan breaks down the SCPB Partner Section feature into discrete, incremental coding tasks. The approach follows a component-first strategy, building from the smallest reusable components up to the complete section, with testing integrated throughout. Each task builds on previous work, ensuring no orphaned code and maintaining a working state at each checkpoint.

## Tasks

- [x] 1. Set up project structure and TypeScript interfaces
  - Create directory structure: `components/sections/PartnerSection/`
  - Define TypeScript interfaces in `types/partner-section.ts` for PartnerSectionProps, PartnerContent, StatCard, CTAConfig, ImageConfig
  - Create content file structure: `lib/content/partner-section.ts`
  - _Requirements: 9.2, 9.4, 9.5_

- [x] 2. Create content data structure with FR/EN translations
  - [x] 2.1 Implement partner section content object
    - Write complete French content object with all required fields (eyebrow, title, subtitle, bodyText, keyFacts, stats, CTAs, images, photoCaption)
    - Write complete English content object with translations
    - Export content as `partnerSectionContent: Record<Locale, PartnerContent>`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 10.1, 10.2_
  
  - [ ]* 2.2 Write property test for content structure
    - **Property 5: Content Length Constraint**
    - **Property 6: Key Facts Count Invariant**
    - **Validates: Requirements 4.4, 4.5**

- [x] 3. Implement base PartnerSection container component
  - [x] 3.1 Create PartnerSection component with props interface
    - Implement main component structure with locale prop
    - Load content from partnerSectionContent based on locale
    - Implement fallback logic (locale → en → error boundary)
    - Add section wrapper with max-width (1200px) and responsive padding (96px desktop / 64px mobile)
    - _Requirements: 1.1, 1.2, 9.1, 9.2, 9.6, 10.3_
  
  - [ ]* 3.2 Write unit tests for PartnerSection container
    - Test component renders without crashing
    - Test content loads correctly for FR and EN locales
    - Test fallback logic for missing content
    - _Requirements: 9.1, 10.3_

- [x] 4. Implement PhotoStack component
  - [x] 4.1 Create PhotoStack component with image rendering
    - Implement component with images and caption props
    - Use next/image for primary image (28px border radius, shadow-2xl)
    - Use next/image for overlay image (absolute positioning, 24px border radius, 1px border rgba(255,255,255,0.08), rotate-1 or rotate-2)
    - Add very light gradient overlay (bg-gradient-to-t from-black/10 via-transparent)
    - Add discrete caption at bottom with semi-transparent background
    - Implement lazy loading for overlay image, priority loading for primary image
    - Add blur placeholder for both images
    - Configure responsive sizes: `(max-width: 768px) 100vw, 60vw`
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 8.1, 8.2, 8.3, 8.4_
  
  - [x] 4.2 Add hover interactions to PhotoStack
    - Implement hover state: scale-102 transform and accent border
    - Add smooth transition (transition-transform duration-300)
    - _Requirements: 7.1, 7.2_
  
  - [ ]* 4.3 Write unit tests for PhotoStack
    - Test images render with correct next/image props
    - Test alt text is present for all images
    - Test caption displays correctly
    - Test hover interactions apply correct classes
    - _Requirements: 8.5, 11.2_
  
  - [ ]* 4.4 Write property test for image optimization
    - **Property 4: Image Optimization Compliance**
    - **Property 11: Image Alt Text Presence**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 11.2**

- [x] 5. Implement EditorialContent component
  - [x] 5.1 Create EditorialContent component with typography hierarchy
    - Implement component with eyebrow, title, subtitle, bodyText, keyFacts props
    - Style eyebrow: 12px uppercase, tracking-wide, accent color, font-semibold
    - Style title (H2): 42-52px desktop / 30-34px mobile, font-bold, primary text color (#EDEDED)
    - Style subtitle: 18-20px, font-medium, secondary text color (rgba(237,237,237,0.72))
    - Style body text: 16-18px, line-height 1.6, secondary text color, max 120 words
    - Style key facts: 16px, bullet list with custom accent color dot markers
    - Implement responsive font sizes using Tailwind breakpoints
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.5, 6.6_
  
  - [ ]* 5.2 Write unit tests for EditorialContent
    - Test all content sections render correctly
    - Test typography hierarchy is applied
    - Test responsive font sizes
    - Test key facts list renders with correct count
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Implement StatCards component (optional trust indicators)
  - [x] 6.1 Create StatCards component with grid layout
    - Implement component with stats array prop
    - Create 3-column grid on desktop, 1-column on mobile
    - Style cards: bg-white/[0.03], border border-white/[0.06], 16px border radius, 16px padding
    - Display label (small, secondary text) and value (large, bold, primary text)
    - Implement conditional rendering (only render if stats array has items)
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [ ]* 6.2 Write unit tests for StatCards
    - Test cards render when stats are provided
    - Test component doesn't render when stats are empty
    - Test exactly 3 cards display when stats are provided
    - Test card styling is applied correctly
    - _Requirements: 12.1, 12.3_
  
  - [ ]* 6.3 Write property test for conditional rendering
    - **Property 14: Stat Cards Conditional Rendering**
    - **Validates: Requirements 12.1, 12.3**

- [x] 7. Implement CTARow component with buttons
  - [x] 7.1 Create CTARow component with primary and secondary CTAs
    - Implement component with primaryCTA and secondaryCTA props
    - Style primary button: bg-accent hover:bg-accent-dark, rounded-full, px-6 py-3, font-semibold, shadow-md, min-height 44px
    - Style secondary button: border-2 border-accent, transparent bg, hover:bg-accent/10, rounded-full, min-height 44px
    - Implement external link handling: target="_blank" rel="noopener noreferrer" for external CTAs
    - Implement internal navigation for secondary CTA
    - Add visible hover states with smooth transitions
    - Add visible focus states (focus ring) for keyboard accessibility
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.3_
  
  - [ ]* 7.2 Write unit tests for CTARow
    - Test both buttons render with correct labels
    - Test external link has target="_blank" and rel="noopener noreferrer"
    - Test internal link doesn't have external attributes
    - Test hover and focus states are applied
    - Test buttons are keyboard accessible
    - _Requirements: 5.4, 5.6, 5.7, 11.3_
  
  - [ ]* 7.3 Write property test for link security
    - **Property 3: External Link Security**
    - **Property 9: Keyboard Navigation Completeness**
    - **Validates: Requirements 1.5, 5.4, 11.3, 11.4**

- [x] 8. Implement TrustMicrocopy component
  - [x] 8.1 Create TrustMicrocopy component
    - Implement component with text prop
    - Style: 14px, secondary color with higher opacity, bullet separators (•)
    - Center-align on mobile, left-align on desktop
    - Position below CTAs
    - _Requirements: 4.6_
  
  - [ ]* 8.2 Write unit tests for TrustMicrocopy
    - Test microcopy renders with correct text
    - Test bullet separators are present
    - Test responsive alignment
    - _Requirements: 4.6_

- [x] 9. Implement responsive layout system
  - [x] 9.1 Create desktop 2-column layout
    - Implement grid layout with 60/40 split (grid-cols-[60fr_40fr])
    - Position PhotoStack in left column
    - Position EditorialContent, StatCards, CTARow, TrustMicrocopy in right column
    - Add 48px gap between columns
    - Apply layout only at ≥768px breakpoint
    - _Requirements: 2.1, 2.6, 2.7_
  
  - [x] 9.2 Create mobile stacked layout
    - Implement vertical stack layout for <768px
    - Order: Title → PhotoStack → EditorialContent → CTAs
    - Make CTAs full-width on mobile
    - Add 32px gap between sections
    - Adjust padding to 64px vertical
    - Adjust heading font size to 30-34px
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 9.3 Write property test for responsive layout
    - **Property 2: Responsive Layout Transformation**
    - **Validates: Requirements 2.1, 3.1, 3.2**

- [x] 10. Checkpoint - Ensure all components render correctly
  - Verify all sub-components render without errors
  - Test French and English content displays correctly
  - Check responsive layout switches at 768px breakpoint
  - Verify images load with optimization
  - Ensure all tests pass, ask the user if questions arise

- [x] 11. Integrate PartnerSection into homepage
  - [x] 11.1 Add PartnerSection to homepage after Services Section
    - Import PartnerSection component in homepage file
    - Position component immediately after Services Section
    - Pass locale prop from page context
    - Add data-testid="partner-section" for testing
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 11.2 Write integration test for section positioning
    - **Property 1: Section Positioning Consistency**
    - **Validates: Requirements 1.1, 1.2**

- [x] 12. Implement accessibility features
  - [x] 12.1 Add semantic HTML and ARIA attributes
    - Use semantic HTML elements (section, article, nav, etc.)
    - Add ARIA labels for external links: "opens in new tab"
    - Add aria-label for image captions
    - Ensure proper heading hierarchy (H2 for title)
    - _Requirements: 11.1, 11.2, 11.6_
  
  - [x] 12.2 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible (Tab navigation)
    - Add visible focus states (focus-visible:ring-2)
    - Test focus order follows logical flow
    - Add skip link if needed
    - _Requirements: 11.3, 11.4_
  
  - [ ]* 12.3 Write accessibility tests
    - **Property 8: Color Contrast Accessibility**
    - **Property 9: Keyboard Navigation Completeness**
    - Test with axe-core for automated accessibility checks
    - Test keyboard navigation flow
    - Verify ARIA attributes are present
    - Check color contrast ratios
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6**

- [x] 13. Add error handling and edge cases
  - [x] 13.1 Implement image loading error handling
    - Add onError handler to next/image components
    - Display fallback placeholder with brand colors on error
    - Log errors in development mode
    - Maintain layout integrity (prevent layout shift)
    - _Requirements: 8.1_
  
  - [x] 13.2 Implement content fallback logic
    - Add fallback to English content if current locale is unavailable
    - Log warning in development mode for missing content
    - Display error boundary if all locales fail
    - Prevent component crash
    - _Requirements: 10.3_
  
  - [x] 13.3 Implement URL validation for external links
    - Validate partner URL format before rendering
    - Disable button if URL is invalid
    - Show tooltip with error message on hover (if invalid)
    - Log validation error in development
    - _Requirements: 5.4_
  
  - [ ]* 13.4 Write unit tests for error handling
    - Test image error handling
    - Test content fallback logic
    - Test URL validation
    - Test error boundaries
    - _Requirements: 8.1, 10.3, 5.4_

- [x] 14. Implement design system color customization
  - [x] 14.1 Add custom colors to Tailwind config
    - Add primary text color: #EDEDED (as 'partner-text-primary')
    - Add secondary text color: rgba(237,237,237,0.72) (as 'partner-text-secondary')
    - Document custom colors in tailwind.config.ts
    - Update component to use new color tokens
    - _Requirements: 6.1, 6.2_
  
  - [ ]* 14.2 Write property test for color consistency
    - **Property 15: Design System Color Consistency**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

- [x] 15. Add placeholder images and prepare image assets
  - [x] 15.1 Create placeholder images or add actual images
    - Add primary image: `/assets/partners/scpb-quality-control.jpg` (800x1000px, WebP)
    - Add overlay image: `/assets/partners/scpb-warehouse.jpg` (400x300px, WebP)
    - Optimize images for web (quality 85, WebP format with JPEG fallback)
    - Add descriptive alt text in content objects
    - _Requirements: 8.1, 8.4, 8.5_
  
  - [ ]* 15.2 Test image optimization
    - Verify images load with lazy loading
    - Check blur placeholder displays during load
    - Verify responsive sizes are applied
    - Test image performance (load time < 1s)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 16. Final checkpoint - Complete testing and validation
  - [ ] 16.1 Run full test suite
    - Run all unit tests and verify they pass
    - Run all property tests (100 iterations each)
    - Run integration tests for homepage positioning
    - Run accessibility tests with axe-core
    - _Requirements: All_
  
  - [ ] 16.2 Manual QA checklist
    - Test on Chrome, Firefox, Safari, Edge
    - Test on mobile (375px), tablet (768px), desktop (1280px, 1920px)
    - Verify layout switches correctly at 768px breakpoint
    - Test hover and focus states on all interactive elements
    - Verify external link opens in new tab with security attributes
    - Test keyboard navigation (Tab, Enter, Space)
    - Verify French and English content displays correctly
    - Check image loading and optimization
    - Verify color contrast meets WCAG AA standards
    - Test with screen reader (VoiceOver or NVDA)
    - _Requirements: All_
  
  - [x] 16.3 Performance validation
    - Run Lighthouse audit (target: 90+ performance score)
    - Verify LCP < 2.5s
    - Verify CLS < 0.1
    - Check image load times
    - Verify component render time < 50ms
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 16.4 Final review and deployment preparation
    - Review all code for consistency and best practices
    - Ensure all TypeScript types are properly defined
    - Verify no console errors or warnings
    - Update documentation if needed
    - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties with 100 iterations each
- Unit tests validate specific examples and edge cases
- Integration tests verify the component works correctly within the homepage context
- The implementation follows a bottom-up approach: small components → larger components → integration
- All interactive elements must be keyboard accessible and have visible focus states
- All images must use next/image with optimization (lazy loading, blur placeholder, responsive sizes)
- External links must include security attributes (rel="noopener noreferrer")
- Content is fully internationalized (FR/EN) and stored in structured JSON format
