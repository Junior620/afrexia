# Requirements Document

## Introduction

This document specifies the requirements for implementing a premium partner section on the Afrexia website to showcase SCPB SARL as a strategic partner. The section will be positioned immediately after the Services Section on the homepage and will communicate B2B trust through operational presence, logistics capacity, and integration standards while maintaining Afrexia's luxury export/editorial design aesthetic.

## Glossary

- **Partner_Section**: The React component that displays SCPB SARL partnership information on the homepage
- **SCPB_SARL**: Strategic partner/subsidiary entity of Afrexia providing local operational services
- **Design_System**: The established visual design language including dark green/charcoal backgrounds, gold accents, and sophisticated typography
- **CTA**: Call-to-action button or link element
- **EUDR**: EU Deforestation Regulation compliance standard
- **Photo_Stack**: Visual layout pattern with overlapping images
- **Trust_Indicators**: Visual and textual elements that communicate credibility (stats, badges, response times)
- **Responsive_Layout**: Adaptive design that adjusts between desktop (2-column) and mobile (stacked) layouts

## Requirements

### Requirement 1: Partner Section Placement and Structure

**User Story:** As a website visitor, I want to see partner information in a logical flow on the homepage, so that I understand Afrexia's operational capabilities and partnerships.

#### Acceptance Criteria

1. THE Partner_Section SHALL be positioned immediately after the Services Section on the homepage
2. WHEN the homepage loads, THE Partner_Section SHALL render as a distinct visual section with proper spacing
3. THE Partner_Section SHALL display SCPB SARL as the featured partner with relationship descriptor "Partenaire stratégique / filleule Afrexia"
4. THE Partner_Section SHALL include a clickable link to https://ste-scpb.com that opens in a new tab
5. WHEN the partner website link is clicked, THE system SHALL apply rel="noopener noreferrer" security attributes

### Requirement 2: Desktop Layout Implementation

**User Story:** As a desktop user, I want to view partner information in a visually balanced layout, so that I can quickly scan key information and visual proof points.

#### Acceptance Criteria

1. WHEN viewed on desktop (≥768px), THE Partner_Section SHALL display a 2-column layout with 60/40 or 55/45 width ratio
2. THE left column SHALL display a Photo_Stack with a large primary image and overlaid smaller image
3. THE primary image SHALL have 28px border radius and soft shadow styling
4. THE overlay image SHALL have 24px border radius, 1px border with rgba(255,255,255,0.08), and 1-2° rotation
5. THE Photo_Stack SHALL include a discrete caption "Contrôle qualité & traçabilité sur site" at the bottom
6. THE right column SHALL display editorial content including eyebrow, title, subtitle, body text, key facts list, CTAs, and trust microcopy
7. THE section SHALL have maximum width of 1200px and 96px vertical padding

### Requirement 3: Mobile Layout Implementation

**User Story:** As a mobile user, I want to view partner information in a stacked layout optimized for small screens, so that I can access all content without horizontal scrolling.

#### Acceptance Criteria

1. WHEN viewed on mobile (<768px), THE Partner_Section SHALL display content in a stacked vertical layout
2. THE stacking order SHALL be: title, Photo_Stack with overlay, text content, CTAs
3. THE CTAs SHALL display at full width on mobile devices
4. THE section SHALL have 64px vertical padding on mobile devices
5. THE heading font size SHALL be 30-34px on mobile devices

### Requirement 4: Content Display and Structure

**User Story:** As a B2B buyer, I want to see concise, scannable information about Afrexia's partner capabilities, so that I can quickly assess operational credibility.

#### Acceptance Criteria

1. THE Partner_Section SHALL display an eyebrow label "Partenaire opérationnel"
2. THE Partner_Section SHALL display the title "Afexia × SCPB SARL"
3. THE Partner_Section SHALL display the subtitle "Un ancrage local solide, des standards internationaux, une exécution prête pour audit."
4. THE body text SHALL be limited to 90-120 words total across 2-3 paragraphs
5. THE Partner_Section SHALL display exactly 3 key facts as bullet points: "Collecte, stockage & préparation export", "Contrôle qualité & documentation (COA / Spec sheets)", "Traçabilité & conformité EUDR-ready"
6. THE Partner_Section SHALL display trust microcopy "Réponse sous 24h • NDA standard • Dossiers QA sur demande" below the CTAs

### Requirement 5: Call-to-Action Implementation

**User Story:** As a potential client, I want clear action buttons to learn more about the partner or view execution capabilities, so that I can take the next step in my evaluation process.

#### Acceptance Criteria

