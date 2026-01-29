# Design Document: SCPB Partner Section

## Overview

The SCPB Partner Section is a premium, visually rich component that showcases SCPB SARL as a strategic partner of Afrexia. The design follows Afrexia's luxury export/editorial aesthetic with dark green/charcoal backgrounds, gold accents, and sophisticated typography. The component implements a responsive 2-column layout on desktop (60/40 split) and a stacked layout on mobile, featuring a photo stack with overlaid images, editorial content, trust indicators, and clear calls-to-action.

The design prioritizes B2B trust signals through operational proof points, scannable content structure, and professional visual hierarchy while maintaining the premium brand aesthetic established across the Afrexia website.

## Architecture

### Component Structure

```
PartnerSection (Container)
├── SectionWrapper (max-width, padding, responsive)
│   ├── DesktopLayout (2-column grid, ≥768px)
│   │   ├── PhotoStack (left column, 60%)
│   │   │   ├── PrimaryImage (large, 28px radius, shadow)
│   │   │   ├── OverlayImage (absolute, 24px radius, rotated)
│   │   │   └── ImageCaption (discrete, bottom)
│   │   └── EditorialContent (right column, 40%)
│   │       ├── Eyebrow (label)
│   │       ├── Title (H2)
│   │       ├── Subtitle (proof-oriented)
│   │       ├── BodyText (2-3 paragraphs, 90-120 words)
│   │       ├── KeyFactsList (3 bullets)
│   │       ├── StatCards (optional, 3 mini-cards)
│   │       ├── CTARow (2 buttons)
│   │       └── TrustMicrocopy (below CTAs)
│   └── MobileLayout (stacked, <768px)
│       ├── Title
│       ├── PhotoStack
│       ├── EditorialContent
│       └── CTAs (full-width)
```

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (using existing design system)
- **Image Optimization**: next/image with lazy loading, blur placeholder
- **Internationalization**: Integration with existing i18n system (FR/EN)
- **State Management**: React hooks for interactions
- **Accessibility**: Semantic HTML, ARIA attributes, keyboard navigation

### Design System Integration

The component leverages the existing Afrexia design system:

