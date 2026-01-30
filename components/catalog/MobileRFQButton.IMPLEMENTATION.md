# MobileRFQButton Implementation Guide

## Overview

This document provides implementation details for the `MobileRFQButton` component, including technical specifications, integration patterns, and best practices.

## Technical Specifications

### Component Architecture

```
MobileRFQButton
├── Container (fixed positioning)
│   ├── Glass effect background
│   ├── Top shadow
│   └── Safe area padding
└── ButtonDark (primary variant)
    ├── Full width
    ├── 48px height
    └── Click handler with analytics
```

### CSS Classes Breakdown

```typescript
// Container classes
const containerClasses = cn(
  // Position and layout
  'fixed bottom-0 left-0 right-0',  // Sticky to bottom
  'z-50',                             // Above most content
  'w-full',                           // Full width
  
  // Background with glass effect
  'bg-[rgba(74,154,98,0.95)]',       // Semi-transparent green
  'backdrop-blur-[12px]',             // Glass blur effect
  
  // Shadow
  'shadow-[0_-4px_16px_rgba(0,0,0,0.3)]', // Top shadow
  
  // Padding with safe area insets
  'px-4 py-3',                        // Base padding
  'pb-[calc(0.75rem+env(safe-area-inset-bottom))]', // Safe area
  
  // Border
  'border-t border-[rgba(255,255,255,0.1)]', // Subtle top border
  
  // Animation
  'transition-transform duration-300 ease-out',
  
  // Responsive
  'md:hidden',                        // Hide on desktop
);
```

### Button Styling

```typescript
// Button classes
const buttonClasses = cn(
  'w-full',                    // Full width
  'h-12',                      // 48px height
  'bg-[#4A9A62]',             // Primary green
  'hover:bg-[#5AAA72]',       // Lighter on hover
  'active:bg-[#3A8A52]',      // Darker on active
  'shadow-lg',                 // Elevation
  'font-bold',                 // Bold text
  'text-white',                // White text
);
```

## Integration Patterns

### Pattern 1: Basic Integration

```tsx
// app/[locale]/products/page.tsx
'use client';

import { useState } from 'react';
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';
import { RFQDrawerDark } from '@/components/catalog/RFQDrawerDark';

export default function ProductsPage() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  return (
    <>
      {/* Page content */}
      
      <MobileRFQButton
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={() => setIsRFQOpen(true)}
      />

      <RFQDrawerDark
        product={selectedProduct}
        locale="fr"
        translations={rfqTranslations}
        isOpen={isRFQOpen}
        onClose={() => setIsRFQOpen(false)}
        onSubmit={handleRFQSubmit}
      />
    </>
  );
}
```

### Pattern 2: With Product Context

```tsx
// app/[locale]/products/ProductCatalogClient.tsx
'use client';

import { useState } from 'react';
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';
import { Product } from '@/types/product';

export function ProductCatalogClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  const handleProductQuoteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsRFQOpen(true);
  };

  const handleMobileRFQClick = () => {
    // If no product selected, select first product or show selection UI
    if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0]);
    }
    setIsRFQOpen(true);
  };

  return (
    <>
      {/* Product grid with individual quote buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCardDark
            key={product.id}
            product={product}
            onQuoteClick={() => handleProductQuoteClick(product)}
          />
        ))}
      </div>

      {/* Mobile sticky button */}
      <MobileRFQButton
        product={selectedProduct || undefined}
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={handleMobileRFQClick}
      />

      {/* RFQ drawer */}
      {selectedProduct && (
        <RFQDrawerDark
          product={selectedProduct}
          locale="fr"
          translations={rfqTranslations}
          isOpen={isRFQOpen}
          onClose={() => setIsRFQOpen(false)}
          onSubmit={handleRFQSubmit}
        />
      )}
    </>
  );
}
```

### Pattern 3: With Translation Hook

```tsx
// Using i18n translations
import { useTranslations } from '@/lib/i18n';
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';

export function CatalogPage({ locale }: { locale: 'fr' | 'en' }) {
  const t = useTranslations(locale);
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  return (
    <>
      {/* Content */}
      
      <MobileRFQButton
        locale={locale}
        translations={{
          requestQuote: t('catalog.requestQuote')
        }}
        onClick={() => setIsRFQOpen(true)}
      />
    </>
  );
}
```

