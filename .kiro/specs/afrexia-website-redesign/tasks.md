# Implementation Plan: Afrexia Website Redesign

## Overview

This implementation plan breaks down the Afrexia B2B website redesign into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout. The plan follows a phased approach: Foundation → Core Features → Content & SEO → Polish & Optimization.

## Tasks

- [ ] 1. Project Setup and Configuration
  - Initialize Next.js 15+ project with TypeScript and App Router
  - Configure Tailwind CSS with custom brand colors and design tokens
  - Set up ESLint, Prettier, and TypeScript strict mode
  - Configure environment variables structure (.env.example)
  - Install core dependencies (shadcn/ui, Sanity, Resend, Mapbox, GSAP, etc.)
  - Set up Git repository with .gitignore
  - _Requirements: All (foundation)_

- [ ] 2. Sanity CMS Setup and Schema Definition
  - [ ] 2.1 Initialize Sanity Studio project
    - Create sanity/ directory structure
    - Configure Sanity client and project settings
    - Set up Sanity Studio with custom branding
    - _Requirements: 4.1_

  - [ ] 2.2 Create Product schema with multilingual support
    - Define Product document type with all fields (name, slug, i18nId, category, description, gallery, originRegions, packaging, MOQ, Incoterms, certifications, QA metrics, HS code, availability)
    - Implement slug generation for FR/EN
    - Add validation rules for required fields
    - _Requirements: 21.1, 21.3, 21.4_

  - [ ] 2.3 Create Certification schema
    - Define Certification document type (name, logo, description, issuing body, valid until, certificate document)
    - _Requirements: 11.1_

  - [ ] 2.4 Create Blog Post schema
    - Define BlogPost document type with multilingual content
    - Add author reference, categories, tags
    - _Requirements: 13.1, 13.3_

  - [ ] 2.5 Create supporting schemas
    - TeamMember schema for About page
    - BlogCategory schema
    - Resource schema for downloadable documents
    - Page schema for static pages
    - _Requirements: 11.5, 12.1, 12.4_

  - [ ] 2.6 Configure CMS roles and permissions
    - Set up Administrator, Editor, and Viewer roles
    - Implement Draft/In Review/Published workflow
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

  - [ ] 2.7 Write unit tests for schema validation
    - Test required field enforcement
    - Test data format validation
    - _Requirements: 21.2, 21.4_

- [ ] 3. Internationalization (i18n) Foundation
  - [ ] 3.1 Implement Next.js middleware for locale detection
    - Create middleware.ts with locale detection logic
    - Implement cookie-based language persistence
    - Handle Accept-Language header parsing
    - Configure matcher to exclude static files and API routes
    - _Requirements: 1.2, 10.2, 10.5_

  - [ ] 3.2 Create translation management system
    - Set up translation JSON files for FR/EN
    - Create getTranslations utility function
    - Define translation keys for navigation, common UI, forms
    - _Requirements: 10.1_

  - [ ] 3.3 Build LanguageSwitcher component
    - Implement language toggle UI
    - Handle i18nId-based page mapping for context preservation
    - Update cookie on language change
    - _Requirements: 10.3, 10.4, 10.8_

  - [ ] 3.4 Write property test for language switching
    - **Property 1: Language switching preserves page context**
    - **Validates: Requirements 1.2, 1.4, 10.4, 10.8**

  - [ ] 3.5 Write property test for language preference persistence
    - **Property 2: Language preference persistence**
    - **Validates: Requirements 1.4, 10.5**

- [ ] 4. Core Layout Components
  - [ ] 4.1 Create root layout with providers
    - Implement app/[locale]/layout.tsx
    - Add AnalyticsProvider with consent management
    - Add ErrorBoundary wrapper
    - Configure fonts (Inter)
    - _Requirements: 1.1, 15.1, 15.2, 15.3_

  - [ ] 4.2 Build Header component with navigation
    - Create responsive header with logo
    - Implement navigation menu (desktop and mobile)
    - Add LanguageSwitcher integration
    - Implement sticky header behavior
    - _Requirements: 1.1, 1.3, 10.3_

  - [ ] 4.3 Build Footer component
    - Create footer with sitemap links
    - Add contact information display
    - Add social media links
    - Display certification logos
    - _Requirements: 1.1, 11.1_

  - [ ] 4.4 Create CookieConsent banner component
    - Implement consent UI with accept/reject options
    - Handle localStorage persistence
    - Trigger analytics reload on consent
    - _Requirements: 15.5, 15.6_

  - [ ] 4.5 Write property test for navigation consistency
    - **Property 3: Navigation consistency**
    - **Validates: Requirements 1.3**

