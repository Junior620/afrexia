# Responsive Grid System

This document describes the responsive grid system implementation for the Afrexia B2B website.

## Overview

The grid system provides a mobile-first, responsive layout framework with:
- **4 columns** on mobile (< 640px)
- **8 columns** on tablet (640px - 767px)
- **12 columns** on desktop (≥ 768px)

Column gaps automatically adjust:
- **16px** on mobile
- **24px** on tablet
- **32px** on desktop and above

## Requirements

Implements Requirements 17.1, 17.2, 17.3, 17.4, 17.5 from `.kiro/specs/responsive-intelligent-navigation/requirements.md`:
- 12-column layout at desktop breakpoint and above
- 8-column layout at tablet breakpoint
- 4-column layout at mobile breakpoint
- Consistent column gaps (16px mobile, 24px tablet, 32px desktop)
- Utility classes for responsive column spanning at each breakpoint

## Usage

### Basic Responsive Grid

The simplest way to use the grid system is with the `.grid-responsive` class:

```tsx
<div className="grid-responsive">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

This automatically:
- Creates a 4-column grid on mobile
- Switches to 8 columns on tablet
- Switches to 12 columns on desktop
- Adjusts gaps appropriately

### Using Tailwind Utility Classes

For more control, use Tailwind's built-in grid utilities with responsive modifiers:

```tsx
<div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
  <div className="col-span-4 sm:col-span-4 md:col-span-6">Half width on desktop</div>
  <div className="col-span-4 sm:col-span-4 md:col-span-6">Half width on desktop</div>
</div>
```

### Column Spanning Patterns

#### Full Width
```tsx
<div className="col-span-4 sm:col-span-8 md:col-span-12">
  Full width at all breakpoints
</div>
```

#### Half Width
```tsx
<div className="col-span-4 sm:col-span-4 md:col-span-6">
  Full on mobile, half on tablet and desktop
</div>
```

#### Third Width
```tsx
<div className="col-span-4 sm:col-span-4 md:col-span-4">
  Full on mobile, half on tablet, third on desktop
</div>
```

#### Quarter Width
```tsx
<div className="col-span-4 sm:col-span-4 md:col-span-3">
  Full on mobile, half on tablet, quarter on desktop
</div>
```

### Common Layout Examples

#### Card Grid (1-2-3 pattern)
```tsx
<div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
  {cards.map((card) => (
    <div key={card.id} className="col-span-4 sm:col-span-4 md:col-span-4">
      <Card {...card} />
    </div>
  ))}
</div>
```

#### Two-Column Layout (Sidebar + Content)
```tsx
<div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
  {/* Sidebar */}
  <aside className="col-span-4 sm:col-span-8 md:col-span-3">
    <Sidebar />
  </aside>
  
  {/* Main content */}
  <main className="col-span-4 sm:col-span-8 md:col-span-9">
    <Content />
  </main>
</div>
```

#### Hero Section (Image + Text)
```tsx
<div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
  {/* Text content */}
  <div className="col-span-4 sm:col-span-8 md:col-span-6">
    <h1>Hero Title</h1>
    <p>Hero description</p>
  </div>
  
  {/* Image */}
  <div className="col-span-4 sm:col-span-8 md:col-span-6">
    <img src="/hero.jpg" alt="Hero" />
  </div>
</div>
```

## TypeScript Utilities

The `lib/responsive/grid-utils.ts` file provides programmatic utilities:

### Get Current Breakpoint
```typescript
import { getCurrentBreakpoint } from '@/lib/responsive';

const breakpoint = getCurrentBreakpoint(window.innerWidth);
// Returns: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop'
```

### Get Grid Configuration
```typescript
import { getCurrentGridConfig } from '@/lib/responsive';

const config = getCurrentGridConfig();
// Returns: { columns: 12, gap: 32, breakpoint: 'desktop' }
```

### Calculate Column Width
```typescript
import { getColumnWidth } from '@/lib/responsive';

const columnWidth = getColumnWidth(1200, 'desktop');
// Returns width of a single column in pixels
```

### Generate Responsive Classes
```typescript
import { getResponsiveColumnClasses } from '@/lib/responsive';

const classes = getResponsiveColumnClasses(4, 4, 6);
// Returns: "col-span-4 sm:col-span-4 md:col-span-6"
```

### Validate Column Span
```typescript
import { isValidSpan } from '@/lib/responsive';

const isValid = isValidSpan(6, 'mobile'); // false (mobile only has 4 columns)
const isValid = isValidSpan(6, 'desktop'); // true (desktop has 12 columns)
```

## Breakpoint Reference

| Breakpoint | Min Width | Max Width | Columns | Gap |
|------------|-----------|-----------|---------|-----|
| Mobile | 0px | 639px | 4 | 16px |
| Tablet | 640px | 767px | 8 | 24px |
| Desktop | 768px | 1023px | 12 | 32px |
| Large Desktop | 1024px | ∞ | 12 | 32px |

## Best Practices

1. **Mobile-First**: Always define mobile layout first, then add responsive modifiers
2. **Semantic Spans**: Use column spans that make sense (e.g., 4, 6, 8, 12 for desktop)
3. **Consistent Gaps**: Use the responsive gap classes to maintain consistency
4. **Full Width on Mobile**: Most content should span all 4 columns on mobile
5. **Test Breakpoints**: Always test layouts at each breakpoint transition

## Container Integration

The grid system works seamlessly with the container system:

```tsx
<div className="container mx-auto">
  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
    {/* Grid content */}
  </div>
</div>
```

The container provides:
- Centered content with `mx-auto`
- Maximum widths: 720px (tablet), 960px (desktop), 1200px (large desktop)
- Horizontal padding: 16px (mobile), 24px (tablet), 32px (desktop)

## Accessibility Considerations

- Grid layouts maintain logical reading order
- Column spans don't break semantic HTML structure
- Touch targets remain accessible (minimum 44x44px)
- Content reflows naturally at each breakpoint

## Performance

- CSS Grid is hardware-accelerated
- No JavaScript required for basic layouts
- Minimal CSS output (utility classes are purged in production)
- No layout shift during breakpoint transitions
