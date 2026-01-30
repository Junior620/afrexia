# CatalogFiltersDark Component

Dark premium filter bar component for the Afrexia product catalog redesign.

## Overview

The `CatalogFiltersDark` component provides a comprehensive filtering interface with a dark premium aesthetic featuring glass morphism effects. It includes desktop sticky filter bar, mobile drawer, search with debouncing, multiple filter types, and analytics tracking.

## Features

- ✅ **Sticky positioning** with glass effect backdrop blur
- ✅ **Search input** with 300ms debouncing
- ✅ **Multiple filter types**: Category, Origin, Availability, Certifications, Incoterms
- ✅ **Active filter chips** with individual remove buttons
- ✅ **Product count** display with live updates
- ✅ **Clear all filters** button
- ✅ **Mobile drawer** (< 768px) with bottom sheet
- ✅ **Analytics tracking** for all filter interactions
- ✅ **URL synchronization** support (via parent component)
- ✅ **Keyboard navigation** and accessibility
- ✅ **Dark theme** with WCAG AA contrast compliance

## Requirements

Implements requirements: **3.1-3.9, 8.1**

## Props

```typescript
interface CatalogFiltersDarkProps {
  searchQuery: string;
  activeFilters: FilterState;
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: {
    filters: FilterTranslations;
    availability: AvailabilityTranslations;
  };
  onSearchChange: (query: string) => void;
  onFilterChange: (filterType: FilterType, value: any) => void;
  onClearFilters: () => void;
  productCount: number;
  className?: string;
}
```

## Usage

### Basic Usage

```tsx
import { CatalogFiltersDark } from '@/components/catalog';
import { useState } from 'react';

function CatalogPage() {
  const [filterState, setFilterState] = useState({
    search: '',
    category: undefined,
    origins: [],
    availability: [],
    eudrReady: undefined,
    certifications: [],
    incoterms: [],
    moqRange: undefined,
  });

  return (
    <CatalogFiltersDark
      searchQuery={filterState.search}
      activeFilters={filterState}
      categories={categories}
      origins={origins}
      certifications={certifications}
      translations={translations}
      onSearchChange={(query) => setFilterState({ ...filterState, search: query })}
      onFilterChange={(type, value) => setFilterState({ ...filterState, [type]: value })}
      onClearFilters={() => setFilterState(initialState)}
      productCount={filteredProducts.length}
    />
  );
}
```

### With URL Synchronization

```tsx
import { CatalogFiltersDark } from '@/components/catalog';
import { updateURLWithFilters, deserializeFiltersFromURL } from '@/lib/catalog';
import { useEffect, useState } from 'react';

function CatalogPage() {
  // Initialize from URL
  const [filterState, setFilterState] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return deserializeFiltersFromURL(searchParams);
  });

  // Sync to URL on change
  useEffect(() => {
    updateURLWithFilters(filterState, window.location.pathname);
  }, [filterState]);

  return (
    <CatalogFiltersDark
      searchQuery={filterState.search}
      activeFilters={filterState}
      // ... other props
    />
  );
}
```

### With Product Filtering

```tsx
import { CatalogFiltersDark } from '@/components/catalog';
import { applyFilters } from '@/lib/catalog';

function CatalogPage({ products }) {
  const [filterState, setFilterState] = useState(initialState);
  
  // Apply filters to products
  const filteredProducts = applyFilters(products, filterState);

  return (
    <>
      <CatalogFiltersDark
        searchQuery={filterState.search}
        activeFilters={filterState}
        categories={categories}
        origins={origins}
        certifications={certifications}
        translations={translations}
        onSearchChange={(query) => setFilterState({ ...filterState, search: query })}
        onFilterChange={(type, value) => setFilterState({ ...filterState, [type]: value })}
        onClearFilters={() => setFilterState(initialState)}
        productCount={filteredProducts.length}
      />
      
      <ProductGrid products={filteredProducts} />
    </>
  );
}
```

## Filter Logic

The component uses the following filter logic:

