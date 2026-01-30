# ProductCardV4 - QA Checklist

## ✅ Visual Design

### Layout & Structure
- [ ] Card container: `rounded-[24px]`, border `rgba(255,255,255,0.08)`
- [ ] Media section: aspect ratio `16:10` (not 4:3)
- [ ] Terrain vignette: 56-72px mobile, 72-92px desktop
- [ ] Vignette position: bottom-left, overlaps content by 12px
- [ ] Vignette style: `rounded-[16px]`, border `rgba(255,255,255,0.12)`

### Editorial Gradient Overlay
- [ ] Top 15%: light gradient (`from-black/15`)
- [ ] Bottom 55-65%: dense gradient (`to-black/65`)
- [ ] Product name visible and readable over gradient
- [ ] Optional film grain overlay present but subtle (opacity 0.03)

### Typography - Editorial Style
- [ ] Category label: 11-12px, uppercase, tracking-wide, opacity 70%
- [ ] Product name: 22-32px (responsive), font-semibold, line-height tight
- [ ] Subtitle: 14-15px, opacity 80%
- [ ] Description: max 2 lines with `line-clamp-2`
- [ ] Specs labels: 10-11px uppercase, opacity 65%
- [ ] Specs values: 13-14px

### Labels & Badges - Subtle Style
- [ ] EUDR badge: `bg-[rgba(255,255,255,0.06)]`, no flashy green
- [ ] Availability badge: subtle dot (●) + text, same subtle background
- [ ] No large colored chips or pills
- [ ] Badges positioned top-left (EUDR) and top-right (availability)

### Proofs Row
- [ ] Text-only format: "COA • Chain of Custody • QA documentée"
- [ ] No pill/badge styling
- [ ] Font size: 12-13px, opacity 75%
- [ ] Separator: bullet (•) between items

### Specs Grid
- [ ] 2-column layout
- [ ] 3-4 items max: Origin, MOQ, Incoterms, Packaging
- [ ] No redundant FOB/CIF display
- [ ] Truncate long values with `truncate` class

### CTAs
- [ ] Primary button: full width, "Demander un devis" + chevron
- [ ] Secondary button: outline style, "Télécharger fiche technique (PDF)"
- [ ] Microproof text: "Réponse sous 24h • NDA possible"
- [ ] Min height 44px (primary), 42px (secondary) for touch targets

---

## ✅ Fallback States

### No Product Image
- [ ] Premium gradient: `from-[#1A2820] via-[#0F1814] to-[#0A1410]`
- [ ] Jute texture overlay present (opacity 12%)
- [ ] Watermark category icon: centered, large, opacity 8-10%
- [ ] Vignette for depth: radial gradient
- [ ] Same editorial gradient overlay applied

### No Terrain Image
- [ ] Vignette shows jute texture + map pin icon
- [ ] Icon: opacity 40%, color `#4A9A62`
- [ ] Background: same dark gradient as main fallback

### Missing Data
- [ ] Origin fallback: "Multi-origine"
- [ ] Packaging fallback: "Sur demande"
- [ ] Subtitle fallback: "Qualité Premium" (optional)

---

## ✅ Responsive Behavior

### Mobile (< 640px)
- [ ] Vignette: 56-72px
- [ ] Product name: 22-26px
- [ ] Category label: 11px
- [ ] Subtitle: 14px
- [ ] Specs grid: 2 columns maintained
- [ ] Touch targets: min 44px height

### Tablet (640px - 1024px)
- [ ] Vignette: 72px
- [ ] Product name: 28px
- [ ] All spacing scales appropriately

### Desktop (> 1024px)
- [ ] Vignette: 84-92px
- [ ] Product name: 32px
- [ ] Hover states fully functional

---

## ✅ Hover States (Desktop)

### Image
- [ ] Scale: `1.03` (not 1.05, subtle)
- [ ] Transition: 500ms duration

### Card Container
- [ ] Translate Y: `-1` (lift effect)
- [ ] Shadow: increases from `0_4px_24px` to `0_8px_32px`
- [ ] Border: changes from `rgba(255,255,255,0.08)` to `0.12`
- [ ] Background: slightly more opaque

### Terrain Vignette
- [ ] Translate Y: `-0.5` (lift effect)
- [ ] Shadow: increases (`shadow-lg`)

---

## ✅ Accessibility (A11y)

### Color Contrast
- [ ] Product name on gradient: WCAG AA compliant (white on dark)
- [ ] Category label: contrast ratio ≥ 4.5:1
- [ ] Specs labels: contrast ratio ≥ 4.5:1
- [ ] Button text: contrast ratio ≥ 4.5:1
- [ ] Microproof text: contrast ratio ≥ 3:1 (large text exception)

### Keyboard Navigation
- [ ] Card has `focus-within` outline
- [ ] Primary button: focus ring visible
- [ ] Secondary button: focus ring visible
- [ ] Tab order: logical (buttons in order)

