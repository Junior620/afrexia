# Responsive Typography System

## Overview

This document describes the responsive typography system implemented for the Afrexia B2B showcase website. The system provides fluid, accessible typography that scales smoothly across all device sizes while maintaining hierarchy and readability.

## Requirements

Implements requirements from `.kiro/specs/responsive-intelligent-navigation/requirements.md`:
- **2.1**: Scale base font size from 14px (mobile) to 16px (desktop)
- **2.2**: Scale heading sizes proportionally maintaining hierarchy
- **2.3**: Enforce minimum line-height of 1.5 for body text and 1.2 for headings
- **2.5**: Ensure no informational text is smaller than 14px at default zoom
- **2.6**: Adjust letter-spacing for headings from -0.02em (mobile) to -0.03em (desktop)
- **2.7**: Implement font loading strategy that prevents FOIT and minimizes CLS

## Typography Scale

### Base Font Size

The base font size uses CSS `clamp()` for fluid scaling:

```css
font-size: clamp(0.875rem, 0.8rem + 0.3125vw, 1rem);
/* 14px at 320px viewport -> 16px at 1920px viewport */
```

**Tailwind classes:**
- `text-base` - Fluid base font size (14px → 16px)
- `text-base-mobile` - Fixed 14px
- `text-base-desktop` - Fixed 16px
- `text-fluid-base` - Utility class for fluid base sizing

### Heading Hierarchy

All headings use `clamp()` for smooth scaling and maintain strict hierarchy:

| Heading | Mobile | Desktop | Tailwind Class | Utility Class |
|---------|--------|---------|----------------|---------------|
| h1 | 32px | 48px | `text-h1` | `text-fluid-h1` |
| h2 | 24px | 36px | `text-h2` | `text-fluid-h2` |
| h3 | 20px | 28px | `text-h3` | `text-fluid-h3` |
| h4 | 18px | 24px | `text-h4` | `text-fluid-h4` |
| h5 | 16px | 20px | `text-h5` | `text-fluid-h5` |
| h6 | 14px | 16px | `text-h6` | `text-fluid-h6` |

**Properties:**
- Line height: `1.2` for all headings
- Letter spacing: `-0.02em` (mobile) → `-0.03em` (desktop)
- Font weight: `700` (h1, h2), `600` (h3-h6)

### Implementation

#### HTML Elements

All HTML heading elements automatically receive fluid typography:

```tsx
<h1>This heading scales from 32px to 48px</h1>
<h2>This heading scales from 24px to 36px</h2>
<p>Body text scales from 14px to 16px</p>
```

#### Tailwind Classes

Use Tailwind classes for explicit control:

```tsx
<div className="text-h1">Large heading</div>
<div className="text-h3">Medium heading</div>
<div className="text-base">Body text</div>
```

#### Utility Classes

Use utility classes for custom elements:

```tsx
<div className="text-fluid-h2">Custom heading</div>
<span className="text-fluid-base">Custom body text</span>
```

## Line Heights

### Body Text
- Line height: `1.5`
- Applied to: `<p>`, `<li>`, `<td>`, `<th>`, and base text
- Tailwind class: `leading-body`

### Headings
- Line height: `1.2`
- Applied to: `<h1>` through `<h6>`
- Tailwind class: `leading-heading`

## Letter Spacing

Headings use tighter letter spacing that adjusts with viewport:

- Mobile: `-0.02em`
- Desktop: `-0.03em`
- Fluid: `clamp(-0.03em, -0.025em, -0.02em)`

**Tailwind classes:**
- `tracking-heading-mobile` - Fixed mobile spacing
- `tracking-heading-desktop` - Fixed desktop spacing
- `tracking-heading-fluid` - Fluid spacing (recommended)

## Minimum Text Size

All text enforces a minimum size of 14px to ensure readability:

```css
font-size: max(0.875rem, 14px);
```

**Tailwind classes:**
- `text-sm` - Small text with 14px minimum
- `text-xs` - Extra small text with 14px minimum
- `text-min-14` - Utility class for 14px minimum

## Font Loading Strategy

### Font Display: Swap

All `@font-face` declarations use `font-display: swap`:

```css
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Prevents FOIT, minimizes CLS */
}
```

**Benefits:**
- **Prevents FOIT**: Text is immediately visible using fallback font
- **Minimizes CLS**: Font swap happens quickly without layout shift
- **Better UX**: Users can read content immediately while custom font loads

### Fallback Fonts

The font stack provides robust fallbacks:

```css
font-family: 'Satoshi', system-ui, sans-serif;
```

1. **Satoshi**: Custom brand font
2. **system-ui**: Native system font (fast, no download)
3. **sans-serif**: Generic fallback

## Accessibility

### Zoom Support

The typography system respects user zoom settings:
- Uses relative units (`rem`, `em`) where appropriate
- Never prevents browser zoom functionality
- Maintains readability at 200% zoom (WCAG requirement)

