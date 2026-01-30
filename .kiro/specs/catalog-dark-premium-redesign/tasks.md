# Implementation Tasks: Catalog Dark Premium Redesign

## Overview

Ce plan d'implémentation décompose la refonte dark premium du catalogue en tâches discrètes et incrémentales. Chaque tâche construit sur le travail précédent, avec une approche bottom-up : configuration thème → composants → intégration → tests → optimisation.

## Tasks

- [x] 1. Configuration du thème dark premium
  - [x] 1.1 Mettre à jour tailwind.config.ts avec les couleurs dark
    - Ajouter `dark-bg-primary`, `dark-bg-secondary`, `dark-bg-tertiary`
    - Ajouter `dark-text-primary`, `dark-text-secondary`, `dark-text-muted`
    - Ajouter `dark-primary`, `dark-secondary`, `dark-accent`
    - Ajouter `dark-border`, `dark-border-hover`
    - Configurer les variantes dark pour tous les composants
    - _Requirements: 1.1-1.7_
  
  - [x] 1.2 Créer les utility classes pour glass effect
    - Créer `.glass-panel` avec backdrop-filter et border
    - Créer `.glass-card` pour les product cards
    - Créer `.glass-input` pour les form inputs
    - Tester les effets sur différents navigateurs
    - _Requirements: 1.6_
  
  - [x] 1.3 Vérifier les ratios de contraste WCAG AA
    - Tester tous les couples texte/background
    - Ajuster les couleurs si nécessaire
    - Documenter les ratios de contraste
    - _Requirements: 6.1_

- [x] 2. Créer les composants de base dark
  - [x] 2.1 Créer ButtonDark component
    - Variantes: primary (green), secondary (outline), ghost
    - États: default, hover, focus, disabled, loading
    - Tailles: sm, md, lg
    - Support icône left/right
    - _Requirements: 2.3, 2.4, 5.3_
  
  - [x] 2.2 Créer InputDark component
    - Style dark avec glass effect
    - États: default, focus, error, disabled
    - Support label, placeholder, helper text, error message
    - Accessibilité: aria-labels, aria-describedby
    - _Requirements: 3.4, 5.2_
  
  - [x] 2.3 Créer SelectDark component
    - Style dark avec glass effect
    - Support single et multi-select
    - Recherche intégrée pour longues listes
    - Navigation clavier
    - _Requirements: 3.3, 3.4_
  
  - [x] 2.4 Créer BadgeDark component
    - Variantes: availability, eudr, certification
    - Style pill avec backdrop blur
    - Tailles: sm (12px), md (14px)
    - _Requirements: 4.2_

- [x] 3. Créer TrustStripDark component
  - [x] 3.1 Implémenter le composant avec icônes + labels
    - Layout: flex row horizontal, gap responsive
    - Variantes: compact, detailed
    - Tooltip au hover avec backdrop blur
    - Items par défaut: 24h, NDA, EUDR, QA, COA
    - _Requirements: 2.5, 6.7_
  
  - [x] 3.2 Créer les icônes SVG pour chaque trust item
    - Clock (24h)
    - Shield (NDA)
    - Leaf (EUDR)
    - CheckCircle (QA)
    - FileText (COA)
    - _Requirements: 2.5_

- [ ] 4. Créer CatalogHeaderDark component
  - [x] 4.1 Implémenter le header avec gradient background
    - H1: "Catalogue Produits" (56px desktop, 44px mobile)
    - Subtitle avec messaging QA + traçabilité
    - TrustStripDark intégré
    - Deux CTAs: Primary (Devis) + Secondary (PDF)
    - Max-height: 30vh desktop, 40vh mobile
    - _Requirements: 2.1-2.7_
  
  - [x] 4.2 Ajouter les traductions FR/EN
    - Heading, subtitle, CTAs
    - Trust items labels et tooltips
    - _Requirements: 7.1-7.7_

