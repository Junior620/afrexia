# Design Document: Product Catalog Redesign

## Overview

This design document specifies the architecture, components, and implementation details for the redesigned product catalog page. The design addresses the current implementation's usability and conversion issues while providing a scalable foundation for B2B e-commerce functionality.

The catalog page will feature a modern, filterable product grid with enhanced product cards, streamlined RFQ workflows, and comprehensive trust elements. The design supports two visual themes: "traceability-first" (emphasizing compliance and documentation) and "luxury-editorial" (emphasizing premium aesthetics and storytelling).

## Architecture

### Page Structure

The catalog page follows a vertical flow optimized for conversion:

```
┌─────────────────────────────────────┐
│ Compact Header (CatalogHeader)      │
│ - H1 + Subtitle                     │
│ - Primary CTA (Download Catalog)    │
│ - Trust indicators                  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Sticky Filter Bar (CatalogFilters)  │ ← Remains visible on scroll
│ - Search input                      │
│ - Category, Origin, Availability    │
│ - Certifications, Incoterms, MOQ    │
│ - Active filter chips + Clear all   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Product Grid (ProductGrid)          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │ Card │ │ Card │ │ Card │ │ Card ││
│ └──────┘ └──────┘ └──────┘ └──────┘│
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │ Card │ │ Card │ │ Card │ │ Card ││
│ └──────┘ └──────┘ └──────┘ └──────┘│
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Process & Compliance Section        │
│ - Quality standards                 │
│ - Traceability process              │
│ - Certifications overview           │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Footer CTA (Multi-Product RFQ)      │
│ - "Need multiple products?"         │
│ - CTA to open RFQ drawer            │
└─────────────────────────────────────┘

Overlays (conditional):
┌─────────────────────────────────────┐
│ RFQ Drawer (slide from right)       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Quick View Modal (centered)         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Catalog Download Form Modal         │
└─────────────────────────────────────┘
```

### Component Hierarchy

```
ProductCatalogPage
├── CatalogHeader
│   ├── Heading (H1)
│   ├── Subtitle
│   ├── TrustStrip
│   └── DownloadCatalogButton
├── CatalogFilters (sticky)
│   ├── SearchInput
│   ├── FilterDropdowns
│   │   ├── CategoryFilter
│   │   ├── OriginFilter
│   │   ├── AvailabilityFilter
│   │   ├── CertificationFilter
│   │   ├── IncotermsFilter
│   │   └── MOQFilter
│   ├── ActiveFilterChips
│   └── ClearFiltersButton
├── ProductGrid
│   └── ProductCard[] (array of cards)
│       ├── MediaSection
│       │   ├── ProductImage
│       │   ├── GradientOverlay
│       │   └── BadgeGroup
│       ├── ContentSection
│       │   ├── ProductHeader
│       │   ├── QuickSpecs
│       │   └── DocumentIndicators
│       └── ActionsSection
│           ├── PrimaryCTA (Quote button)
│           ├── SecondaryCTA (Specs link)
│           └── QuickViewButton
├── ProcessComplianceSection
│   ├── QualityStandards
│   ├── TraceabilityProcess
│   └── CertificationsOverview
├── FooterCTA
│   └── MultiProductRFQButton
├── RFQDrawer (conditional)
│   ├── DrawerHeader
│   ├── SelectedProductsList
│   ├── RFQForm
│   │   ├── ContactFields
│   │   ├── OrderDetails
│   │   └── AdditionalNotes
│   ├── TrustElements
│   └── SubmitButton
├── QuickViewModal (conditional)
│   ├── ProductImage
│   ├── ComprehensiveSpecs
│   ├── CertificationsList
│   ├── DocumentsList
│   └── CTAButtons
└── CatalogDownloadModal (conditional)
    ├── LeadCaptureForm
    └── DownloadButton
```

### Mobile Adaptations

On mobile viewports (< 768px):
- Single-column product grid
- Filters collapse into expandable drawer/accordion
- Sticky bottom bar with RFQ cart icon
- Simplified product cards with stacked layout
- Touch-optimized tap targets (44x44px minimum)

## Components and Interfaces

### 1. ProductCatalogPage Component

**Purpose:** Main page component orchestrating the entire catalog experience.

**Props Interface:**
```typescript
interface ProductCatalogPageProps {
  locale: 'fr' | 'en' | 'es' | 'de' | 'ru';
  initialProducts: Product[];
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: CatalogTranslations;
}
```

**Responsibilities:**
- Fetch and manage product data from Sanity CMS
- Manage filter state and apply filtering logic
- Handle RFQ drawer state
- Handle Quick View modal state
- Track analytics events
- Coordinate between child components

### 2. CatalogHeader Component

**Purpose:** Compact header section with page title, subtitle, and trust indicators.

**Props Interface:**
```typescript
interface CatalogHeaderProps {
  locale: string;
  translations: {
    heading: string;
    subtitle: string;
    downloadCatalogCTA: string;
  };
  onDownloadCatalog: () => void;
}
```