1. THE Partner_Section SHALL display two CTAs in a horizontal row on desktop
2. THE primary CTA SHALL display "Découvrir SCPB SARL" with gold accent styling
3. THE secondary CTA SHALL display "Voir nos capacités d'exécution" with outline styling
4. WHEN the primary CTA is clicked, THE system SHALL navigate to https://ste-scpb.com in a new tab
5. WHEN the secondary CTA is clicked, THE system SHALL navigate to the Impact/Track record section or Solutions page
6. WHEN a user hovers over any CTA, THE system SHALL display visible hover state styling
7. WHEN a user focuses on any CTA via keyboard, THE system SHALL display visible focus state styling

### Requirement 6: Visual Design and Brand Consistency

**User Story:** As a brand manager, I want the partner section to maintain Afrexia's luxury export aesthetic, so that the website presents a cohesive premium brand experience.

#### Acceptance Criteria

1. THE Partner_Section SHALL use primary text color #EDEDED for main content
2. THE Partner_Section SHALL use secondary text color rgba(237,237,237,0.72) for supporting content
3. THE Partner_Section SHALL use the existing site gold accent color for primary CTAs
4. THE Partner_Section SHALL use background color rgba(255,255,255,0.03) with border rgba(255,255,255,0.06) for card surfaces
5. THE heading (H2) SHALL be 42-52px on desktop and 30-34px on mobile
6. THE body text SHALL be 16-18px with line-height approximately 1.6
7. THE border radius for images SHALL be 24-28px
8. THE Photo_Stack SHALL include a very light gradient overlay for text readability

### Requirement 7: Interactive Enhancements

**User Story:** As a user, I want visual feedback when interacting with elements in the partner section, so that I understand which elements are interactive.

#### Acceptance Criteria

1. WHEN a user hovers over the Photo_Stack images, THE system SHALL apply a scale transformation of 1.02 and accent border
2. WHEN a user hovers over any CTA, THE system SHALL display clear hover state styling
3. WHEN a user focuses on any interactive element via keyboard, THE system SHALL display visible focus state styling
4. THE hover and focus transitions SHALL be smooth and performant

### Requirement 8: Image Optimization and Performance

**User Story:** As a website visitor, I want images to load quickly and efficiently, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. THE Partner_Section SHALL use next/image component for all images
2. THE images SHALL implement lazy loading
3. THE images SHALL include blur placeholder during loading
4. THE images SHALL use responsive sizes based on viewport
5. THE images SHALL include appropriate alt text for accessibility

### Requirement 9: Component Architecture and Reusability

**User Story:** As a developer, I want a well-structured, reusable component, so that I can easily maintain and extend the partner section.

#### Acceptance Criteria

1. THE system SHALL implement a React component named PartnerSection
2. THE PartnerSection component SHALL accept props for partnerName, relationship, partnerUrl, and images array
3. THE component SHALL be data-driven using a content object structure
4. THE component SHALL support TypeScript type definitions
5. THE component SHALL use Tailwind CSS for styling
6. THE component SHALL be framework-compatible with Next.js 14+ App Router

### Requirement 10: Internationalization Support

**User Story:** As an international visitor, I want to view partner information in my preferred language, so that I can understand the content clearly.

#### Acceptance Criteria

1. THE Partner_Section SHALL support both French (FR) and English (EN) content
2. THE content SHALL be stored in a structured JSON format for easy translation
3. WHEN the site language changes, THE Partner_Section SHALL display content in the selected language
4. THE component SHALL integrate with the existing internationalization system

### Requirement 11: Accessibility Compliance

**User Story:** As a user with accessibility needs, I want the partner section to be fully accessible, so that I can navigate and understand the content using assistive technologies.

#### Acceptance Criteria

1. THE Partner_Section SHALL include proper semantic HTML structure
2. THE images SHALL include descriptive alt text
3. THE interactive elements SHALL be keyboard navigable
4. THE focus states SHALL be clearly visible
5. THE color contrast SHALL meet WCAG AA standards
6. THE links SHALL clearly indicate they open in new tabs for screen reader users

### Requirement 12: Trust Indicators and Proof Points

**User Story:** As a B2B buyer, I want to see concrete proof of operational capacity, so that I can assess whether Afrexia can handle my requirements.

#### Acceptance Criteria

1. WHERE validated statistics are available, THE Partner_Section SHALL display 3 mini-stat cards showing producer network, annual capacity, and infrastructure metrics
2. THE stat cards SHALL use compact design with background rgba(255,255,255,0.03) and border rgba(255,255,255,0.06)
3. WHERE statistics are not yet validated, THE system SHALL mark them as "to be completed" in the content structure
4. THE Partner_Section SHALL include a "View field photos" link that opens a modal, slider, or gallery section
5. THE trust indicators SHALL be visually distinct and scannable
