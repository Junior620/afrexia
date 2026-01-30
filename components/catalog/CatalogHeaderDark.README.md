# CatalogHeaderDark Component

## Overview

The `CatalogHeaderDark` component is a premium dark-themed header for the product catalog page. It features a gradient background, clear B2B messaging, trust indicators, and prominent CTAs for requesting quotes and downloading the catalog.

## Visual Design

- **Background**: Dark gradient from `#0A1410` to `#1A2820`
- **Max Height**: 30vh on desktop, 40vh on mobile
- **Typography**:
  - H1: 56px desktop / 44px mobile, bold, dark green (`#4A9A62`)
  - Subtitle: 18px, muted light green (`#B0D4B8`)
- **Trust Strip**: Horizontal row with icons and labels
- **CTAs**: Two buttons (Primary green + Secondary outline)

## Props

```typescript
interface CatalogHeaderDarkProps {
  locale: 'fr' | 'en';
  translations: {
    heading: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: {
      response24h: string;
      response24hTooltip?: string;
      ndaAvailable: string;
      ndaAvailableTooltip?: string;
      eudrCompliant: string;
      eudrCompliantTooltip?: string;
      qaDocumented: string;
      qaDocumentedTooltip?: string;
      coaAvailable: string;
      coaAvailableTooltip?: string;
    };
  };
  onRequestQuote: () => void;
  onDownloadCatalog: () => void;
  className?: string;
}
```

## Usage

### Basic Usage

```tsx
import { CatalogHeaderDark } from '@/components/catalog/CatalogHeaderDark';

function CatalogPage() {
  const handleRequestQuote = () => {
    // Open RFQ drawer
  };

  const handleDownloadCatalog = () => {
    // Trigger PDF download
  };

  return (
    <CatalogHeaderDark
      locale="fr"
      translations={{
        heading: 'Catalogue Produits',
        subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
        ctaPrimary: 'Demander un devis',
        ctaSecondary: 'Télécharger le catalogue (PDF)',
        trust: {
          response24h: '24h',
          response24hTooltip: 'Réponse sous 24 heures',
          ndaAvailable: 'NDA',
          ndaAvailableTooltip: 'NDA disponible sur demande',
          eudrCompliant: 'EUDR',
          eudrCompliantTooltip: 'Conforme EUDR',
          qaDocumented: 'QA',
          qaDocumentedTooltip: 'Documentation QA complète',
          coaAvailable: 'COA',
          coaAvailableTooltip: 'COA & fiches techniques disponibles',
        },
      }}
      onRequestQuote={handleRequestQuote}
      onDownloadCatalog={handleDownloadCatalog}
    />
  );
}
```

### With i18n System

```tsx
import { CatalogHeaderDark } from '@/components/catalog/CatalogHeaderDark';
import { getTranslations } from '@/lib/i18n/translations';

function CatalogPage({ locale }: { locale: 'fr' | 'en' }) {
  const t = getTranslations(locale);

  return (
    <CatalogHeaderDark
      locale={locale}
      translations={{
        heading: t.catalog.header.heading,
        subtitle: t.catalog.header.subtitle,
        ctaPrimary: t.catalog.header.ctaPrimary,
        ctaSecondary: t.catalog.header.ctaSecondary,
        trust: t.catalog.trust,
      }}
      onRequestQuote={() => {/* ... */}}
      onDownloadCatalog={() => {/* ... */}}
    />
  );
}
```

## Translations

### French (FR)

```typescript
{
  heading: 'Catalogue Produits',
  subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
  ctaPrimary: 'Demander un devis',
  ctaSecondary: 'Télécharger le catalogue (PDF)',
  trust: {
    response24h: '24h',
    response24hTooltip: 'Réponse sous 24 heures',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA disponible sur demande',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'Conforme EUDR',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'Documentation QA complète',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & fiches techniques disponibles',
  },
}
```

### English (EN)

```typescript
{
  heading: 'Product Catalog',
  subtitle: 'Cocoa, coffee & African commodities — Documented QA, audit-ready traceability.',
  ctaPrimary: 'Request a Quote',
  ctaSecondary: 'Download Catalog (PDF)',
  trust: {
    response24h: '24h',
    response24hTooltip: '24h response time',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA available upon request',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'EUDR compliant',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'Comprehensive QA documentation',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & spec sheets available',
  },
}
```

## Components Used

- **ButtonDark**: Primary and secondary buttons with dark theme
- **TrustStripDark**: Trust indicators with icons and tooltips
- **TrustIconsDark**: SVG icons for trust items (Clock, Shield, Leaf, CheckCircle, FileText)

## Accessibility

- Semantic HTML with `<header>` and `role="banner"`
- Proper heading hierarchy (H1)
- ARIA labels on buttons
- Keyboard navigation support
- Focus indicators (2px gold outline)
- WCAG AA contrast ratios:
  - H1 (#4A9A62 on #0A1410): 4.8:1 ✓
  - Subtitle (#B0D4B8 on #0A1410): 9.2:1 ✓

## Responsive Behavior

- **Mobile (< 768px)**:
  - H1: 44px (2.75rem)
  - Max height: 40vh
  - CTAs stack vertically
  - Full-width buttons
  - Trust strip wraps with 16px gap

- **Desktop (≥ 768px)**:
  - H1: 56px (3.5rem)
  - Max height: 30vh
  - CTAs in horizontal row
  - Auto-width buttons
  - Trust strip horizontal with 32px gap

## Requirements Satisfied

- **2.1**: H1 "Catalogue Produits" with proper sizing
- **2.2**: Clear subtitle with QA + traceability messaging
- **2.3**: Primary CTA "Demander un devis"
- **2.4**: Secondary CTA "Télécharger le catalogue (PDF)"
- **2.5**: Trust indicators (24h, NDA, EUDR, QA, COA)
- **2.6**: Dark gradient background
- **2.7**: Max height constraints (30vh desktop, 40vh mobile)
- **7.1-7.7**: Complete FR/EN translations

## Related Components

- [TrustStripDark](./TrustStripDark.README.md)
- [ButtonDark](../ui/ButtonDark.tsx)
- [TrustIconsDark](./TrustIconsDark.tsx)

## Examples

See [CatalogHeaderDark.example.tsx](./CatalogHeaderDark.example.tsx) for complete usage examples.