- [ ] 5. Checkpoint - Foundation Complete
  - Ensure all tests pass
  - Verify i18n routing works correctly
  - Confirm Sanity Studio is accessible
  - Ask the user if questions arise


- [ ] 6. Image Optimization System
  - [ ] 6.1 Configure Next.js Image component
    - Set up next.config.js with image domains and formats (AVIF, WebP)
    - Configure device sizes and image sizes
    - Add Sanity CDN to remotePatterns
    - _Requirements: 5.1, 5.3_

  - [ ] 6.2 Create Sanity image URL builder utilities
    - Implement urlFor helper function
    - Create getImageProps for responsive images
    - Add format and quality optimization helpers
    - _Requirements: 5.1, 5.5_

  - [ ] 6.3 Build OptimizedImage component
    - Wrap Next.js Image with Sanity URL builder
    - Implement lazy loading for below-the-fold images
    - Add error handling with fallback images
    - _Requirements: 5.2, 5.6_

  - [ ] 6.4 Write property test for image format selection
    - **Property 18: Responsive image format selection**
    - **Validates: Requirements 5.1**

  - [ ] 6.5 Write property test for lazy loading
    - **Property 19: Lazy loading implementation**
    - **Validates: Requirements 5.2**

- [ ] 7. SEO Foundation
  - [ ] 7.1 Create SEO metadata generation utilities
    - Implement generateMetaTags function
    - Create Schema.org structured data generators (Product, Organization, Article, Breadcrumb)
    - Build hreflang tag generator
    - _Requirements: 6.1, 6.2, 6.4_

  - [ ] 7.2 Implement dynamic sitemap generation
    - Create app/sitemap.ts with all static and dynamic routes
    - Include both FR and EN versions of all pages
    - Set appropriate changeFrequency and priority
    - _Requirements: 1.5, 6.3_

  - [ ] 7.3 Create robots.txt configuration
    - Implement app/robots.ts
    - Allow all crawlers with appropriate disallow rules
    - Link to sitemap
    - _Requirements: 6.3_

  - [ ] 7.4 Write property test for meta tags completeness
    - **Property 21: Meta tags completeness**
    - **Validates: Requirements 6.1, 6.2, 6.5**

  - [ ] 7.5 Write property test for Schema.org structured data
    - **Property 22: Schema.org structured data**
    - **Validates: Requirements 6.4, 13.7**

  - [ ] 7.6 Write property test for semantic HTML hierarchy
    - **Property 23: Semantic HTML hierarchy**
    - **Validates: Requirements 6.6**

- [ ] 8. Product Pages Implementation
  - [ ] 8.1 Create product listing page
    - Implement app/[locale]/products/page.tsx
    - Fetch all products from Sanity with ISR (revalidate: 60)
    - Build ProductCard component with image, name, description, certifications
    - Implement responsive grid layout
    - Add SEO metadata generation
    - _Requirements: 2.1, 2.6_

  - [ ] 8.2 Build ProductGallery component
    - Create image gallery with main image and thumbnails
    - Implement lightbox modal with keyboard navigation
    - Add zoom functionality
    - Handle touch gestures for mobile
    - _Requirements: 2.1, 2.3_

  - [ ] 8.3 Create ProductOriginMap component
    - Integrate Mapbox with react-map-gl
    - Display custom markers for origin regions
    - Implement marker popups with region information
    - Add zoom, pan, and rotation controls
    - Lazy load Mapbox library
    - _Requirements: 2.1, 2.4, 8.2, 8.4, 8.5_

  - [ ] 8.4 Build ProductSpecifications component
    - Create tabbed interface for Grading, Packaging, Logistics, Compliance
    - Display QA metrics table
    - Show Incoterms, MOQ, HS code
    - Add packaging options list
    - _Requirements: 2.1_

  - [ ] 8.5 Implement product detail page
    - Create app/[locale]/products/[slug]/page.tsx
    - Implement slug validation with redirect for wrong locale
    - Fetch product data with ISR (revalidate: 60)
    - Integrate ProductGallery, ProductOriginMap, ProductSpecifications
    - Add PDF download button for spec sheets
    - Display prominent RFQ CTA buttons
    - Generate comprehensive SEO metadata with Product schema
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

  - [ ] 8.6 Write property test for product page completeness
    - **Property 5: Product page completeness**
    - **Validates: Requirements 2.1, 2.5**

  - [ ] 8.7 Write property test for product image interactions
    - **Property 6: Product image interactions**
    - **Validates: Requirements 2.3**

  - [ ] 8.8 Write property test for product origin map display
    - **Property 7: Product origin map display**
    - **Validates: Requirements 2.4, 8.2, 8.4**

  - [ ] 8.9 Write property test for product specification downloads
    - **Property 8: Product specification downloads**
    - **Validates: Requirements 2.2, 12.2, 12.3**