**Colors** (from tailwind.config.ts):
- Primary text: `#EDEDED` (custom, not in existing palette - will be added)
- Secondary text: `rgba(237,237,237,0.72)` (custom opacity variant)
- Gold accent: `accent.DEFAULT` (#655E2C) for primary CTAs
- Card backgrounds: `rgba(255,255,255,0.03)` with border `rgba(255,255,255,0.06)`
- Dark mode: Uses `dark-bg-primary`, `dark-text-primary`, `dark-accent`

**Typography**:
- Font family: Satoshi (existing)
- H2: 42-52px desktop / 30-34px mobile
- Body: 16-18px, line-height 1.6
- Font weights: semibold for headings, regular for body

**Spacing**:
- Section padding: 96px vertical (desktop) / 64px (mobile)
- Max width: 1200px
- Grid gap: 48px (desktop) / 32px (mobile)

**Border Radius**:
- Images: 24-28px
- Buttons: rounded-full (existing pattern)
- Cards: 16px

## Components and Interfaces

### 1. PartnerSection Component

**Purpose**: Main container component that orchestrates the partner section layout and content.

**Props Interface**:
```typescript
interface PartnerSectionProps {
  locale: Locale; // 'fr' | 'en'
  content?: PartnerContent; // Optional override for content
  className?: string; // Additional Tailwind classes
}

interface PartnerContent {
  partnerName: string;
  relationship: string;
  partnerUrl: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bodyText: string[];
  keyFacts: string[];
  stats?: StatCard[];
  primaryCTA: CTAConfig;
  secondaryCTA: CTAConfig;
  trustMicrocopy: string;
  images: ImageConfig[];
  photoCaption: string;
}

interface StatCard {
  label: string;
  value: string;
  icon?: string;
}

interface CTAConfig {
  label: string;
  href: string;
  external?: boolean;
}

interface ImageConfig {
  src: string;
  alt: string;
  priority?: boolean;
}
```

**Behavior**:
- Renders responsive layout based on viewport width
- Loads content from locale-specific content object
- Handles image optimization and lazy loading
- Manages hover/focus states for interactive elements
- Opens external links in new tabs with security attributes

### 2. PhotoStack Component

**Purpose**: Displays overlapping images with premium styling and subtle interactions.

**Props Interface**:
```typescript
interface PhotoStackProps {
  images: ImageConfig[];
  caption: string;
  className?: string;
}
```

**Styling Details**:
- Primary image: Full width/height, 28px border radius, soft shadow (`shadow-2xl`)
- Overlay image: Positioned absolute (bottom-right offset), 24px border radius, 1px border `rgba(255,255,255,0.08)`, rotation 1-2° (`rotate-1` or `rotate-2`)
- Gradient overlay: Very light (`bg-gradient-to-t from-black/10 via-transparent`)
- Caption: Absolute positioned at bottom, small text, semi-transparent background

**Interactions**:
- Hover: Scale 1.02 (`hover:scale-102`), accent border appears
- Transition: Smooth transform (`transition-transform duration-300`)

### 3. EditorialContent Component

**Purpose**: Displays structured text content with hierarchy and scannable layout.

**Props Interface**:
```typescript
interface EditorialContentProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  bodyText: string[];
  keyFacts: string[];
  className?: string;
}
```

**Typography Hierarchy**:
- Eyebrow: 12px uppercase, tracking-wide, accent color, font-semibold
- Title (H2): 42-52px desktop / 30-34px mobile, font-bold, primary text color
- Subtitle: 18-20px, font-medium, secondary text color
- Body: 16-18px, line-height 1.6, secondary text color, max 120 words
- Key facts: 16px, bullet list with custom markers (accent color dots)

### 4. StatCards Component

**Purpose**: Displays compact trust indicators with metrics (optional, data-driven).

**Props Interface**:
```typescript
interface StatCardsProps {
  stats: StatCard[];
  className?: string;
}
```

**Layout**:
- Grid: 3 columns on desktop, 1 column on mobile
- Card styling: `bg-white/[0.03]`, `border border-white/[0.06]`, 16px border radius, 16px padding
- Content: Label (small, secondary text), Value (large, bold, primary text)

### 5. CTARow Component

**Purpose**: Displays primary and secondary call-to-action buttons.

**Props Interface**:
```typescript
interface CTARowProps {
  primaryCTA: CTAConfig;
  secondaryCTA: CTAConfig;
  className?: string;
}
```

**Button Styles**:
- Primary: `bg-accent hover:bg-accent-dark`, gold color, rounded-full, px-6 py-3, font-semibold, shadow-md
- Secondary: `border-2 border-accent`, transparent background, `hover:bg-accent/10`, rounded-full
- Both: Smooth transitions, visible focus rings, min-height 44px (accessibility)

**Behavior**:
- Primary CTA: Opens partner website in new tab (`target="_blank" rel="noopener noreferrer"`)
- Secondary CTA: Internal navigation to solutions/impact section
- Keyboard accessible with visible focus states

### 6. TrustMicrocopy Component

**Purpose**: Displays trust indicators below CTAs.

**Props Interface**:
```typescript
interface TrustMicrocopyProps {
  text: string;
  className?: string;
}
```

**Styling**:
- Small text (14px), secondary color with higher opacity
- Bullet separators: `•` character with spacing
- Center-aligned on mobile, left-aligned on desktop

## Data Models

### Content Structure (JSON)

```typescript
// lib/content/partner-section.ts
export const partnerSectionContent: Record<Locale, PartnerContent> = {
  fr: {
    partnerName: 'SCPB SARL',
    relationship: 'Partenaire stratégique / filleule Afrexia',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Partenaire opérationnel',
    title: 'Afexia × SCPB SARL',
    subtitle: 'Un ancrage local solide, des standards internationaux, une exécution prête pour audit.',
    bodyText: [
      'SCPB SARL assure la collecte, le stockage et la préparation export de nos produits directement à la source. Cette présence locale garantit un contrôle qualité rigoureux et une traçabilité complète de la ferme au port.',
      'En tant que partenaire stratégique d\'Afrexia, SCPB applique les mêmes standards de qualité et de conformité, avec une documentation complète (COA, spec sheets) et une préparation EUDR-ready pour tous les envois.'
    ],
    keyFacts: [
      'Collecte, stockage & préparation export',
      'Contrôle qualité & documentation (COA / Spec sheets)',
      'Traçabilité & conformité EUDR-ready'
    ],
    stats: [
      { label: 'Réseau producteurs', value: '+2000', icon: 'users' },
      { label: 'Capacité annuelle', value: '20,000 t', icon: 'scale' },
      { label: 'Infrastructure', value: '5 sites', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Découvrir SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'Voir nos capacités d\'exécution',
      href: '/fr/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Réponse sous 24h • NDA standard • Dossiers QA sur demande',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'Contrôle qualité SCPB - inspection des fèves de cacao',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'Infrastructure de stockage SCPB',
        priority: false
      }
    ],
    photoCaption: 'Contrôle qualité & traçabilité sur site'
  },
  en: {
    partnerName: 'SCPB SARL',
    relationship: 'Strategic partner / Afrexia subsidiary',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Operational partner',
    title: 'Afexia × SCPB SARL',
    subtitle: 'Strong local presence, international standards, audit-ready execution.',
    bodyText: [
      'SCPB SARL handles collection, storage, and export preparation of our products directly at source. This local presence ensures rigorous quality control and complete traceability from farm to port.',
      'As a strategic partner of Afrexia, SCPB applies the same quality and compliance standards, with complete documentation (COA, spec sheets) and EUDR-ready preparation for all shipments.'
    ],
    keyFacts: [
      'Collection, storage & export preparation',
      'Quality control & documentation (COA / Spec sheets)',
      'Traceability & EUDR-ready compliance'
    ],
    stats: [
      { label: 'Producer network', value: '+2000', icon: 'users' },
      { label: 'Annual capacity', value: '20,000 t', icon: 'scale' },
      { label: 'Infrastructure', value: '5 sites', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Discover SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'View our execution capabilities',
      href: '/en/solutions#impact',
      external: false
    },
    trustMicrocopy: '24h response • Standard NDA • QA files on request',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'SCPB quality control - cocoa bean inspection',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'SCPB storage infrastructure',
        priority: false
      }
    ],
    photoCaption: 'On-site quality control & traceability'
  }
};
```

### Image Requirements

**Primary Image**:
- Dimensions: 800x1000px (4:5 aspect ratio)
- Format: WebP with JPEG fallback
- Quality: 85
- Content: Quality control scene, warehouse, or field operations

**Overlay Image**:
- Dimensions: 400x300px (4:3 aspect ratio)
- Format: WebP with JPEG fallback
- Quality: 85
- Content: Complementary scene (infrastructure, products, team)

**Optimization**:
- Lazy loading for overlay image
- Priority loading for primary image
- Blur placeholder for both
- Responsive sizes: `(max-width: 768px) 100vw, 60vw`

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Section Positioning Consistency

*For any* homepage render, the Partner_Section should appear immediately after the Services Section in the DOM order and visual flow.

**Validates: Requirements 1.1, 1.2**

### Property 2: Responsive Layout Transformation

*For any* viewport width, the Partner_Section should display a 2-column layout when width ≥768px and a stacked layout when width <768px, with no layout breakage or content overflow.

**Validates: Requirements 2.1, 3.1, 3.2**

### Property 3: External Link Security

*For any* external link (partner website), the rendered anchor element should include both `target="_blank"` and `rel="noopener noreferrer"` attributes.

**Validates: Requirements 1.5, 5.4**

### Property 4: Image Optimization Compliance

*For any* image rendered in the Partner_Section, the component should use next/image with lazy loading (except priority images), blur placeholder, and responsive sizes configuration.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 5: Content Length Constraint

*For any* locale, the body text content should not exceed 120 words total across all paragraphs.

**Validates: Requirements 4.4**

### Property 6: Key Facts Count Invariant

*For any* locale, the key facts list should contain exactly 3 items.

**Validates: Requirements 4.5**

### Property 7: CTA Interaction Feedback

*For any* CTA button, hovering or focusing the element should trigger visible state changes (hover styles or focus ring) within 100ms.

**Validates: Requirements 5.6, 5.7, 7.2, 7.3**

### Property 8: Color Contrast Accessibility

*For any* text element in the Partner_Section, the color contrast ratio between text and background should meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 11.5**

### Property 9: Keyboard Navigation Completeness

*For any* interactive element (links, buttons), the element should be reachable and activatable using only keyboard navigation (Tab, Enter, Space).

**Validates: Requirements 11.3, 11.4**

### Property 10: Internationalization Content Mapping

*For any* supported locale (FR, EN), the Partner_Section should render content from the corresponding locale object without fallback to default language or missing translations.

**Validates: Requirements 10.1, 10.2, 10.3**

### Property 11: Image Alt Text Presence

*For any* image in the Partner_Section, the img element should have a non-empty alt attribute with descriptive text.

**Validates: Requirements 8.5, 11.2**

### Property 12: Photo Stack Overlay Positioning

*For any* viewport width ≥768px, the overlay image in the Photo_Stack should be positioned absolutely with bottom-right offset and 1-2° rotation applied.

**Validates: Requirements 2.4**

### Property 13: Trust Microcopy Visibility

*For any* render of the Partner_Section, the trust microcopy should be visible below the CTA buttons with bullet separators between segments.

**Validates: Requirements 4.6**

### Property 14: Stat Cards Conditional Rendering

*For any* content configuration, if the stats array is empty or undefined, the StatCards component should not render, and if stats are present, exactly 3 cards should display.

**Validates: Requirements 12.1, 12.3**

### Property 15: Design System Color Consistency

*For any* color value used in the Partner_Section, the color should either exist in the Tailwind config or be explicitly defined as a custom value in the component with documentation.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

## Error Handling

### Image Loading Failures

**Scenario**: Image fails to load (404, network error, invalid path)

**Handling**:
- Display fallback placeholder with brand colors
- Log error to console in development mode
- Show alt text in placeholder
- Maintain layout integrity (no layout shift)

**Implementation**:
```typescript
<Image
  src={image.src}
  alt={image.alt}
  onError={(e) => {
    console.error('Image failed to load:', image.src);
    // next/image handles fallback automatically
  }}
/>
```

### Missing Content Data

**Scenario**: Content object is missing or incomplete for a locale

**Handling**:
- Fallback to English content if current locale is unavailable
- Log warning in development mode
- Display error boundary in production if English also fails
- Prevent component crash

**Implementation**:
```typescript
const content = partnerSectionContent[locale] || partnerSectionContent.en;
if (!content) {
  console.error('Partner section content missing for all locales');
  return <ErrorBoundary />;
}
```

### External Link Failures

**Scenario**: Partner website URL is invalid or unreachable

**Handling**:
- Validate URL format before rendering
- Display button as disabled if URL is invalid
- Show tooltip with error message on hover
- Log validation error

**Implementation**:
```typescript
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const ctaDisabled = !isValidUrl(content.partnerUrl);
```

### Viewport Resize Edge Cases

**Scenario**: Rapid viewport resizing or orientation changes

**Handling**:
- Use CSS media queries for layout (no JS resize listeners)
- Debounce any JS-based responsive logic (if needed)
- Prevent layout thrashing with CSS containment
- Maintain smooth transitions

**Implementation**:
```css
@media (min-width: 768px) {
  .partner-section-grid {
    display: grid;
    grid-template-columns: 60fr 40fr;
  }
}
```

### Accessibility Failures

**Scenario**: Screen reader or keyboard navigation issues

**Handling**:
- Provide skip links for keyboard users
- Ensure all interactive elements have accessible names
- Add ARIA labels where semantic HTML is insufficient
- Test with automated accessibility tools (axe-core)

**Implementation**:
```typescript
<a
  href={content.partnerUrl}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${content.primaryCTA.label} (opens in new tab)`}
