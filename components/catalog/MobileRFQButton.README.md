# MobileRFQButton Component

## Overview

The `MobileRFQButton` component provides a sticky bottom bar for mobile devices that displays the RFQ cart count and opens the RFQ drawer when clicked. This component is part of the product catalog redesign and implements Requirements 4.12 and 13.5.

## Features

- **Mobile-Only Display**: Automatically hidden on desktop (≥ 768px)
- **Sticky Positioning**: Fixed at bottom of viewport for easy access
- **Cart Count Badge**: Shows number of products in RFQ cart
- **Touch-Optimized**: Minimum 44x44px touch target
- **iOS Safe Area**: Respects iOS safe area insets
- **Smooth Animations**: Slide-up animation and badge zoom-in
- **Accessibility**: Proper ARIA labels and keyboard support

## Usage

### Basic Example

```tsx
import { MobileRFQButton } from '@/components/catalog';

function ProductCatalogPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      {/* Your page content */}
      
      <MobileRFQButton
        cartCount={cartCount}
        onClick={() => setIsDrawerOpen(true)}
        translations={{
          requestQuote: 'Request Quote',
          itemsInCart: 'items in cart',
        }}
      />
    </>
  );
}
```

### With RFQDrawer Integration

```tsx
import { MobileRFQButton, RFQDrawer } from '@/components/catalog';

function ProductCatalogPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  return (
    <>
      {/* Product grid and other content */}
      
      {/* Mobile sticky button */}
      <MobileRFQButton
        cartCount={selectedProducts.length}
        onClick={() => setIsDrawerOpen(true)}
        translations={{
          requestQuote: 'Request Quote',
          itemsInCart: 'items in cart',
        }}
      />

      {/* RFQ Drawer */}
      <RFQDrawer
        selectedProducts={selectedProducts}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        onRemoveProduct={handleRemoveProduct}
        // ... other props
      />
    </>
  );
}
```

## Props

### MobileRFQButtonProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `cartCount` | `number` | Yes | Number of products in RFQ cart |
| `onClick` | `() => void` | Yes | Callback when button is clicked |
| `translations` | `object` | Yes | Translation strings |
| `translations.requestQuote` | `string` | Yes | Button text (e.g., "Request Quote") |
| `translations.itemsInCart` | `string` | Yes | Accessibility label suffix (e.g., "items in cart") |

## Translations

The component requires translation strings for internationalization:

### English
```typescript
{
  requestQuote: 'Request Quote',
  itemsInCart: 'items in cart',
}
```

### French
```typescript
{
  requestQuote: 'Demander un devis',
  itemsInCart: 'articles dans le panier',
}
```

### Spanish
```typescript
{
  requestQuote: 'Solicitar cotización',
  itemsInCart: 'artículos en el carrito',
}
```

### German
```typescript
{
  requestQuote: 'Angebot anfordern',
  itemsInCart: 'Artikel im Warenkorb',
}
```

### Russian
```typescript
{
  requestQuote: 'Запросить предложение',
  itemsInCart: 'товаров в корзине',
}
```

## Styling

The component uses Tailwind CSS classes and follows the design system:

- **Background**: White with top border
- **Button**: Primary color with hover state
- **Badge**: Red background with white text
- **Shadow**: Elevated shadow for prominence
- **Transitions**: Smooth animations for all interactions

### Customization

You can customize the appearance by modifying the component or using CSS classes:

```tsx
// The component already includes all necessary styling
// No additional customization needed for standard use cases
```

## Responsive Behavior

- **Mobile (< 768px)**: Visible as sticky bottom bar
- **Tablet/Desktop (≥ 768px)**: Hidden (uses `md:hidden` class)

## Accessibility

The component follows WCAG 2.1 AA guidelines:

- **Touch Targets**: Minimum 44x44px for mobile
- **ARIA Labels**: Descriptive labels including cart count
- **Keyboard Support**: Fully keyboard accessible
- **Focus Indicators**: Visible focus ring
- **Screen Readers**: Announces cart count changes

### ARIA Label Example

When cart has 3 items:
```
"Request Quote - 3 items in cart"
```

## Performance

- **Lightweight**: Minimal JavaScript and CSS
- **No Re-renders**: Only updates when props change
- **Optimized Animations**: Uses CSS transforms for smooth performance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (latest)
- Android Chrome (latest)

## iOS Safe Area

The component automatically handles iOS safe area insets using the `safe-area-inset-bottom` class. This ensures the button doesn't overlap with the home indicator on newer iPhones.

## Testing

### Manual Testing Checklist

- [ ] Button appears only on mobile viewports (< 768px)
- [ ] Button is hidden on desktop viewports (≥ 768px)
- [ ] Cart count badge displays correctly
- [ ] Badge shows "99+" for counts > 99
- [ ] Badge animates in when count changes from 0 to 1
- [ ] Button opens RFQ drawer when clicked
- [ ] Touch target is at least 44x44px
- [ ] Button respects iOS safe area
- [ ] Keyboard navigation works
- [ ] Screen reader announces cart count
- [ ] Focus indicator is visible

### Unit Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileRFQButton } from './MobileRFQButton';

describe('MobileRFQButton', () => {
  const mockOnClick = jest.fn();
  const translations = {
    requestQuote: 'Request Quote',
    itemsInCart: 'items in cart',
  };

  it('renders with cart count', () => {
    render(
      <MobileRFQButton
        cartCount={3}
        onClick={mockOnClick}
        translations={translations}
      />
    );
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={translations}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('shows 99+ for counts over 99', () => {
    render(
      <MobileRFQButton
        cartCount={150}
        onClick={mockOnClick}
        translations={translations}
      />
    );
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});
```

## Related Components

- **RFQDrawer**: The drawer that opens when button is clicked
- **ProductCard**: Cards that add products to RFQ cart
- **CatalogFilters**: Filter bar that works with mobile layout

## Requirements

This component implements the following requirements:

- **Requirement 4.12**: Mobile sticky CTA button for accessing RFQ drawer
- **Requirement 13.5**: Sticky bottom bar on mobile viewport
- **Requirement 13.7**: Minimum 44x44px touch targets on mobile

## Changelog

### Version 1.0.0 (2024-01-29)
- Initial implementation
- Mobile-only sticky bottom bar
- Cart count badge
- iOS safe area support
- Full accessibility support
