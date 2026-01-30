# Design Document: Catalog Dark Premium Redesign

## Overview

Ce document de design spécifie l'architecture, les composants et les détails d'implémentation pour la refonte dark premium du catalogue produits Afrexia. Le design transforme l'expérience actuelle (fond blanc, style template) en une expérience premium sobre avec dark green/charcoal + accent gold, optimisée pour la conversion B2B.

## Design Principles

1. **Premium Sobre**: Élégance discrète, pas de surcharge visuelle
2. **Clarté B2B**: Informations techniques immédiatement visibles
3. **Crédibilité**: Preuves de conformité et qualité omniprésentes
4. **Conversion**: Parcours RFQ frictionless
5. **Cohérence**: Alignement total avec la DA dark du site

## Color Palette - Dark Premium

### Primary Colors
```typescript
const DARK_THEME_COLORS = {
  // Backgrounds
  bgPrimary: '#0A1410',      // Charcoal très foncé
  bgSecondary: '#1A2820',    // Dark green charcoal
  bgTertiary: '#141D18',     // Variation pour cards
  
  // Text
  textPrimary: '#E8F5E9',    // Ivory/light green
  textSecondary: '#B0D4B8',  // Muted light green
  textMuted: '#80996F',      // Support green
  
  // Brand
  brandPrimary: '#4A9A62',   // Dark green (CTAs)
  brandSecondary: '#5AAA72', // Lighter green
  brandAccent: '#A89858',    // Gold (hover, links)
  
  // Borders & Dividers
  border: 'rgba(255,255,255,0.1)',
  borderHover: 'rgba(255,255,255,0.2)',
  
  // Glass Effect
  glassBackground: 'rgba(26, 40, 32, 0.6)',
  glassBackdrop: 'blur(12px)',
  glassBorder: 'rgba(255,255,255,0.1)',
  glassShadow: '0 8px 32px rgba(0,0,0,0.3)',
};
```

### Semantic Colors
```typescript
const SEMANTIC_COLORS = {
  success: '#4A9A62',
  warning: '#A89858',
  error: '#DC2626',
  info: '#80996F',
};
```

## Typography Scale

```typescript
const TYPOGRAPHY = {
  h1: {
    size: '3.5rem',      // 56px desktop
    sizeMobile: '2.75rem', // 44px mobile
    weight: 700,
    lineHeight: 1.1,
    color: 'brandPrimary',
  },
  h2: {
    size: '2.25rem',     // 36px
    weight: 700,
    lineHeight: 1.2,
    color: 'textPrimary',
  },
  h3: {
    size: '1.375rem',    // 22px
    weight: 700,
    lineHeight: 1.3,
    color: 'textPrimary',
  },
  body: {
    size: '1rem',        // 16px
    weight: 400,
    lineHeight: 1.5,
    color: 'textSecondary',
  },
  bodySmall: {
    size: '0.875rem',    // 14px
    weight: 400,
    lineHeight: 1.5,
    color: 'textMuted',
  },
  label: {
    size: '0.75rem',     // 12px
    weight: 600,
    lineHeight: 1.4,
    color: 'textMuted',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
};
```

## Component Architecture

### Page Structure

```
┌─────────────────────────────────────────────────────────┐
│ CatalogHeaderDark                                       │
│ - H1: "Catalogue Produits"                             │
│ - Subtitle avec QA + traçabilité                       │
│ - Trust indicators (24h, NDA, EUDR, QA, COA)          │
│ - CTAs: Primary (Devis) + Secondary (PDF)             │
│ Background: dark gradient                               │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ CatalogFiltersDark (sticky)                            │
│ Desktop: Inline filters avec labels visibles           │
│ Mobile: Bouton "Filtrer" + Sheet                       │
│ Style: Glass effect ou dark panel                      │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ ProductGridDark                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ CardDark │ │ CardDark │ │ CardDark │ │ CardDark │  │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│ Responsive: 1 col mobile, 2-3 tablet, 3-4 desktop     │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Mobile: Sticky Bottom CTA                              │
│ "Demander un devis" - Fixed bottom, z-50              │
└─────────────────────────────────────────────────────────┘

Overlays:
┌─────────────────────────────────────────────────────────┐
│ RFQDrawerDark (slide from right)                       │
│ Dark theme, glass effect, pre-filled product           │
└─────────────────────────────────────────────────────────┘
```


## Component Specifications

