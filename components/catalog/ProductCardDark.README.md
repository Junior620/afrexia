# ProductCardDark Component

Premium dark theme product card for the Afrexia catalog redesign.

## Overview

The `ProductCardDark` component is a fully-featured product card designed for the dark premium catalog experience. It features a glass effect container, gradient overlays, badges, quick specs, document indicators, and clear CTAs.

## Features

- **Glass Effect Container**: Dark background with backdrop blur and subtle borders
- **4:3 Aspect Ratio Image**: Optimized product images with gradient overlay
- **Premium Fallback**: Elegant pattern display when no image is available
- **Badges**: Availability and EUDR compliance badges
- **Quick Specs Grid**: Origin, MOQ, and Incoterms displayed prominently
- **Document Indicators**: Visual indicators for COA, Spec Sheet, and Chain of Custody
- **Dual CTAs**: Primary quote button and secondary spec link
- **Microproof**: Trust element ("Réponse sous 24h • NDA possible")
- **Hover States**: Elevation, shadow enhancement, and border color change
- **Focus States**: Gold outline for keyboard navigation
- **Analytics Tracking**: Automatic tracking of quote and spec clicks

## Usage

```tsx
import { ProductCardDark } from '@/components/catalog';
import { Product } from '@/types/product';

const translations = {
  requestQuote: 'Demander un devis',
  viewSpecs: 'Voir fiche technique',
  origin: 'Origine',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  microproof: 'Réponse sous 24h • NDA possible',
  badges: {
    available: 'Disponible',
    onRequest: 'Sur demande',
    outOfStock: 'Épuisé',
    eudrReady: 'EUDR-ready',
  },
  documents: {
    coa: 'Certificate of Analysis',
    specSheet: 'Specification Sheet',
    chainOfCustody: 'Chain of Custody',
  },
};

function CatalogPage() {
  const handleQuoteClick = () => {
    // Open RFQ drawer with product pre-filled
    console.log('Opening RFQ drawer');
  };

  return (
    <ProductCardDark
      product={product}
      locale="fr"
      translations={translations}
      onQuoteClick={handleQuoteClick}
    />
  );
}
```

## Props

### ProductCardDarkProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `Product` | Yes | Product data object |
| `locale` | `'fr' \| 'en'` | Yes | Current locale for routing |
| `translations` | `ProductCardDarkTranslations` | Yes | Translated strings |
| `onQuoteClick` | `() => void` | Yes | Callback when quote button is clicked |
| `onSpecClick` | `() => void` | No | Optional callback when spec link is clicked |

### ProductCardDarkTranslations

```typescript
interface ProductCardDarkTranslations {
  requestQuote: string;
  viewSpecs: string;
  origin: string;
  moq: string;
  incoterm: string;
  microproof: string;
  badges: {
    available: string;
    onRequest: string;
    outOfStock: string;
    eudrReady: string;
  };
  documents: {
    coa: string;
    specSheet: string;
    chainOfCustody: string;
  };
}
```

## Visual Specifications

### Container
- Background: `rgba(26, 40, 32, 0.8)` with backdrop blur
- Border: `rgba(255, 255, 255, 0.1)`
- Border radius: `28px`
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.3)`
- Min height: `520px`

### Hover States
- Transform: `translateY(-4px)`
- Shadow: `0 12px 48px rgba(0, 0, 0, 0.4)`
- Border: `rgba(255, 255, 255, 0.2)`

### Focus States
- Outline: `2px solid #A89858` (gold)
- Outline offset: `2px`

### Typography
- Product name (H3): `22px`, bold, `#E8F5E9`
- Subtitle: `14px`, `#B0D4B8`
- Spec labels: `12px`, uppercase, `#80996F`
- Spec values: `14px`, semibold, `#E8F5E9`

### Colors
- Primary text: `#E8F5E9` (ivory/light green)
- Secondary text: `#B0D4B8` (muted light green)
- Muted text: `#80996F` (support green)
- Primary CTA: `#4A9A62` (dark green)
- Secondary link: `#A89858` (gold)

## Analytics

The component automatically tracks the following events:

### Quote Click
```typescript
trackQuoteClick({
  productId: string,
  productName: string,
  category: string,
  origin: string,
  availability: string,
  source: 'card',
});
```

### Spec Click
```typescript
trackSpecClick({
  productId: string,
  productName: string,
  category: string,
  origin: string,
});
```

## Accessibility

- **Semantic HTML**: Uses `<article>` for card container
- **Focus Management**: Visible focus indicators with gold outline
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: SVG icons have `aria-hidden="true"`
- **Alt Text**: Product images have descriptive alt text
- **Touch Targets**: Minimum 44px height for buttons
- **Contrast**: WCAG AA compliant color contrast ratios

## Requirements Satisfied

- **4.1**: Container with glass effect ✓
- **4.2**: Badges for EUDR and availability ✓
- **4.3**: Product name as H3 (22px) ✓
- **4.4**: Subtitle (14px) ✓
- **4.5**: Quick specs grid (Origin, MOQ, Incoterms) ✓
- **4.6**: Primary button "Demander un devis" ✓
- **4.7**: Secondary link "Voir fiche technique" (gold) ✓
- **4.8**: Hover states with elevation ✓
- **4.9**: Focus states with gold outline ✓
- **4.10**: Document indicators ✓
- **4.11**: Microproof text ✓
- **6.9**: Focus outline gold 2px ✓
- **8.2**: Analytics tracking for quote click ✓
- **8.5**: Analytics tracking with product metadata ✓

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari (iOS): Last 2 versions
- Chrome Mobile (Android): Last 2 versions

## Performance

- **Image Optimization**: Uses Next.js Image component with lazy loading
- **Responsive Images**: Appropriate sizes attribute for different viewports
- **Minimal Re-renders**: Memoized event handlers
- **Prefetching**: Product detail pages are prefetched on hover via Next.js Link

## Related Components

- `BadgeDark`: Badge component for availability and certifications
- `ButtonDark`: Button component for CTAs
- `TrustStripDark`: Trust indicators strip
- `CatalogHeaderDark`: Catalog page header
- `CatalogFiltersDark`: Catalog filters bar
