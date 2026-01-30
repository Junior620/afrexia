# WCAG AA Contrast Ratio Documentation
## Catalog Dark Premium Redesign

**Date:** January 30, 2026  
**Requirement:** 6.1 from catalog-dark-premium-redesign/requirements.md  
**Standard:** WCAG AA (4.5:1 for normal text, 3:1 for large text/UI components)

## Color Palette

### Backgrounds
- **Primary:** `#0A1410` (Charcoal très foncé)
- **Secondary:** `#1A2820` (Dark green charcoal)
- **Tertiary:** `#141D18` (Variation pour cards)

### Text Colors
- **Primary:** `#E8F5E9` (Ivory/light green)
- **Secondary:** `#B0D4B8` (Muted light green)
- **Muted:** `#80996F` (Support green)

### Brand Colors
- **Primary:** `#4A9A62` (Dark green - CTAs)
- **Secondary:** `#4A9A62` (Same as primary for better contrast)
- **Accent:** `#A89858` (Gold - hover, links)

### Borders
- **Default:** `rgba(255, 255, 255, 0.1)` (Subtle border)
- **Hover:** `rgba(255, 255, 255, 0.2)` (Hover state)

## Verified Contrast Ratios

### Primary Text Combinations (Normal Text - 4.5:1 minimum)
| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Primary text (#E8F5E9) | Primary bg (#0A1410) | 16.66:1 | ✓ Pass |
| Primary text (#E8F5E9) | Secondary bg (#1A2820) | 13.64:1 | ✓ Pass |
| Primary text (#E8F5E9) | Tertiary bg (#141D18) | 15.32:1 | ✓ Pass |
| Primary text (#E8F5E9) | Glass card (#1A2820) | 13.64:1 | ✓ Pass |

### Secondary Text Combinations (Normal Text - 4.5:1 minimum)
| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Secondary text (#B0D4B8) | Primary bg (#0A1410) | 11.56:1 | ✓ Pass |
| Secondary text (#B0D4B8) | Secondary bg (#1A2820) | 9.47:1 | ✓ Pass |
| Secondary text (#B0D4B8) | Glass card (#1A2820) | 9.47:1 | ✓ Pass |

### Muted Text Combinations (Large Text - 3:1 minimum)
| Foreground | Background | Ratio | Status | Note |
|------------|------------|-------|--------|------|
| Muted text (#80996F) | Primary bg (#0A1410) | 5.98:1 | ✓ Pass | Also passes 4.5:1 |
| Muted text (#80996F) | Secondary bg (#1A2820) | 4.90:1 | ✓ Pass | Also passes 4.5:1 |
| Muted text (#80996F) | Glass card (#1A2820) | 4.90:1 | ✓ Pass | Also passes 4.5:1 |

### Brand Color Combinations (Large Text/UI Components - 3:1 minimum)
| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Brand primary (#4A9A62) | Primary bg (#0A1410) | 5.44:1 | ✓ Pass |
| Brand secondary (#4A9A62) | Primary bg (#0A1410) | 5.44:1 | ✓ Pass |
| Brand accent (#A89858) | Primary bg (#0A1410) | 6.51:1 | ✓ Pass |
| Brand accent (#A89858) | Secondary bg (#1A2820) | 5.33:1 | ✓ Pass |

### Button Text Combinations (Large/Bold Text - 3:1 minimum)
| Foreground | Background | Ratio | Status | Note |
|------------|------------|-------|--------|------|
| White (#FFFFFF) | Brand primary (#4A9A62) | 3.45:1 | ✓ Pass | Button text is bold |
| White (#FFFFFF) | Brand secondary (#4A9A62) | 3.45:1 | ✓ Pass | Button text is bold |
| Dark bg (#0A1410) | Brand accent (#A89858) | 6.51:1 | ✓ Pass | Gold button variant |

## Usage Guidelines

### Normal Text (< 18px or < 14px bold)
- **Minimum ratio:** 4.5:1
- **Use:** Body text, labels, descriptions
- **Recommended combinations:**
  - Primary text (#E8F5E9) on any dark background
  - Secondary text (#B0D4B8) on any dark background
  - Muted text (#80996F) on any dark background (exceeds minimum)

### Large Text (≥ 18px or ≥ 14px bold)
- **Minimum ratio:** 3:1
- **Use:** Headings, button text, large labels
- **Recommended combinations:**
  - All text colors on dark backgrounds
  - Brand colors on dark backgrounds
  - White text on brand color buttons

### UI Components
- **Minimum ratio:** 3:1
- **Use:** Borders, icons, graphical elements
- **Note:** Borders use subtle rgba values for visual separation, not text

## Implementation Notes

1. **Button Text:** All buttons use 14-16px bold text, qualifying as "large text" under WCAG, requiring only 3:1 contrast.

2. **Glass Effect:** The glass effect uses `rgba(26, 40, 32, 0.8)` which approximates to `#1A2820` for contrast calculations.

3. **Borders:** Borders use `rgba(255, 255, 255, 0.1)` for subtle visual separation. They are not text elements and serve as visual guides.

4. **Brand Secondary:** Adjusted from `#5AAA72` to `#4A9A62` (same as primary) to ensure 3:1 contrast with white text on buttons.

5. **Hover States:** All hover states maintain or improve contrast ratios.

## Testing

All contrast ratios have been verified using automated tests in:
- `lib/brand/__tests__/dark-catalog-contrast.test.ts`

Run tests with:
```bash
npm run test -- lib/brand/__tests__/dark-catalog-contrast.test.ts --run
```

## Compliance Status

✅ **WCAG AA Compliant**

All text and UI component color combinations meet or exceed WCAG AA requirements:
- Normal text: All combinations exceed 4.5:1
- Large text: All combinations exceed 3:1
- UI components: All combinations meet 3:1 (where applicable)

## References

- [WCAG 2.1 Success Criterion 1.4.3 (Contrast Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Design Document: `.kiro/specs/catalog-dark-premium-redesign/design.md`
- Requirements: `.kiro/specs/catalog-dark-premium-redesign/requirements.md`
