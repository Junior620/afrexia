# Catalog Components

This directory contains components specifically designed for the product catalog redesign.

## TrustStrip Component

The `TrustStrip` component displays B2B credibility indicators in a horizontal strip with icons and labels.

### Features

- Displays trust items in a horizontal flex row
- Supports compact and detailed variants
- Shows tooltips on hover for additional details
- Fully accessible with proper ARIA attributes
- Responsive design (24px gap on desktop, 16px on mobile)

### Usage

```tsx
import { TrustStrip, TrustIcons, getDefaultTrustItems } from '@/components/catalog';

// Using default trust items
const translations = {
  response24h: '24h Response',
  ndaAvailable: 'NDA Available',
  eudrCompliant: 'EUDR Compliant',
  qaDocumented: 'QA Documented',
  coaAvailable: 'COA & Spec Sheets',
};

const defaultItems = getDefaultTrustItems(translations);

<TrustStrip items={defaultItems} />

// Using custom items
const customItems = [
  {
    icon: <TrustIcons.Clock />,
    label: '24h Response',
    tooltip: 'We respond to all inquiries within 24 hours',
  },
  {
    icon: <TrustIcons.Document />,
    label: 'NDA Available',
    tooltip: 'Standard NDA available upon request',
  },
];

<TrustStrip items={customItems} variant="detailed" />
```

### Props

- `items`: Array of trust items with icon, label, and optional tooltip
- `variant`: 'compact' (default) or 'detailed'
- `className`: Additional CSS classes

### Available Icons

- `TrustIcons.Clock` - For response time indicators
- `TrustIcons.Document` - For NDA and documentation
- `TrustIcons.Leaf` - For EUDR compliance
- `TrustIcons.Checkmark` - For QA and certifications
- `TrustIcons.Folder` - For COA and spec sheets

### Accessibility

- Uses semantic HTML with `role="list"` and `role="listitem"`
- Includes `aria-label` for the container
- Icons are marked with `aria-hidden="true"`
- Tooltips use `role="tooltip"`

### Requirements

Validates Requirements: 6.1-6.5

## CatalogHeader Component

The CatalogHeader component provides a compact header section with page title, subtitle, trust indicators, and download CTA.

### Features

