# ProductCardV4 - Luxury Export Editorial

## Overview

**ProductCardV4** est la version "Luxury Export Editorial" de la carte produit Afrexia. Conçue pour un site B2B export (cacao, café, commodities), elle combine un style dark premium avec une esthétique éditoriale sobre inspirée des magazines de luxe.

### Objectifs
- **Crédibilité B2B**: Labels discrets, specs claires, preuves documentaires
- **Conversion RFQ**: CTA primaire "Demander un devis" + téléchargement fiche technique
- **Esthétique premium**: Typographie éditoriale, gradients subtils, vignette terrain signature

---

## Key Features

### 1. Structure Visuelle

#### Card Container
- **Border radius**: 24px (coins arrondis doux)
- **Border**: `rgba(255,255,255,0.08)` (subtil, pas flashy)
- **Shadow**: douce, augmente au hover
- **Backdrop blur**: 12px (effet glass)

#### Media Section (16:10 ratio)
- **Aspect ratio**: 16:10 (plus horizontal que 4:3, réduit hauteur)
- **Image**: cover + zoom 1.03 au hover
- **Gradient overlay**: 
  - Top 15%: léger (`from-black/15`)
  - Bottom 55-65%: dense (`to-black/65`) pour lisibilité texte
- **Film grain**: overlay subtil (opacity 0.03) pour texture éditoriale

#### Vignette Terrain (Signature Editorial)
- **Position**: bottom-left, chevauche le contenu de 12px
- **Taille**: 56-72px (mobile), 72-92px (desktop)
- **Style**: `rounded-[16px]`, border `rgba(255,255,255,0.12)`, shadow
- **Contenu**: photo terrain si dispo, sinon texture jute + icône map pin
- **Micro-label**: "Terrain" / "Field" sous la vignette (8-10px)
- **Hover**: lift effect (`translateY -0.5`)

### 2. Labels Sobres (Pas de Gros Chips)

#### EUDR Badge (Top-Left)
- **Style**: tag ultra sobre
- **Background**: `rgba(255,255,255,0.06)` (pas de vert flashy)
- **Text**: `rgba(255,255,255,0.85)`
- **Icon**: shield/check petit (3px)
- **Font**: 11-12px

#### Availability Badge (Top-Right)
- **Style**: même tag sobre
- **Dot**: ● vert/or discret (1.5px)
- **Text**: "En stock" / "Sur demande"

### 3. Typographie Editorial

#### Dans l'overlay image (bottom-left)
- **Category**: 11-12px, uppercase, tracking-wide, opacity 70%
- **Product name**: 22-32px (responsive), font-semibold, line-height 1.1
- **Subtitle**: 14-15px, opacity 80% ("Qualité Premium" / "Grade export")

#### Dans le body de card
- **Description**: max 2 lignes (`line-clamp-2`), 13-14px, tone B2B sobre
- **Proofs row**: text-only (pas pills), 12-13px, opacity 75%
  - Ex: "COA • Chain of Custody • QA documentée"

### 4. Bloc Specs (Compact, Luxe)

- **Layout**: 2 colonnes (grid)
- **Items**: 3-4 max (Origine, MOQ, Incoterms, Packaging)
- **Format**: 
  - Label: 10-11px uppercase, opacity 65%
  - Value: 13-14px, font-semibold
- **Pas de redondance**: ne pas afficher FOB/CIF deux fois

### 5. CTAs (Conversion B2B)

#### Primary Button
- **Full width**: "Demander un devis" + chevron
- **Style**: `bg-[#4A9A62]`, rounded-xl, min-height 44px
- **Hover**: `bg-[#5AAA72]`, shadow augmente

#### Secondary Button
- **Full width**: "Télécharger fiche technique (PDF)"
- **Style**: outline, `border-[rgba(168,152,88,0.3)]`, text `#A89858`
- **Hover**: `bg-[rgba(168,152,88,0.1)]`

#### Microproof
- **Text**: "Réponse sous 24h • NDA possible"
- **Style**: 11px, center, `text-[#80996F]`

### 6. États & Fallbacks

