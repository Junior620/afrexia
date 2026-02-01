# Animation Optimization Guide

## Overview

This document explains the animation optimization strategy for the responsive navigation system, ensuring all animations maintain 60fps performance.

## Requirements

- **Requirement 18.1**: Animations should only use `transform` and `opacity` properties
- **Requirement 18.6**: Animations should maintain 60fps during execution

## Performant Animation Properties

### ✅ Use These Properties (Composite-Only)

These properties only trigger the **composite** step in the browser rendering pipeline, making them extremely performant:

- **`transform`**: translate, scale, rotate, skew
- **`opacity`**: transparency changes

### ❌ Avoid These Properties (Layout/Paint)

These properties trigger **layout recalculation** or **paint operations**, causing performance issues:

- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border`
- `background`, `color`
- `font-size`

## Current Implementation

### Mobile Menu Animation

The mobile menu uses only `transform` for the slide-in animation:

```tsx
// MobileNav.tsx
<nav
  className={`transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>
```

**Performance**: ✅ Only animates `transform` property

### Keyframe Animations

All keyframe animations in `app/globals.css` use only performant properties:

#### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```
**Properties**: `transform` ✅

#### Slide Up Animation
```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```
**Properties**: `transform`, `opacity` ✅

#### Fade In Animation
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```
**Properties**: `opacity` ✅

#### Slide In Animations
```css
@keyframes slide-in-from-left {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```
**Properties**: `transform`, `opacity` ✅

#### Scale In Animation
```css
@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```
**Properties**: `transform`, `opacity` ✅

#### Skeleton Pulse Animation
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```
**Properties**: `opacity` ✅

## Performance Monitoring

### Using AnimationPerformanceMonitor

Monitor animation frame rates to ensure 60fps:

```typescript
import { AnimationPerformanceMonitor } from '@/lib/navigation';

const monitor = new AnimationPerformanceMonitor();

// Start monitoring
monitor.startMonitoring();

// Perform animation
await performAnimation();

// Stop and get results
const results = monitor.stopMonitoring();

console.log('Average FPS:', results.averageFps);
console.log('Dropped frames:', results.droppedFrames);
```

### Validating Animation Properties

Check if an element's animations use performant properties:

```typescript
import { validateAnimationProperties } from '@/lib/navigation';

const element = document.getElementById('mobile-menu');
const validation = validateAnimationProperties(element);

if (!validation.isValid) {
  console.warn('Non-performant properties:', validation.nonPerformantProperties);
}
```

## Best Practices

### 1. Use will-change Hint

Apply `will-change` before animations to optimize browser rendering:

```typescript
import { applyWillChange, removeWillChange } from '@/lib/navigation';

const element = document.getElementById('menu');

// Before animation
applyWillChange(element, ['transform', 'opacity']);

// Perform animation
await animate(element);

// After animation
removeWillChange(element);
```

### 2. Respect prefers-reduced-motion

Always check user motion preferences:

```typescript
import { prefersReducedMotion, getSafeAnimationDuration } from '@/lib/navigation';

const duration = getSafeAnimationDuration(300); // Returns 0 if reduced motion preferred
```

### 3. Use Hardware Acceleration

Trigger GPU acceleration with `transform: translateZ(0)` or `will-change`:

```css
.animated-element {
  transform: translateZ(0); /* Force GPU acceleration */
  will-change: transform, opacity;
}
```

### 4. Avoid Layout Thrashing

Batch DOM reads and writes:

```typescript
// ❌ Bad: Interleaved reads and writes
element1.style.transform = 'translateX(100px)';
const height1 = element1.offsetHeight; // Forces layout
element2.style.transform = 'translateX(200px)';
const height2 = element2.offsetHeight; // Forces layout again

// ✅ Good: Batch reads, then batch writes
const height1 = element1.offsetHeight;
const height2 = element2.offsetHeight;
element1.style.transform = 'translateX(100px)';
element2.style.transform = 'translateX(200px)';
```

## Animation Durations

Standard durations for consistent UX:

- **Mobile menu**: 300ms
- **Fade in**: 500ms
- **Slide in**: 300ms
- **Scale in**: 300ms
- **Hover transitions**: 200-300ms

## Testing

### Manual Testing

1. Open Chrome DevTools
2. Go to Performance tab
3. Start recording
4. Trigger animation
5. Stop recording
6. Check FPS graph (should stay at 60fps)

### Automated Testing

Use the performance monitor in tests:

```typescript
import { measureAnimationPerformance } from '@/lib/navigation';

test('mobile menu animation maintains 60fps', async () => {
  const metrics = await measureAnimationPerformance(
    async () => {
      // Trigger menu animation
      await openMobileMenu();
    },
    300 // Animation duration
  );

  expect(metrics.averageFps).toBeGreaterThanOrEqual(55); // Allow small variance
  expect(metrics.droppedFrames).toBeLessThan(5);
});
```

## Browser Rendering Pipeline

Understanding the rendering pipeline helps optimize animations:

1. **JavaScript**: Execute JS that changes styles
2. **Style**: Calculate computed styles
3. **Layout**: Calculate element positions and sizes
4. **Paint**: Fill in pixels (text, colors, images)
5. **Composite**: Draw layers in correct order

### Property Impact

- **`transform`, `opacity`**: Only trigger **Composite** (fastest)
- **`color`, `background`**: Trigger **Paint** + **Composite** (slower)
- **`width`, `height`, `margin`**: Trigger **Layout** + **Paint** + **Composite** (slowest)

## Resources

- [CSS Triggers](https://csstriggers.com/) - See which properties trigger layout/paint
- [High Performance Animations](https://web.dev/animations-guide/)
- [Rendering Performance](https://web.dev/rendering-performance/)

## Validation Checklist

- [ ] All animations use only `transform` and `opacity`
- [ ] Mobile menu animation completes in 300ms
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No layout thrashing during animations
- [ ] `will-change` applied before animations
- [ ] `will-change` removed after animations
- [ ] Frame rate stays at 60fps during animations
- [ ] No dropped frames during critical animations