### Minimum Sizes

All text meets WCAG minimum size requirements:
- Body text: ≥14px at default zoom
- Small text: ≥14px enforced with `max()`
- Headings: Scale proportionally, always readable

### Contrast

Typography works with the color system to ensure:
- Normal text: 4.5:1 contrast ratio minimum
- Large text (≥18px or ≥14px bold): 3:1 contrast ratio minimum

### Reduced Motion

Typography respects `prefers-reduced-motion`:
- No animated text effects
- Instant font swaps if motion is reduced
- Smooth transitions disabled

## Usage Examples

### Basic Page Structure

```tsx
export default function Page() {
  return (
    <div className="container">
      <h1>Main Page Heading</h1>
      <p className="text-base">
        Body text that scales from 14px to 16px.
      </p>
      
      <h2>Section Heading</h2>
      <p className="leading-body">
        More body text with explicit line height.
      </p>
      
      <h3>Subsection</h3>
      <small className="text-sm">
        Small text with 14px minimum.
      </small>
    </div>
  );
}
```

### Custom Typography

```tsx
export default function CustomComponent() {
  return (
    <div>
      {/* Use fluid typography classes */}
      <div className="text-fluid-h2 tracking-heading-fluid">
        Custom Heading
      </div>
      
      {/* Enforce minimum size */}
      <span className="text-min-14">
        Always at least 14px
      </span>
      
      {/* Explicit line heights */}
      <p className="leading-body">
        Body text with 1.5 line height
      </p>
    </div>
  );
}
```

### Responsive Typography

```tsx
export default function ResponsiveText() {
  return (
    <div>
      {/* Fluid scaling (recommended) */}
      <h1 className="text-h1">
        Scales smoothly from 32px to 48px
      </h1>
      
      {/* Breakpoint-based (legacy) */}
      <h2 className="text-h2-mobile lg:text-h2-desktop">
        24px on mobile, 36px on desktop
      </h2>
      
      {/* Mixed approach */}
      <p className="text-base-mobile lg:text-base-desktop">
        14px on mobile, 16px on desktop
      </p>
    </div>
  );
}
```

## Testing

### Visual Testing

Test typography at these viewport widths:
- 320px (small mobile)
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1920px (large desktop)

### Accessibility Testing

1. **Zoom Test**: Verify readability at 200% zoom
2. **Contrast Test**: Check all text meets WCAG AA standards
3. **Screen Reader Test**: Ensure heading hierarchy is logical
4. **Font Loading Test**: Verify no FOIT, minimal CLS

### Browser Testing

Test font loading and scaling in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (14+)
- Chrome Mobile (90+)

## Performance

### Font Loading

- All fonts use `font-display: swap`
- WOFF format for broad browser support
- Fonts are preloaded in critical path
- Fallback fonts prevent layout shift

### CLS Prevention

To minimize Cumulative Layout Shift:
1. Font metrics match fallback fonts closely
2. `font-display: swap` ensures quick swap
3. No font-size changes after load
4. Consistent line heights prevent reflow

## Migration Guide

### From Fixed Sizes

**Before:**
```tsx
<h1 className="text-4xl">Heading</h1>
```

**After:**
```tsx
<h1 className="text-h1">Heading</h1>
{/* or */}
<h1>Heading</h1> {/* Uses default h1 styles */}
```

### From Breakpoint Classes

**Before:**
```tsx
<h2 className="text-2xl md:text-3xl lg:text-4xl">
  Heading
</h2>
```

**After:**
```tsx
<h2 className="text-h2">Heading</h2>
{/* or */}
<h2>Heading</h2> {/* Scales automatically */}
```

### From Custom Sizes

**Before:**
```tsx
<div className="text-lg">Custom text</div>
```

**After:**
```tsx
<div className="text-fluid-base">Custom text</div>
{/* or use semantic heading classes */}
<div className="text-h4">Custom text</div>
```

## Troubleshooting

### Text Too Small on Mobile

**Problem**: Text appears smaller than 14px
**Solution**: Use `text-min-14` class or check for overriding styles

### Headings Not Scaling

**Problem**: Headings stay same size across viewports
**Solution**: Ensure using `text-h*` classes or default `<h*>` elements

### Font Not Loading

**Problem**: Fallback font persists
**Solution**: Check font file paths, verify WOFF files exist, check network tab

### Layout Shift on Font Load

**Problem**: Content jumps when custom font loads
**Solution**: Verify `font-display: swap` is set, check fallback font metrics

## References

- Design Document: `.kiro/specs/responsive-intelligent-navigation/design.md`
- Requirements: `.kiro/specs/responsive-intelligent-navigation/requirements.md`
- Tailwind Config: `tailwind.config.ts`
- Global Styles: `app/globals.css`
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