- [ ] 9. Checkpoint - Product Pages Complete
  - Ensure all product pages render correctly
  - Verify image optimization is working
  - Test map interactions
  - Confirm SEO metadata is complete
  - Ask the user if questions arise

- [ ] 10. Form System - RFQ Implementation
  - [ ] 10.1 Set up form validation with Zod
    - Create RFQ form schema with all field validations
    - Define error messages for each field
    - _Requirements: 3.1, 3.3, 3.4_

  - [ ] 10.2 Build RFQForm component (multi-step)
    - Create multi-step form with progress indicator (Product → Logistics → Contact)
    - Implement React Hook Form integration
    - Add field-level validation with error display
    - Implement LocalStorage draft saving (non-sensitive data only, 7-day TTL)
    - Add "Clear draft" functionality
    - Integrate reCAPTCHA v3
    - _Requirements: 3.1, 3.3, 3.4, 3.6, 3.7, 3.8_

  - [ ] 10.3 Create RFQ API route with rate limiting
    - Implement app/api/rfq/route.ts
    - Add Vercel KV rate limiting (5 requests per minute per IP)
    - Verify reCAPTCHA with action and hostname validation
    - Validate form data with Zod
    - Send emails via Resend (sales notification + customer confirmation)
    - Handle errors gracefully with Sentry logging
    - _Requirements: 3.1, 3.2, 3.5, 19.1, 19.3, 19.4, 20.3_

  - [ ] 10.4 Create email templates with React Email
    - Build RFQEmail template for sales team
    - Build RFQConfirmationEmail template for customers
    - Apply Afrexia branding to templates
    - _Requirements: 19.1, 19.3, 19.5_

  - [ ] 10.5 Implement RFQ page
    - Create app/[locale]/rfq/page.tsx
    - Integrate RFQForm component
    - Add product pre-selection from query params
    - Display contact information alongside form
    - _Requirements: 3.1, 14.6_

  - [ ] 10.6 Write property test for RFQ form validation
    - **Property 9: RFQ form validation**
    - **Validates: Requirements 3.3**

  - [ ] 10.7 Write property test for RFQ form submission
    - **Property 10: RFQ form submission with valid data**
    - **Validates: Requirements 3.1, 3.2, 19.1, 19.3, 19.4**

  - [ ] 10.8 Write property test for form draft persistence
    - **Property 11: Form draft persistence**
    - **Validates: Requirements 3.6, 3.8**

  - [ ] 10.9 Write property test for spam prevention
    - **Property 12: Spam prevention**
    - **Validates: Requirements 3.5**

- [ ] 11. Contact Form Implementation
  - [ ] 11.1 Build ContactForm component
    - Create form with name, email, phone, company, subject, message fields
    - Implement validation with Zod
    - Integrate reCAPTCHA v3
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

  - [ ] 11.2 Create Contact API route
    - Implement app/api/contact/route.ts
    - Add rate limiting
    - Verify reCAPTCHA
    - Send email via Resend
    - _Requirements: 14.1, 19.2, 20.3_

  - [ ] 11.3 Implement Contact page
    - Create app/[locale]/contact/page.tsx
    - Integrate ContactForm
    - Display contact information (email, phone, address)
    - Add office location map
    - _Requirements: 14.1, 14.6_

  - [ ] 11.4 Write property test for contact form validation and submission
    - **Property 13: Contact form validation and submission**
    - **Validates: Requirements 14.1, 14.3, 14.4, 19.2**