1. **Search**: Debounced 300ms, searches across product name, category, and tags
2. **AND Logic**: All active filters must match (product must satisfy ALL filters)
3. **Multi-select**: Origins, Availability, Certifications, Incoterms support multiple selections
4. **Single-select**: Category is single selection

Filter logic is implemented in `lib/catalog/filters.ts`:

```typescript
import { applyFilters } from '@/lib/catalog/filters';

const filteredProducts = applyFilters(products, filterState);
```

## Analytics Tracking

The component automatically tracks filter usage:

```typescript
// Tracked events:
trackCatalogFilter({
  filterType: 'category' | 'origins' | 'availability' | 'certifications' | 'incoterms' | 'search',
  filterValue: string | string[],
  resultCount: number,
});
```

Events are sent to:
- Plausible Analytics (privacy-friendly, no consent required)
- Google Analytics 4 (with user consent)
- Vercel Analytics

## Styling

### Desktop Filter Bar

- **Position**: `sticky top-0 z-40`
- **Background**: `rgba(26,40,32,0.8)` with `backdrop-blur-[12px]`
- **Border**: `border-b border-[rgba(255,255,255,0.1)]`
- **Shadow**: `0 8px 32px rgba(0,0,0,0.3)` when scrolled
- **Padding**: `py-4` default, `py-3` when scrolled

### Mobile Drawer

- **Position**: `fixed bottom-0` with `z-50`
- **Max Height**: `80vh`
- **Background**: `#0A1410` (dark charcoal)
- **Shadow**: `0 -4px 32px rgba(0,0,0,0.5)`
- **Animation**: Slide up from bottom

### Filter Chips

- **Background**: `rgba(74,154,98,0.2)` (green with transparency)
- **Text**: `#4A9A62` (dark green)
- **Border**: `rgba(74,154,98,0.3)`
- **Border Radius**: `rounded-full`

## Accessibility

- ✅ **WCAG AA** contrast ratios for all text
- ✅ **Keyboard navigation** for all interactive elements
- ✅ **Focus indicators** (2px ring, gold color)
- ✅ **ARIA labels** for screen readers
- ✅ **Live regions** for product count updates
- ✅ **Touch targets** ≥ 44x44px on mobile
- ✅ **Semantic HTML** structure

## Responsive Breakpoints

- **Mobile**: `< 768px` - Collapsed filters with drawer
- **Tablet**: `768px - 1024px` - Inline filters with wrapping
- **Desktop**: `> 1024px` - Full inline filters

## Dependencies

- `@/components/ui/InputDark` - Dark theme input component
- `@/components/ui/SelectDark` - Dark theme select component
- `@/components/ui/ButtonDark` - Dark theme button component
- `@/lib/catalog/filters` - Filter logic utilities
- `@/lib/catalog/url-params` - URL synchronization utilities
- `@/lib/analytics/events` - Analytics tracking

## Related Components

- `CatalogHeaderDark` - Dark premium catalog header
- `ProductCardDark` - Dark premium product card
- `ProductGrid` - Product grid layout
- `RFQDrawerDark` - Request for quote drawer

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari (iOS): Last 2 versions
- Chrome Mobile (Android): Last 2 versions

## Performance

- **Debounced search**: 300ms delay prevents excessive re-renders
- **Memoized callbacks**: `useCallback` for filter handlers
- **Optimized re-renders**: Only updates when filter state changes
- **Lazy drawer**: Mobile drawer only renders when open

## Testing

See `CatalogFiltersDark.example.tsx` for usage examples.

## Design Tokens

```typescript
const COLORS = {
  bgPrimary: '#0A1410',
  bgSecondary: '#1A2820',
  textPrimary: '#E8F5E9',
  textSecondary: '#B0D4B8',
  textMuted: '#80996F',
  brandPrimary: '#4A9A62',
  brandAccent: '#A89858',
  border: 'rgba(255,255,255,0.1)',
  borderHover: 'rgba(255,255,255,0.2)',
};
```

## Notes

- The component is controlled - parent manages filter state
- URL synchronization is handled by parent component
- Filter logic uses AND logic (all filters must match)
- Analytics tracking respects Do Not Track settings
- Mobile drawer prevents body scroll when open