>
  {content.primaryCTA.label}
</a>
```

## Testing Strategy

### Unit Testing

**Framework**: Jest + React Testing Library

**Test Coverage**:

1. **Component Rendering**:
   - PartnerSection renders without crashing
   - All sub-components render with correct props
   - Content displays correctly for each locale
   - Conditional rendering (stats cards) works as expected

2. **Props Validation**:
   - Component accepts all required props
   - Optional props work correctly
   - Invalid props trigger appropriate warnings
   - Default values apply when props are omitted

3. **Interaction Testing**:
   - CTA buttons are clickable
   - External links open in new tabs
   - Hover states apply correctly
   - Focus states are visible

4. **Accessibility Testing**:
   - All images have alt text
   - Interactive elements are keyboard accessible
   - ARIA attributes are present where needed
   - Color contrast meets WCAG AA standards

5. **Edge Cases**:
   - Missing content data falls back gracefully
   - Invalid URLs are handled
   - Empty stats array doesn't render StatCards
   - Long text content is truncated or wrapped properly

**Example Unit Tests**:
```typescript
describe('PartnerSection', () => {
  it('renders with French content', () => {
    render(<PartnerSection locale="fr" />);
    expect(screen.getByText('Afexia × SCPB SARL')).toBeInTheDocument();
  });

  it('opens partner link in new tab with security attributes', () => {
    render(<PartnerSection locale="en" />);
    const link = screen.getByRole('link', { name: /discover scpb/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays exactly 3 key facts', () => {
    render(<PartnerSection locale="fr" />);
    const facts = screen.getAllByRole('listitem');
    expect(facts).toHaveLength(3);
  });
});
```

### Property-Based Testing

**Framework**: fast-check (for TypeScript/JavaScript)

**Configuration**: Minimum 100 iterations per property test

**Property Tests**:

1. **Property 1: Section Positioning Consistency**
   - Generate random homepage component orders
   - Verify Partner_Section always appears after Services Section
   - **Feature: scpb-partner-section, Property 1: Section positioning**

2. **Property 2: Responsive Layout Transformation**
   - Generate random viewport widths (320px - 2560px)
   - Verify layout switches at 768px breakpoint
   - Verify no overflow or layout breakage
   - **Feature: scpb-partner-section, Property 2: Responsive layout**

3. **Property 3: External Link Security**
   - Generate random external URLs
   - Verify all external links have security attributes
   - **Feature: scpb-partner-section, Property 3: Link security**

4. **Property 4: Image Optimization Compliance**
   - Generate random image configurations
   - Verify all images use next/image with correct props
   - **Feature: scpb-partner-section, Property 4: Image optimization**

5. **Property 5: Content Length Constraint**
   - Generate random body text arrays
   - Verify total word count ≤ 120
   - **Feature: scpb-partner-section, Property 5: Content length**

6. **Property 6: Key Facts Count Invariant**
   - Generate random content objects
   - Verify keyFacts array always has exactly 3 items
   - **Feature: scpb-partner-section, Property 6: Key facts count**

7. **Property 10: Internationalization Content Mapping**
   - Generate random locale selections
   - Verify content renders without missing translations
   - **Feature: scpb-partner-section, Property 10: i18n mapping**

**Example Property Test**:
```typescript
import fc from 'fast-check';

describe('Property Tests: PartnerSection', () => {
  // Feature: scpb-partner-section, Property 5: Content length constraint
  it('body text never exceeds 120 words', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
        (paragraphs) => {
          const totalWords = paragraphs.join(' ').split(/\s+/).length;
          const content = {
            ...partnerSectionContent.en,
            bodyText: paragraphs
          };
          
          // If content exceeds 120 words, component should truncate
          render(<PartnerSection locale="en" content={content} />);
          const renderedText = screen.getByTestId('body-text').textContent;
          const renderedWords = renderedText.split(/\s+/).length;
          
          expect(renderedWords).toBeLessThanOrEqual(120);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: scpb-partner-section, Property 6: Key facts count invariant
  it('always displays exactly 3 key facts', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        (facts) => {
          const content = {
            ...partnerSectionContent.en,
            keyFacts: facts
          };
          
          render(<PartnerSection locale="en" content={content} />);
          const renderedFacts = screen.getAllByRole('listitem');
          
          // Component should always render exactly 3, taking first 3 or padding
          expect(renderedFacts).toHaveLength(3);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Framework**: Playwright or Cypress

**Test Scenarios**:

1. **Full Page Integration**:
   - Partner section renders correctly within homepage
   - Section appears after Services Section
   - Scrolling to section works smoothly
   - Section is visible in viewport

2. **Cross-Browser Testing**:
   - Test on Chrome, Firefox, Safari, Edge
   - Verify layout consistency across browsers
   - Check image rendering and optimization
   - Validate hover/focus states

3. **Responsive Testing**:
   - Test on mobile (375px, 414px)
   - Test on tablet (768px, 1024px)
   - Test on desktop (1280px, 1920px)
   - Verify layout switches at breakpoints

4. **Performance Testing**:
   - Measure Largest Contentful Paint (LCP)
   - Verify images load with lazy loading
   - Check for layout shifts (CLS)
   - Validate Time to Interactive (TTI)

5. **Accessibility Testing**:
   - Run axe-core automated tests
   - Test keyboard navigation flow
   - Verify screen reader announcements
   - Check focus management

**Example Integration Test**:
```typescript
test('Partner section appears after Services section on homepage', async ({ page }) => {
  await page.goto('/fr');
  
  const servicesSection = page.locator('[data-testid="services-section"]');
  const partnerSection = page.locator('[data-testid="partner-section"]');
  
  await expect(servicesSection).toBeVisible();
  await expect(partnerSection).toBeVisible();
  
  // Verify partner section comes after services section in DOM
  const servicesBoundingBox = await servicesSection.boundingBox();
  const partnerBoundingBox = await partnerSection.boundingBox();
  
  expect(partnerBoundingBox.y).toBeGreaterThan(servicesBoundingBox.y + servicesBoundingBox.height);
});
```

### Visual Regression Testing

**Tool**: Percy or Chromatic

**Scenarios**:
- Desktop layout (1280px)
- Mobile layout (375px)
- Hover states on CTAs
- Focus states on interactive elements
- French vs English content
- With and without stat cards
- Dark mode (if applicable)

### Performance Benchmarks

**Targets**:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Image load time: < 1s (with lazy loading)
- Component render time: < 50ms

**Monitoring**:
- Use Lighthouse CI in build pipeline
- Track Core Web Vitals in production
- Set up alerts for performance regressions
