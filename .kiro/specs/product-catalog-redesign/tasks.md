# Implementation Plan: Product Catalog Redesign

## Overview

This implementation plan breaks down the product catalog redesign into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout to catch issues early. The plan follows a bottom-up approach: shared components → catalog-specific components → page integration → testing → optimization.

## Tasks

- [x] 1. Set up TypeScript interfaces and data models
  - Create `types/product.ts` with Product, FilterState, Category, Origin, Certification interfaces
  - Create `types/rfq.ts` with RFQFormData, RFQProduct, ContactInfo, DeliveryInfo interfaces
  - Create `types/analytics.ts` with analytics event interfaces
  - Create `types/translations.ts` with translation interfaces for catalog
  - _Requirements: 14.1, 14.2_

- [x] 2. Create translation files for all locales
  - Create `locales/fr/catalog.json` with all French translations
  - Create `locales/en/catalog.json` with all English translations
  - Create `locales/es/catalog.json` with all Spanish translations
  - Create `locales/de/catalog.json` with all German translations
  - Create `locales/ru/catalog.json` with all Russian translations
  - Include translations for: headings, filters, badges, CTAs, trust elements, RFQ form, error messages
  - _Requirements: 16.1-16.20_

- [x] 3. Implement shared UI components
  - [x] 3.1 Create Button component with variants (primary, secondary, ghost)
    - Support loading state, disabled state, icon support
    - Ensure 44x44px minimum touch target on mobile
    - _Requirements: 13.7_
  
  - [x] 3.2 Create Input component with validation states
    - Support label, placeholder, error message, helper text
    - Include focus styles and accessibility attributes
    - _Requirements: 11.1, 11.2, 11.10_
  
  - [x] 3.3 Create Select component for filter dropdowns
    - Support single and multi-select modes
    - Include search functionality for long lists
    - Keyboard navigation support
    - _Requirements: 2.2-2.8, 11.1_
  
  - [x] 3.4 Create Badge component for product badges
    - Support variants: availability, certification, EUDR
    - Pill shape with appropriate sizing (12-13px font)
    - _Requirements: 3.3, 3.4, 3.5_

- [x] 4. Implement TrustStrip component
  - [x] 4.1 Create TrustStrip component with icon + label layout
    - Display trust items in horizontal flex row
    - Support compact and detailed variants
    - Include tooltip on hover for additional details
    - _Requirements: 6.1-6.5_
  
  - [ ]* 4.2 Write unit tests for TrustStrip
    - Test rendering of all trust items
    - Test tooltip display on hover
    - Test responsive behavior
    - _Requirements: 6.1-6.5_