**Visual Specifications:**
- Max height: 20vh (viewport height)
- Background: Subtle gradient or solid color matching brand
- Padding: 48px vertical, 24px horizontal (desktop), 32px vertical, 16px horizontal (mobile)
- H1: 36-42px font size, bold weight, dark green (#194424) or charcoal
- Subtitle: 16-18px font size, regular weight, 60% opacity
- Trust strip: Horizontal row of icons + text, 14px font size

**Layout:**
```
┌────────────────────────────────────────────┐
│  Notre Catalogue de Produits              │ ← H1
│  Cacao, café et produits agricoles...     │ ← Subtitle
│                                            │
│  [24h] [NDA] [EUDR] [QA] [COA]           │ ← Trust strip
│                                            │
│  [Télécharger le catalogue PDF]           │ ← CTA button
└────────────────────────────────────────────┘
```

### 3. TrustStrip Component

**Purpose:** Display B2B credibility indicators in a compact horizontal strip.

**Props Interface:**
```typescript
interface TrustStripProps {
  items: TrustItem[];
  variant?: 'compact' | 'detailed';
}

interface TrustItem {
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
}
```

**Visual Specifications:**
- Display: Flex row, gap 24px (desktop), 16px (mobile)
- Each item: Icon (20x20px) + Label (14px)
- Color: Charcoal or dark green
- Hover: Tooltip with additional details

**Default Items:**
- 24h response time (clock icon)
- NDA available (document icon)
- EUDR compliant (leaf icon)
- QA documented (checkmark icon)
- COA & spec sheets (folder icon)

### 4. CatalogFilters Component

**Purpose:** Sticky filter bar with search and multiple filter controls.

**Props Interface:**
```typescript
interface CatalogFiltersProps {
  searchQuery: string;
  activeFilters: FilterState;
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: FilterTranslations;
  onSearchChange: (query: string) => void;
  onFilterChange: (filterType: FilterType, value: any) => void;
  onClearFilters: () => void;
  productCount: number;
}

interface FilterState {
  category?: string;
  origins?: string[];
  availability?: AvailabilityStatus[];
  eudrReady?: boolean;
  certifications?: string[];
  incoterms?: string[];
  moqRange?: { min: number; max: number };
}

type FilterType = 'category' | 'origins' | 'availability' | 'eudrReady' | 'certifications' | 'incoterms' | 'moqRange';
```

**Visual Specifications:**
- Position: Sticky, top: 0, z-index: 100
- Background: White with subtle shadow
- Padding: 16px vertical, 24px horizontal
- Layout: Flex row wrap, gap 12px
- Search input: 300px width (desktop), full width (mobile)
- Filter dropdowns: Min 150px width, max-content
- Active filter chips: Pill shape, 12px font, close icon
- Product count: "X produits" in muted text

**Desktop Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ [Search input.....................] [Category ▼]         │
│ [Origin ▼] [Availability ▼] [Certifications ▼]          │
│ [Incoterms ▼] [MOQ ▼]                                    │
│                                                           │
│ Active: [Côte d'Ivoire ×] [EUDR Ready ×] [Clear all]    │
│ 24 produits                                              │
└──────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌──────────────────────────────────┐
│ [Search input.................]  │
│ [Filters (3) ▼]                  │
│                                  │
│ Active: [Côte d'Ivoire ×]       │
│ 24 produits                      │
└──────────────────────────────────┘
```

**Sticky Behavior:**
- Remains at top of viewport during scroll
- Collapses slightly on scroll (reduced padding) for space efficiency
- On mobile: Filters collapse into expandable drawer

### 5. ProductGrid Component

**Purpose:** Responsive grid layout for product cards.

**Props Interface:**
```typescript
interface ProductGridProps {
  products: Product[];
  locale: string;
  translations: ProductTranslations;
  onQuoteClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onProductView: (product: Product) => void;
}
```

**Visual Specifications:**
- Grid columns: 1 (mobile), 2 (tablet), 3-4 (desktop)
- Gap: 24px (desktop), 16px (mobile)
- Padding: 24px horizontal
- Max width: 1440px, centered

**Responsive Breakpoints:**
- < 768px: 1 column
- 768px - 1024px: 2 columns
- 1024px - 1280px: 3 columns
- > 1280px: 4 columns

### 6. ProductCard Component (v2)

**Purpose:** Enhanced product card with improved readability, quick specs, and clear CTAs.

**Props Interface:**
```typescript
interface ProductCardProps {
  product: Product;
  locale: string;
  translations: ProductCardTranslations;
  variant?: 'traceability-first' | 'luxury-editorial';
  onQuoteClick: () => void;
  onQuickView: () => void;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  heroImage: SanityImage;
  availability: 'in-stock' | 'limited' | 'pre-order';
  origins: string[];
  certifications: string[];
  eudrReady: boolean;
  qaAvailable: boolean;
  documents: {
    coa: boolean;
    specSheet: boolean;
    chainOfCustody: boolean;
  };
  moq: {
    value: number;
    unit: string;
  };
  incoterms: string[];
  packaging?: string;
  grade?: string;
  leadTime?: string;
  notes?: string;
  tags: string[];
  markets: string[];
  updatedAt: string;
}
```

**Visual Specifications:**

**Card Dimensions:**
- Border radius: 24px (luxury-editorial) or 16px (traceability-first)
- Padding: 0 (image full bleed), 20px (content section), 20px (actions section)
- Min height: 480px
- Background: White
- Border: 1px solid rgba(0,0,0,0.08)
- Shadow: 0 2px 8px rgba(0,0,0,0.04)
- Hover shadow: 0 8px 24px rgba(0,0,0,0.12)
- Transition: all 0.3s ease

**Media Section:**
- Aspect ratio: 4:3 or 3:2
- Image: Object-fit cover, full width
- Gradient overlay: Linear gradient from transparent to rgba(0,0,0,0.6) at bottom
- Badge group: Absolute positioned, top-right, gap 8px
- Badge style: Pill shape, 12-13px font, semi-transparent background with backdrop blur

**Content Section:**
- Padding: 20px
- Product name (H3): 20-22px font size, bold, line-height 1.3
- Subtitle: 14px font size, muted color, margin-top 4px
- Quick specs: Grid layout, 2 columns, gap 12px, margin-top 16px
- Spec item: Icon (16px) + Label (12px) + Value (14px bold)
- Document indicators: Flex row, gap 8px, margin-top 12px, icon size 18px

**Actions Section:**
- Padding: 20px
- Border-top: 1px solid rgba(0,0,0,0.08)
- Layout: Flex column, gap 12px
- Primary CTA: Full width button, 44px height, bold text, dark green background
- Secondary CTA: Text link, 14px, underline on hover, charcoal color
- Quick view: Icon button, absolute top-right of card, 40x40px, white background, shadow

**Traceability-First Variant:**
- Emphasize badges (EUDR, certifications) with larger size and prominent placement
- Document indicators more visible (colored icons)
- Quick specs include compliance-related info
- Primary CTA: "Demander un devis + documentation"

**Luxury-Editorial Variant:**
- Larger border radius (24-28px)
- More generous padding (24px)
- Elegant typography (serif for product name optional)
- Subtle gold accent on hover
- Primary CTA: "Demander un devis"

**Card Layout:**
```
┌────────────────────────────────┐
│                                │
│     [Product Image]            │ ← Media section
│     with gradient overlay      │   Badges top-right
│                                │
├────────────────────────────────┤
│ Product Name                   │ ← Content section
│ Subtitle/Category              │
│                                │
│ 🌍 Origine: Côte d'Ivoire     │
│ 📦 MOQ: 500 kg                │ ← Quick specs
│ 🚢 Incoterm: FOB              │
│                                │
│ [📄] [✓] [🔗]                 │ ← Document indicators
├────────────────────────────────┤
│ [Demander un devis]           │ ← Actions section
│ Voir spécifications →         │
│                         [👁]   │ ← Quick view button
└────────────────────────────────┘
```

**Accessibility:**
- All interactive elements keyboard accessible
- Focus visible indicator (2px outline, gold color)
- Alt text for images: "{Product name} - {Category}"
- ARIA labels for icon-only buttons
- Contrast ratio: 4.5:1 minimum for all text

### 7. QuickViewModal Component

**Purpose:** Modal overlay showing comprehensive product specifications without leaving the catalog page.

**Props Interface:**
```typescript
interface QuickViewModalProps {
  product: Product;
  locale: string;
  translations: QuickViewTranslations;
  isOpen: boolean;
  onClose: () => void;
  onQuoteClick: () => void;
}
```

**Visual Specifications:**
- Modal width: 800px max (desktop), 100vw (mobile)
- Modal height: 90vh max, scrollable content
- Background: White
- Border radius: 16px (desktop), 0 (mobile)
- Padding: 32px (desktop), 20px (mobile)
- Overlay: rgba(0,0,0,0.6) backdrop with blur
- Close button: Top-right, 40x40px, X icon

**Layout:**
```
┌──────────────────────────────────────┐
│ [×]                                  │ ← Close button
│                                      │
│ ┌────────────┐  Product Name        │
│ │            │  Category             │
│ │   Image    │                       │
│ │            │  Availability: ●      │
│ └────────────┘  [EUDR] [Bio]        │
│                                      │
│ Spécifications:                      │
│ • Origine: Côte d'Ivoire            │
│ • Grade: Premium                     │
│ • Conditionnement: Sacs 60kg        │
│ • MOQ: 500 kg                        │
│ • Délai: 4-6 semaines               │
│ • Incoterms: FOB, CIF, DAP          │
│                                      │
│ Certifications:                      │
│ [EUDR Ready] [Bio] [Fair Trade]     │
│                                      │
│ Documents disponibles:               │
│ • Certificate of Analysis (COA)     │
│ • Fiche technique                    │
│ • Chaîne de traçabilité             │
│                                      │
│ [Demander un devis]                  │
│ [Voir la page produit complète →]   │
└──────────────────────────────────────┘
```

**Behavior:**
- Opens with fade + scale animation
- Traps focus within modal
- Closes on ESC key, overlay click, or close button
- Returns focus to triggering element on close
- Body scroll locked when open

### 8. RFQDrawer Component

**Purpose:** Slide-out drawer for submitting quote requests with pre-filled product information.

**Props Interface:**
```typescript
interface RFQDrawerProps {
  selectedProducts: Product[];
  locale: string;
  translations: RFQTranslations;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RFQFormData) => Promise<void>;
  onRemoveProduct: (productId: string) => void;
}

interface RFQFormData {
  products: { id: string; quantity: number }[];
  contact: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  delivery: {
    location: string;
    incoterm?: string;
  };
  notes: string;
}
```

**Visual Specifications:**
- Width: 480px (desktop), 100vw (mobile)
- Height: 100vh
- Position: Fixed right, slide from right animation
- Background: White
- Shadow: -4px 0 24px rgba(0,0,0,0.15)
- Padding: 24px
- Z-index: 200

**Layout:**
```
┌────────────────────────────────┐
│ [←] Demander un devis          │ ← Header
├────────────────────────────────┤
│ Produits sélectionnés:         │
│                                │
│ ┌──────────────────────────┐  │
│ │ [img] Cacao Premium      │  │
│ │       Qty: [500] kg  [×] │  │
│ └──────────────────────────┘  │
│                                │
│ Vos coordonnées:               │
│ [Nom complet]                  │
│ [Email]                        │
│ [Entreprise]                   │
│ [Téléphone]                    │
│                                │
│ Détails de la commande:        │
│ [Lieu de livraison]            │
│ [Incoterm ▼]                   │
│                                │
│ [Notes additionnelles...]      │
│                                │
│ ✓ Réponse sous 24h             │
│ ✓ NDA disponible sur demande   │
│                                │
│ [Envoyer la demande]           │
└────────────────────────────────┘
```

**Form Validation:**
- Name: Required, min 2 characters
- Email: Required, valid email format
- Company: Required, min 2 characters
- Phone: Optional, valid phone format if provided
- Quantity: Required, positive number, >= MOQ
- Delivery location: Required, min 2 characters

**Behavior:**
- Slides in from right with smooth animation
- Overlay darkens background
- Closes on back button, overlay click, or close icon
- Form persists data in session storage
- Shows loading state during submission
- Shows success message after submission
- Clears form and closes after 2 seconds on success

### 9. CatalogDownloadModal Component

**Purpose:** Lead capture form before allowing catalog PDF download.

**Props Interface:**
```typescript
interface CatalogDownloadModalProps {
  locale: string;
  translations: DownloadTranslations;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadData) => Promise<string>; // Returns download URL
}

interface LeadData {
  name: string;
  email: string;
  company: string;
  country: string;
}
```

**Visual Specifications:**
- Modal width: 500px (desktop), 90vw (mobile)
- Background: White
- Border radius: 16px
- Padding: 32px
- Center aligned

**Layout:**
```
┌────────────────────────────────┐
│ [×]                            │
│                                │
│ Télécharger notre catalogue    │
│                                │
│ Recevez notre catalogue PDF    │
│ complet avec tous nos produits │
│ et spécifications.             │
│                                │
│ [Nom complet]                  │
│ [Email professionnel]          │
│ [Entreprise]                   │
│ [Pays ▼]                       │
│                                │
│ [Télécharger le catalogue]     │
│                                │
│ 🔒 Vos données sont protégées  │
└────────────────────────────────┘
```

### 10. ProcessComplianceSection Component

**Purpose:** Educational section explaining quality standards and traceability.

**Props Interface:**
```typescript
interface ProcessComplianceSectionProps {
  locale: string;
  translations: ComplianceTranslations;
}
```

**Visual Specifications:**
- Background: Light gray or subtle pattern
- Padding: 80px vertical, 24px horizontal
- Max width: 1200px, centered
- Layout: 3-column grid (desktop), 1-column (mobile)

**Content:**
- Quality standards: ISO certifications, QA process
- Traceability: Farm to port tracking, blockchain integration
- Certifications: EUDR, organic, fair trade, Rainforest Alliance

## Data Models

### TypeScript Interfaces

```typescript
// Core Product Model
interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  heroImage: SanityImage;
  availability: AvailabilityStatus;
  origins: string[];
  certifications: string[];
  eudrReady: boolean;
  qaAvailable: boolean;
  documents: ProductDocuments;
  moq: MinimumOrderQuantity;
  incoterms: string[];
  packaging?: string;
  grade?: string;
  leadTime?: string;
  notes?: string;
  tags: string[];
  markets: string[];
  updatedAt: string;
}

