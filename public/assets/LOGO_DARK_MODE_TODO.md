# Dark Mode Logo - Action Required

## Current Status
A temporary placeholder file `logo-dark.png` has been created by copying the original logo. This is **NOT** the final solution.

## Required Action
The design team needs to create a proper light-colored logo variant optimized for dark backgrounds.

### Specifications
- **File name**: `logo-dark.png`
- **Dimensions**: 1600 x 1600 pixels (matching original logo)
- **Format**: PNG with transparency (RGBA)
- **Color scheme**: Light colors suitable for dark backgrounds
  - Consider using light green (#B0D4B8 or #E8F5E9) for the main logo
  - Ensure sufficient contrast against dark background (#0A1410)
  - Maintain brand identity while adapting for dark mode

### Design Guidelines
1. The logo should be clearly visible on dark backgrounds
2. Maintain the same dimensions as the original logo (1600x1600)
3. Use colors from the dark mode palette (see design.md)
4. Test contrast ratio to ensure WCAG AA compliance (3:1 minimum for logos)

### Temporary Fallback
Until the proper logo is created, the system uses:
1. The copied logo file as a placeholder
2. CSS filter fallback (brightness/invert) if the dark logo fails to load
3. Error handling to gracefully fall back to the standard logo

### How to Replace
1. Create the light-colored logo variant in your design tool
2. Export as PNG with transparency at 1600x1600 pixels
3. Replace `public/assets/logo-dark.png` with the new file
4. Test in dark mode to verify visibility and contrast
5. Delete this TODO file once complete
