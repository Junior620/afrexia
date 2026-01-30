# Requirements Document: Catalog Dark Premium Redesign

## Introduction

Ce document spécifie les exigences pour la refonte complète du catalogue produits Afrexia en version dark premium. L'objectif est d'harmoniser le catalogue avec la direction artistique dark green/gold du site, tout en optimisant la conversion B2B (lead generation via RFQ).

Le système cible les acheteurs industriels internationaux, chocolatiers et traders qui nécessitent une expérience premium sobre, une clarté des spécifications techniques, et des preuves de conformité (EUDR-ready).

## Glossary

- **DA (Direction Artistique)**: Style visuel premium dark green/charcoal + accent gold
- **RFQ (Request for Quote)**: Demande de devis
- **EUDR**: EU Deforestation Regulation - Règlement européen sur la déforestation
- **Glass Effect**: Effet de transparence avec backdrop blur (glassmorphism)
- **Dark Panel**: Panneau sombre avec bordure subtile et ombre douce
- **Microproof**: Micro-élément de réassurance (ex: "Réponse sous 24h")
- **CRO (Conversion Rate Optimization)**: Optimisation du taux de conversion
- **Lead-gen**: Génération de leads qualifiés
- **QA**: Quality Assurance - Assurance qualité
- **COA**: Certificate of Analysis - Certificat d'analyse
- **MOQ**: Minimum Order Quantity - Quantité minimale de commande
- **Incoterms**: International Commercial Terms - Termes commerciaux internationaux

## Requirements

### Requirement 1: Dark Premium Theme Implementation

**User Story:** En tant qu'acheteur B2B, je veux une expérience visuelle premium et cohérente avec l'identité Afrexia, pour percevoir le professionnalisme et la qualité de l'offre.

#### Acceptance Criteria

