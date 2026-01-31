# Quality & Compliance Page - Implementation Guide

## Overview

Page "Qualité & Conformité" premium B2B orientée export de commodités agricoles africaines.
Design "luxury export editorial" avec fond dark green, accents gold, et focus conversion.

## Structure de la Page

### A. Hero Section (Editorial)
- **Background**: Image `/assets/quality-control.jpg` avec overlay dark
- **Titre**: "Qualité & Conformité"
- **Sous-titre**: "Normes rigoureuses et documentation audit-ready..."
- **Badges inline**: 5 badges (QA documentée, EUDR-ready, COA/Spec sheet, NDA, Réponse <24h)
- **Trust microcopy**: "Documents disponibles sur demande • Partage sous NDA si requis"
- **CTAs**: Primary "Recevoir le pack conformité" + Secondary "Voir nos certifications"

### B. Certifications Section
- **Grid**: 2-3 colonnes responsive
- **Cards**: Logo + Titre + Description + Badge "Sur demande"
- **CTA**: "Demander la liste complète (NDA)"
- **Fallback**: Message si aucune certification dans Sanity

### C. Quality Standards Section
- **Grid**: 2 colonnes (4 cards)
- **Cards**: Icon + Titre + Description + Bullets (3 items) + Proof label
- **Standards**:
  1. Normes de Classement
  2. Tests en Laboratoire
  3. Inspection Pré-Expédition
  4. Documentation & Traçabilité

### D. QA Process Timeline
- **Layout**: Timeline verticale avec numéros
- **Steps**: 6 étapes avec détails expandables
- **Animation**: Fade-in au scroll
- **Mobile**: Timeline adaptée

### E. Compliance Pack Section
- **Grid**: 2 colonnes (7 documents)
- **Documents**: COA, Spec Sheet, Packing List, Certificat d'origine, Traçabilité, Shipping docs, Certificats tiers
- **CTA**: "Recevoir le pack conformité" (redirect vers contact)
- **Trust indicators**: Réponse 24h + NDA

### F. FAQ Section
- **Accordéon**: 7 questions B2B
- **Topics**: Audit, NDA, Traçabilité, Tests labo, Incoterms, EUDR, Inspections tierces
- **Interaction**: Click to expand/collapse

### G. Final CTA Section
- **Background**: Image avec overlay
- **Icon**: Shield
- **Titre**: "Besoin d'un COA ou Spec Sheet?"
- **CTAs**: "Demander un devis" + "Nous contacter"

## Composants Créés

### 1. `QualityHeroBadges.tsx`
```typescript
interface QualityBadge {
  label: string;
  icon: string; // 'file-check' | 'shield' | 'file-text' | 'lock' | 'clock'
}
```
- Affiche badges inline avec icons
- Responsive flex wrap
- Style: bg-[rgba(74,154,98,0.15)] + border

### 2. `CompliancePackSection.tsx`
```typescript
interface ComplianceDoc {
  label: string;
  note?: string;
}
```
- Grid 2 colonnes de documents
- CTA download avec callback
- Trust indicators (Clock + Shield)
- Background decorations (blur circles)

### 3. `QualityFAQ.tsx`
```typescript
interface FAQItem {
  question: string;
  answer: string;
}
```
- Accordéon avec state management
- Animation smooth expand/collapse
- Keyboard accessible (focus states)

## Data Structure

### `lib/content/quality-data.ts`

```typescript
export interface QualityPageContent {
  hero: {
    title: string;
    subtitle: string;
    badges: QualityBadge[];
    trustMicrocopy: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  certifications: {
    title: string;
    subtitle: string;
    ctaRequest: string;
  };
  standards: {
    title: string;
    subtitle: string;
    items: QualityStandard[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: QAStep[];
  };
  compliancePack: {
    title: string;
    subtitle: string;
    documents: ComplianceDoc[];
    ctaDownload: string;
    trustNote: string;
  };
  faq: {
    title: string;
    items: QualityFAQ[];
  };
  finalCTA: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}
```

**Locales supportés**: FR, EN, ES (DE/RU fallback to EN)

## Design Tokens

### Colors
- **Background**: `#0A1410` (dark green primary)
- **Background alt**: `#0F1814` (dark green secondary)
- **Text primary**: `#E8F5E9` (light green)
- **Text secondary**: `#C5D9C0` (medium green)
- **Text muted**: `#80996F` (muted green)
- **Accent green**: `#4A9A62` (primary CTA)
- **Accent green hover**: `#5AAA72`
- **Accent gold**: `#A89858` (labels, highlights)

