# ProductCatalogPageDark Component

## Overview

The `ProductCatalogPageDark` component is the main client-side component for the dark premium catalog redesign. It manages all state and coordinates between the various dark-themed catalog components.

## Features

### State Management
- **Filter State**: Manages all filter selections (search, category, origin, availability, certifications, incoterms, MOQ)
- **RFQ State**: Manages selected products and RFQ drawer visibility
- **Modal State**: Manages catalog download modal visibility
- **URL Sync**: Automatically syncs filter state with URL search parameters

### Component Coordination
- **CatalogHeaderDark**: Premium dark header with trust indicators and CTAs
- **CatalogFiltersDark**: Sticky filter bar with glass effect
- **ProductCardDark**: Individual product cards with dark theme
- **RFQDrawerDark**: Slide-out drawer for quote requests
- **MobileRFQButton**: Sticky bottom CTA for mobile devices
- **CatalogDownloadModal**: Modal for catalog PDF download

### Responsive Layout
- **Mobile (< 768px)**: 1 column grid, 16px gap
- **Tablet (768px - 1023px)**: 2 columns grid, 24px gap
- **Desktop (1024px - 1279px)**: 3 columns grid, 24px gap
- **Large Desktop (≥ 1280px)**: 4 columns grid, 24px gap

### Translations
- Full FR and EN translations via `getCatalogDarkTranslations()`
- Automatic fallback to EN for unsupported locales
- Type-safe translation interface

## Usage

```tsx
import { ProductCatalogPageDark } from './ProductCatalogPageDark';

// In your server component
export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  
  // Fetch data
  const [products, certifications] = await Promise.all([
    getAllProducts(),
    getAllCertifications(),
  ]);

  // Transform data...
  
  return (
    <ProductCatalogPageDark
      locale={locale}
      products={products}
      categories={categories}
      origins={origins}
      certifications={certifications}
    />
  );
}
```

## Props

```typescript
interface ProductCatalogPageDarkProps {
  locale: 'fr' | 'en';
  products: Product[];
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
}
```

## Requirements Fulfilled

- **1.1-1.7**: Dark premium theme implementation
- **3.1-3.9**: Filter functionality with URL sync
- **5.8**: Mobile RFQ button
- **7.1-7.7**: Complete FR/EN translations with fallback
- **9.1-9.4**: Responsive layout with correct breakpoints
- **9.6**: Mobile-specific features

## Performance Optimizations

- **Code Splitting**: RFQDrawerDark and CatalogDownloadModal are dynamically imported
- **Memoization**: Filtered products are memoized with useMemo
- **Debouncing**: Search input is debounced (300ms) in CatalogFiltersDark
- **Analytics**: Product views tracked on hover

## Accessibility

- Skip links for keyboard navigation
- ARIA labels on all interactive elements
- Focus management in modals and drawers
- Keyboard navigation support
- WCAG AA contrast ratios

## Related Files

- `lib/i18n/catalog-dark-translations.ts` - Translation definitions
- `components/catalog/CatalogHeaderDark.tsx` - Header component
- `components/catalog/CatalogFiltersDark.tsx` - Filter bar component
- `components/catalog/ProductCardDark.tsx` - Product card component
- `components/catalog/RFQDrawerDark.tsx` - RFQ drawer component
- `components/catalog/MobileRFQButton.tsx` - Mobile CTA button

## Testing

To test the component:

1. Navigate to `/fr/products` or `/en/products`
2. Verify dark theme is applied
3. Test filter functionality
4. Test RFQ drawer
5. Test mobile responsive behavior
6. Test translations switch between FR/EN

## Notes

- This component is a client component ('use client')
- Data fetching is handled by the parent server component
- URL parameters are automatically synced with filter state
- All analytics tracking is integrated