## Analytics Implementation

### Event Tracking

The component automatically tracks quote clicks when a product is provided:

```typescript
// Automatic tracking in component
const handleClick = () => {
  if (product) {
    trackQuoteClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
      origin: product.origins?.[0] || 'Unknown',
      availability: product.availability,
      source: 'mobile_cta', // Key identifier
    });
  }
  onClick();
};
```

### Custom Analytics

If you need custom analytics logic:

```tsx
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';
import { trackEvent } from '@/lib/analytics';

export function CustomAnalyticsCatalog() {
  const handleRFQClick = () => {
    // Custom analytics
    trackEvent('custom_mobile_rfq_click', {
      page: 'catalog',
      timestamp: Date.now(),
    });
    
    // Open drawer
    setIsRFQOpen(true);
  };

  return (
    <MobileRFQButton
      locale="fr"
      translations={{ requestQuote: 'Demander un devis' }}
      onClick={handleRFQClick}
    />
  );
}
```

## Safe Area Insets

### How It Works

The component uses CSS environment variables to respect device safe areas:

```css
padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
```

### Supported Devices

- **iPhone X and newer**: Home indicator area
- **Android with gesture navigation**: Navigation bar area
- **Devices with notches**: Bottom safe area

### Testing Safe Areas

```tsx
// Test component for safe area behavior
export function SafeAreaTest() {
  return (
    <div className="min-h-screen bg-[#0A1410]">
      <div className="h-[200vh] p-4">
        <h1 className="text-white">Scroll to bottom</h1>
      </div>
      
      <MobileRFQButton
        locale="en"
        translations={{ requestQuote: 'Request Quote' }}
        onClick={() => console.log('Clicked')}
      />
      
      {/* Visual indicator of safe area */}
      <div className="fixed bottom-0 left-0 right-0 h-[env(safe-area-inset-bottom)] bg-red-500 opacity-50 pointer-events-none" />
    </div>
  );
}
```

## Responsive Behavior

### Breakpoint Strategy

```typescript
// Component is hidden on desktop
'md:hidden' // Hidden at 768px and above
```

### Desktop Alternative

On desktop, users should use the quote buttons in product cards or header:

```tsx
export function ResponsiveCatalog() {
  return (
    <>
      {/* Desktop: Header CTA */}
      <CatalogHeaderDark
        onRequestQuote={() => setIsRFQOpen(true)}
      />

      {/* Desktop: Product card CTAs */}
      <ProductCardDark
        product={product}
        onQuoteClick={() => setIsRFQOpen(true)}
      />

      {/* Mobile: Sticky button */}
      <MobileRFQButton
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={() => setIsRFQOpen(true)}
      />
    </>
  );
}
```

## Performance Optimization

### Memoization

```tsx
import { memo, useCallback } from 'react';
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';

const MemoizedMobileRFQButton = memo(MobileRFQButton);

export function OptimizedCatalog() {
  const handleClick = useCallback(() => {
    setIsRFQOpen(true);
  }, []);

  return (
    <MemoizedMobileRFQButton
      locale="fr"
      translations={{ requestQuote: 'Demander un devis' }}
      onClick={handleClick}
    />
  );
}
```

### Lazy Loading

```tsx
import dynamic from 'next/dynamic';

// Lazy load the button (though it's lightweight)
const MobileRFQButton = dynamic(
  () => import('@/components/catalog/MobileRFQButton').then(mod => mod.MobileRFQButton),
  { ssr: false }
);
```

## Accessibility

### ARIA Labels

```tsx
<MobileRFQButton
  locale="fr"
  translations={{
    requestQuote: 'Demander un devis' // Used as aria-label
  }}
  onClick={handleClick}
/>
```

### Keyboard Navigation

The button is fully keyboard accessible:
- **Tab**: Focus the button
- **Enter/Space**: Activate the button
- **Escape**: Close the drawer (handled by RFQDrawerDark)

### Screen Reader Support

```tsx
// The button announces properly to screen readers
<button aria-label="Demander un devis">
  Demander un devis
</button>
```

## Styling Customization

### Custom Background

```tsx
<MobileRFQButton
  locale="fr"
  translations={{ requestQuote: 'Demander un devis' }}
  onClick={handleClick}
  className="bg-[rgba(90,170,114,0.95)]" // Custom green
/>
```

