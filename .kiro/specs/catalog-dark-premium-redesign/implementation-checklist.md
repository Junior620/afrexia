# Implementation Checklist: Catalog Dark Premium Redesign

## Phase 1: Configuration & Setup ✓

### Thème Dark
- [ ] Mettre à jour `tailwind.config.ts` avec les couleurs dark
- [ ] Créer `lib/brand/dark-theme.ts` avec les tokens
- [ ] Tester les ratios de contraste (WCAG AA minimum)
- [ ] Créer les utility classes `.glass-panel`, `.glass-card`, `.glass-input`
- [ ] Documenter les couleurs et leur usage

### Structure de fichiers
- [ ] Créer `components/catalog-dark/` directory
- [ ] Créer `lib/analytics/catalog-events.ts`
- [ ] Créer `types/catalog-dark.ts` pour les interfaces
- [ ] Créer `locales/catalog-dark/` pour les traductions

## Phase 2: Composants de Base ✓

### ButtonDark
- [ ] Créer `components/ui/ButtonDark.tsx`
- [ ] Implémenter variantes: primary, secondary, ghost
- [ ] Implémenter états: hover, focus, disabled, loading
- [ ] Implémenter tailles: sm, md, lg
- [ ] Support icône left/right
- [ ] Tests unitaires

### InputDark
- [ ] Créer `components/ui/InputDark.tsx`
- [ ] Style dark avec glass effect
- [ ] États: default, focus, error, disabled
- [ ] Support label, placeholder, helper, error message
- [ ] Accessibilité: aria-labels, aria-describedby
- [ ] Tests unitaires

### SelectDark
- [ ] Créer `components/ui/SelectDark.tsx`
- [ ] Style dark avec glass effect
- [ ] Support single et multi-select
- [ ] Recherche intégrée
- [ ] Navigation clavier
- [ ] Tests unitaires

### BadgeDark
- [ ] Créer `components/ui/BadgeDark.tsx`
- [ ] Variantes: availability, eudr, certification
- [ ] Style pill avec backdrop blur
- [ ] Tailles: sm, md
- [ ] Tests unitaires

## Phase 3: Composants Métier ✓

### TrustStripDark
- [ ] Créer `components/catalog-dark/TrustStripDark.tsx`
- [ ] Layout flex row horizontal
- [ ] Variantes: compact, detailed
- [ ] Tooltip au hover
- [ ] Icônes SVG: Clock, Shield, Leaf, CheckCircle, FileText
- [ ] Responsive (gap adaptatif)
- [ ] Tests unitaires

### CatalogHeaderDark
- [ ] Créer `components/catalog-dark/CatalogHeaderDark.tsx`
- [ ] H1 avec taille responsive (56px → 44px)
- [ ] Subtitle avec messaging QA + traçabilité
- [ ] TrustStripDark intégré
- [ ] Deux CTAs: Primary + Secondary
- [ ] Gradient background
- [ ] Max-height: 30vh desktop, 40vh mobile
- [ ] Traductions FR/EN
- [ ] Tests unitaires

### CatalogFiltersDark
- [ ] Créer `components/catalog-dark/CatalogFiltersDark.tsx`
- [ ] Barre sticky desktop avec glass effect
- [ ] Labels visibles pour chaque filtre
- [ ] Placeholders explicites
- [ ] Compteur de résultats
- [ ] Bouton "Reset"
- [ ] Drawer mobile avec bouton "Filtrer (X)"
- [ ] Logique de filtrage (AND logic)
- [ ] Debounce search (300ms)
- [ ] Sync URL params
- [ ] Tracking analytics "filter_used"
- [ ] Tests unitaires
- [ ] Tests d'intégration

### ProductCardDark
- [ ] Créer `components/catalog-dark/ProductCardDark.tsx`
- [ ] Container glass effect (border-radius 28px)
- [ ] Section image (4:3, gradient overlay)
- [ ] Badges top-right (EUDR, Availability)
- [ ] Fallback image premium
- [ ] Section content (H3, subtitle, quick specs grid)
- [ ] Document indicators
- [ ] Section actions (Primary button, Secondary link, Microproof)
- [ ] Hover states (translateY, shadow, border)
- [ ] Focus states (outline gold 2px)
- [ ] Tracking analytics "quote_click", "spec_click"
- [ ] Tests unitaires
- [ ] Tests visuels (Storybook optionnel)

### RFQDrawerDark
- [ ] Créer `components/catalog-dark/RFQDrawerDark.tsx`
- [ ] Structure drawer (480px desktop, 100vw mobile)
- [ ] Background dark avec glass overlay
- [ ] Animation slide from right
- [ ] Formulaire avec champs requis
- [ ] Produit pré-rempli (read-only)
- [ ] Validation des champs
- [ ] Messages d'erreur clairs
- [ ] Trust elements (24h, NDA)
- [ ] Loading state
- [ ] Success/Error messages
- [ ] Tracking analytics "rfq_submit"
- [ ] Tests unitaires
- [ ] Tests d'intégration

### MobileRFQButtonDark
- [ ] Créer `components/catalog-dark/MobileRFQButtonDark.tsx`
- [ ] Position fixed bottom, z-50
- [ ] Background green avec glass effect
- [ ] Full width, 48px height
- [ ] Shadow top
- [ ] Safe area insets
- [ ] Tracking analytics "quote_click" (source: mobile_cta)
- [ ] Tests unitaires