### 1. CatalogHeaderDark Component

**Purpose:** Header premium dark avec messaging B2B clair et CTAs visibles.

**Props Interface:**
```typescript
interface CatalogHeaderDarkProps {
  locale: 'fr' | 'en';
  translations: {
    heading: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustItems: TrustItem[];
  };
  onRequestQuote: () => void;
  onDownloadCatalog: () => void;
}
```

**Visual Specifications:**
- Background: `linear-gradient(180deg, #0A1410 0%, #1A2820 100%)`
- Max height: 30vh desktop, 40vh mobile
- Padding: 64px vertical desktop, 48px mobile
- H1: 56px desktop / 44px mobile, color: `#4A9A62`, bold
- Subtitle: 18px, color: `#B0D4B8`, max-width: 800px, center-aligned
- Trust strip: Horizontal flex, gap 32px desktop / 16px mobile
- CTAs: Flex row, gap 16px, center-aligned

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│              Catalogue Produits                        │ ← H1 (56px, green)
│                                                        │
│  Cacao, café & commodités africaines — QA documentée, │ ← Subtitle (18px)
│        traçabilité prête pour audit.                   │
│                                                        │
│  [24h] [NDA] [EUDR] [QA] [COA]                       │ ← Trust strip
│                                                        │
│  [Demander un devis]  [Télécharger le catalogue]     │ ← CTAs
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### 2. CatalogFiltersDark Component

**Purpose:** Barre de filtres sticky avec labels visibles et style dark premium.

**Props Interface:**
```typescript
interface CatalogFiltersDarkProps {
  activeFilters: FilterState;
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: FilterTranslations;
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
  productCount: number;
}
```

**Visual Specifications - Desktop:**
- Position: `sticky`, `top: 0`, `z-index: 40`
- Background: Glass effect
  - `background: rgba(26, 40, 32, 0.8)`
  - `backdrop-filter: blur(12px)`
  - `border-bottom: 1px solid rgba(255,255,255,0.1)`
- Padding: 20px vertical, 24px horizontal
- Layout: Flex row wrap, gap 16px
- Each filter:
  - Label visible (12px, uppercase, muted)
  - Select dropdown (dark theme)
  - Min-width: 180px

**Visual Specifications - Mobile:**
- Collapsed into button: "Filtrer (X)"
- Button: Full width, dark panel style
- Opens sheet from bottom
- Sheet: Max-height 80vh, dark background

**Filter Controls Styling:**
```css
.filter-select {
  background: rgba(26, 40, 32, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #E8F5E9;
  padding: 12px 16px;
  font-size: 14px;
}

.filter-select:hover {
  border-color: rgba(255,255,255,0.2);
  background: rgba(26, 40, 32, 0.8);
}

.filter-select:focus {
  outline: 2px solid #A89858;
  outline-offset: 2px;
}
```

**Layout - Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│ [Rechercher...] [Catégorie ▼] [Origine ▼] [Disponibilité ▼] │
│ [Certifications ▼] [Incoterms ▼] [MOQ ▼]                    │
│                                                              │
│ Actifs: [Côte d'Ivoire ×] [EUDR ×]  [Réinitialiser]        │
│ 24 produits                                                  │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. ProductCardDark Component

**Purpose:** Fiche produit premium dark avec toutes les infos essentielles visibles.

**Props Interface:**
```typescript
interface ProductCardDarkProps {
  product: Product;
  locale: 'fr' | 'en';
  translations: ProductCardTranslations;
  onQuoteClick: () => void;
  onSpecClick: () => void;
}
```

**Visual Specifications:**
- Container:
  - Background: `rgba(26, 40, 32, 0.8)` (glass effect)
  - Border: `1px solid rgba(255,255,255,0.1)`
  - Border-radius: `28px`
  - Shadow: `0 8px 32px rgba(0,0,0,0.3)`
  - Padding: 0 (image full bleed)
  - Min-height: 520px
  - Backdrop-filter: `blur(12px)` (optional)

- Image Section:
  - Aspect ratio: 4:3
  - Gradient overlay: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)`
  - Badges: Top-right, gap 8px
  - Fallback: Premium pattern + gradient si pas d'image

- Content Section:
  - Padding: 24px
  - H3: 22px, bold, `#E8F5E9`
  - Subtitle: 14px, `#B0D4B8`
  - Quick specs: Grid 2 cols, gap 12px
  - Spec labels: 12px, uppercase, `#80996F`
  - Spec values: 14px, semibold, `#E8F5E9`