- [x] 5. Créer CatalogFiltersDark component
  - [x] 5.1 Implémenter la barre de filtres desktop
    - Position sticky avec glass effect
    - Labels visibles pour chaque filtre
    - Placeholders explicites
    - Compteur de résultats
    - Bouton "Reset" quand filtres actifs
    - _Requirements: 3.1-3.9_
  
  - [x] 5.2 Implémenter le drawer mobile
    - Bouton "Filtrer (X)" avec badge count
    - Sheet depuis le bas, max-height 80vh
    - Tous les filtres accessibles
    - Boutons Apply/Reset
    - _Requirements: 3.2, 9.5_
  
  - [x] 5.3 Implémenter la logique de filtrage
    - Fonction applyFilters avec AND logic
    - Debounce search (300ms)
    - Sync avec URL params
    - _Requirements: 3.1-3.9_
  
  - [x] 5.4 Ajouter le tracking analytics
    - Event "filter_used" avec type et valeur
    - Inclure resultCount
    - _Requirements: 8.1_

- [x] 6. Créer ProductCardDark component
  - [x] 6.1 Implémenter la structure de base
    - Container avec glass effect
    - Border-radius 28px
    - Shadow et hover states
    - Min-height 520px
    - _Requirements: 4.1-4.11_
  
  - [x] 6.2 Implémenter la section image
    - Aspect ratio 4:3
    - Gradient overlay
    - Badges top-right (EUDR, Availability)
    - Fallback premium si pas d'image
    - _Requirements: 4.1, 4.2_
  
  - [x] 6.3 Implémenter la section content
    - H3 product name (22px)
    - Subtitle (14px)
    - Quick specs grid (Origine, MOQ, Incoterms)
    - Document indicators
    - _Requirements: 4.3-4.5_
  
  - [x] 6.4 Implémenter la section actions
    - Primary button: "Demander un devis"
    - Secondary link: "Voir fiche technique" (gold)
    - Microproof: "Réponse sous 24h • NDA possible"
    - _Requirements: 4.6, 4.7_
  
  - [x] 6.5 Ajouter les hover et focus states
    - Transform translateY(-4px)
    - Shadow enhancement
    - Border color change
    - Focus outline gold 2px
    - _Requirements: 4.8, 4.9, 6.9_
  
  - [x] 6.6 Ajouter le tracking analytics
    - Event "quote_click" au clic CTA
    - Event "spec_click" au clic secondary link
    - Inclure product metadata
    - _Requirements: 8.2, 8.5_

- [ ] 7. Créer RFQDrawerDark component
  - [x] 7.1 Implémenter la structure du drawer
    - Width 480px desktop, 100vw mobile
    - Height 100vh, fixed right
    - Background dark avec glass overlay
    - Animation slide from right
    - _Requirements: 5.1-5.9_
  
  - [x] 7.2 Implémenter le formulaire
    - Produit pré-rempli (read-only)
    - Champs: Quantité, Incoterm, Destination, Email, Société, Notes
    - Validation des champs requis
    - Messages d'erreur clairs
    - _Requirements: 5.2-5.4_
  
  - [x] 7.3 Ajouter les trust elements
    - "Réponse sous 24h"
    - "NDA disponible sur demande"
    - _Requirements: 5.5_
  
  - [x] 7.4 Implémenter la soumission
    - Loading state pendant envoi
    - Success message après soumission
    - Error handling
    - _Requirements: 5.6, 5.7_
  
  - [x] 7.5 Ajouter le tracking analytics
    - Event "rfq_submit" avec form data
    - Inclure product metadata
    - _Requirements: 8.3, 8.5_

- [x] 8. Créer MobileRFQButtonDark component
  - [x] 8.1 Implémenter le bouton sticky bottom
    - Position fixed bottom, z-50
    - Background green avec glass effect
    - Full width, 48px height
    - Shadow top
    - Safe area insets
    - _Requirements: 5.8, 9.6_
  
  - [x] 8.2 Ajouter le tracking analytics
    - Event "quote_click" avec source: 'mobile_cta'
    - _Requirements: 8.2_