- [ ] 12. Animation System
  - [ ] 12.1 Configure GSAP and ScrollTrigger
    - Set up GSAP with ScrollTrigger plugin
    - Create animation configuration with reduced motion support
    - Implement performance monitoring for animations
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ] 12.2 Create animation preset utilities
    - Implement fadeIn, slideInLeft, slideInRight, scaleIn, staggerFadeIn presets
    - Create counterAnimation for statistics
    - Build createScrollTrigger helper with reduced motion check
    - _Requirements: 7.1, 7.5_

  - [ ] 12.3 Build ScrollReveal component
    - Create reusable scroll-triggered animation wrapper
    - Support multiple animation types
    - Respect prefers-reduced-motion
    - _Requirements: 7.1, 7.5_

  - [ ] 12.4 Implement Lenis smooth scroll (desktop only)
    - Create useSmoothScroll hook
    - Sync with GSAP ScrollTrigger
    - Disable on mobile and when reduced motion is preferred
    - _Requirements: 7.4, 7.5_

  - [ ] 12.5 Build CounterAnimation component
    - Create animated number counter for statistics
    - Trigger on scroll into viewport
    - _Requirements: 7.1_

  - [ ] 12.6 Write property test for reduced motion respect
    - **Property 27: Reduced motion respect**
    - **Validates: Requirements 7.5**

  - [ ] 12.7 Write property test for animation performance
    - **Property 28: Animation performance on desktop**
    - **Property 29: Animation performance on mobile**
    - **Validates: Requirements 7.3, 7.4**

- [ ] 13. Homepage Implementation
  - [ ] 13.1 Build Hero section
    - Create hero with headline, subheadline, CTA buttons
    - Add background image with overlay
    - Implement scroll-triggered animations
    - _Requirements: 7.1_

  - [ ] 13.2 Create Statistics section
    - Display key metrics (years, volume, countries, certifications)
    - Implement CounterAnimation for numbers
    - _Requirements: 11.2_

  - [ ] 13.3 Build Products showcase section
    - Display featured products with ProductCard components
    - Add "View All Products" CTA
    - _Requirements: 2.1_

  - [ ] 13.4 Create Process/Journey section
    - Visualize buyer and institutional journeys
    - Add animated timeline
    - Include CTAs for each journey
    - _Requirements: 24.1, 24.2, 24.3_

  - [ ] 13.5 Build Certifications section
    - Display certification logos
    - Link to Quality & Compliance page
    - _Requirements: 11.1_

  - [ ] 13.6 Assemble homepage
    - Create app/[locale]/page.tsx
    - Integrate all sections
    - Add SEO metadata with Organization schema
    - _Requirements: 1.1_

- [ ] 14. Checkpoint - Core Features Complete
  - Ensure all forms work correctly
  - Verify animations perform well
  - Test email sending
  - Confirm rate limiting is active
  - Ask the user if questions arise


- [ ] 15. Blog Implementation
  - [ ] 15.1 Create blog listing page
    - Implement app/[locale]/blog/page.tsx
    - Fetch blog posts from Sanity with ISR (revalidate: 300)
    - Display posts with featured image, title, excerpt, author, date, reading time
    - Implement pagination or infinite scroll
    - _Requirements: 13.1, 13.2_

  - [ ] 15.2 Build BlogSearch component
    - Integrate Fuse.js for client-side search
    - Search across title, excerpt, and tags
    - Display filtered results
    - _Requirements: 13.4_

  - [ ] 15.3 Implement blog post detail page
    - Create app/[locale]/blog/[slug]/page.tsx
    - Fetch post content with ISR (revalidate: 300)
    - Render rich text content with custom components
    - Display author information
    - Add social sharing buttons
    - Generate SEO metadata with Article schema
    - _Requirements: 13.1_

  - [ ] 15.4 Build RelatedArticles component
    - Fetch related posts based on categories and tags
    - Display 3-4 related articles
    - _Requirements: 13.5_

  - [ ] 15.5 Generate RSS feed
    - Create app/feed.xml/route.ts
    - Include all published blog posts
    - _Requirements: 13.6_

  - [ ] 15.6 Write property test for blog post metadata display
    - **Property 48: Blog post metadata display**
    - **Validates: Requirements 13.2**

  - [ ] 15.7 Write property test for related articles suggestion
    - **Property 49: Related articles suggestion**
    - **Validates: Requirements 13.5**