- Actions Section:
  - Padding: 24px
  - Border-top: `1px solid rgba(255,255,255,0.1)`
  - Primary button: Full width, `#4A9A62`, hover: `#5AAA72`
  - Secondary link: Center, 14px, `#A89858` (gold)
  - Microproof: 12px, `#80996F`, center

**Hover States:**
```css
.product-card-dark:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0,0,0,0.4);
  border-color: rgba(255,255,255,0.2);
}

.product-card-dark:hover .secondary-link {
  color: #B8A868; /* Lighter gold */
}
```

**Layout:**
```
┌────────────────────────────────┐
│                                │
│     [Product Image]            │ ← 4:3 ratio, gradient overlay
│     [EUDR] [Disponible]        │ ← Badges top-right
│                                │
├────────────────────────────────┤
│ Cacao Premium Côte d'Ivoire   │ ← H3 (22px)
│ Fèves fermentées grade A      │ ← Subtitle (14px)
│                                │
│ ORIGINE          MOQ           │ ← Quick specs grid
│ Côte d'Ivoire    500 kg        │
│                                │
│ INCOTERMS                      │
│ FOB, CIF, DAP                  │
│                                │
│ [📄] [✓] [🔗]                 │ ← Document indicators
├────────────────────────────────┤
│ [Demander un devis]           │ ← Primary CTA
│ Voir fiche technique →         │ ← Secondary link (gold)
│                                │
│ Réponse sous 24h • NDA possible│ ← Microproof
└────────────────────────────────┘
```

---

### 4. RFQDrawerDark Component

**Purpose:** Drawer dark premium pour demande de devis avec produit pré-rempli.

**Props Interface:**
```typescript
interface RFQDrawerDarkProps {
  product: Product;
  locale: 'fr' | 'en';
  translations: RFQTranslations;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RFQFormData) => Promise<void>;
}

interface RFQFormData {
  productId: string;
  quantity: number;
  incoterm: string;
  destination: string;
  email: string;
  company: string;
  notes?: string;
}
```

**Visual Specifications:**
- Width: 480px desktop, 100vw mobile
- Height: 100vh
- Position: Fixed right
- Background: `#0A1410` with glass overlay
- Shadow: `-4px 0 32px rgba(0,0,0,0.5)`
- Animation: Slide from right, 300ms ease-out

**Form Styling:**
```css
.rfq-input-dark {
  background: rgba(26, 40, 32, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #E8F5E9;
  padding: 14px 16px;
  font-size: 16px;
}

.rfq-input-dark:focus {
  outline: 2px solid #A89858;
  outline-offset: 2px;
  border-color: rgba(255,255,255,0.2);
}

.rfq-input-dark::placeholder {
  color: #80996F;
}
```

**Layout:**
```
┌────────────────────────────────┐
│ [←] Demander un devis          │ ← Header
├────────────────────────────────┤
│ Produit sélectionné:           │
│ ┌──────────────────────────┐  │
│ │ [img] Cacao Premium      │  │
│ │       Côte d'Ivoire      │  │
│ └──────────────────────────┘  │
│                                │
│ Quantité *                     │
│ [500] kg (MOQ: 500 kg)        │
│                                │
│ Incoterm *                     │
│ [FOB ▼]                        │
│                                │
│ Destination/Port *             │
│ [Ville, Pays]                  │
│                                │
│ Email *                        │
│ [votre@email.com]              │
│                                │
│ Société *                      │
│ [Nom de votre société]         │
│                                │
│ Notes additionnelles           │
│ [Informations complémentaires] │
│                                │
│ ✓ Réponse sous 24h             │
│ ✓ NDA disponible sur demande   │
│                                │
│ [Envoyer la demande]           │
└────────────────────────────────┘
```

---

### 5. TrustStripDark Component

**Purpose:** Bande de réassurance avec icônes et labels.

**Props Interface:**
```typescript
interface TrustStripDarkProps {
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
- Layout: Flex row, gap 32px desktop / 16px mobile
- Each item:
  - Icon: 24px, color: `#4A9A62`
  - Label: 14px, color: `#B0D4B8`
  - Hover: Tooltip with backdrop blur