- [x] 5. Implement CatalogHeader component
  - [x] 5.1 Create CatalogHeader with heading, subtitle, and trust strip
    - Limit height to 20vh maximum
    - Include download catalog CTA button
    - Support all locale translations
    - Apply brand colors (dark green #194424, charcoal)
    - _Requirements: 1.1, 6.1-6.5, 8.6_
  
  - [ ]* 5.2 Write unit tests for CatalogHeader
    - Test rendering with different locales
    - Test download button click handler
    - Test responsive layout
    - _Requirements: 1.1, 8.6_

- [x] 6. Implement filter logic and utilities
  - [x] 6.1 Create filter utility functions
    - `applyFilters(products, filterState)` - applies all active filters
    - `matchesAllFilters(product, filterState)` - checks if product matches filters
    - `searchProducts(products, query)` - searches across name, category, tags
    - Use AND logic for multiple filters
    - Case-insensitive search
    - _Requirements: 2.1, 2.9, 2.10_
  
  - [ ]* 6.2 Write property test for search functionality
    - **Property 1: Search filters products across multiple fields**
    - **Validates: Requirements 2.1**
    - Test that for any search query and product collection, results only include matching products
    - _Requirements: 2.1_
  
  - [ ]* 6.3 Write property test for filter application
    - **Property 2: Filter application correctness**
    - **Validates: Requirements 2.9, 2.10, 2.12**
    - Test that for any filter combination, all displayed products match ALL criteria
    - Test that displayed count equals filtered product count
    - _Requirements: 2.9, 2.10, 2.12_

- [x] 7. Implement CatalogFilters component
  - [x] 7.1 Create CatalogFilters with search input and filter dropdowns
    - Implement sticky positioning (position: sticky, top: 0)
    - Include search input with debouncing (300ms)
    - Include filter dropdowns for: category, origin, availability, certifications, incoterms, MOQ
    - Display active filter chips with remove functionality
    - Display product count
    - Include "Clear all filters" button
    - _Requirements: 2.1-2.13_
  
  - [x] 7.2 Implement mobile filter drawer
    - Collapse filters into expandable drawer on mobile (< 768px)
    - Show filter count badge on mobile trigger button
    - _Requirements: 13.6_
  
  - [ ]* 7.3 Write unit tests for CatalogFilters
    - Test filter selection updates state
    - Test search input with debouncing
    - Test clear all filters functionality
    - Test active filter chips display and removal
    - Test mobile drawer behavior
    - _Requirements: 2.1-2.13_

- [x] 8. Implement ProductCard component
  - [x] 8.1 Create ProductCard with media, content, and actions sections
    - Media section: Image with gradient overlay, badges (availability, EUDR, certifications)
    - Content section: Product name (H3, 20-22px), subtitle, quick specs (origin, MOQ, incoterm), document indicators
    - Actions section: Primary CTA (quote button), secondary CTA (specs link), quick view button
    - Apply border radius (24px luxury, 16px traceability), padding (20-24px), shadow
    - Implement hover effects (elevation, shadow increase)
    - _Requirements: 3.1-3.14_
  
  - [x] 8.2 Implement traceability-first variant
    - Larger badges, prominent document indicators
    - Primary CTA text: "Demander un devis + documentation"
    - Emphasize compliance information
    - _Requirements: 3.1-3.14_
  
  - [x] 8.3 Implement luxury-editorial variant
    - Larger border radius (24-28px), generous padding (24px)
    - Optional serif typography for product name
    - Gold accent on hover
    - _Requirements: 3.1-3.14_
  
  - [ ]* 8.4 Write property test for product card completeness
    - **Property 3: Product card completeness**
    - **Validates: Requirements 3.1-3.12, 3.14**
    - Test that for any product with complete data, all required elements render
    - _Requirements: 3.1-3.12, 3.14_
  
  - [ ]* 8.5 Write property test for text contrast
    - **Property 4: Text contrast accessibility**
    - **Validates: Requirements 3.13, 11.5**
    - Test that all text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
    - _Requirements: 3.13, 11.5_
  
  - [ ]* 8.6 Write unit tests for ProductCard
    - Test rendering with different product data
    - Test CTA button clicks
    - Test hover states
    - Test both variants (traceability-first, luxury-editorial)
    - Test missing optional fields handled gracefully
    - _Requirements: 3.1-3.14, 15.4_

- [x] 9. Implement ProductGrid component
  - [x] 9.1 Create ProductGrid with responsive grid layout
    - CSS Grid with responsive columns: 1 (mobile), 2 (tablet), 3-4 (desktop)
    - Breakpoints: 768px, 1024px, 1280px
    - Gap: 24px desktop, 16px mobile
    - Max width: 1440px, centered
    - _Requirements: 1.3, 13.2-13.4_
  
  - [ ]* 9.2 Write property test for responsive grid layout
    - **Property 9: Responsive grid layout adaptation**
    - **Validates: Requirements 1.3, 13.2-13.4**
    - Test that for any viewport width, correct number of columns display
    - _Requirements: 1.3, 13.2-13.4_
  
  - [ ]* 9.3 Write unit tests for ProductGrid
    - Test grid rendering with different product counts
    - Test responsive column counts at each breakpoint
    - Test empty state when no products
    - _Requirements: 1.3, 2.11_

- [x] 10. Checkpoint - Ensure basic catalog display works
  - Verify CatalogHeader renders correctly
  - Verify CatalogFilters displays and filters work
  - Verify ProductGrid displays products in responsive grid
  - Verify ProductCard renders all product information
  - Run all tests and ensure they pass
  - Ask the user if questions arise

- [x] 11. Implement QuickViewModal component
  - [x] 11.1 Create QuickViewModal with product details
    - Modal overlay with backdrop blur
    - Product image, name, category, availability
    - Comprehensive specifications (origin, grade, packaging, MOQ, lead time, incoterms)
    - Certifications list with badges
    - Documents list (COA, spec sheet, chain of custody)
    - Quote CTA and product page link
    - Close button (top-right) and ESC key support
    - _Requirements: 5.1-5.7_
  
  - [x] 11.2 Implement focus trap and accessibility
    - Trap focus within modal when open
    - Return focus to trigger element on close
    - Support ESC key and overlay click to close
    - Use role="dialog" and aria-modal="true"
    - _Requirements: 5.8, 5.9, 11.8, 11.9_
  
  - [ ]* 11.3 Write property test for quick view content
    - **Property 8: Quick view modal content completeness**
    - **Validates: Requirements 5.2-5.7**
    - Test that for any product, quick view displays all specified information
    - _Requirements: 5.2-5.7_
  
  - [ ]* 11.4 Write unit tests for QuickViewModal
    - Test modal opens with correct product data
    - Test close behavior (button, ESC, overlay click)
    - Test focus trap and focus return
    - Test keyboard navigation
    - _Requirements: 5.1-5.9_

- [x] 12. Implement RFQDrawer component
  - [x] 12.1 Create RFQDrawer with form and product list
    - Slide-out drawer from right (480px width desktop, 100vw mobile)
    - Display selected products with thumbnails and quantity inputs
    - Contact form fields: name, email, company, phone
    - Order details fields: delivery location, incoterm
    - Additional notes textarea
    - Trust elements display (24h response, NDA available)
    - Submit button with loading state
    - _Requirements: 4.1-4.6_
  
  - [x] 12.2 Implement form validation
    - Validate required fields: name, email, company, quantity, delivery location
    - Validate email format
    - Validate quantity >= MOQ for each product
    - Display field-specific error messages
    - Prevent submission when validation fails
    - _Requirements: 4.7, 4.8_
  
  - [x] 12.3 Implement multi-product RFQ functionality
    - Support adding multiple products to RFQ
    - Display cart count indicator
    - Allow removing products from RFQ
    - Persist RFQ cart in session storage
    - _Requirements: 4.10, 4.11_
  
  - [x] 12.4 Implement mobile sticky CTA
    - Display sticky bottom bar on mobile (< 768px)
    - Show RFQ cart icon with count badge
    - Opens RFQ drawer on click
    - _Requirements: 4.12, 13.5_
  
  - [ ]* 12.5 Write property test for RFQ drawer pre-selection
    - **Property 5: RFQ drawer pre-selection**
    - **Validates: Requirements 4.1**
    - Test that for any product, clicking quote CTA opens drawer with that product selected
    - _Requirements: 4.1_
  
  - [ ]* 12.6 Write property test for RFQ form validation
    - **Property 6: RFQ form validation**
    - **Validates: Requirements 4.7, 4.8**
    - Test that for any form data, validation correctly identifies errors and allows/prevents submission
    - _Requirements: 4.7, 4.8_
  
  - [ ]* 12.7 Write property test for multi-product RFQ
    - **Property 7: Multi-product RFQ accumulation**
    - **Validates: Requirements 4.10, 4.11**
    - Test that for any sequence of products added, cart contains all without duplicates and count is correct
    - _Requirements: 4.10, 4.11_
  
  - [ ]* 12.8 Write unit tests for RFQDrawer
    - Test drawer open/close behavior
    - Test form field validation
    - Test error message display
    - Test product list rendering
    - Test quantity input updates
    - Test remove product functionality
    - Test submission success/failure flows
    - _Requirements: 4.1-4.12_

- [x] 13. Implement CatalogDownloadModal component
  - [x] 13.1 Create CatalogDownloadModal with lead capture form
    - Modal with form fields: name, email, company, country
    - Validate required fields before allowing download
    - Display privacy message
    - Submit button triggers download
    - _Requirements: 7.1-7.5_
  
  - [ ]* 13.2 Write unit tests for CatalogDownloadModal
    - Test form validation
    - Test submission triggers download
    - Test error handling
    - _Requirements: 7.1-7.5_

- [x] 14. Implement ProcessComplianceSection component
  - [x] 14.1 Create ProcessComplianceSection with quality standards content
    - 3-column grid layout (desktop), 1-column (mobile)
    - Quality standards section
    - Traceability process section
    - Certifications overview section
    - Support all locale translations
    - _Requirements: 6.9_
  
  - [ ]* 14.2 Write unit tests for ProcessComplianceSection
    - Test rendering with different locales
    - Test responsive layout
    - _Requirements: 6.9_

- [x] 15. Implement analytics tracking utilities
  - [x] 15.1 Create analytics utility functions
    - `trackEvent(event, properties)` - sends event to analytics services
    - Support Google Analytics 4 integration
    - Support custom analytics endpoint
    - _Requirements: 10.1-10.8_
  
  - [x] 15.2 Integrate analytics tracking in components
    - Track filter usage in CatalogFilters
    - Track product card views in ProductGrid (intersection observer)
    - Track CTA clicks in ProductCard
    - Track quick view opens in QuickViewModal
    - Track RFQ submissions in RFQDrawer
    - Track catalog downloads in CatalogDownloadModal
    - _Requirements: 10.1-10.8_
  
  - [ ]* 15.3 Write property test for analytics event accuracy
    - **Property 11: Analytics event accuracy**
    - **Validates: Requirements 10.1-10.8**
    - Test that for any user interaction, correct analytics event fires with accurate metadata
    - _Requirements: 10.1-10.8_

- [x] 16. Implement main ProductCatalogPage
  - [x] 16.1 Create ProductCatalogPage component
    - Fetch product data from Sanity CMS (Server Component)
    - Fetch categories, origins, certifications from Sanity
    - Manage filter state (Client Component wrapper)
    - Manage RFQ drawer state
    - Manage Quick View modal state
    - Coordinate between all child components
    - _Requirements: 1.1-1.7, 15.1-15.7_
  
  - [x] 16.2 Implement URL state management for filters
    - Sync filter state with URL search params
    - Enable shareable filtered views
    - Use Next.js useSearchParams and useRouter
    - _Requirements: 2.1-2.13_
  
  - [x] 16.3 Implement image optimization
    - Use Next.js Image component for all product images
    - Configure sizes attribute for responsive images
    - Implement lazy loading for below-fold images
    - Integrate with Sanity image CDN
    - _Requirements: 9.1-9.3_
  
  - [ ]* 16.4 Write property test for locale-based translations
    - **Property 10: Locale-based translation completeness**
    - **Validates: Requirements 8.6, 16.1-16.20**
    - Test that for any supported locale, all UI text is translated
    - _Requirements: 8.6, 16.1-16.20_
  
  - [ ]* 16.5 Write property test for image optimization
    - **Property 14: Image optimization implementation**
    - **Validates: Requirements 9.1-9.3**
    - Test that for any product image, Next.js Image component is used with proper configuration
    - _Requirements: 9.1-9.3_
  
  - [ ]* 16.6 Write property test for CMS data handling
    - **Property 15: CMS data handling robustness**
    - **Validates: Requirements 15.1, 15.4**
    - Test that for any product data including missing optional fields, system renders without errors
    - _Requirements: 15.1, 15.4_

- [x] 17. Implement API routes
  - [x] 17.1 Create RFQ submission API route
    - POST endpoint at `/api/rfq`
    - Validate form data
    - Send email notification
    - Store submission in database or CRM
    - Return success/error response
    - _Requirements: 4.9_
  
  - [x] 17.2 Create catalog download API route
    - POST endpoint at `/api/catalog-download`
    - Validate lead data
    - Store lead in database or CRM
    - Return PDF download URL
    - Track download event
    - _Requirements: 7.3-7.5_
  
  - [ ]* 17.3 Write unit tests for API routes
    - Test RFQ submission with valid/invalid data
    - Test catalog download with valid/invalid data
    - Test error handling
    - _Requirements: 4.9, 7.3-7.5_

- [x] 18. Implement SEO and metadata
  - [x] 18.1 Add metadata to ProductCatalogPage
    - Generate metadata with title, description, Open Graph tags
    - Support all locales
    - _Requirements: 12.7, 12.8_
  
  - [x] 18.2 Create structured data component
    - Implement Schema.org ItemList structured data
    - Include all products in list
    - Add to page as JSON-LD script tag
    - _Requirements: 12.5, 12.6_
  
  - [ ]* 18.3 Write unit tests for SEO implementation
    - Test metadata generation for each locale
    - Test structured data format
    - _Requirements: 12.1-12.9_

- [x] 19. Implement accessibility features
  - [x] 19.1 Add keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators (2px outline, gold color)
    - Implement skip links
    - _Requirements: 11.1, 11.2, 11.7_
  
  - [x] 19.2 Add ARIA attributes
    - Add ARIA labels to icon-only buttons
    - Add aria-describedby to form fields with errors
    - Add role="dialog" and aria-modal to modals
    - Add aria-expanded to expandable sections
    - Add ARIA live regions for dynamic content (filter count, form errors)
    - _Requirements: 11.3, 11.4, 11.10_
  
  - [x] 19.3 Add alt text to all images
    - Format: "{Product name} - {Category}"
    - Ensure descriptive and meaningful
    - _Requirements: 11.4, 12.9_
  
  - [ ]* 19.4 Write property test for keyboard navigation
    - **Property 12: Keyboard navigation completeness**
    - **Validates: Requirements 11.1, 11.2, 11.3**
    - Test that for any interactive element, it's reachable and activatable via keyboard
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ]* 19.5 Write property test for focus management
    - **Property 13: Focus management in modals**
    - **Validates: Requirements 5.9, 11.8, 11.9**
    - Test that for any modal, focus is trapped while open and returned on close
    - _Requirements: 5.9, 11.8, 11.9_
  
  - [ ]* 19.6 Write accessibility tests
    - Test focus indicators visible on all focusable elements
    - Test ARIA labels present on icon buttons
    - Test alt text present on all images
    - Test semantic HTML structure
    - Test screen reader announcements
    - _Requirements: 11.1-11.10_

