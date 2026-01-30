# TrustStripDark Component

A dark premium themed trust indicator strip for the B2B catalog redesign. Displays credibility indicators with icons and labels in a horizontal layout.

## Features

- **Dark Premium Theme**: Matches the catalog dark green/charcoal + gold aesthetic
- **Responsive Layout**: Adapts from desktop (32px gap) to mobile (16px gap)
- **Hover Tooltips**: Glass effect tooltips with backdrop blur on hover
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Two Variants**: Compact and detailed display modes
- **Default Items**: Pre-configured trust items for B2B catalog

## Visual Specifications

- **Icon Size**: 24x24px
- **Icon Color**: #4A9A62 (dark green)
- **Label Size**: 14px
- **Label Color**: #B0D4B8 (muted light green)
- **Gap**: 32px desktop, 16px mobile
- **Tooltip**: Glass effect with backdrop blur

## Usage

### Basic Usage

```tsx
import { TrustStripDark, TrustIconsDark, getDefaultTrustItemsDark } from '@/components/catalog';

// Using default trust items
const translations = {
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
};

const items = getDefaultTrustItemsDark(translations);

<TrustStripDark items={items} />
```

### Custom Items

```tsx
import { TrustStripDark, TrustIconsDark } from '@/components/catalog';

const customItems = [
  {
    icon: <TrustIconsDark.Clock />,
    label: '24h',
    tooltip: 'Réponse sous 24 heures',
  },
  {
    icon: <TrustIconsDark.Shield />,
    label: 'NDA',
    tooltip: 'NDA disponible',
  },
];

<TrustStripDark items={customItems} />
```

### Variants

```tsx
// Compact variant (default)
<TrustStripDark items={items} variant="compact" />

// Detailed variant
<TrustStripDark items={items} variant="detailed" />
```

### Custom Styling

```tsx
<TrustStripDark 
  items={items} 
  className="border-t border-[rgba(255,255,255,0.1)] pt-6"
/>
```

## Props

### TrustStripDarkProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TrustItem[]` | required | Array of trust items to display |
| `variant` | `'compact' \| 'detailed'` | `'compact'` | Display variant |
| `className` | `string` | `undefined` | Additional CSS classes |

### TrustItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `icon` | `React.ReactNode` | Yes | Icon component to display |
| `label` | `string` | Yes | Label text |
| `tooltip` | `string` | No | Tooltip text on hover |

## Available Icons

The `TrustIconsDark` object provides 5 pre-built SVG icons:

- **Clock**: 24h response time
- **Shield**: NDA available
- **Leaf**: EUDR compliance
- **CheckCircle**: QA documented
- **FileText**: COA & spec sheets

All icons are 24x24px and use `currentColor` for easy theming.

## Default Trust Items

The `getDefaultTrustItemsDark` helper function creates the standard 5 trust items:

1. **24h** - Response time
2. **NDA** - Non-disclosure agreement
3. **EUDR** - EU Deforestation Regulation compliance
4. **QA** - Quality assurance documentation
5. **COA** - Certificate of Analysis

### Translation Object

```typescript
{
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
}
```

If tooltip translations are not provided, the label will be used as the tooltip.

## Examples

See `TrustStripDark.example.tsx` for complete usage examples including:

- Default trust items (FR/EN)
- Compact and detailed variants
- Custom styling
- Header context integration
- Mobile responsive layouts

## Accessibility

- Uses semantic HTML with `role="list"` and `role="listitem"`
- Provides `aria-label="Trust indicators"` for screen readers
- Icons have `aria-hidden="true"` to avoid duplication
- Tooltips use `role="tooltip"`
- Keyboard accessible (hover states work with focus)

## Requirements

Implements requirements:
- **2.5**: Trust indicators in header
- **6.7**: Accessibility compliance

## Related Components

- `TrustStrip` - Light theme version
- `CatalogHeaderDark` - Uses TrustStripDark
- `TrustIconsDark` - Icon library

## Browser Support

Works in all modern browsers with CSS backdrop-filter support. Gracefully degrades in older browsers.
