# Catalog Dark Premium Redesign - Spec Complete

## Vue d'ensemble

Cette spec complète définit la refonte du catalogue produits Afrexia en version **dark premium**, alignée avec la direction artistique dark green/gold du site, optimisée pour la conversion B2B (lead generation via RFQ).

## Objectifs

1. **Harmoniser avec la DA**: Transformer le catalogue blanc actuel en expérience dark premium cohérente
2. **Optimiser la conversion**: Parcours RFQ frictionless, informations techniques claires
3. **Renforcer la crédibilité**: Preuves de conformité (EUDR, QA, COA) omniprésentes
4. **Améliorer l'UX**: Filtres clairs, cards lisibles, responsive optimisé

## Documents de Spec

### 1. Requirements Document
**Fichier**: `requirements.md`

Spécifie les 10 requirements principaux avec acceptance criteria détaillés:
- Requirement 1: Dark Premium Theme Implementation
- Requirement 2: Header Redesign
- Requirement 3: Filters UX Redesign
- Requirement 4: Product Card V2 Redesign
- Requirement 5: RFQ Workflow Enhancement
- Requirement 6: Visual Quality & Accessibility
- Requirement 7: Copywriting & Translations
- Requirement 8: Analytics & Tracking
- Requirement 9: Responsive Design
- Requirement 10: Performance

### 2. Design Document
**Fichier**: `design.md`

Spécifie l'architecture, les composants et les détails visuels:
- Color Palette Dark Premium
- Typography Scale
- Component Architecture
- 6 composants principaux détaillés:
  - CatalogHeaderDark
  - CatalogFiltersDark
  - ProductCardDark
  - RFQDrawerDark
  - TrustStripDark
  - MobileRFQButtonDark
- Data Models & TypeScript Interfaces
- Copywriting FR/EN complet
- Analytics Events Specification
- Responsive Breakpoints
- Accessibility Checklist
- Performance Optimization
- Migration Strategy

### 3. Tasks Document
**Fichier**: `tasks.md`

Plan d'implémentation en 12 tâches principales:
1. Configuration du thème dark premium
2. Créer les composants de base dark
3. Créer TrustStripDark component
4. Créer CatalogHeaderDark component
5. Créer CatalogFiltersDark component
6. Créer ProductCardDark component
7. Créer RFQDrawerDark component
8. Créer MobileRFQButtonDark component
9. Intégrer les composants dans la page
10. Optimisation des performances
11. Tests et validation
12. Documentation et déploiement

**Estimation**: ~13 jours de développement

### 4. Implementation Checklist
**Fichier**: `implementation-checklist.md`

Checklist détaillée en 9 phases avec items cochables:
- Phase 1: Configuration & Setup
- Phase 2: Composants de Base
- Phase 3: Composants Métier
- Phase 4: Intégration Page
- Phase 5: Optimisation
- Phase 6: Tests
- Phase 7: Analytics & Monitoring
- Phase 8: Documentation
- Phase 9: Déploiement

## Composants à Créer

### Composants UI de Base
1. **ButtonDark** - Bouton avec variantes primary/secondary/ghost
2. **InputDark** - Input avec style dark et glass effect
3. **SelectDark** - Select avec recherche et multi-select
4. **BadgeDark** - Badges pour availability, EUDR, certifications

### Composants Métier
1. **TrustStripDark** - Bande de réassurance (24h, NDA, EUDR, QA, COA)
2. **CatalogHeaderDark** - Header avec H1, subtitle, trust strip, CTAs
3. **CatalogFiltersDark** - Barre de filtres sticky avec drawer mobile
4. **ProductCardDark** - Fiche produit premium dark avec glass effect
5. **RFQDrawerDark** - Drawer de demande de devis avec formulaire
6. **MobileRFQButtonDark** - CTA sticky bottom pour mobile

## Interfaces TypeScript