- [x] 9. Intégrer les composants dans la page
  - [x] 9.1 Créer ProductCatalogPageDark
    - Fetch products depuis Sanity
    - Manage filter state
    - Manage RFQ drawer state
    - Coordinate entre composants
    - _Requirements: 1.1-1.7_
  
  - [x] 9.2 Implémenter le layout responsive
    - Grid 1 col mobile, 2-3 tablet, 3-4 desktop
    - Spacing responsive
    - Breakpoints: 768px, 1024px, 1280px
    - _Requirements: 9.1-9.4_
  
  - [x] 9.3 Ajouter les traductions complètes
    - FR et EN pour tous les composants
    - Fallback sur EN si traduction manquante
    - _Requirements: 7.1-7.7_

- [x] 10. Optimisation des performances
  - [x] 10.1 Implémenter le lazy loading des images
    - next/image avec loading="lazy"
    - Sizes attribute approprié
    - Formats optimisés (WebP, AVIF)
    - _Requirements: 6.4, 10.3_
  
  - [x] 10.2 Implémenter le code splitting
    - Dynamic imports pour RFQDrawer
    - Dynamic imports pour modals
    - Loading states
    - _Requirements: 10.4_
  
  - [x] 10.3 Implémenter la mémoization
    - useMemo pour filteredProducts
    - useCallback pour handlers
    - Debounce search input
    - _Requirements: 10.5, 10.6_
  
  - [x] 10.4 Implémenter le prefetching
    - Prefetch product pages au hover
    - Next.js Link avec prefetch
    - _Requirements: 10.7_

- [x] 11. Tests et validation
  - [x] 11.1 Tests unitaires des composants
    - CatalogHeaderDark
    - CatalogFiltersDark
    - ProductCardDark
    - RFQDrawerDark
    - TrustStripDark
  
  - [x] 11.2 Tests d'intégration
    - Filter application updates grid
    - RFQ form submission flow
    - PDF download flow
  
  - [x] 11.3 Tests E2E
    - User journey complet
    - Mobile-specific flows
    - Cross-browser testing
  
  - [x] 11.4 Tests d'accessibilité
    - Automated: axe-core, Lighthouse
    - Manual: Keyboard navigation
    - Manual: Screen reader testing
    - _Requirements: 6.1-6.9_
  
  - [x] 11.5 Tests de performance
    - Lighthouse scores (≥85 desktop, ≥75 mobile)
    - Core Web Vitals
    - Image loading times
    - _Requirements: 10.1, 10.2_

- [ ] 12. Documentation et déploiement
  - [ ] 12.1 Documenter les composants
    - Props interfaces
    - Usage examples
    - Storybook stories (optionnel)
  
  - [ ] 12.2 Créer le guide de migration
    - Étapes de déploiement
    - Rollback plan
    - A/B testing setup (optionnel)
  
  - [ ] 12.3 Configurer le monitoring
    - Analytics events
    - Error tracking (Sentry)
    - Performance monitoring
    - _Requirements: 8.1-8.7_

## Notes

- Toutes les tâches doivent respecter les requirements spécifiés
- Les composants doivent être réutilisables avec interfaces TypeScript
- Le thème dark doit être cohérent sur tous les composants
- L'accessibilité WCAG AA est obligatoire
- Les tests sont intégrés tout au long du développement
- Le tracking analytics est essentiel pour mesurer le succès

## Ordre d'implémentation recommandé

1. Configuration thème (Task 1)
2. Composants de base (Task 2)
3. Composants métier (Tasks 3-8)
4. Intégration page (Task 9)
5. Optimisation (Task 10)
6. Tests (Task 11)
7. Documentation (Task 12)

## Estimation

- Configuration thème: 1 jour
- Composants de base: 2 jours
- Composants métier: 4 jours
- Intégration: 2 jours
- Optimisation: 1 jour
- Tests: 2 jours
- Documentation: 1 jour

**Total: ~13 jours de développement**