### Custom Animation

```tsx
<MobileRFQButton
  locale="fr"
  translations={{ requestQuote: 'Demander un devis' }}
  onClick={handleClick}
  className="animate-bounce" // Add bounce animation
/>
```

### Custom Shadow

```tsx
<MobileRFQButton
  locale="fr"
  translations={{ requestQuote: 'Demander un devis' }}
  onClick={handleClick}
  className="shadow-[0_-8px_32px_rgba(0,0,0,0.5)]" // Stronger shadow
/>
```

## Testing

### Unit Tests

```typescript
// components/catalog/__tests__/MobileRFQButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileRFQButton } from '../MobileRFQButton';

describe('MobileRFQButton', () => {
  const mockProduct = {
    id: 'test-product',
    name: 'Test Product',
    category: 'Test',
    origins: ['Test Origin'],
    availability: 'available',
  };

  it('renders with correct text', () => {
    render(
      <MobileRFQButton
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={() => {}}
      />
    );
    
    expect(screen.getByText('Demander un devis')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    
    render(
      <MobileRFQButton
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={handleClick}
      />
    );
    
    fireEvent.click(screen.getByText('Demander un devis'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('tracks analytics with mobile_cta source', () => {
    const trackQuoteClick = jest.fn();
    
    render(
      <MobileRFQButton
        product={mockProduct}
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Demander un devis'));
    
    expect(trackQuoteClick).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'mobile_cta',
      })
    );
  });

  it('is hidden on desktop', () => {
    const { container } = render(
      <MobileRFQButton
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={() => {}}
      />
    );
    
    const button = container.firstChild;
    expect(button).toHaveClass('md:hidden');
  });
});
```

### E2E Tests

```typescript
// tests/e2e/mobile-rfq-button.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MobileRFQButton', () => {
  test('opens RFQ drawer on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/products');
    
    // Button should be visible
    const button = page.locator('[aria-label="Request a Quote"]');
    await expect(button).toBeVisible();
    
    // Click button
    await button.click();
    
    // Drawer should open
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();
  });

  test('is hidden on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.goto('/products');
    
    // Button should not be visible
    const button = page.locator('[aria-label="Request a Quote"]');
    await expect(button).not.toBeVisible();
  });

  test('respects safe area insets', async ({ page, browserName }) => {
    // Only test on webkit (Safari)
    test.skip(browserName !== 'webkit', 'Safe area only on Safari');
    
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto('/products');
    
    const button = page.locator('[aria-label="Request a Quote"]');
    const box = await button.boundingBox();
    
    // Button should not be at the very bottom (safe area padding)
    expect(box?.y).toBeLessThan(812 - 48); // 48px = button height
  });
});
```

## Troubleshooting

### Issue: Button not visible on mobile

**Solution**: Check viewport size and ensure `md:hidden` class is applied.

```tsx
// Verify responsive classes
<div className="md:hidden"> {/* Should hide at 768px+ */}
  <MobileRFQButton ... />
</div>
```

### Issue: Button obscured by home indicator

**Solution**: Ensure safe area insets are supported in your viewport meta tag.

```html
<!-- In layout.tsx or _document.tsx -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

### Issue: Analytics not tracking

**Solution**: Verify product prop is provided and analytics library is loaded.

```tsx
// Check product prop
<MobileRFQButton
  product={product} // Must be provided for analytics
  locale="fr"
  translations={{ requestQuote: 'Demander un devis' }}
  onClick={handleClick}
/>
```

### Issue: Button appears on desktop

**Solution**: Ensure Tailwind's `md:` breakpoint is configured correctly.

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      md: '768px', // Ensure this is set
    },
  },
};
```

## Requirements Mapping

- **Requirement 5.8**: Sticky bottom CTA on mobile ✓
- **Requirement 9.6**: Mobile-specific UI elements ✓
- **Requirement 8.2**: Analytics tracking with source attribution ✓

## Related Documentation

- [RFQDrawerDark Component](./RFQDrawerDark.README.md)
- [ProductCardDark Component](./ProductCardDark.README.md)
- [ButtonDark Component](../ui/ButtonDark.tsx)
- [Analytics Events](../../lib/analytics/events.ts)
