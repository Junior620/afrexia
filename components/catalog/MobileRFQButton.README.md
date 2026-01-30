# MobileRFQButton Component

## Overview

The `MobileRFQButton` component is a sticky bottom CTA button designed specifically for mobile devices. It provides a persistent call-to-action for requesting quotes, ensuring users can easily initiate an RFQ from anywhere on the catalog page.

## Features

- **Sticky Bottom Position**: Fixed at the bottom of the viewport with z-index 50
- **Glass Effect**: Semi-transparent background with backdrop blur for premium feel
- **Safe Area Support**: Respects device safe area insets (notches, home indicators)
- **Analytics Tracking**: Automatically tracks quote clicks with source attribution
- **Mobile-Only**: Hidden on desktop viewports (≥768px)
- **Accessibility**: Proper ARIA labels and touch target sizing (48px height)

## Visual Specifications

### Layout
- Position: `fixed bottom-0 left-0 right-0`
- Z-index: `50`
- Width: `100%`
- Height: `48px` (button) + padding

### Styling
- Background: `rgba(74,154,98,0.95)` with `backdrop-blur(12px)`
- Shadow: `0 -4px 16px rgba(0,0,0,0.3)` (top shadow)
- Border: `1px solid rgba(255,255,255,0.1)` (top border)
- Padding: `12px 16px` + safe area insets

### Button
- Variant: Primary (green)
- Size: Large
- Background: `#4A9A62`
- Hover: `#5AAA72`
- Active: `#3A8A52`

## Props

```typescript
interface MobileRFQButtonProps {
  product?: Product;           // Optional product for analytics tracking
  locale: 'fr' | 'en';        // Current locale
  translations: {
    requestQuote: string;      // Button text
  };
  onClick: () => void;         // Click handler (opens RFQ drawer)
  className?: string;          // Optional additional classes
}
```

## Usage

### Basic Usage

```tsx
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';

function CatalogPage() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  return (
    <>
      {/* Page content */}
      
      <MobileRFQButton
        locale="fr"
        translations={{
          requestQuote: 'Demander un devis'
        }}
        onClick={() => setIsRFQOpen(true)}
      />
    </>
  );
}
```

### With Product Context

```tsx
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';

function ProductCatalog({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  const handleRFQClick = () => {
    // If no product selected, open drawer without pre-selection
    setIsRFQOpen(true);
  };

  return (
    <>
      {/* Product grid */}
      
      <MobileRFQButton
        product={selectedProduct || undefined}
        locale="en"
        translations={{
          requestQuote: 'Request a Quote'
        }}
        onClick={handleRFQClick}
      />
    </>
  );
}
```

## Translations

### French (FR)
```typescript
{
  requestQuote: 'Demander un devis'
}
```

### English (EN)
```typescript
{
  requestQuote: 'Request a Quote'
}
```

## Analytics Tracking

The component automatically tracks quote clicks when a product is provided:

```typescript
trackQuoteClick({
  productId: product.id,
  productName: product.name,
  category: product.category,
  origin: product.origins?.[0] || 'Unknown',
  availability: product.availability,
  source: 'mobile_cta', // Identifies clicks from mobile button
});
```

**Event Name**: `cta_click`

**Event Properties**:
- `cta_type`: `'quote_click'`
- `product_id`: Product ID
- `product_name`: Product name
- `category`: Product category
- `origin`: Product origin
- `availability`: Product availability status
- `source`: `'mobile_cta'` (distinguishes from card clicks)

## Accessibility

- **Touch Target**: 48px height meets minimum touch target size
- **ARIA Label**: Descriptive label for screen readers
- **Keyboard Navigation**: Fully keyboard accessible
- **Focus Indicators**: Visible focus ring (gold color)

## Responsive Behavior

- **Mobile (< 768px)**: Visible and sticky at bottom
- **Tablet/Desktop (≥ 768px)**: Hidden via `md:hidden` class

## Safe Area Insets

The component respects device safe areas using CSS environment variables:

```css
padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
```

This ensures the button is not obscured by:
- iPhone home indicators
- Android navigation bars
- Device notches or rounded corners

## Integration with RFQDrawerDark

The button is designed to work seamlessly with the `RFQDrawerDark` component:

```tsx
function CatalogPage() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      {/* Catalog content */}
      
      <MobileRFQButton
        product={selectedProduct || undefined}
        locale="fr"
        translations={{ requestQuote: 'Demander un devis' }}
        onClick={() => setIsRFQOpen(true)}
      />

      <RFQDrawerDark
        product={selectedProduct!}
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

## Requirements

- **Requirement 5.8**: Sticky bottom CTA on mobile
- **Requirement 9.6**: Mobile-specific UI elements
- **Requirement 8.2**: Analytics tracking with source attribution

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Graceful fallback for browsers without backdrop-filter (solid background)
- Safe area insets supported in iOS 11+ and modern Android browsers

## Performance

- Minimal re-renders (memoized click handler)
- No layout shift (fixed positioning)
- Lightweight component (~2KB gzipped)

## Testing

### Unit Tests
```typescript
describe('MobileRFQButton', () => {
  it('renders with correct text', () => {
    // Test rendering
  });

  it('calls onClick when clicked', () => {
    // Test click handler
  });

  it('tracks analytics with mobile_cta source', () => {
    // Test analytics tracking
  });

  it('is hidden on desktop', () => {
    // Test responsive behavior
  });
});
```

### E2E Tests
```typescript
test('mobile RFQ button opens drawer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile
  await page.goto('/products');
  
  await page.click('[aria-label="Request a Quote"]');
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});
```

## Related Components

- `RFQDrawerDark`: The drawer opened by this button
- `ProductCardDark`: Desktop quote button alternative
- `ButtonDark`: Base button component used internally
- `CatalogHeaderDark`: Header with desktop quote CTA

## Design Tokens

```typescript
const MOBILE_RFQ_BUTTON_TOKENS = {
  background: 'rgba(74,154,98,0.95)',
  backdropBlur: '12px',
  shadow: '0 -4px 16px rgba(0,0,0,0.3)',
  border: 'rgba(255,255,255,0.1)',
  buttonHeight: '48px',
  zIndex: 50,
};
```