- [ ] 16. Static Pages Implementation
  - [ ] 16.1 Create Solutions/Services page
    - Implement app/[locale]/solutions/page.tsx
    - Describe logistics, warehousing, processing, traceability services
    - Add service cards with icons
    - Include CTAs to contact or RFQ
    - _Requirements: 1.1_

  - [ ] 16.2 Create Quality & Compliance page
    - Implement app/[locale]/quality/page.tsx
    - Display all certifications with logos and descriptions
    - Provide downloadable certificate PDFs
    - Explain grading standards and QA processes
    - _Requirements: 11.1, 11.3_

  - [ ] 16.3 Create Traceability & EUDR page
    - Implement app/[locale]/traceability/page.tsx
    - Explain supply chain and due diligence process
    - Display animated supply chain map
    - List compliance measures
    - Provide downloadable EUDR documentation
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

  - [ ] 16.4 Build SupplyChainAnimation component
    - Create animated map showing product journey
    - Use GSAP timeline with ScrollTrigger
    - Integrate Mapbox for visualization
    - _Requirements: 7.7, 8.3_

  - [ ] 16.5 Create About page
    - Implement app/[locale]/about/page.tsx
    - Tell company story
    - Display team members with photos and bios
    - Show governance structure
    - List partnerships and memberships
    - _Requirements: 11.4, 11.5, 11.6_

  - [ ] 16.6 Create Resources page
    - Implement app/[locale]/resources/page.tsx
    - List all downloadable documents organized by category
    - Display file metadata (name, size, format)
    - Track downloads via analytics
    - _Requirements: 12.1, 12.2, 12.3, 12.5_

  - [ ] 16.7 Create resource download API route
    - Implement app/api/resources/[slug]/download/route.ts
    - Track download event
    - Redirect to Sanity CDN file URL
    - _Requirements: 12.2, 12.3_

  - [ ] 16.8 Write property test for resource metadata display
    - **Property 50: Resource metadata display**
    - **Validates: Requirements 12.5**

  - [ ] 16.9 Write property test for product-specific resources
    - **Property 51: Product-specific resources**
    - **Validates: Requirements 12.6**

  - [ ] 16.10 Write property test for traceability information display
    - **Property 52: Traceability information display**
    - **Validates: Requirements 23.6**

- [ ] 17. Analytics and Tracking
  - [ ] 17.1 Implement event tracking utilities
    - Create trackEvent functions for all conversion events
    - Track RFQ submissions, contact submissions, resource downloads, product views, CTA clicks
    - Send events to Plausible, GA4 (if consent), and Vercel Analytics
    - _Requirements: 15.4_

  - [ ] 17.2 Integrate analytics in components
    - Add tracking to RFQ form submission
    - Add tracking to contact form submission
    - Add tracking to resource downloads
    - Add tracking to product page views
    - Add tracking to CTA button clicks
    - _Requirements: 15.4, 24.4_

  - [ ] 17.3 Write property test for conversion event tracking
    - **Property 38: Conversion event tracking**
    - **Validates: Requirements 15.4, 24.4**

  - [ ] 17.4 Write property test for Do Not Track respect
    - **Property 39: Do Not Track respect**
    - **Validates: Requirements 15.8**

- [ ] 18. Security Implementation
  - [ ] 18.1 Configure security headers
    - Add CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy headers in next.config.js
    - _Requirements: 20.5, 20.6, 20.7_

  - [ ] 18.2 Implement input sanitization
    - Create sanitization utilities for user inputs
    - Apply to all form handlers
    - _Requirements: 20.2_

  - [ ] 18.3 Set up Sanity webhook with signature verification
    - Implement app/api/revalidate/route.ts
    - Verify webhook signature using HMAC
    - Revalidate appropriate paths based on content type
    - _Requirements: 4.2_

  - [ ] 18.4 Write property test for input sanitization
    - **Property 40: Input sanitization**
    - **Validates: Requirements 20.2**

  - [ ] 18.5 Write property test for rate limiting
    - **Property 41: Rate limiting**
    - **Validates: Requirements 20.3**