type AvailabilityStatus = 'in-stock' | 'limited' | 'pre-order';

interface ProductDocuments {
  coa: boolean;
  specSheet: boolean;
  chainOfCustody: boolean;
}

interface MinimumOrderQuantity {
  value: number;
  unit: string;
}

interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Filter Models
interface FilterState {
  search: string;
  category?: string;
  origins: string[];
  availability: AvailabilityStatus[];
  eudrReady?: boolean;
  certifications: string[];
  incoterms: string[];
  moqRange?: MOQRange;
}

interface MOQRange {
  min: number;
  max: number;
}

// Category Model
interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

// Origin Model
interface Origin {
  id: string;
  name: string;
  code: string; // ISO country code
  flag?: string;
}

// Certification Model
interface Certification {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

// RFQ Models
interface RFQFormData {
  products: RFQProduct[];
  contact: ContactInfo;
  delivery: DeliveryInfo;
  notes: string;
}

interface RFQProduct {
  id: string;
  quantity: number;
  unit: string;
}

interface ContactInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface DeliveryInfo {
  location: string;
  incoterm?: string;
}

// Lead Capture Model
interface LeadData {
  name: string;
  email: string;
  company: string;
  country: string;
}

// Analytics Event Models
interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

interface ProductViewEvent extends AnalyticsEvent {
  event: 'product_card_view';
  properties: {
    productId: string;
    productName: string;
    category: string;
    origin: string;
    availability: AvailabilityStatus;
  };
}

interface FilterUsedEvent extends AnalyticsEvent {
  event: 'catalog_filter_used';
  properties: {
    filterType: string;
    filterValue: any;
    resultCount: number;
  };
}

interface RFQSubmitEvent extends AnalyticsEvent {
  event: 'rfq_submit';
  properties: {
    productIds: string[];
    productCount: number;
    totalQuantity: number;
    company: string;
    country: string;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Before defining the correctness properties, I need to analyze the acceptance criteria from the requirements document to determine which are testable as properties.


### Property Reflection

After analyzing all acceptance criteria, I've identified the following areas where properties can be consolidated:

**Consolidation Opportunities:**
1. **Filter properties (2.9, 2.10, 2.12)** can be combined into a comprehensive "Filter correctness" property that validates all filtered products match criteria AND count is accurate
2. **Product card rendering (3.1-3.14)** can be consolidated into one property that validates all required elements are present for any product
3. **RFQ validation (4.7, 4.8)** can be combined - validation and error display are two sides of the same behavior
4. **Quick view content (5.2-5.7)** can be consolidated into one property validating all content is displayed
5. **Analytics events (10.1-10.8)** can be consolidated into fewer properties grouped by interaction type
6. **Accessibility requirements (11.1-11.10)** can be grouped into keyboard navigation, focus management, and contrast properties
7. **Translation requirements (16.1-16.20)** can be consolidated into one property that validates all UI text is translated for any locale

**Properties to Keep Separate:**
- Search functionality (2.1) - distinct from filtering
- Responsive grid layout (1.3, 13.1-13.10) - important for mobile experience
- Multi-product RFQ (4.10) - distinct from single-product RFQ
- Image optimization (9.1-9.3) - critical for performance
- CMS data handling (15.1-15.7) - important for content management

### Correctness Properties

Property 1: Search filters products across multiple fields
*For any* search query and product collection, the filtered results should only include products where the query matches the product name, category, or any tag (case-insensitive).
**Validates: Requirements 2.1**

Property 2: Filter application correctness
*For any* combination of active filters (category, origins, availability, certifications, incoterms, MOQ range) and product collection, all displayed products must match ALL active filter criteria (AND logic), and the displayed count must equal the number of filtered products.
**Validates: Requirements 2.9, 2.10, 2.12**

Property 3: Product card completeness
*For any* product with complete data, the rendered product card must include all required elements: hero image, availability badge, EUDR badge (if applicable), certification badges, product name, subtitle, origin, MOQ, primary incoterm, document indicators, primary CTA, and secondary CTA link.
**Validates: Requirements 3.1-3.12, 3.14**

Property 4: Text contrast accessibility
*For any* product card and text element, the contrast ratio between text and background must meet or exceed WCAG AA requirements (4.5:1 for normal text, 3:1 for large text ≥18px).
**Validates: Requirements 3.13, 11.5**

Property 5: RFQ drawer pre-selection
*For any* product, when the quote CTA is clicked, the RFQ drawer must open with that specific product pre-selected in the products list.
**Validates: Requirements 4.1**

Property 6: RFQ form validation
*For any* RFQ form submission, the system must validate all required fields (name, email, company, quantity ≥ MOQ, delivery location) and only allow submission when all validations pass, displaying specific error messages for each invalid field when validation fails.
**Validates: Requirements 4.7, 4.8**

Property 7: Multi-product RFQ accumulation
*For any* sequence of products added to the RFQ cart, the cart must contain all added products without duplicates, and the cart count indicator must equal the number of unique products in the cart.
**Validates: Requirements 4.10, 4.11**

Property 8: Quick view modal content completeness
*For any* product, when the quick view modal opens, it must display all specified information: hero image, comprehensive specifications (origin, grade, packaging, MOQ, lead time, incoterms), certifications, available documents, quote CTA, and product page link.
**Validates: Requirements 5.2-5.7**

Property 9: Responsive grid layout adaptation
*For any* viewport width, the product grid must display the correct number of columns: 1 column for width < 768px, 2 columns for 768px ≤ width < 1024px, 3 columns for 1024px ≤ width < 1280px, and 4 columns for width ≥ 1280px.
**Validates: Requirements 1.3, 13.2-13.4**

Property 10: Locale-based translation completeness
*For any* supported locale (fr, en, es, de, ru), all UI text elements (headings, labels, buttons, placeholders, messages, badges) must be displayed in the corresponding language, with no untranslated strings visible to the user.
**Validates: Requirements 8.6, 16.1-16.20**

Property 11: Analytics event accuracy
*For any* user interaction (filter usage, product view, CTA click, quick view open, RFQ submit, catalog download), the system must fire the corresponding analytics event with accurate metadata including product IDs, filter values, and user context.
**Validates: Requirements 10.1-10.8**

Property 12: Keyboard navigation completeness
*For any* interactive element on the page (buttons, links, form inputs, modal close buttons), the element must be reachable via keyboard navigation (Tab key) and activatable via keyboard (Enter or Space key), with visible focus indicators.
**Validates: Requirements 11.1, 11.2, 11.3**

Property 13: Focus management in modals
*For any* modal or drawer that opens (Quick View, RFQ Drawer, Catalog Download), focus must be trapped within the modal while open, and when the modal closes, focus must return to the element that triggered the modal opening.
**Validates: Requirements 5.9, 11.8, 11.9**

Property 14: Image optimization implementation
*For any* product image displayed on the page, the image must use Next.js Image component with appropriate sizes attribute, lazy loading for below-fold images, and responsive srcset for different viewport sizes.
**Validates: Requirements 9.1, 9.2, 9.3**

Property 15: CMS data handling robustness
*For any* product data fetched from Sanity CMS, including products with missing optional fields, the system must render the product card without errors, displaying available data and gracefully handling missing fields with appropriate fallbacks or omissions.
**Validates: Requirements 15.1, 15.4**

## Error Handling

### Filter Error States

**No Results Found:**
- Display: Empty state component with message "Aucun produit trouvé" / "No products found"
- Include: Illustration or icon, suggestion to clear filters
- Action: "Clear all filters" button prominently displayed

**Search Query Too Short:**
- Minimum 2 characters for search activation
- Display: Placeholder text indicating minimum length
- No error message, just inactive state

### Form Validation Errors

**RFQ Form Errors:**
- Name: "Le nom est requis" / "Name is required"
- Email: "Email invalide" / "Invalid email address"
- Company: "L'entreprise est requise" / "Company is required"
- Quantity: "La quantité doit être supérieure ou égale au MOQ" / "Quantity must be greater than or equal to MOQ"
- Delivery: "Le lieu de livraison est requis" / "Delivery location is required"

**Catalog Download Form Errors:**
- Name: "Le nom est requis" / "Name is required"
- Email: "Email invalide" / "Invalid email address"
- Company: "L'entreprise est requise" / "Company is required"
- Country: "Le pays est requis" / "Country is required"

**Error Display:**
- Position: Below the invalid field
- Color: Red (#DC2626)
- Icon: Warning icon
- Font size: 14px
- Margin: 4px top

### Data Loading Errors

**Product Fetch Failure:**
- Display: Error boundary with retry button
- Message: "Erreur de chargement des produits" / "Error loading products"
- Action: "Réessayer" / "Retry" button
- Fallback: Show cached products if available

**Image Load Failure:**
- Display: Placeholder image with product category icon
- Background: Light gray
- No error message to user
- Log error for monitoring

### Network Errors

**RFQ Submission Failure:**
- Display: Toast notification with error message
- Message: "Erreur lors de l'envoi. Veuillez réessayer." / "Error sending request. Please try again."
- Action: Retry button in toast
- Preserve form data for retry

**Catalog Download Failure:**
- Display: Toast notification with error message
- Message: "Erreur lors du téléchargement. Veuillez réessayer." / "Download error. Please try again."
- Action: Retry button
- Log error with user email for follow-up

### Accessibility Errors

**Focus Trap Failure:**
- Fallback: Allow normal tab navigation
- Log error for debugging
- Ensure close button always accessible

**Contrast Ratio Failure:**
- Fallback: Use high-contrast text color (#000000 on light, #FFFFFF on dark)
- Override gradient opacity if needed
- Ensure minimum 4.5:1 ratio

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of filter combinations
- Edge cases (empty results, missing data, invalid inputs)
- Error conditions and error message display
- Integration between components (filter → grid update)
- Specific responsive breakpoints (320px, 768px, 1024px, 1440px)
- Modal open/close behavior
- Form submission success/failure flows

**Property-Based Tests** focus on:
- Universal properties across all products and filter combinations
- Search and filter correctness for any input
- Product card rendering for any product data
- Responsive layout for any viewport width
- Translation completeness for any locale
- Accessibility compliance for any interactive element
- Analytics event accuracy for any user interaction

### Property-Based Testing Configuration

**Library Selection:**
- **JavaScript/TypeScript**: Use `fast-check` library for property-based testing
- Installation: `npm install --save-dev fast-check @types/fast-check`

**Test Configuration:**
- Minimum 100 iterations per property test (configurable via `fc.assert` options)
- Each property test must include a comment tag referencing the design document property
- Tag format: `// Feature: product-catalog-redesign, Property {number}: {property_text}`

**Example Property Test Structure:**
```typescript
import fc from 'fast-check';

// Feature: product-catalog-redesign, Property 2: Filter application correctness
describe('Product filtering', () => {
  it('should only show products matching all active filters', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary),
        fc.record({
          category: fc.option(fc.string()),
          origins: fc.array(fc.string()),
          availability: fc.array(fc.constantFrom('in-stock', 'limited', 'pre-order')),
          eudrReady: fc.option(fc.boolean()),
        }),
        (products, filters) => {
          const filtered = applyFilters(products, filters);
          return filtered.every(product => matchesAllFilters(product, filters));
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Coverage

**Component Tests:**
- CatalogHeader: Renders all elements, download button click
- CatalogFilters: Filter selection, search input, clear filters
- ProductCard: Renders all product data, CTA clicks, hover states
- ProductGrid: Responsive columns, product display
- RFQDrawer: Form validation, submission, product list
- QuickViewModal: Content display, close behavior
- TrustStrip: Trust items display

**Integration Tests:**
- Filter application updates product grid
- Search query filters products
- RFQ drawer opens with pre-selected product
- Quick view modal displays correct product
- Multi-product RFQ accumulates products
- Locale change updates all UI text

**Accessibility Tests:**
- Keyboard navigation through all interactive elements
- Focus indicators visible on all focusable elements
- ARIA labels present on icon buttons
- Alt text present on all images
- Contrast ratios meet WCAG AA
- Screen reader announcements for dynamic content

**Responsive Tests:**
- Grid columns at each breakpoint (320px, 375px, 768px, 1024px, 1440px)
- Mobile sticky CTA bar visibility
- Filter drawer on mobile
- Touch target sizes (minimum 44x44px)

### Test Data Generators

**Product Generator:**
```typescript
const productArbitrary = fc.record({
  id: fc.uuid(),
  slug: fc.string(),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  category: fc.constantFrom('cocoa', 'coffee', 'spices'),
  availability: fc.constantFrom('in-stock', 'limited', 'pre-order'),
  origins: fc.array(fc.constantFrom('CI', 'GH', 'CM', 'NG'), { minLength: 1, maxLength: 3 }),
  certifications: fc.array(fc.constantFrom('organic', 'fairtrade', 'rainforest'), { maxLength: 3 }),
  eudrReady: fc.boolean(),
  moq: fc.record({
    value: fc.integer({ min: 100, max: 10000 }),
    unit: fc.constant('kg'),
  }),
  incoterms: fc.array(fc.constantFrom('FOB', 'CIF', 'DAP'), { minLength: 1, maxLength: 3 }),
});
```

**Filter Generator:**
```typescript
const filterArbitrary = fc.record({
  search: fc.string({ maxLength: 50 }),
  category: fc.option(fc.constantFrom('cocoa', 'coffee', 'spices')),
  origins: fc.array(fc.constantFrom('CI', 'GH', 'CM', 'NG')),
  availability: fc.array(fc.constantFrom('in-stock', 'limited', 'pre-order')),
  eudrReady: fc.option(fc.boolean()),
  certifications: fc.array(fc.constantFrom('organic', 'fairtrade', 'rainforest')),
  incoterms: fc.array(fc.constantFrom('FOB', 'CIF', 'DAP')),
  moqRange: fc.option(fc.record({
    min: fc.integer({ min: 0, max: 5000 }),
    max: fc.integer({ min: 5000, max: 20000 }),
  })),
});
```

### Performance Testing

**Metrics to Track:**
- Time to First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms
- Time to Interactive (TTI): < 3.5s

**Load Testing:**
- Test with 10, 25, 50, 100 products
- Measure filter application time
- Measure search query response time
- Measure image loading time

**Optimization Validation:**
- Verify Next.js Image optimization active
- Verify lazy loading for below-fold images
- Verify code splitting for modals/drawers
- Verify bundle size < 200KB (gzipped)

## Implementation Notes

### Design System Integration

**Colors:**
- Primary: Dark green #194424
- Secondary: Charcoal #2D2D2D
- Accent: Gold #D4AF37
- Background: White #FFFFFF
- Muted: Gray #6B7280
- Error: Red #DC2626
- Success: Green #10B981

**Typography:**
- Headings: Inter or similar sans-serif, bold
- Body: Inter or similar sans-serif, regular
- H1: 36-42px
- H2: 28-32px
- H3: 20-22px
- Body: 14-16px
- Small: 12-14px

**Spacing Scale:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Border Radius:**
- sm: 8px
- md: 16px
- lg: 24px
- full: 9999px (pills)

### Sanity CMS Schema

The product schema in Sanity should include:

```javascript
{
  name: 'product',
  type: 'document',
  fields: [
    { name: 'name', type: 'localeString', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', validation: Rule => Rule.required() },
    { name: 'subtitle', type: 'localeString' },
    { name: 'category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'heroImage', type: 'image', validation: Rule => Rule.required() },
    { name: 'availability', type: 'string', options: { list: ['in-stock', 'limited', 'pre-order'] } },
    { name: 'origins', type: 'array', of: [{ type: 'reference', to: [{ type: 'origin' }] }] },
    { name: 'certifications', type: 'array', of: [{ type: 'reference', to: [{ type: 'certification' }] }] },
    { name: 'eudrReady', type: 'boolean', initialValue: false },
    { name: 'qaAvailable', type: 'boolean', initialValue: false },
    { name: 'documents', type: 'object', fields: [
      { name: 'coa', type: 'boolean' },
      { name: 'specSheet', type: 'boolean' },
      { name: 'chainOfCustody', type: 'boolean' },
    ]},
    { name: 'moq', type: 'object', fields: [
      { name: 'value', type: 'number' },
      { name: 'unit', type: 'string' },
    ]},
    { name: 'incoterms', type: 'array', of: [{ type: 'string' }] },
    { name: 'packaging', type: 'localeString' },
    { name: 'grade', type: 'localeString' },
    { name: 'leadTime', type: 'localeString' },
    { name: 'notes', type: 'localeText' },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'markets', type: 'array', of: [{ type: 'string' }] },
  ]
}
```

### Next.js App Router Structure

```
app/
├── [locale]/
│   ├── products/
│   │   ├── page.tsx (ProductCatalogPage)
│   │   ├── [slug]/
│   │   │   └── page.tsx (ProductDetailPage)
│   │   └── loading.tsx
│   └── layout.tsx
├── api/
│   ├── rfq/
│   │   └── route.ts (RFQ submission endpoint)
│   └── catalog-download/
│       └── route.ts (Catalog download endpoint)
└── components/
    ├── catalog/
    │   ├── CatalogHeader.tsx
    │   ├── CatalogFilters.tsx
    │   ├── ProductGrid.tsx
    │   ├── ProductCard.tsx
    │   ├── RFQDrawer.tsx
    │   ├── QuickViewModal.tsx
    │   ├── CatalogDownloadModal.tsx
    │   └── TrustStrip.tsx
    └── shared/
        ├── Button.tsx
        ├── Input.tsx
        ├── Select.tsx
        └── Badge.tsx
```

### State Management

**Client-Side State:**
- Filter state: React useState or useReducer
- RFQ cart: React Context + localStorage persistence
- Modal state: React useState
- Search query: React useState with debouncing

**Server-Side State:**
- Product data: Fetched in Server Component, passed as props
- Categories, origins, certifications: Fetched in Server Component

**URL State:**
- Search query: URL search params (?q=)
- Active filters: URL search params (?category=cocoa&origin=CI)
- Enables shareable filtered views
- Use Next.js useSearchParams and useRouter

### Internationalization Implementation

**Translation Files Structure:**
```
locales/
├── fr/
│   └── catalog.json
├── en/
│   └── catalog.json
├── es/
│   └── catalog.json
├── de/
│   └── catalog.json
└── ru/
    └── catalog.json
```

**Translation Keys:**
```json
{
  "catalog": {
    "heading": "Notre Catalogue de Produits",
    "subtitle": "Cacao, café et produits agricoles premium...",
    "downloadCatalog": "Télécharger le catalogue PDF",
    "search": {
      "placeholder": "Rechercher un produit...",
      "noResults": "Aucun produit trouvé"
    },
    "filters": {
      "category": "Catégorie",
      "origin": "Origine",
      "availability": "Disponibilité",
      "certifications": "Certifications",
      "incoterms": "Incoterms",
      "moq": "MOQ",
      "clearAll": "Effacer les filtres"
    },
    "availability": {
      "in-stock": "En stock",
      "limited": "Stock limité",
      "pre-order": "Précommande"
    },
    "product": {
      "requestQuote": "Demander un devis",
      "viewSpecs": "Voir spécifications",
      "quickView": "Aperçu rapide",
      "origin": "Origine",
      "moq": "MOQ",
      "incoterm": "Incoterm"
    },
    "trust": {
      "response24h": "Réponse sous 24h",
      "ndaAvailable": "NDA disponible",
      "eudrCompliant": "Conforme EUDR",
      "qaDocumented": "Documentation QA",
      "coaAvailable": "COA & fiches techniques"
    },
    "rfq": {
      "heading": "Demander un devis",
      "selectedProducts": "Produits sélectionnés",
      "contactInfo": "Vos coordonnées",
      "orderDetails": "Détails de la commande",
      "submit": "Envoyer la demande",
      "success": "Demande envoyée avec succès",
      "error": "Erreur lors de l'envoi"
    }
  }
}
```

### Analytics Implementation

**Event Tracking:**
```typescript
// utils/analytics.ts
export const trackEvent = (event: string, properties: Record<string, any>) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
  
  // Custom analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties, timestamp: Date.now() }),
  });
};

// Usage in components
trackEvent('product_card_view', {
  productId: product.id,
  productName: product.name,
  category: product.category,
  origin: product.origins[0],
  availability: product.availability,
});
```

### SEO Implementation

**Metadata:**
```typescript
// app/[locale]/products/page.tsx
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations(params.locale);
  
  return {
    title: t('catalog.meta.title'),
    description: t('catalog.meta.description'),
    openGraph: {
      title: t('catalog.meta.title'),
      description: t('catalog.meta.description'),
      images: ['/og-catalog.jpg'],
    },
  };
}
```

**Structured Data:**
```typescript
// components/catalog/StructuredData.tsx
export function CatalogStructuredData({ products }: { products: Product[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.heroImage.url,
        description: product.subtitle,
        offers: {
          '@type': 'Offer',
          availability: product.availability === 'in-stock' 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/PreOrder',
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

## Design Variants

### Traceability-First Variant

**Focus:** Compliance, documentation, and transparency

**Visual Characteristics:**
- Prominent EUDR and certification badges (larger, top placement)
- Document indicators with colored icons (green for available)
- Trust elements more visible (larger icons, bold text)
- Primary CTA includes "+ documentation" text
- Quick specs emphasize compliance info (certifications, QA status)
- Color scheme: More green accents, professional tone

**Use Case:** When targeting buyers who prioritize regulatory compliance and traceability (EU market, large corporations)

### Luxury-Editorial Variant

**Focus:** Premium aesthetics, storytelling, and brand prestige

**Visual Characteristics:**
- Larger border radius (24-28px) for softer, premium feel
- More generous padding and whitespace
- Optional serif typography for product names
- Subtle gold accent on hover and active states
- Emphasis on origin story and quality grade
- High-quality imagery with minimal overlay
- Color scheme: More charcoal and gold, luxury tone

**Use Case:** When targeting premium buyers who value artisanal quality and brand story (chocolatiers, specialty roasters)

### Variant Selection

The variant can be selected via:
1. **User preference:** Toggle in settings
2. **Market segment:** Automatic based on user's industry/location
3. **A/B testing:** Serve different variants to measure conversion
4. **Component prop:** `<ProductCard variant="traceability-first" />`

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators on all focusable elements (2px outline, gold color)
- [ ] ARIA labels on icon-only buttons
- [ ] Alt text on all images (format: "{Product name} - {Category}")
- [ ] Contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Semantic HTML (header, nav, main, section, article)
- [ ] Skip links for keyboard users
- [ ] Focus trap in modals with proper focus return
- [ ] ARIA live regions for dynamic content (filter results count, form errors)
- [ ] Form labels associated with inputs
- [ ] Error messages linked to form fields via aria-describedby
- [ ] Modal dialogs use role="dialog" and aria-modal="true"
- [ ] Expandable sections use aria-expanded
- [ ] Loading states announced to screen readers
- [ ] Touch targets ≥ 44x44px on mobile

## Performance Checklist

- [ ] Next.js Image component for all product images
- [ ] Sizes attribute on images (responsive)
- [ ] Lazy loading for below-fold images
- [ ] Image optimization through Sanity CDN
- [ ] Code splitting for modals and drawers (dynamic imports)
- [ ] Debounced search input (300ms delay)
- [ ] Memoized filter functions
- [ ] Virtual scrolling for large product lists (if > 100 products)
- [ ] Prefetch product detail pages on card hover
- [ ] Bundle size < 200KB (gzipped)
- [ ] Lighthouse performance score ≥ 85 (desktop), ≥ 75 (mobile)
- [ ] No layout shifts during image loading (reserved space)
- [ ] Optimized font loading (font-display: swap)
- [ ] Minimal JavaScript for initial render (Server Components)

## Responsive Testing Checklist

- [ ] 320px width (iPhone SE)
- [ ] 375px width (iPhone 12/13)
- [ ] 768px width (iPad portrait)
- [ ] 1024px width (iPad landscape)
- [ ] 1440px width (desktop)
- [ ] 1920px width (large desktop)
- [ ] Grid columns correct at each breakpoint
- [ ] Sticky filter bar works on all sizes
- [ ] Mobile sticky CTA bar visible < 768px
- [ ] Touch targets ≥ 44x44px on mobile
- [ ] No horizontal scrolling at any size
- [ ] Modals full-screen on mobile
- [ ] Filter drawer on mobile
- [ ] Text readable at all sizes (no truncation issues)
- [ ] Images scale properly
- [ ] Spacing appropriate for each breakpoint