- Compact design (max 20vh height)
- Responsive layout with centered content
- Integrated TrustStrip component
- Download catalog CTA button
- Full internationalization support
- Brand colors (dark green #194424)
- Gradient background

### Usage

```tsx
import { CatalogHeader } from '@/components/catalog';

<CatalogHeader
  locale="fr"
  translations={{
    heading: 'Notre Catalogue de Produits',
    subtitle: 'Cacao, café et produits agricoles premium...',
    downloadCatalogCTA: 'Télécharger le catalogue PDF',
    trustStrip: {
      response24h: 'Réponse sous 24h',
      response24hTooltip: 'Nous répondons à toutes les demandes...',
      ndaAvailable: 'NDA disponible',
      ndaAvailableTooltip: 'Accord de confidentialité disponible...',
      eudrCompliant: 'Conforme RDUE',
      eudrCompliantTooltip: 'Tous nos produits respectent...',
      qaDocumented: 'Documentation QA',
      qaDocumentedTooltip: 'Assurance qualité complète...',
      coaAvailable: 'COA & fiches techniques',
      coaAvailableTooltip: 'Certificats d\'analyse disponibles...',
    },
  }}
  onDownloadCatalog={() => console.log('Download clicked')}
/>
```

### Props

- `locale`: Current language code (fr, en, es, de, ru)
- `translations`: Object containing all translated strings
- `onDownloadCatalog`: Callback function when download button is clicked
- `className`: Optional additional CSS classes

### Visual Specifications

- Max height: 20vh
- Padding: 48px vertical (desktop), 32px vertical (mobile)
- H1: 36-42px font size, bold, dark green
- Subtitle: 16-18px, 60% opacity
- Centered layout with max-width container

### Requirements

Validates Requirements: 1.1, 6.1-6.5, 8.6

## CatalogFilters Component

The CatalogFilters component provides a sticky filter bar with search input and multiple filter controls for the product catalog.

### Features

- Sticky positioning (remains visible on scroll)
- Search input with 300ms debouncing
- Multiple filter dropdowns: category, origin, availability, certifications, incoterms, MOQ
- Active filter chips with remove functionality
- Product count display
- "Clear all filters" button
- Mobile filter drawer (< 768px)
- Filter count badge on mobile
- Responsive design with adaptive layout
- Full keyboard navigation support
- ARIA attributes for accessibility

### Usage

```tsx
import { CatalogFilters } from '@/components/catalog';
import { FilterState } from '@/types/product';

const [searchQuery, setSearchQuery] = useState('');
const [activeFilters, setActiveFilters] = useState<FilterState>({
  search: '',
  category: undefined,
  origins: [],
  availability: [],
  eudrReady: undefined,
  certifications: [],
  incoterms: [],
  moqRange: undefined,
});

<CatalogFilters
  searchQuery={searchQuery}
  activeFilters={activeFilters}
  categories={categories}
  origins={origins}
  certifications={certifications}
  translations={{
    filters: {
      search: 'Rechercher',
      searchPlaceholder: 'Rechercher un produit...',
      category: 'Catégorie',
      categoryPlaceholder: 'Toutes les catégories',
      origin: 'Origine',
      originPlaceholder: 'Tous les pays',
      availability: 'Disponibilité',
      availabilityPlaceholder: 'Toutes disponibilités',
      certifications: 'Certifications',
      certificationsPlaceholder: 'Toutes certifications',
      incoterms: 'Incoterms',
      incotermsPlaceholder: 'Tous incoterms',
      moq: 'MOQ',
      clearAll: 'Effacer tous les filtres',
      showFilters: 'Afficher les filtres',
      hideFilters: 'Masquer les filtres',
    },
    availability: {
      'in-stock': 'En stock',
      'limited': 'Stock limité',
      'pre-order': 'Précommande',
    },
  }}
  onSearchChange={(query) => setSearchQuery(query)}
  onFilterChange={(filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }}
  onClearFilters={() => {
    setSearchQuery('');
    setActiveFilters({
      search: '',
      category: undefined,
      origins: [],
      availability: [],
      eudrReady: undefined,
      certifications: [],
      incoterms: [],
      moqRange: undefined,
    });
  }}
  productCount={filteredProducts.length}
/>
```

### Props

- `searchQuery`: Current search query string
- `activeFilters`: Current filter state object
- `categories`: Array of category objects
- `origins`: Array of origin/country objects
- `certifications`: Array of certification objects
- `translations`: Object containing filter and availability translations
- `onSearchChange`: Callback when search query changes (debounced 300ms)
- `onFilterChange`: Callback when any filter changes
- `onClearFilters`: Callback to clear all filters
- `productCount`: Number of products matching current filters
- `className`: Optional additional CSS classes

### Filter Types

The component supports the following filter types:
- `search`: Text search across product name, category, and tags
- `category`: Single category selection
- `origins`: Multiple origin/country selection
- `availability`: Multiple availability status selection
- `eudrReady`: Boolean EUDR compliance filter
- `certifications`: Multiple certification selection
- `incoterms`: Multiple incoterm selection
- `moqRange`: MOQ range filter (min/max)

### Desktop Layout

- Horizontal filter bar with all controls visible
- Search input (300px width)
- Filter dropdowns (min 150px width)
- Active filter chips below controls
- Product count on the right
- Sticky positioning at top of viewport
- Collapses slightly on scroll for space efficiency

### Mobile Layout (< 768px)

- Search input (full width)
- Filter button with count badge
- Filters collapse into slide-up drawer
- Active filter chips below search
- Product count below chips
- Touch-optimized controls (44x44px minimum)

### Mobile Filter Drawer

- Slides up from bottom
- Max height: 85vh
- Scrollable filter controls
- Apply and Clear buttons in footer
- Backdrop overlay
- Closes on overlay click or ESC key
- Prevents body scroll when open

### Accessibility

- All interactive elements keyboard accessible
- Visible focus indicators
- ARIA labels on icon buttons
- ARIA live region for product count
- Semantic HTML structure
- Screen reader announcements for filter changes

### Visual Specifications

- Sticky position: top: 0, z-index: 40
- Background: White with border and shadow
- Padding: 16px vertical, 24px horizontal
- Gap: 12px between controls
- Filter chips: Pill shape, 12px font, primary color
- Mobile drawer: Rounded top corners (16px)

### Requirements

Validates Requirements: 2.1-2.13, 13.6


## ProductCard Component

Enhanced product card component with two visual variants for the product catalog redesign.

### Features

- Responsive image with gradient overlay
- Availability, EUDR, and certification badges
- Quick specs display (origin, MOQ, incoterm)
- Document indicators (COA, spec sheet, chain of custody)
- Primary and secondary CTAs
- Quick view button on hover
- Hover effects with elevation and shadow
- Two visual variants: traceability-first and luxury-editorial
- Accessibility compliant (WCAG AA)
- Touch-optimized for mobile (44x44px minimum targets)

### Variants

#### 1. Traceability-First Variant (default)

Emphasizes compliance, documentation, and transparency.

**Visual Characteristics:**
- Prominent EUDR and certification badges (larger, scaled 110%)
- Document indicators with colored icons (green for available)
- Primary CTA includes "+ documentation" text
- Quick specs emphasize compliance info
- Border radius: 16px
- Professional tone with green accents

**Best for:** Buyers who prioritize regulatory compliance (EU market, large corporations)

#### 2. Luxury-Editorial Variant

Emphasizes premium aesthetics, storytelling, and brand prestige.

**Visual Characteristics:**
- Larger border radius (24-28px) for softer, premium feel
- More generous padding (24px)
- Optional serif typography for product names
- Subtle gold accent on hover (ring and shadow)
- Emphasis on origin story and quality grade
- Luxury tone with charcoal and gold accents

**Best for:** Premium buyers who value artisanal quality (chocolatiers, specialty roasters)

### Usage

```tsx
import { ProductCard } from '@/components/catalog';
import type { Product } from '@/types/product';

// Traceability-First Variant
<ProductCard
  product={product}
  locale="fr"
  translations={{
    requestQuote: 'Demander un devis',
    requestQuoteWithDocs: 'Demander un devis + documentation',
    viewSpecs: 'Voir spécifications',
    quickView: 'Aperçu rapide',
    origin: 'Origine',
    moq: 'MOQ',
    incoterm: 'Incoterm',
    documents: {
      coa: 'Certificate of Analysis',
      specSheet: 'Fiche technique',
      chainOfCustody: 'Chaîne de traçabilité',
    },
  }}
  variant="traceability-first"
  onQuoteClick={() => handleQuoteClick(product)}
  onQuickView={() => handleQuickView(product)}
/>

// Luxury-Editorial Variant
<ProductCard
  product={product}
  locale="en"
  translations={englishTranslations}
  variant="luxury-editorial"
  onQuoteClick={() => handleQuoteClick(product)}
  onQuickView={() => handleQuickView(product)}
/>
```

### Props

- `product`: Product object with all product data (see Product interface)
- `locale`: Current locale (fr, en, es, de, ru)
- `translations`: ProductCardTranslations object with all UI labels
- `variant`: 'traceability-first' | 'luxury-editorial' (default: 'traceability-first')
- `onQuoteClick`: Callback when quote button is clicked
- `onQuickView`: Callback when quick view button is clicked

### Product Interface

```typescript
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

### Card Structure

```
┌────────────────────────────────┐
│                                │
│     [Product Image]            │ ← Media section
│     with gradient overlay      │   Badges top-right
│     [Quick View Button]        │   (top-left on hover)
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
└────────────────────────────────┘
```

### Visual Specifications

**Card Dimensions:**
- Min height: 480px
- Border radius: 24-28px (luxury) or 16px (traceability)
- Padding: 24px (luxury) or 20px (traceability)
- Shadow: Subtle on rest, elevated on hover
- Transition: 300ms ease-in-out

**Media Section:**
- Aspect ratio: 4:3
- Image: Object-fit cover, scale on hover (105%)
- Gradient overlay: Bottom-only (transparent → black/60)
- Badge group: Top-right, flex column, gap 2-2.5px
- Quick view button: Top-left, 40x40px, white background

**Content Section:**
- Product name: 20-22px font, bold, line-clamp 2
- Subtitle: 14px, muted color
- Quick specs: 2-column grid, icon + label + value
- Document indicators: Flex row, 18px icons (traceability: 20px, colored)

**Actions Section:**
- Border-top: 1px solid black/8
- Primary CTA: Full width, 44px height, primary color
- Secondary CTA: Text link, underline on hover

**Hover Effects:**
- Card elevation increase
- Shadow expansion
- Image scale (105%)
- Quick view button fade in
- Gold ring on luxury variant

### Accessibility

- All interactive elements keyboard accessible
- Visible focus indicators (2px outline, primary color)
- Alt text for images: "{Product name} - {Category}"
- ARIA labels on icon-only buttons
- Contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- Semantic HTML (article, h3)
- Touch targets ≥ 44x44px on mobile

### Responsive Behavior

**Desktop (> 1024px):**
- Full card with all features
- Hover effects active
- Quick view button on hover

**Tablet (768px - 1024px):**
- Slightly reduced padding
- All features visible

**Mobile (< 768px):**
- Single column layout
- Touch-optimized targets
- Quick view button always visible
- Simplified hover effects (tap-based)

### Examples

See `ProductCard.example.tsx` for complete usage examples including:
- Traceability-first variant
- Luxury-editorial variant
- Product grid layout
- Limited stock products
- Products with minimal documentation

### Requirements

Validates Requirements: 3.1-3.14

### Related Components

- `Badge` - Used for availability, EUDR, and certification badges
- `Button` - Used for primary CTA
- `Image` (Next.js) - Used for optimized product images
