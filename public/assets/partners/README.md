# SCPB Partner Section Images

This directory contains image assets for the SCPB Partner Section component.

## Image Assets

### Primary Image: `scpb-quality-control.jpg`
- **Dimensions**: 1536x2048px (3:4 aspect ratio)
- **Format**: JPEG (automatically converted to WebP by Next.js)
- **Size**: ~645KB
- **Usage**: Main hero image in PhotoStack component
- **Alt Text (FR)**: "Contrôle qualité SCPB - inspection des fèves de cacao"
- **Alt Text (EN)**: "SCPB quality control - cocoa bean inspection"
- **Loading**: Priority (loads immediately)
- **Content**: Quality control scene showing cocoa bean inspection

### Overlay Image: `scpb-warehouse.jpg`
- **Dimensions**: 600x800px (3:4 aspect ratio)
- **Format**: JPEG (automatically converted to WebP by Next.js)
- **Size**: ~145KB
- **Usage**: Overlay image in PhotoStack component (positioned bottom-right with rotation)
- **Alt Text (FR)**: "Infrastructure de stockage SCPB"
- **Alt Text (EN)**: "SCPB storage infrastructure"
- **Loading**: Lazy (loads when near viewport)
- **Content**: Warehouse/storage infrastructure

## Image Optimization

### Next.js Automatic Optimization

All images are processed through Next.js's built-in Image Optimization API, which provides:

1. **Format Conversion**: Automatically serves WebP format to browsers that support it, with JPEG fallback for older browsers
2. **Quality Optimization**: Images are optimized to quality 75 by default (configurable in next.config.ts)
3. **Responsive Sizing**: Images are resized based on the `sizes` attribute and device pixel ratio
4. **Lazy Loading**: Overlay image uses lazy loading to improve initial page load performance
5. **Blur Placeholder**: Both images include blur placeholders for better perceived performance

### Responsive Sizes Configuration

- **Primary Image**: `(max-width: 768px) 100vw, 60vw`
  - Mobile: Full viewport width
  - Desktop: 60% of viewport width (left column in 60/40 layout)

- **Overlay Image**: `(max-width: 768px) 50vw, 30vw`
  - Mobile: 50% of viewport width
  - Desktop: 30% of viewport width (45% of primary image width)

### Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **Image Load Time**: < 1s with lazy loading
- **CLS (Cumulative Layout Shift)**: < 0.1 (maintained with aspect ratio containers)

## Requirements Validation

This image setup validates the following requirements:

- **Requirement 8.1**: Uses next/image component for all images ✓
- **Requirement 8.2**: Implements lazy loading for overlay image ✓
- **Requirement 8.3**: Includes blur placeholder during loading ✓
- **Requirement 8.4**: Uses responsive sizes based on viewport ✓
- **Requirement 8.5**: Includes appropriate alt text for accessibility ✓

## Image Specifications (Design Requirements)

According to the design document, the ideal specifications are:

- **Primary Image**: 800x1000px (4:5 aspect ratio), WebP format, quality 85
- **Overlay Image**: 400x300px (4:3 aspect ratio), WebP format, quality 85

**Current Implementation**: The source images are larger than specified (1536x2048px and 600x800px), which is acceptable as Next.js will automatically resize them to appropriate dimensions based on the viewport and device pixel ratio. The WebP conversion happens automatically at serve time.

## Future Optimization Opportunities

If further optimization is needed:

1. **Source Image Resizing**: Resize source images to closer to target dimensions (800x1000px and 400x300px) to reduce storage and initial processing
2. **Manual WebP Conversion**: Pre-convert images to WebP format to reduce first-request processing time
3. **Quality Adjustment**: Adjust quality setting in next.config.ts if needed (currently default 75)
4. **CDN Caching**: Ensure Vercel's CDN is properly caching optimized images

## Content Configuration

Image paths and alt text are configured in:
- `lib/content/partner-section.ts`

The content file includes both French and English alt text for internationalization support.