- [ ] 19. Accessibility Implementation
  - [ ] 19.1 Implement skip-to-content links
    - Add skip links in layout
    - Ensure keyboard focus management
    - _Requirements: 16.6_

  - [ ] 19.2 Audit and fix color contrast
    - Review all text/background combinations
    - Ensure 4.5:1 ratio for normal text, 3:1 for large text
    - _Requirements: 16.2_

  - [ ] 19.3 Add ARIA labels to interactive elements
    - Audit all buttons, links, form inputs, custom controls
    - Add appropriate aria-label, aria-labelledby, aria-describedby
    - _Requirements: 16.3_

  - [ ] 19.4 Ensure keyboard navigation
    - Test all interactive features with keyboard only
    - Add visible focus indicators
    - Implement focus trapping in modals
    - _Requirements: 16.4_

  - [ ] 19.5 Write property test for color contrast compliance
    - **Property 30: Color contrast compliance**
    - **Validates: Requirements 16.2**

  - [ ] 19.6 Write property test for ARIA labels completeness
    - **Property 31: ARIA labels completeness**
    - **Validates: Requirements 16.3**

  - [ ] 19.7 Write property test for image alt text
    - **Property 32: Image alt text**
    - **Validates: Requirements 16.5**

  - [ ] 19.8 Write property test for form label association
    - **Property 33: Form label association**
    - **Validates: Requirements 16.7**

  - [ ] 19.9 Write property test for keyboard navigation
    - **Property 34: Keyboard navigation**
    - **Validates: Requirements 16.4**

  - [ ] 19.10 Write automated accessibility tests with axe-core
    - **Property 35: WCAG AA compliance**
    - **Validates: Requirements 16.1**

- [ ] 20. Responsive Design Implementation
  - [ ] 20.1 Implement mobile navigation
    - Create hamburger menu or drawer for mobile
    - Ensure touch-friendly targets (44x44px minimum)
    - _Requirements: 18.2, 18.3_

  - [ ] 20.2 Optimize layouts for all viewports
    - Test and adjust layouts for 320px to 3840px
    - Ensure no horizontal scrolling
    - Optimize font sizes for readability
    - _Requirements: 18.1, 18.4_

  - [ ] 20.3 Optimize forms for mobile
    - Use appropriate input types (email, tel, number)
    - Ensure easy completion on mobile devices
    - _Requirements: 18.6_

  - [ ] 20.4 Write property test for viewport adaptation
    - **Property 42: Viewport adaptation**
    - **Validates: Requirements 18.1**

  - [ ] 20.5 Write property test for mobile navigation adaptation
    - **Property 43: Mobile navigation adaptation**
    - **Validates: Requirements 18.2**

  - [ ] 20.6 Write property test for touch target sizing
    - **Property 44: Touch target sizing**
    - **Validates: Requirements 18.3**

  - [ ] 20.7 Write property test for mobile form optimization
    - **Property 45: Mobile form optimization**
    - **Validates: Requirements 18.6**

- [ ] 21. Checkpoint - Content and Features Complete
  - Ensure all pages are accessible
  - Verify responsive design works on all devices
  - Test security headers are applied
  - Confirm analytics tracking is working
  - Ask the user if questions arise

- [ ] 22. Performance Optimization
  - [ ] 22.1 Implement code splitting for heavy libraries
    - Lazy load Mapbox with dynamic import and ssr: false
    - Lazy load GSAP in animation wrappers only
    - Disable Lenis on mobile
    - _Requirements: 9.5, 9.6_

  - [ ] 22.2 Optimize bundle size
    - Analyze bundle with @next/bundle-analyzer
    - Remove unused dependencies
    - Tree-shake libraries where possible
    - _Requirements: 9.5_

  - [ ] 22.3 Implement resource hints
    - Add preconnect for Sanity CDN, Mapbox, analytics services
    - Add dns-prefetch for third-party services
    - _Requirements: 9.7_

  - [ ] 22.4 Optimize images
    - Ensure all images use OptimizedImage component
    - Preload critical above-the-fold images
    - Verify lazy loading for below-the-fold images
    - _Requirements: 5.2, 5.6_

  - [ ] 22.5 Write property test for Core Web Vitals compliance
    - **Property 24: Core Web Vitals compliance**
    - **Validates: Requirements 5.4, 9.2, 9.3, 9.4**

  - [ ] 22.6 Write property test for Lighthouse performance scores
    - **Property 25: Lighthouse performance scores**
    - **Validates: Requirements 9.1**

  - [ ] 22.7 Write property test for code splitting effectiveness
    - **Property 26: Code splitting effectiveness**
    - **Validates: Requirements 9.5**