**Default Items:**
```typescript
const DEFAULT_TRUST_ITEMS = [
  { icon: <Clock />, label: '24h', tooltip: 'Réponse sous 24 heures' },
  { icon: <Shield />, label: 'NDA', tooltip: 'NDA disponible' },
  { icon: <Leaf />, label: 'EUDR', tooltip: 'Conforme EUDR' },
  { icon: <Check />, label: 'QA', tooltip: 'Documentation QA' },
  { icon: <File />, label: 'COA', tooltip: 'COA & fiches techniques' },
];
```

---

### 6. MobileRFQButtonDark Component

**Purpose:** CTA sticky bottom pour mobile.

**Visual Specifications:**
- Position: `fixed`, `bottom: 0`, `left: 0`, `right: 0`, `z-index: 50`
- Background: `#4A9A62` with glass effect
- Padding: 16px
- Button: Full width, 48px height
- Shadow: `0 -4px 16px rgba(0,0,0,0.3)`
- Safe area insets: `padding-bottom: env(safe-area-inset-bottom)`

```
┌────────────────────────────────┐
│ [Demander un devis]           │ ← Full width button
└────────────────────────────────┘
```



## Data Models & Interfaces

### TypeScript Interfaces

```typescript
// Product Model
interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  heroImage: SanityImage | null;
  availability: 'available' | 'on-request' | 'out-of-stock';
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
  updatedAt: string;
}

// Filter State
interface FilterState {
  search: string;
  category?: string;
  origins: string[];
  availability: string[];
  certifications: string[];
  incoterms: string[];
  moqRange?: { min: number; max: number };
}

// RFQ Form Data
interface RFQFormData {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  incoterm: string;
  destination: string;
  email: string;
  company: string;
  notes?: string;
}

// Translations
interface CatalogTranslations {
  header: {
    heading: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  filters: {
    search: string;
    searchPlaceholder: string;
    category: string;
    categoryPlaceholder: string;
    origin: string;
    originPlaceholder: string;
    availability: string;
    availabilityPlaceholder: string;
    certifications: string;
    certificationsPlaceholder: string;
    incoterms: string;
    incotermsPlaceholder: string;
    moq: string;
    clearAll: string;
    showFilters: string;
    resultsCount: string;
  };
  productCard: {
    requestQuote: string;
    viewSpecs: string;
    origin: string;
    moq: string;
    incoterm: string;
    microproof: string;
  };
  rfq: {
    title: string;
    productLabel: string;
    quantityLabel: string;
    incotermLabel: string;
    destinationLabel: string;
    emailLabel: string;
    companyLabel: string;
    notesLabel: string;
    trustResponse: string;
    trustNDA: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
  trust: {
    response24h: string;
    ndaAvailable: string;
    eudrCompliant: string;
    qaDocumented: string;
    coaAvailable: string;
  };
}
```

## Copywriting

### French (FR)

```typescript
const FR_COPY = {
  header: {
    heading: 'Catalogue Produits',
    subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
    ctaPrimary: 'Demander un devis',
    ctaSecondary: 'Télécharger le catalogue (PDF)',
  },
  filters: {
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher un produit...',
    category: 'Catégorie',
    categoryPlaceholder: 'Sélectionner une catégorie',
    origin: 'Origine',
    originPlaceholder: 'Sélectionner une origine',
    availability: 'Disponibilité',
    availabilityPlaceholder: 'Sélectionner la disponibilité',
    certifications: 'Certifications',
    certificationsPlaceholder: 'Sélectionner des certifications',
    incoterms: 'Incoterms',
    incotermsPlaceholder: 'Sélectionner des incoterms',
    moq: 'MOQ',
    clearAll: 'Réinitialiser',
    showFilters: 'Filtrer',
    resultsCount: '{count} produits',
  },
  productCard: {
    requestQuote: 'Demander un devis',
    viewSpecs: 'Voir fiche technique',
    origin: 'Origine',
    moq: 'MOQ',
    incoterm: 'Incoterms',
    microproof: 'Réponse sous 24h • NDA possible',
  },
  rfq: {
    title: 'Demander un devis',
    productLabel: 'Produit sélectionné',
    quantityLabel: 'Quantité',
    incotermLabel: 'Incoterm',
    destinationLabel: 'Destination/Port',
    emailLabel: 'Email',
    companyLabel: 'Société',
    notesLabel: 'Notes additionnelles',
    trustResponse: 'Réponse sous 24h',
    trustNDA: 'NDA disponible sur demande',
    submit: 'Envoyer la demande',
    submitting: 'Envoi en cours...',
    success: 'Demande envoyée avec succès !',
    error: 'Une erreur est survenue. Veuillez réessayer.',
  },
  trust: {
    response24h: '24h',
    ndaAvailable: 'NDA',
    eudrCompliant: 'EUDR',
    qaDocumented: 'QA',
    coaAvailable: 'COA',
  },
  badges: {
    available: 'Disponible',
    onRequest: 'Sur demande',
    outOfStock: 'Épuisé',
    eudrReady: 'EUDR-ready',
  },
};
```