### Screen Readers
- [ ] Image alt text: descriptive (`product.name`)
- [ ] Terrain vignette alt: includes "Terrain" label
- [ ] Buttons: clear action labels
- [ ] ARIA labels: not needed (semantic HTML sufficient)

### Touch Targets
- [ ] Primary button: min 44px height ✓
- [ ] Secondary button: min 42px height ✓
- [ ] Adequate spacing between buttons (10px gap)

---

## ✅ Performance

### Images
- [ ] Next.js Image component used
- [ ] Lazy loading: `loading="lazy"`
- [ ] Quality: 85 (balance quality/size)
- [ ] Sizes attribute: responsive breakpoints defined
- [ ] Terrain vignette: sizes="92px" (small)

### Animations
- [ ] Transitions: CSS only (no JS)
- [ ] Duration: 300-500ms (not too slow)
- [ ] Easing: `ease-out` for natural feel
- [ ] No layout shift on hover

### Bundle Size
- [ ] No heavy dependencies
- [ ] SVG icons inlined (no icon library)
- [ ] Tailwind classes: purged in production

---

## ✅ Browser Compatibility

### Modern Browsers
- [ ] Chrome/Edge: all features work
- [ ] Firefox: all features work
- [ ] Safari: all features work (backdrop-blur supported)

### Fallbacks
- [ ] Backdrop blur: graceful degradation if not supported
- [ ] Gradient overlays: work in all browsers
- [ ] Border radius: works in all browsers

---

## ✅ Content Edge Cases

### Long Product Names
- [ ] Name wraps to 2 lines max
- [ ] Line height: tight (1.1) for editorial look
- [ ] No overflow or text cutoff

### Long Origin Names
- [ ] Truncate with ellipsis (`truncate` class)
- [ ] Title attribute shows full text on hover

### Multiple Origins
- [ ] Show first 2 origins max
- [ ] Join with comma: "Cameroun, Région Centre"

### Missing Subtitle
- [ ] Component handles gracefully (no empty space)

### Missing Description
- [ ] Component handles gracefully (no empty space)

### No Documents
- [ ] Proofs row shows fallback: "QA documentée" only
- [ ] No broken layout

---

## ✅ Analytics & Tracking

### Quote Click
- [ ] `trackQuoteClick` called with correct params
- [ ] Source: `'card-v4-luxury'`
- [ ] Product ID, name, category, origin included

### Spec Download Click
- [ ] `trackSpecClick` called with correct params
- [ ] Product metadata included

---

## ✅ Integration

### Props Interface
- [ ] All required props documented
- [ ] Optional props: `terrainImage`, `onDownloadSpec`
- [ ] Translations interface complete

### Type Safety
- [ ] Product type imported from `@/types/product`
- [ ] No TypeScript errors
- [ ] All props typed correctly

### Sanity Integration
- [ ] `getProductCardImageUrl` used for image URLs
- [ ] Handles missing images gracefully
- [ ] Handles placeholder.svg fallback

---

## 🧪 Manual Testing Checklist

### Visual Regression
- [ ] Compare with design mockup
- [ ] Check on real device (not just browser DevTools)
- [ ] Test in dark room (contrast visibility)

### User Flow
- [ ] Click "Demander un devis" → RFQ drawer opens
- [ ] Click "Télécharger fiche technique" → PDF downloads
- [ ] Hover card → smooth animations
- [ ] Tab through card → focus visible

### Data Variations
- [ ] Test with real product data from Sanity
- [ ] Test with missing images
- [ ] Test with missing terrain images
- [ ] Test with long product names
- [ ] Test with multiple origins
- [ ] Test with EUDR true/false
- [ ] Test with different availability states

---

## 📊 Performance Metrics

### Target Metrics
- [ ] First Contentful Paint: < 1.5s
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] Time to Interactive: < 3.5s

### Image Optimization
- [ ] WebP format served (Next.js automatic)
- [ ] Correct sizes for viewport
- [ ] No oversized images loaded

---

## 🚀 Production Readiness

### Code Quality
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] ESLint: no errors
- [ ] Prettier: formatted

### Documentation
- [ ] Component has JSDoc comment
- [ ] Props interface documented
- [ ] Example file provided
- [ ] QA checklist completed (this file)

### Deployment
- [ ] Component exported in `index.ts`
- [ ] No breaking changes to existing components
- [ ] Backward compatible with ProductCardV2

---

## ✅ Final Sign-Off

- [ ] All visual design requirements met
- [ ] All accessibility requirements met
- [ ] All performance requirements met
- [ ] All edge cases handled
- [ ] Manual testing completed
- [ ] Ready for production deployment

---

**Tested by:** _________________  
**Date:** _________________  
**Approved by:** _________________  
**Date:** _________________