- [x] 20. Checkpoint - Ensure complete functionality works
  - Test entire catalog page flow end-to-end
  - Test filtering and search
  - Test product card interactions
  - Test RFQ workflow (single and multi-product)
  - Test Quick View modal
  - Test catalog download
  - Test all locales
  - Test responsive behavior at all breakpoints
  - Run all tests and ensure they pass
  - Ask the user if questions arise

- [x] 21. Update Sanity CMS schema
  - [x] 21.1 Create or update product schema in Sanity
    - Add all required fields: name, slug, subtitle, category, heroImage, availability, origins, certifications, eudrReady, qaAvailable, documents, moq, incoterms, packaging, grade, leadTime, notes, tags, markets
    - Configure localization for name, subtitle, packaging, grade, leadTime, notes
    - Add validation rules
    - _Requirements: 15.2_
  
  - [x] 21.2 Create category, origin, and certification schemas
    - Category: name, slug, icon
    - Origin: name, code (ISO), flag
    - Certification: name, icon, description
    - _Requirements: 15.2_

- [x] 22. Performance optimization
  - [x] 22.1 Implement code splitting for modals
    - Use dynamic imports for QuickViewModal, RFQDrawer, CatalogDownloadModal
    - Reduce initial bundle size
    - _Requirements: 9.6_
  
  - [x] 22.2 Implement search debouncing
    - Add 300ms debounce to search input
    - Prevent excessive re-renders
    - _Requirements: 9.6_
  
  - [x] 22.3 Implement memoization for filter functions
    - Use React.useMemo for expensive filter calculations
    - Prevent unnecessary re-computations
    - _Requirements: 9.6_
  
  - [x] 22.4 Implement prefetching for product detail pages
    - Prefetch product detail pages on card hover
    - Improve perceived performance
    - _Requirements: 9.6_
  
  - [ ]* 22.5 Run performance tests
    - Test with 10, 25, 50, 100 products
    - Measure filter application time
    - Measure search query response time
    - Measure image loading time
    - Verify Lighthouse scores (≥85 desktop, ≥75 mobile)
    - _Requirements: 9.7, 9.8_