### English (EN)

```typescript
const EN_COPY = {
  header: {
    heading: 'Product Catalog',
    subtitle: 'Cocoa, coffee & African commodities — Documented QA, audit-ready traceability.',
    ctaPrimary: 'Request a Quote',
    ctaSecondary: 'Download Catalog (PDF)',
  },
  filters: {
    search: 'Search',
    searchPlaceholder: 'Search for a product...',
    category: 'Category',
    categoryPlaceholder: 'Select a category',
    origin: 'Origin',
    originPlaceholder: 'Select an origin',
    availability: 'Availability',
    availabilityPlaceholder: 'Select availability',
    certifications: 'Certifications',
    certificationsPlaceholder: 'Select certifications',
    incoterms: 'Incoterms',
    incotermsPlaceholder: 'Select incoterms',
    moq: 'MOQ',
    clearAll: 'Reset',
    showFilters: 'Filter',
    resultsCount: '{count} products',
  },
  productCard: {
    requestQuote: 'Request a Quote',
    viewSpecs: 'View Specifications',
    origin: 'Origin',
    moq: 'MOQ',
    incoterm: 'Incoterms',
    microproof: '24h response • NDA available',
  },
  rfq: {
    title: 'Request a Quote',
    productLabel: 'Selected Product',
    quantityLabel: 'Quantity',
    incotermLabel: 'Incoterm',
    destinationLabel: 'Destination/Port',
    emailLabel: 'Email',
    companyLabel: 'Company',
    notesLabel: 'Additional Notes',
    trustResponse: '24h response',
    trustNDA: 'NDA available upon request',
    submit: 'Send Request',
    submitting: 'Sending...',
    success: 'Request sent successfully!',
    error: 'An error occurred. Please try again.',
  },
  trust: {
    response24h: '24h',
    ndaAvailable: 'NDA',
    eudrCompliant: 'EUDR',
    qaDocumented: 'QA',
    coaAvailable: 'COA',
  },
  badges: {
    available: 'Available',
    onRequest: 'On Request',
    outOfStock: 'Out of Stock',
    eudrReady: 'EUDR-ready',
  },
};
```

## Analytics Events

### Event Tracking Specification

```typescript
// Filter Usage
interface FilterUsedEvent {
  event: 'filter_used';
  properties: {
    filterType: 'category' | 'origin' | 'availability' | 'certification' | 'incoterm' | 'moq';
    filterValue: string | string[];
    resultCount: number;
    timestamp: number;
  };
}

// Quote Click
interface QuoteClickEvent {
  event: 'quote_click';
  properties: {
    productId: string;
    productName: string;
    category: string;
    origin: string;
    availability: string;
    source: 'card' | 'mobile_cta';
    timestamp: number;
  };
}

// RFQ Submit
interface RFQSubmitEvent {
  event: 'rfq_submit';
  properties: {
    productId: string;
    productName: string;
    quantity: number;
    incoterm: string;
    destination: string;
    company: string;
    timestamp: number;
  };
}

// PDF Download
interface PDFDownloadEvent {
  event: 'pdf_download';
  properties: {
    source: 'header' | 'footer';
    timestamp: number;
  };
}

// Page Engagement
interface PageEngagementEvent {
  event: 'catalog_engagement';
  properties: {
    timeSpent: number; // seconds
    scrollDepth: number; // percentage
    productsViewed: number;
    filtersUsed: number;
    timestamp: number;
  };
}
```

### Tracking Implementation