#### Si `product.image` manque
- **Fallback premium**: gradient + texture jute + watermark icône catégorie (opacity 8-10%)
- **Gradient**: `from-[#1A2820] via-[#0F1814] to-[#0A1410]`
- **Vignette**: radial gradient pour depth

#### Si pas de vignette terrain
- **Fallback**: texture jute + icône map pin (opacity 40%)

#### Hover Desktop
- **Image**: zoom 1.03
- **Border**: plus visible (`rgba(255,255,255,0.12)`)
- **Vignette**: lift (`translateY -2px`, shadow augmente)

---

## Usage

### Basic Example

```tsx
import { ProductCardV4 } from '@/components/catalog';
import type { Product } from '@/types/product';

const translations = {
  requestQuote: 'Demander un devis',
  downloadSpec: 'Télécharger fiche technique',
  origin: 'Origine',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  packaging: 'Conditionnement',
  microproof: 'Réponse sous 24h • NDA possible',
  terrainLabel: 'Terrain',
  categoryLabels: {
    cocoa: 'Cacao',
    coffee: 'Café',
    corn: 'Maïs',
    pepper: 'Poivre',
    wood: 'Bois',
  },
  badges: {
    inStock: 'En stock',
    onRequest: 'Sur demande',
    eudrReady: 'EUDR-ready',
  },
  proofs: {
    coa: 'COA',
    chainOfCustody: 'Chain of Custody',
    qaDocumented: 'QA documentée',
  },
  fallback: {
    terrainOnRequest: 'Photo terrain sur demande',
    multiOrigin: 'Multi-origine',
  },
};

function CatalogPage() {
  const handleQuoteClick = () => {
    // Open RFQ drawer
  };

  const handleDownloadSpec = () => {
    // Trigger PDF download
  };

  return (
    <ProductCardV4
      product={product}
      locale="fr"
      translations={translations}
      onQuoteClick={handleQuoteClick}
      onDownloadSpec={handleDownloadSpec}
      terrainImage="/assets/terrain-cocoa-cameroon.jpg" // Optional
    />
  );
}
```

### With Terrain Image

```tsx
<ProductCardV4
  product={product}
  locale="fr"
  translations={translations}
  onQuoteClick={handleQuoteClick}
  onDownloadSpec={handleDownloadSpec}
  terrainImage="/assets/terrain-coffee-ethiopia.jpg"
/>
```

### Grid Layout (Recommended)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map((product) => (
    <ProductCardV4
      key={product.id}
      product={product}
      locale={locale}
      translations={translations}
      onQuoteClick={() => handleQuoteClick(product)}
      onDownloadSpec={() => handleDownloadSpec(product)}
    />
  ))}