- [ ] 23. Responsive testing and fixes
  - [ ]* 23.1 Test at all required breakpoints
    - Test 320px (iPhone SE)
    - Test 375px (iPhone 12/13)
    - Test 768px (iPad portrait)
    - Test 1024px (iPad landscape)
    - Test 1440px (desktop)
    - Test 1920px (large desktop)
    - _Requirements: 13.10_
  
  - [ ]* 23.2 Verify responsive requirements
    - Verify grid columns correct at each breakpoint
    - Verify sticky filter bar works on all sizes
    - Verify mobile sticky CTA bar visible < 768px
    - Verify touch targets ≥ 44x44px on mobile
    - Verify no horizontal scrolling at any size
    - Verify modals full-screen on mobile
    - Verify filter drawer on mobile
    - _Requirements: 13.1-13.10_

- [x] 24. Final integration and polish
  - [x] 24.1 Add error boundaries
    - Wrap page in error boundary
    - Display user-friendly error messages
    - Provide retry functionality
    - _Requirements: Error handling_
  
  - [x] 24.2 Add loading states
    - Skeleton loaders for product grid
    - Loading spinners for form submissions
    - Loading states for modals
    - _Requirements: Performance_
  
  - [x] 24.3 Add empty states
    - No products found message
    - No search results message
    - Empty RFQ cart message
    - _Requirements: 2.11_
  
  - [x] 24.4 Polish animations and transitions
    - Smooth modal open/close animations
    - Smooth drawer slide animations
    - Smooth hover effects on cards
    - Smooth filter application transitions
    - _Requirements: UX polish_

- [ ] 25. Final checkpoint - Complete testing and validation
  - Run complete test suite (unit + property tests)
  - Verify all requirements are met
  - Test in multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on real devices (iOS, Android)
  - Verify accessibility with screen reader
  - Verify performance metrics meet targets
  - Verify SEO metadata and structured data
  - Verify analytics tracking works correctly
  - Ask the user for final review and approval

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- Testing is integrated throughout to catch issues early
- Implementation uses TypeScript with Next.js App Router
- All components are reusable with proper TypeScript interfaces
- Design supports two variants: traceability-first and luxury-editorial
- Full internationalization support for FR/EN/ES/DE/RU
- Comprehensive accessibility and performance optimization