```typescript
// lib/analytics/catalog-events.ts
export function trackFilterUsed(filterType: string, filterValue: any, resultCount: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'filter_used', {
      filter_type: filterType,
      filter_value: JSON.stringify(filterValue),
      result_count: resultCount,
    });
  }
}

export function trackQuoteClick(product: Product, source: 'card' | 'mobile_cta') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quote_click', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      origin: product.origins[0],
      availability: product.availability,
      source,
    });
  }
}

export function trackRFQSubmit(formData: RFQFormData) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'rfq_submit', {
      product_id: formData.productId,
      product_name: formData.productName,
      quantity: formData.quantity,
      incoterm: formData.incoterm,
      destination: formData.destination,
      company: formData.company,
    });
  }
}

export function trackPDFDownload(source: 'header' | 'footer') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'pdf_download', {
      source,
    });
  }
}
```

## Responsive Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: '320px - 767px',
  tablet: '768px - 1023px',
  desktop: '1024px+',
};

const GRID_COLUMNS = {
  mobile: 1,
  tablet: 2, // or 3 depending on content
  desktop: 3, // or 4 for large screens (1280px+)
};

const SPACING = {
  mobile: {
    sectionPadding: '32px 16px',
    cardPadding: '20px',
    gridGap: '16px',
  },
  tablet: {
    sectionPadding: '48px 24px',
    cardPadding: '24px',
    gridGap: '20px',
  },
  desktop: {
    sectionPadding: '64px 32px',
    cardPadding: '24px',
    gridGap: '24px',
  },
};
```

## Accessibility Checklist

- [ ] All text meets WCAG AA contrast ratio (4.5:1 normal, 3:1 large)
- [ ] All interactive elements have min 44x44px touch target
- [ ] All images have descriptive alt text
- [ ] All form inputs have associated labels
- [ ] All buttons have descriptive aria-labels
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible (2px outline, gold color)
- [ ] Modals trap focus and return focus on close
- [ ] ARIA live regions announce dynamic content changes
- [ ] Semantic HTML used throughout (header, main, section, article)
- [ ] Skip links provided for keyboard users
- [ ] Color is not the only means of conveying information

## Performance Optimization

### Image Optimization
```typescript
// next.config.ts
const config = {
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Code Splitting
```typescript
// Dynamic imports for modals
const RFQDrawerDark = dynamic(() => import('@/components/catalog/RFQDrawerDark'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const CatalogDownloadModal = dynamic(() => import('@/components/catalog/CatalogDownloadModal'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
```

### Memoization
```typescript
// Memoize expensive filter calculations
const filteredProducts = useMemo(() => {
  return applyFilters(products, filterState);
}, [products, filterState]);

// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    setFilterState(prev => ({ ...prev, search: query }));
  }, 300),
  []
);
```

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari (iOS): Last 2 versions
- Chrome Mobile (Android): Last 2 versions

## Testing Strategy

### Unit Tests
- Component rendering with different props
- Filter logic correctness
- Form validation
- Analytics event firing

### Integration Tests
- Filter application updates product grid
- RFQ form submission flow
- PDF download flow
- Mobile responsive behavior

### E2E Tests
- Complete user journey: Browse → Filter → View → Request Quote
- Mobile-specific flows
- Cross-browser compatibility

### Accessibility Tests
- Automated: axe-core, Lighthouse
- Manual: Keyboard navigation, screen reader testing

## Migration Strategy

1. **Phase 1: Theme Setup**
   - Update Tailwind config with dark theme colors
   - Create dark theme utility classes
   - Test color contrast ratios

2. **Phase 2: Component Development**
   - Build new dark components in parallel
   - Maintain existing components for fallback
   - Test components in isolation

3. **Phase 3: Integration**
   - Replace existing catalog page with dark version
   - A/B test if possible
   - Monitor analytics for conversion impact

4. **Phase 4: Optimization**
   - Gather user feedback
   - Optimize based on performance metrics
   - Iterate on design based on data

## Success Metrics

- **Conversion Rate**: RFQ submissions / Page views
  - Target: +25% increase
- **Time to RFQ**: Average time from page load to RFQ submission
  - Target: -30% decrease
- **Bounce Rate**: Users leaving without interaction
  - Target: -15% decrease
- **Engagement**: Average session duration
  - Target: +20% increase
- **Mobile Conversion**: Mobile RFQ submissions / Mobile page views
  - Target: Within 10% of desktop conversion rate

## Conclusion

Cette refonte dark premium transforme le catalogue Afrexia en une expérience B2B haut de gamme, cohérente avec la DA du site, tout en optimisant la conversion via un parcours RFQ frictionless. L'accent est mis sur la clarté des informations techniques, les preuves de conformité, et une esthétique sobre et professionnelle.