1. WHEN the catalog page loads, THE System SHALL display a dark charcoal background (#0A1410 ou #1A2820)
2. THE System SHALL use ivory/light text (#E8F5E9 ou #B0D4B8) for primary content with WCAG AA contrast
3. THE System SHALL use gold accent (#A89858) for secondary links and hover states
4. THE System SHALL apply dark green (#4A9A62) for primary CTAs and brand elements
5. THE System SHALL eliminate all white/light theme elements from the current design
6. THE System SHALL use glass effect or dark panel style for product cards with:
   - Border radius: 24-28px
   - Subtle border: rgba(255,255,255,0.1)
   - Soft shadow: 0 8px 32px rgba(0,0,0,0.3)
   - Optional backdrop blur for glass effect
7. THE System SHALL maintain consistent dark theme across all catalog components

### Requirement 2: Header Redesign

**User Story:** En tant qu'acheteur, je veux un header clair et informatif qui m'explique immédiatement la valeur de l'offre et les garanties de qualité.

#### Acceptance Criteria

1. THE System SHALL display "Catalogue Produits" as H1 (44-56px, bold, dark-primary color)
2. THE System SHALL display a clear subtitle with WCAG AA contrast:
   - FR: "Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit."
   - EN: "Cocoa, coffee & African commodities — Documented QA, audit-ready traceability."
3. THE System SHALL include a primary CTA button "Demander un devis" / "Request a Quote"
4. THE System SHALL include a secondary CTA button "Télécharger le catalogue (PDF)" / "Download Catalog (PDF)"
5. THE System SHALL display trust indicators below the subtitle (24h response, NDA, EUDR, QA, COA)
6. THE System SHALL use dark background with subtle gradient or pattern
7. THE System SHALL ensure header height does not exceed 30vh on desktop, 40vh on mobile

### Requirement 3: Filters UX Redesign

**User Story:** En tant qu'acheteur, je veux des filtres clairs et accessibles pour trouver rapidement les produits qui correspondent à mes besoins spécifiques.

#### Acceptance Criteria

1. THE System SHALL display filters in a sticky bar on desktop (position: sticky, top: 0)
2. THE System SHALL collapse filters into a "Filtrer" button with sheet/drawer on mobile (< 768px)
3. THE System SHALL provide visible labels for each filter:
   - Catégorie / Category
   - Origine / Origin
   - Disponibilité / Availability
   - Certifications
   - Incoterms
   - MOQ (Quantité minimale)
4. THE System SHALL include explicit placeholders:
   - "Sélectionner une catégorie" / "Select a category"
   - "Sélectionner une origine" / "Select an origin"
   - etc.
5. THE System SHALL display a "Reset" / "Réinitialiser" button when filters are active
6. THE System SHALL display a results counter: "X produits" / "X products"
7. THE System SHALL use dark theme for filter controls with proper contrast
8. THE System SHALL apply glass effect or dark panel style to filter bar
9. THE System SHALL ensure filter bar z-index is appropriate (z-40 or higher)

### Requirement 4: Product Card V2 Redesign

**User Story:** En tant qu'acheteur, je veux des fiches produits claires qui affichent toutes les informations essentielles (specs, conformité, disponibilité) pour prendre une décision rapide.

#### Acceptance Criteria

1. THE System SHALL display product image with fallback to premium pattern + gradient if no image available
2. THE System SHALL display badges at top of card:
   - "EUDR-ready" badge (if applicable)
   - Availability badge: "Disponible" / "Available" or "Sur demande" / "On Request"
3. THE System SHALL display product name as H3 (20-22px, bold)
4. THE System SHALL display a short subtitle below product name
5. THE System SHALL display quick specs in mini-grid format:
   - Origine / Origin (with value visible)
   - MOQ (with value visible)
   - Incoterms (with values visible)
6. THE System SHALL provide two action buttons:
   - Primary (full): "Demander un devis" / "Request a Quote"
   - Secondary (outline): "Voir fiche technique" / "View Specifications"
7. THE System SHALL display microproof below actions:
   - FR: "Réponse sous 24h • NDA possible"
   - EN: "24h response • NDA available"
8. THE System SHALL apply hover states on desktop:
   - Elevation increase
   - Shadow enhancement
   - Optional scale transform (1.02)
9. THE System SHALL apply focus states for accessibility (2px outline, gold color)
10. THE System SHALL use dark panel style with:
    - Background: rgba(26, 40, 32, 0.8) or similar dark-bg-secondary
    - Border: rgba(255,255,255,0.1)
    - Border radius: 24-28px
    - Shadow: 0 8px 32px rgba(0,0,0,0.3)
11. THE System SHALL ensure all text meets WCAG AA contrast requirements on dark background

### Requirement 5: RFQ Workflow Enhancement

**User Story:** En tant qu'acheteur, je veux un processus de demande de devis simple et rapide, pré-rempli avec le produit sélectionné.

#### Acceptance Criteria

1. WHEN a user clicks "Demander un devis", THE System SHALL open a drawer/modal with the product pre-selected
2. THE RFQ drawer SHALL display in dark theme consistent with catalog
3. THE RFQ drawer SHALL include minimum fields:
   - Produit / Product (pre-filled, read-only)
   - Quantité / Quantity (number input, min = MOQ)
   - Incoterm (select dropdown)
   - Destination/Port (text input)
   - Email (email input, required)
   - Société / Company (text input, required)
   - Notes additionnelles / Additional notes (textarea, optional)
4. THE RFQ drawer SHALL validate all required fields before submission
5. THE RFQ drawer SHALL display trust elements:
   - "Réponse sous 24h" / "24h response"
   - "NDA disponible sur demande" / "NDA available upon request"
6. THE RFQ drawer SHALL show loading state during submission
7. THE RFQ drawer SHALL show success message after submission
8. THE System SHALL display a sticky bottom CTA on mobile: "Request a Quote" / "Demander un devis"
9. THE System SHALL track RFQ submissions with analytics event "rfq_submit"

### Requirement 6: Visual Quality & Accessibility

**User Story:** En tant qu'utilisateur, je veux une expérience visuelle de haute qualité qui soit également accessible à tous.

#### Acceptance Criteria

1. THE System SHALL ensure minimum WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
2. THE System SHALL use typography scale:
   - H1: 44-56px
   - H3: 20-22px
   - Body: 14-16px
3. THE System SHALL apply consistent spacing:
   - Section padding: 64-96px desktop, 32-48px mobile
   - Card padding: 20-24px
   - Grid gap: 24px desktop, 16px mobile
4. THE System SHALL use next/image for all product images with:
   - Lazy loading enabled
   - Appropriate sizes attribute
   - Optimized formats (WebP, AVIF)
5. THE System SHALL provide keyboard navigation for all interactive elements
6. THE System SHALL display visible focus indicators (2px outline, gold color)
7. THE System SHALL use semantic HTML (header, main, section, article)
8. THE System SHALL provide descriptive alt text for all images
9. THE System SHALL ensure touch targets ≥ 44x44px on mobile

### Requirement 7: Copywriting & Translations

**User Story:** En tant qu'acheteur international, je veux du contenu clair et professionnel dans ma langue.

#### Acceptance Criteria

1. THE System SHALL provide French and English translations for all UI elements
2. THE System SHALL use professional B2B tone for all copy
3. THE System SHALL include the following key messages:
   - Header subtitle emphasizing QA documentation and audit-ready traceability
   - Microproof elements: "24h response", "NDA available"
   - Trust indicators: EUDR compliance, documented QA, COA availability
4. THE System SHALL use clear, action-oriented CTA text:
   - Primary: "Demander un devis" / "Request a Quote"
   - Secondary: "Voir fiche technique" / "View Specifications"
   - Download: "Télécharger le catalogue (PDF)" / "Download Catalog (PDF)"
5. THE System SHALL provide explicit filter placeholders in both languages
6. THE System SHALL display results counter in appropriate language

### Requirement 8: Analytics & Tracking

**User Story:** En tant que stakeholder business, je veux tracker les interactions clés pour optimiser la conversion.

#### Acceptance Criteria

1. WHEN a user applies a filter, THE System SHALL fire "filter_used" event with filter type and value
2. WHEN a user clicks "Demander un devis", THE System SHALL fire "quote_click" event with product ID
3. WHEN a user submits an RFQ, THE System SHALL fire "rfq_submit" event with product IDs and form data
4. WHEN a user clicks "Télécharger le catalogue", THE System SHALL fire "pdf_download" event
5. THE System SHALL include product metadata in all events (category, origin, availability)
6. THE System SHALL track time spent on catalog page
7. THE System SHALL track scroll depth

### Requirement 9: Responsive Design

**User Story:** En tant qu'utilisateur mobile, je veux une expérience optimisée pour mon appareil.

#### Acceptance Criteria

1. THE System SHALL be fully functional on viewport widths from 320px to 1920px
2. THE System SHALL display 1 column grid on mobile (< 768px)
3. THE System SHALL display 2-3 column grid on tablet (768px - 1024px)
4. THE System SHALL display 3-4 column grid on desktop (> 1024px)
5. THE System SHALL collapse filters into drawer on mobile
6. THE System SHALL display sticky bottom RFQ CTA on mobile
7. THE System SHALL ensure no horizontal scrolling at any viewport size
8. THE System SHALL optimize touch targets for mobile (≥ 44x44px)

### Requirement 10: Performance

**User Story:** En tant qu'utilisateur, je veux une page qui charge rapidement et reste fluide.

#### Acceptance Criteria

1. THE System SHALL achieve Lighthouse performance score ≥ 85 on desktop
2. THE System SHALL achieve Lighthouse performance score ≥ 75 on mobile
3. THE System SHALL implement lazy loading for product images
4. THE System SHALL use code splitting for modals/drawers
5. THE System SHALL debounce search input (300ms)
6. THE System SHALL memoize expensive filter calculations
7. THE System SHALL prefetch product detail pages on card hover

## Technical Constraints

- Stack: Next.js 14+ with App Router
- Styling: Tailwind CSS with custom dark theme configuration
- Components: Reusable TypeScript components with proper interfaces
- Images: next/image with Sanity CDN integration
- Accessibility: WCAG AA compliance minimum
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

## Success Metrics

- Conversion rate (RFQ submissions) increase by 25%
- Time to RFQ submission decrease by 30%
- Bounce rate decrease by 15%
- Average session duration increase by 20%
- Mobile conversion rate parity with desktop (within 10%)

## Out of Scope

- Product detail page redesign (separate spec)
- Shopping cart functionality
- Payment processing
- User accounts/authentication
- Product comparison feature
- Wishlist functionality