- [ ] 23. Brand Consistency and Design Polish
  - [ ] 23.1 Apply brand colors consistently
    - Audit all color usage
    - Ensure only brand palette colors are used
    - _Requirements: 17.1_

  - [ ] 23.2 Implement design tokens
    - Ensure consistent spacing, sizing, typography
    - Use Tailwind design tokens throughout
    - _Requirements: 17.3_

  - [ ] 23.3 Style shadcn/ui components
    - Customize component styles to match brand
    - Ensure visual consistency
    - _Requirements: 17.4_

  - [ ] 23.4 Write property test for color palette adherence
    - **Property 46: Color palette adherence**
    - **Validates: Requirements 17.1**

  - [ ] 23.5 Write property test for design token consistency
    - **Property 47: Design token consistency**
    - **Validates: Requirements 17.3, 17.5**

- [ ] 24. Error Handling and Monitoring
  - [ ] 24.1 Set up Sentry error tracking
    - Configure Sentry for client and server
    - Set up error boundaries
    - Configure beforeSend filter
    - _Requirements: 25.1_

  - [ ] 24.2 Implement error handling in API routes
    - Use centralized error handler
    - Log errors to Sentry
    - Return user-friendly error messages
    - _Requirements: 19.6_

  - [ ] 24.3 Configure alerting
    - Set up Sentry alerts for critical errors
    - Configure Slack/email notifications
    - _Requirements: 25.3_

  - [ ] 24.4 Write property test for email delivery error handling
    - **Property 53: Email delivery and error handling**
    - **Validates: Requirements 19.6**

  - [ ] 24.5 Write property test for critical error alerting
    - **Property 55: Critical error alerting**
    - **Validates: Requirements 25.3**

- [ ] 25. Testing and Quality Assurance
  - [ ] 25.1 Set up testing infrastructure
    - Configure Vitest for unit tests
    - Configure fast-check for property-based tests
    - Configure Playwright for E2E tests
    - Configure jest-axe for accessibility tests
    - _Requirements: All (testing foundation)_

  - [ ] 25.2 Write E2E tests for critical user journeys
    - Buyer journey: Homepage → Products → Product Detail → RFQ → Confirmation
    - Institutional journey: Homepage → Traceability → Quality → Contact → Confirmation
    - Language switching journey
    - Resource download journey
    - Blog reading journey
    - _Requirements: 24.1, 24.2_

  - [ ] 25.3 Set up Lighthouse CI
    - Configure Lighthouse CI in GitHub Actions
    - Set performance budgets
    - Fail builds if budgets are exceeded
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 25.4 Run accessibility audit
    - Use axe-core to scan all pages
    - Fix any violations found
    - _Requirements: 16.1_

- [ ] 26. Content Population and CMS Training
  - [ ] 26.1 Populate Sanity with initial content
    - Add all products with complete information
    - Add certifications
    - Add team members
    - Add initial blog posts
    - Add resources
    - _Requirements: 4.1_

  - [ ] 26.2 Create CMS documentation
    - Document how to add/edit products
    - Document how to publish blog posts
    - Document how to manage resources
    - Document workflow (Draft → Review → Publish)
    - _Requirements: 22.5_

- [ ] 27. Deployment and Production Setup
  - [ ] 27.1 Configure Vercel deployment
    - Set up production and preview environments
    - Configure environment variables
    - Set up custom domain
    - _Requirements: All (deployment)_

  - [ ] 27.2 Set up monitoring and analytics
    - Verify Sentry is tracking errors
    - Verify Plausible is tracking page views
    - Verify GA4 is working (with consent)
    - Verify Vercel Analytics is active
    - _Requirements: 15.1, 15.2, 15.3, 25.1, 25.5_

  - [ ] 27.3 Configure Sanity webhook
    - Set up webhook in Sanity dashboard
    - Point to /api/revalidate endpoint
    - Add webhook secret
    - Test revalidation
    - _Requirements: 4.2_

  - [ ] 27.4 Set up Vercel KV for rate limiting
    - Create Vercel KV database
    - Configure connection
    - Test rate limiting
    - _Requirements: 20.3_

  - [ ] 27.5 Final production checklist
    - Verify all environment variables are set
    - Confirm HTTPS is enforced
    - Test all forms in production
    - Verify email sending works
    - Check all analytics are tracking
    - Run final Lighthouse audit
    - Test on multiple devices and browsers
    - _Requirements: 20.1_

- [ ] 28. Final Checkpoint - Production Ready
  - All tests passing
  - Performance budgets met
  - Accessibility compliance verified
  - Security headers configured
  - Monitoring active
  - Content populated
  - Ready for launch

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows a phased approach: Foundation → Core Features → Content & SEO → Polish & Optimization