### Product Model
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  heroImage: SanityImage | null;
  availability: 'available' | 'on-request' | 'out-of-stock';
  origins: string[];
  certifications: string[];
  eudrReady: boolean;
  qaAvailable: boolean;
  documents: {
    coa: boolean;
    specSheet: boolean;
    chainOfCustody: boolean;
  };
  moq: { value: number; unit: string };
  incoterms: string[];
  // ... autres champs
}
```

### Filter State
```typescript
interface FilterState {
  search: string;
  category?: string;
  origins: string[];
  availability: string[];
  certifications: string[];
  incoterms: string[];
  moqRange?: { min: number; max: number };
}
```

### RFQ Form Data
```typescript
interface RFQFormData {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  incoterm: string;
  destination: string;
  email: string;
  company: string;
  notes?: string;
}
```

## Copywriting

### Header (FR)
- **H1**: "Catalogue Produits"
- **Subtitle**: "Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit."
- **CTA Primary**: "Demander un devis"
- **CTA Secondary**: "Télécharger le catalogue (PDF)"

### Header (EN)
- **H1**: "Product Catalog"
- **Subtitle**: "Cocoa, coffee & African commodities — Documented QA, audit-ready traceability."
- **CTA Primary**: "Request a Quote"
- **CTA Secondary**: "Download Catalog (PDF)"

### Product Card
- **Primary CTA**: "Demander un devis" / "Request a Quote"
- **Secondary Link**: "Voir fiche technique" / "View Specifications"
- **Microproof**: "Réponse sous 24h • NDA possible" / "24h response • NDA available"

### Trust Items
- **24h**: "Réponse sous 24 heures" / "24h response"
- **NDA**: "NDA disponible" / "NDA available"
- **EUDR**: "Conforme EUDR" / "EUDR compliant"
- **QA**: "Documentation QA" / "QA documentation"
- **COA**: "COA & fiches techniques" / "COA & spec sheets"

## Analytics Events

### Events à Tracker
1. **filter_used** - Utilisation des filtres
2. **quote_click** - Clic sur "Demander un devis"
3. **rfq_submit** - Soumission du formulaire RFQ
4. **pdf_download** - Téléchargement du catalogue PDF
5. **catalog_engagement** - Engagement global (temps, scroll depth)

### Metadata à Inclure
- Product ID, name, category, origin, availability
- Filter type et value
- Result count
- Source (card, mobile_cta, etc.)
- Timestamp

## Color Palette

### Backgrounds
- **Primary**: `#0A1410` (Charcoal très foncé)
- **Secondary**: `#1A2820` (Dark green charcoal)
- **Tertiary**: `#141D18` (Variation pour cards)

### Text
- **Primary**: `#E8F5E9` (Ivory/light green)
- **Secondary**: `#B0D4B8` (Muted light green)
- **Muted**: `#80996F` (Support green)

### Brand
- **Primary**: `#4A9A62` (Dark green - CTAs)
- **Secondary**: `#5AAA72` (Lighter green)
- **Accent**: `#A89858` (Gold - hover, links)

### Borders
- **Default**: `rgba(255,255,255,0.1)`
- **Hover**: `rgba(255,255,255,0.2)`

## Glass Effect

```css
.glass-panel {
  background: rgba(26, 40, 32, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
```

## Responsive Breakpoints

- **Mobile**: 320px - 767px (1 column)
- **Tablet**: 768px - 1023px (2-3 columns)
- **Desktop**: 1024px+ (3-4 columns)

## Success Metrics

### Conversion
- RFQ submissions: **+25%**
- Time to RFQ: **-30%**
- Bounce rate: **-15%**
- Session duration: **+20%**
- Mobile conversion: **Within 10% of desktop**

### Technical
- Lighthouse performance: **≥85 desktop, ≥75 mobile**
- Lighthouse accessibility: **≥95**
- Core Web Vitals: **All "Good"**
- Test coverage: **≥80%**

## Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + custom dark theme
- **Components**: TypeScript avec interfaces strictes
- **Images**: next/image + Sanity CDN
- **Analytics**: Google Analytics 4
- **Testing**: Vitest + Playwright
- **Accessibility**: WCAG AA minimum

## Prochaines Étapes

1. **Review de la spec** avec l'équipe
2. **Validation du design** avec les stakeholders
3. **Estimation détaillée** par l'équipe dev
4. **Kick-off** du développement
5. **Sprints** selon le plan de tasks
6. **QA & Testing** continu
7. **Déploiement** progressif (staging → production)
8. **Monitoring** des métriques de succès

## Questions Ouvertes

- [ ] Faut-il un A/B test entre version actuelle et dark premium ?
- [ ] Quelle est la priorité : desktop ou mobile first ?
- [ ] Faut-il créer un Storybook pour les composants ?
- [ ] Quel est le plan de rollback si les métriques baissent ?
- [ ] Faut-il une feature flag pour activer/désactiver le dark theme ?

## Contacts

- **Product Owner**: [À définir]
- **Designer**: [À définir]
- **Tech Lead**: [À définir]
- **QA Lead**: [À définir]

## Ressources

- Figma (si designs visuels disponibles)
- Sanity CMS documentation
- Next.js documentation
- Tailwind CSS documentation
- WCAG 2.1 AA guidelines

---

**Spec Version**: 1.0  
**Date**: 30 janvier 2026  
**Status**: Ready for Implementation