### Typography
- **H1**: 4xl-6xl, font-bold, text-[#E8F5E9]
- **H2**: 4xl-5xl, font-bold, text-[#E8F5E9]
- **H3**: 2xl-xl, font-bold, text-[#E8F5E9]
- **Body**: base-xl, text-[#C5D9C0]
- **Small**: sm, text-[#80996F]

### Spacing
- **Section padding**: py-20
- **Container**: max-w-7xl (standards), max-w-4xl (timeline), max-w-5xl (hero)
- **Gap**: gap-8 (grid), gap-4 (flex)

### Effects
- **Border**: border-[rgba(255,255,255,0.08)]
- **Border hover**: border-[rgba(74,154,98,0.4)]
- **Shadow**: shadow-2xl shadow-[rgba(74,154,98,0.2)]
- **Backdrop**: backdrop-blur-sm
- **Transition**: transition-all duration-300

## SEO & Accessibility

### Metadata
```typescript
title: "Qualité & Conformité | Afrexia"
description: "Normes rigoureuses et documentation audit-ready..."
canonical: /${locale}/quality
alternates: fr, en, es, de, ru
```

### Accessibility
- ✅ Semantic HTML (h1, h2, h3, section)
- ✅ Alt text sur images
- ✅ Focus states visibles (focus:ring-2)
- ✅ Keyboard navigation (accordéon)
- ✅ ARIA labels (aria-expanded)
- ✅ Color contrast AA minimum

### Performance
- ✅ Images optimized (Next.js Image)
- ✅ Lazy load sections (ScrollReveal)
- ✅ Code splitting (dynamic imports si nécessaire)
- ✅ Minimal bundle size

## Content Guidelines

### Tone of Voice
- **Sérieux**: Pas de langage marketing excessif
- **Audit-ready**: Focus conformité et documentation
- **Précis**: Utiliser "sur demande", "selon contrat", "disponible"
- **Rassurant**: Mentionner NDA, réponse 24h, traçabilité

### Éviter
- ❌ Promesses non vérifiées (ex: "certifié SGS" si pas confirmé)
- ❌ Superlatifs ("meilleur", "unique", "révolutionnaire")
- ❌ Jargon technique non expliqué
- ❌ Certifications spécifiques non validées

### Utiliser
- ✅ "Disponible sur demande"
- ✅ "Selon contrat"
- ✅ "Laboratoires tiers accrédités"
- ✅ "Documentation complète"
- ✅ "Partage sous NDA"

## Testing Checklist

### Functional
- [ ] Hero CTAs scroll to correct sections
- [ ] Certifications load from Sanity
- [ ] FAQ accordéon expand/collapse
- [ ] Compliance pack CTA redirects to contact
- [ ] All links work (internal + external)

### Responsive
- [ ] Mobile: sections stack correctly
- [ ] Tablet: 2-column grids work
- [ ] Desktop: full layout displays
- [ ] Timeline adapts on mobile
- [ ] Badges wrap properly

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus states visible
- [ ] Color contrast passes AA
- [ ] Alt text on all images

### Performance
- [ ] Page loads < 3s
- [ ] Images optimized
- [ ] No layout shift (CLS)
- [ ] Smooth animations
- [ ] No console errors

### Content
- [ ] FR content complete
- [ ] EN content complete
- [ ] ES content complete
- [ ] Fallback to EN works (DE/RU)
- [ ] No typos or grammar errors

## Maintenance

### Adding New Certifications
1. Add to Sanity CMS (schema: `certification`)
2. Upload logo (recommended: SVG or PNG transparent)
3. Add translations (FR/EN/ES)
4. Publish

### Updating FAQ
1. Edit `lib/content/quality-data.ts`
2. Add/modify items in `faq.items` array
3. Maintain 5-7 questions max
4. Keep answers concise (2-3 sentences)

### Changing CTAs
1. Edit `lib/content/quality-data.ts`
2. Update `ctaPrimary` / `ctaSecondary` labels
3. Update href in page component if needed

## Future Enhancements

### Phase 2 (Optional)
- [ ] Modal pour "Recevoir le pack conformité" (form inline)
- [ ] Filtres certifications (Cacao / Café / Autres)
- [ ] Expandable details sur QA steps (drawer)
- [ ] Sticky CTA bar (desktop only)
- [ ] Schema.org FAQPage markup
- [ ] Download actual PDF pack

### Phase 3 (Advanced)
- [ ] Integration CRM (form submissions)
- [ ] Analytics tracking (CTA clicks)
- [ ] A/B testing CTAs
- [ ] Multilingual content management (Sanity)
- [ ] Dynamic content per product category

## Support

Pour questions ou modifications:
- **Design**: Voir `QUALITY_PAGE_IMPLEMENTATION.md`
- **Content**: Éditer `lib/content/quality-data.ts`
- **Components**: Dossier `components/quality/`
- **Styling**: Tokens dans Tailwind config

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-31  
**Author**: Senior Frontend + UX Writer