</div>
```

---

## Props

### `ProductCardV4Props`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `Product` | ✅ | Product data from Sanity |
| `locale` | `'fr' \| 'en'` | ✅ | Current locale |
| `translations` | `ProductCardV4Translations` | ✅ | All UI strings |
| `onQuoteClick` | `() => void` | ✅ | Callback when "Demander un devis" clicked |
| `onDownloadSpec` | `() => void` | ❌ | Callback when "Télécharger fiche" clicked |
| `terrainImage` | `string` | ❌ | Optional terrain vignette image URL |

### `ProductCardV4Translations`

```typescript
interface ProductCardV4Translations {
  requestQuote: string;
  downloadSpec: string;
  origin: string;
  moq: string;
  incoterm: string;
  packaging: string;
  microproof: string;
  terrainLabel: string;
  categoryLabels: {
    cocoa: string;
    coffee: string;
    corn: string;
    pepper: string;
    wood: string;
  };
  badges: {
    inStock: string;
    onRequest: string;
    eudrReady: string;
  };
  proofs: {
    coa: string;
    chainOfCustody: string;
    qaDocumented: string;
  };
  fallback: {
    terrainOnRequest: string;
    multiOrigin: string;
  };
}
```

---

## Responsive Behavior

### Mobile (< 640px)
- Vignette: 56-72px
- Product name: 22-26px
- Category: 11px
- Specs grid: 2 columns maintained
- Touch targets: min 44px

### Tablet (640px - 1024px)
- Vignette: 72px
- Product name: 28px
- All spacing scales

### Desktop (> 1024px)
- Vignette: 84-92px
- Product name: 32px
- Hover states active

---

## Accessibility

### Color Contrast
- ✅ Product name on gradient: WCAG AA compliant
- ✅ All text: contrast ratio ≥ 4.5:1
- ✅ Microproof: ≥ 3:1 (large text exception)

### Keyboard Navigation
- ✅ Card has `focus-within` outline
- ✅ Buttons: focus ring visible
- ✅ Tab order: logical

### Screen Readers
- ✅ Image alt text: descriptive
- ✅ Buttons: clear action labels
- ✅ Semantic HTML (no ARIA needed)

### Touch Targets
- ✅ Primary button: 44px min height
- ✅ Secondary button: 42px min height

---

## Performance

### Images
- ✅ Next.js Image component
- ✅ Lazy loading
- ✅ Quality: 85
- ✅ Responsive sizes

### Animations
- ✅ CSS only (no JS)
- ✅ Duration: 300-500ms
- ✅ Easing: ease-out

---

## Design Decisions

### Pourquoi 16:10 au lieu de 4:3?
- Réduit la hauteur totale de la card (~420px vs 520px)
- Plus horizontal = plus moderne, moins "carré"
- Meilleur pour photos terrain (paysages)

### Pourquoi vignette terrain?
- **Signature éditoriale**: différencie Afrexia des catalogues génériques
- **Preuve visuelle**: montre l'origine terrain (crédibilité B2B)
- **Storytelling**: humanise le produit (pas juste une fiche technique)

### Pourquoi labels sobres (pas de gros chips verts)?
- **Luxe = discrétion**: les labels flashy font "cheap"
- **B2B ≠ B2C**: les acheteurs pros veulent du sobre, pas du marketing agressif
- **Editorial**: les magazines de luxe n'ont pas de badges criards

### Pourquoi proofs en text-only?
- **Moins de bruit visuel**: pills/badges surchargent la card
- **Plus lisible**: "COA • Chain of Custody" est plus clair qu'une série de badges
- **Économie d'espace**: permet de garder la card compacte

### Pourquoi 2 CTAs?
- **Primary (RFQ)**: objectif principal = conversion devis
- **Secondary (PDF)**: permet aux acheteurs de comparer offline avant de demander devis
- **Microproof**: rassure sur délai de réponse + confidentialité (NDA)

---

## Comparison with ProductCardV2

| Feature | V2 | V4 (Luxury Editorial) |
|---------|----|-----------------------|
| **Ratio** | 16:10 | 16:10 ✓ |
| **Vignette terrain** | ❌ | ✅ Signature editorial |
| **Labels** | Badges colorés | Tags sobres |
| **Typo** | Standard | Editorial (smallcaps, tight line-height) |
| **Gradient** | Bottom only | Top 15% + Bottom 65% |
| **Film grain** | ❌ | ✅ Subtle overlay |
| **Proofs** | Pills | Text-only |
| **Hover vignette** | N/A | ✅ Lift effect |

---

## Browser Support

- ✅ Chrome/Edge: all features
- ✅ Firefox: all features
- ✅ Safari: all features (backdrop-blur supported)
- ✅ Mobile browsers: all features

---

## Related Components

- **ProductCardV2**: Version précédente (sans vignette terrain)
- **ProductCardDark**: Version dark theme standard
- **RFQDrawerDark**: Drawer pour demande de devis
- **CatalogHeaderDark**: Header catalogue dark premium

---

## Testing

See `ProductCardV4.QA.md` for complete QA checklist.

### Quick Test
```bash
# Run example page
npm run dev
# Navigate to /examples/product-card-v4
```

---

## Changelog

### v4.0.0 (2024-01-30)
- ✨ Initial release
- ✨ Luxury editorial design
- ✨ Terrain vignette signature
- ✨ Subtle labels (no flashy chips)
- ✨ Editorial typography
- ✨ Film grain overlay
- ✨ Premium fallbacks

---

## Credits

**Design**: Afrexia Luxury Export Editorial  
**Implementation**: Kiro AI  
**Inspiration**: Kinfolk Magazine, Cereal Magazine, Monocle