## Phase 4: Intégration Page ✓

### ProductCatalogPageDark
- [ ] Créer `app/[locale]/products-dark/page.tsx`
- [ ] Fetch products depuis Sanity
- [ ] Manage filter state
- [ ] Manage RFQ drawer state
- [ ] Coordinate entre composants
- [ ] Layout responsive (1/2-3/3-4 cols)
- [ ] Spacing responsive
- [ ] Traductions complètes FR/EN
- [ ] Tests E2E

## Phase 5: Optimisation ✓

### Images
- [ ] Lazy loading avec next/image
- [ ] Sizes attribute approprié
- [ ] Formats optimisés (WebP, AVIF)
- [ ] Fallback images premium

### Code Splitting
- [ ] Dynamic import RFQDrawerDark
- [ ] Dynamic import modals
- [ ] Loading states

### Mémoization
- [ ] useMemo pour filteredProducts
- [ ] useCallback pour handlers
- [ ] Debounce search input

### Prefetching
- [ ] Prefetch product pages au hover
- [ ] Next.js Link avec prefetch

## Phase 6: Tests ✓

### Tests Unitaires
- [ ] Tous les composants UI de base
- [ ] Tous les composants métier
- [ ] Logique de filtrage
- [ ] Form validation

### Tests d'Intégration
- [ ] Filter application updates grid
- [ ] RFQ form submission flow
- [ ] PDF download flow
- [ ] Mobile responsive behavior

### Tests E2E
- [ ] User journey: Browse → Filter → View → RFQ
- [ ] Mobile-specific flows
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)

### Tests d'Accessibilité
- [ ] Automated: axe-core
- [ ] Automated: Lighthouse accessibility score ≥95
- [ ] Manual: Keyboard navigation complète
- [ ] Manual: Screen reader (NVDA/JAWS)
- [ ] Contrast ratios WCAG AA
- [ ] Touch targets ≥44x44px mobile

### Tests de Performance
- [ ] Lighthouse performance ≥85 desktop
- [ ] Lighthouse performance ≥75 mobile
- [ ] Core Web Vitals (LCP, FID, CLS)
- [ ] Image loading times
- [ ] Bundle size analysis

## Phase 7: Analytics & Monitoring ✓

### Events Tracking
- [ ] "filter_used" avec type et valeur
- [ ] "quote_click" avec product metadata
- [ ] "rfq_submit" avec form data
- [ ] "pdf_download" avec source
- [ ] "catalog_engagement" (time, scroll depth)

### Monitoring
- [ ] Google Analytics 4 configuré
- [ ] Sentry error tracking
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Conversion funnel tracking

## Phase 8: Documentation ✓

### Code Documentation
- [ ] JSDoc pour tous les composants
- [ ] Props interfaces documentées
- [ ] Usage examples
- [ ] Storybook stories (optionnel)

### User Documentation
- [ ] Guide de migration
- [ ] Rollback plan
- [ ] A/B testing setup (optionnel)
- [ ] Analytics dashboard setup

### Technical Documentation
- [ ] Architecture overview
- [ ] Component hierarchy
- [ ] Data flow diagrams
- [ ] API endpoints documentation

## Phase 9: Déploiement ✓

### Pre-Deployment
- [ ] Code review complet
- [ ] Tests passent à 100%
- [ ] Lighthouse scores validés
- [ ] Accessibility audit complet
- [ ] Performance benchmarks validés

### Deployment
- [ ] Deploy to staging
- [ ] QA testing sur staging
- [ ] Stakeholder review
- [ ] Deploy to production
- [ ] Monitor analytics et errors

### Post-Deployment
- [ ] Monitor conversion metrics (24h, 7j, 30j)
- [ ] Gather user feedback
- [ ] Iterate based on data
- [ ] Document lessons learned

## Success Criteria ✓

### Conversion Metrics
- [ ] RFQ submissions increase ≥25%
- [ ] Time to RFQ decrease ≥30%
- [ ] Bounce rate decrease ≥15%
- [ ] Session duration increase ≥20%
- [ ] Mobile conversion within 10% of desktop

### Technical Metrics
- [ ] Lighthouse performance ≥85 desktop
- [ ] Lighthouse performance ≥75 mobile
- [ ] Lighthouse accessibility ≥95
- [ ] Core Web Vitals: All "Good"
- [ ] Zero critical accessibility issues

### Quality Metrics
- [ ] Test coverage ≥80%
- [ ] Zero high-severity bugs
- [ ] WCAG AA compliance 100%
- [ ] Cross-browser compatibility 100%

## Notes

- Cocher chaque item au fur et à mesure de l'implémentation
- Documenter les blockers et décisions importantes
- Faire des commits atomiques avec messages clairs
- Créer des PRs pour chaque phase majeure
- Demander des reviews régulières

## Timeline Estimé

- Phase 1: 1 jour
- Phase 2: 2 jours
- Phase 3: 4 jours
- Phase 4: 2 jours
- Phase 5: 1 jour
- Phase 6: 2 jours
- Phase 7: 0.5 jour
- Phase 8: 1 jour
- Phase 9: 0.5 jour

**Total: ~14 jours**
