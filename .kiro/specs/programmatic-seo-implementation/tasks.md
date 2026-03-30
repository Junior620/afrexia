# Tasks - SEO Programmatique Afrexia

## Overview

Ce document définit les tâches d'implémentation pour le système de SEO programmatique Afrexia. L'implémentation est organisée en 3 phases progressives (V1, V2, V3) pour garantir une livraison incrémentale de valeur métier.

**Volumétrie totale:**
- V1 (MVP): ~30 pages validées métier
- V2 (Extension): ~33 pages supplémentaires
- V3 (Avancé): ~15 pages supplémentaires
- Total: ~78 pages × 5 locales = ~390 URLs au sitemap

**Approche:** Chaque phase est complètement implémentable et déployable indépendamment. Les tests property-based sont créés en parallèle de l'implémentation pour valider les 41 propriétés de correction.

---

## Phase V1 (MVP - Livrable Immédiat)

### 1. Setup & Infrastructure V1

- [x] 1.1 Configurer l'environnement de développement
  - Installer fast-check pour property-based testing: `npm install --save-dev fast-check @types/fast-check`
  - Créer la structure de dossiers: `lib/seo/`, `types/seo.ts`, `__tests__/properties/`, `__tests__/unit/`
  - Configurer TypeScript pour les nouveaux types SEO
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 1.2 Créer les types TypeScript de base
  - Créer `types/seo.ts` avec tous les types (Locale, ContentSourceType, LocalizedString, ExportCountry, RouteValidationResult, etc.)
  - Définir les interfaces pour PageMetadata, SchemaOrgData, FAQ, QualityThreshold, IndexabilityDecision
  - _Requirements: 1.1, 1.6, 1.7, 1.8, 1.9_

- [x] 1.3 Configurer ISR pour les pages programmatiques
  - Définir les constantes de revalidation (24h pour prix, 7j pour autres pages)
  - Configurer les headers de cache (Cache-Control, ETag)
  - Implémenter la stratégie stale-while-revalidate
  - _Requirements: 1.15_

### 2. Sanity Schemas V1

- [x] 2.1 Créer le schéma ExportCountry
  - Définir les champs multilingues (name: fr, en, es, de, ru) avec validation required sur fr et en
  - Ajouter les champs: slug, code (ISO 3166-1 alpha-2), flag (emoji), description (multilingue)
  - Ajouter les champs: targetMarkets (array), mainPorts (references), requiredCertifications (references)
  - Ajouter customsInfo (multilingue), averageTransitTime (days + note multilingue)
  - Ajouter dataCompleteness (number 0-100) et approvedForSEO (boolean)
  - Configurer le preview personnalisé avec flag + name.en
  - _Requirements: 1.1_


- [ ]* 2.2 Tester le schéma ExportCountry
  - Vérifier que tous les champs requis sont définis
  - Vérifier que la validation est présente sur les champs obligatoires
  - Vérifier que le preview est configuré
  - _Requirements: 1.1_

### 3. Core Services V1

- [x] 3.1 Implémenter RouteCombinationValidator
  - Créer `lib/seo/routeCombinationValidator.ts`
  - Implémenter validateProductCountry() avec vérification approvedForSEO et dataCompleteness >= 70%
  - Implémenter logRejectedCombination() pour logger les rejets avec raison
  - Implémenter generateValidationReport() pour rapport validées vs rejetées
  - _Requirements: 1.2_

- [ ]* 3.2 Écrire les tests property-based pour RouteCombinationValidator
  - **Property 2: Route Combination Validation**
  - **Valide: Requirements 1.2.1, 1.2.2, 1.2.5**
  - Tester que toute combinaison avec approvedForSEO=false OU dataCompleteness<70% est rejetée
  - Utiliser fast-check avec fc.record() pour générer des combinaisons aléatoires
  - Minimum 100 runs
  - _Requirements: 1.2_

- [ ]* 3.3 Écrire les tests property-based pour le logging des rejets
  - **Property 3: Rejected Combination Logging**
  - **Valide: Requirements 1.2.6**
  - Tester que chaque combinaison rejetée génère un log avec raison
  - _Requirements: 1.2_

- [x] 3.4 Implémenter ContentGenerator
  - Créer `lib/seo/contentGenerator.ts`
  - Implémenter generateProductCountryIntro() avec templates et variations
  - Implémenter generateContextualFAQs() pour 3-5 FAQ uniques par page
  - Implémenter calculateContentLength() et meetsMinimumLength() (500 mots minimum)
  - Implémenter markContentSource() pour marquer le type de source (sanity/calculated/template/editorial)
  - Implémenter generateDisclaimer() pour prix/délais/coûts estimés
  - Implémenter applyLanguageFallback() avec logging des fallbacks
  - Implémenter calculateFallbackPercentage() et logContentDistribution()
  - _Requirements: 1.6, 1.7, 1.8, 1.10_

- [ ]* 3.5 Écrire les tests property-based pour ContentGenerator
  - **Property 1: Multilingual Fallback Consistency**
  - **Valide: Requirements 1.1.2, 1.7.5**
  - Tester que toute traduction manquante utilise l'anglais comme fallback
  - **Property 12: Minimum Content Length**
  - **Valide: Requirements 1.6.6**
  - Tester que tout contenu généré a au moins 500 mots
  - **Property 14: Content Source Marking**
  - **Valide: Requirements 1.6.8, 1.8.1**
  - Tester que tout bloc de contenu est marqué avec son sourceType
  - **Property 16: Fallback Usage Logging**
  - **Valide: Requirements 1.7.6**
  - Tester que chaque fallback génère un log
  - _Requirements: 1.6, 1.7, 1.8_


- [x] 3.6 Implémenter IndexabilityController
  - Créer `lib/seo/indexabilityController.ts`
  - Définir QUALITY_THRESHOLD (minDataCompleteness: 70%, minContentLength: 500 mots, maxFallbackPercentage: 30%)
  - Implémenter determineIndexability() qui vérifie les 3 seuils
  - Implémenter generateRobotsMetaTag() qui retourne "index, follow" ou "noindex, follow"
  - Implémenter generateIndexabilityReport() avec breakdown des raisons de non-indexabilité
  - _Requirements: 1.9_

- [ ]* 3.7 Écrire les tests property-based pour IndexabilityController
  - **Property 19: High Fallback Content Non-Indexability**
  - **Valide: Requirements 1.7.9, 1.9.4**
  - Tester que toute page avec >30% de fallback est marquée noindex
  - **Property 25: Quality Threshold Non-Indexability**
  - **Valide: Requirements 1.9.4**
  - Tester que toute page ne respectant pas les seuils est marquée noindex
  - _Requirements: 1.9_

- [x] 3.8 Implémenter MetadataGenerator
  - Créer `lib/seo/metadataGenerator.ts`
  - Implémenter generatePageMetadata() avec title (50-60 chars), description (150-160 chars), canonical, hreflang
  - Implémenter generateProductSchema() pour données structurées Product + Offer
  - Implémenter generateBreadcrumbSchema() pour BreadcrumbList
  - Implémenter generateFAQSchema() pour FAQPage
  - Implémenter optimizeTitle() et optimizeDescription() pour respecter les longueurs
  - _Requirements: 1.12_

- [ ]* 3.9 Écrire les tests property-based pour MetadataGenerator
  - **Property 29: Metadata Title Length Optimization**
  - **Valide: Requirements 1.12.1**
  - Tester que tout title généré fait 50-60 caractères
  - **Property 30: Metadata Description Length Optimization**
  - **Valide: Requirements 1.12.2**
  - Tester que toute description générée fait 150-160 caractères
  - **Property 6: Schema.org Structured Data Presence**
  - **Valide: Requirements 1.12.3, 1.12.4**
  - Tester que toute page produit contient Product et Offer schema
  - **Property 31: FAQ Schema.org Presence**
  - **Valide: Requirements 1.12.6**
  - Tester que toute page avec FAQ contient FAQPage schema
  - **Property 32: Social Sharing Metadata**
  - **Valide: Requirements 1.12.7, 1.12.8**
  - Tester que toute page contient Open Graph et Twitter Card
  - _Requirements: 1.12_

- [x] 3.10 Implémenter SitemapGenerator (V1 uniquement)
  - Créer `lib/seo/sitemapGenerator.ts`
  - Implémenter generateSitemap() qui agrège toutes les entrées V1
  - Implémenter generateProductCountryEntries() avec query Sanity pour combinaisons validées
  - Implémenter generatePriceEntries() pour pages de prix
  - Implémenter generateComparisonEntries() pour pages de comparaison
  - Implémenter entriesToXML() pour convertir en XML valide
  - Exclure les pages noindex du sitemap
  - _Requirements: 1.11_


- [ ]* 3.11 Écrire les tests property-based pour SitemapGenerator
  - **Property 26: Non-Indexable Pages Excluded from Sitemap**
  - **Valide: Requirements 1.9.6, 1.11.6**
  - Tester qu'aucune page noindex n'apparaît dans le sitemap
  - **Property 27: Sitemap Entry Completeness**
  - **Valide: Requirements 1.11.3, 1.11.4, 1.11.5**
  - Tester que toute URL du sitemap a lastmod, changefreq et priority
  - **Property 28: Price Page Changefreq**
  - **Valide: Requirements 1.11.5**
  - Tester que toute page de prix a changefreq="daily"
  - **Property 17: Sitemap Locale Variants**
  - **Valide: Requirements 1.7.7**
  - Tester que toute page indexable a ses 5 variantes de locale dans le sitemap
  - _Requirements: 1.11_

- [x] 3.12 Implémenter InternalLinkingEngine
  - Créer `lib/seo/internalLinkingEngine.ts`
  - Implémenter generateRelatedLinks() pour 4-6 liens pertinents par page
  - Implémenter generateBreadcrumb() avec liens cliquables
  - Implémenter varyAnchorText() pour éviter la sur-optimisation
  - Prioriser les liens vers pages indexables
  - _Requirements: 1.13_

- [ ]* 3.13 Écrire les tests property-based pour InternalLinkingEngine
  - **Property 33: Internal Links Presence**
  - **Valide: Requirements 1.13.1, 1.13.2, 1.13.3, 1.13.4, 1.13.5**
  - Tester que toute page a breadcrumb + section "pages connexes" avec 4-6 liens
  - **Property 34: Anchor Text Variation**
  - **Valide: Requirements 1.13.6**
  - Tester que les anchor texts sont variés
  - **Property 35: Indexable Link Prioritization**
  - **Valide: Requirements 1.13.7**
  - Tester que les liens pointent préférentiellement vers pages indexables
  - _Requirements: 1.13_

### 4. Routes & Pages V1

- [x] 4.1 Créer la route Produit × Pays
  - Créer `app/[locale]/produits/[product-slug]/export-[country-slug]/page.tsx`
  - Implémenter generateStaticParams() pour générer toutes les combinaisons validées
  - Implémenter la validation de route avec RouteCombinationValidator
  - Retourner notFound() si combinaison invalide
  - Configurer revalidate = 604800 (7 jours)
  - Fetcher les données produit et pays depuis Sanity
  - Générer le contenu avec ContentGenerator
  - Générer les métadonnées avec MetadataGenerator
  - Générer les liens internes avec InternalLinkingEngine
  - Vérifier l'indexabilité avec IndexabilityController
  - _Requirements: 1.3_

- [ ]* 4.2 Écrire les tests property-based pour la route Produit × Pays
  - **Property 4: Route Pattern Consistency**
  - **Valide: Requirements 1.3.1**
  - Tester que toute route générée respecte le pattern /[locale]/produits/[product-slug]/export-[country-slug]
  - **Property 5: Page Data Completeness**
  - **Valide: Requirements 1.3.2, 1.3.3, 1.3.4, 1.3.5**
  - Tester que toute page contient les données produit, pays, certifications, ports
  - **Property 15: Multilingual Content Consistency**
  - **Valide: Requirements 1.7.1, 1.7.2, 1.7.3, 1.7.4**
  - Tester que tout le contenu est dans la locale demandée ou en fallback anglais
  - _Requirements: 1.3_


- [x] 4.3 Créer la route Prix
  - Créer `app/[locale]/prix/[product-slug]-cameroun/page.tsx`
  - Implémenter generateStaticParams() pour tous les produits
  - Configurer revalidate = 86400 (24 heures)
  - Fetcher les données de prix depuis Sanity (prix actuel + historique 30 jours)
  - Générer le graphique d'évolution des prix
  - Calculer la tendance (hausse/baisse/stable) et le pourcentage de variation
  - Afficher la source des données avec date de dernière mise à jour
  - Générer les métadonnées avec le prix actuel dans le title
  - _Requirements: 1.4_

- [ ]* 4.4 Écrire les tests pour la route Prix
  - Tester que revalidate = 86400
  - Tester que les données de prix sont affichées
  - Tester que l'historique 30 jours est présent
  - Tester que la tendance est calculée
  - _Requirements: 1.4_

- [x] 4.5 Créer les routes Comparaisons
  - Créer `app/[locale]/guide/[comparison-type]/page.tsx`
  - Supporter les patterns: [product-a]-vs-[product-b] et [product]-[origin-a]-vs-[origin-b]
  - Générer des tableaux comparatifs (prix, qualité, certifications, disponibilité)
  - Inclure des recommandations basées sur les cas d'usage
  - Inclure des sections sur différences de goût, qualité, applications
  - Générer les métadonnées optimisées pour requêtes de comparaison
  - Retourner 404 si produits comparés n'existent pas
  - _Requirements: 1.5_

- [ ]* 4.6 Écrire les tests pour les routes Comparaisons
  - Tester que les tableaux comparatifs sont générés
  - Tester que les recommandations sont présentes
  - Tester que 404 est retourné si produits invalides
  - _Requirements: 1.5_

- [x] 4.7 Créer la page 404 personnalisée
  - Créer `app/[locale]/not-found.tsx`
  - Afficher des suggestions de pages similaires
  - Inclure un formulaire de recherche
  - Inclure des liens vers les pages les plus populaires
  - Retourner le statut HTTP 404 approprié
  - _Requirements: 1.14_

- [ ]* 4.8 Écrire les tests pour la page 404
  - **Property 36: Custom 404 Page**
  - **Valide: Requirements 1.14.1, 1.14.3, 1.14.4, 1.14.5**
  - Tester que la page 404 contient suggestions, formulaire de recherche, liens populaires
  - **Property 37: Invalid Route Logging**
  - **Valide: Requirements 1.14.2**
  - Tester que chaque accès à route invalide génère un log
  - _Requirements: 1.14_

- [x] 4.9 Implémenter la gestion des erreurs ISR
  - Configurer le error handling pour les régénérations ISR
  - Servir la version en cache en cas d'échec de régénération
  - Logger les erreurs de régénération avec contexte complet
  - _Requirements: 1.15_


- [ ]* 4.10 Écrire les tests property-based pour ISR
  - **Property 38: ISR Regeneration Error Handling**
  - **Valide: Requirements 1.15.5**
  - Tester que toute erreur de régénération sert la version en cache et log l'erreur
  - **Property 39: Cache Headers Presence**
  - **Valide: Requirements 1.15.7**
  - Tester que toute page a les headers Cache-Control et ETag
  - _Requirements: 1.15_

### 5. Sitemap & SEO V1

- [x] 5.1 Créer le sitemap XML dynamique
  - Créer `app/sitemap.ts` (ou `app/sitemap-seo.xml/route.ts`)
  - Utiliser SitemapGenerator.generateSitemap() pour obtenir toutes les entrées V1
  - Convertir en XML avec SitemapGenerator.entriesToXML()
  - Organiser par sections (produit×pays, prix, guides)
  - Définir les priorités (0.7-0.8) et changefreq appropriées
  - Exclure les pages noindex
  - _Requirements: 1.11_

- [ ]* 5.2 Tester le sitemap XML
  - Tester que le XML est valide
  - Tester que toutes les pages indexables V1 sont présentes
  - Tester qu'aucune page noindex n'est présente
  - Tester que les 5 locales sont présentes pour chaque page
  - _Requirements: 1.11_

- [x] 5.3 Implémenter les balises hreflang
  - Ajouter les balises hreflang dans MetadataGenerator.generatePageMetadata()
  - Générer les URLs pour toutes les 5 locales (fr, en, es, de, ru)
  - Inclure x-default pointant vers la version française
  - _Requirements: 1.7_

- [ ]* 5.4 Tester les balises hreflang
  - Tester que toute page a 5 balises hreflang + x-default
  - Tester que les URLs hreflang sont correctes
  - _Requirements: 1.7_

- [x] 5.5 Implémenter la redirection des locales non supportées
  - Créer un middleware pour détecter les locales non supportées
  - Rediriger vers la locale française par défaut
  - _Requirements: 1.7_

- [ ]* 5.6 Tester la redirection des locales
  - **Property 18: Unsupported Locale Redirect**
  - **Valide: Requirements 1.7.8**
  - Tester que toute locale non supportée redirige vers français
  - _Requirements: 1.7_

### 6. Optimisations Performance V1

- [x] 6.1 Optimiser les composants React
  - Utiliser React Server Components pour toutes les pages programmatiques
  - Minimiser le JavaScript côté client
  - Implémenter le streaming HTML pour améliorer FCP
  - _Requirements: 1.16_

- [x] 6.2 Optimiser les images
  - Utiliser next/image pour toutes les images
  - Configurer le lazy loading
  - Optimiser les formats (WebP, AVIF)
  - _Requirements: 1.16_

- [x] 6.3 Implémenter le prefetching des liens internes
  - Configurer le prefetching automatique des liens visibles
  - Utiliser next/link avec prefetch={true}
  - _Requirements: 1.16_


- [ ]* 6.4 Tester les performances
  - **Property 40: Page Performance TTFB**
  - **Valide: Requirements 1.16.4**
  - Tester que toute page a TTFB < 2 secondes
  - **Property 41: Lighthouse Performance Score**
  - **Valide: Requirements 1.16.5**
  - Tester que toute page a score Lighthouse ≥ 90
  - _Requirements: 1.16_

### 7. Data & Content V1

- [x] 7.1 Créer les données de test dans Sanity
  - Créer 5 pays d'export (Pays-Bas, Belgique, Allemagne, France, Chine)
  - Remplir tous les champs multilingues (fr, en minimum)
  - Définir dataCompleteness et approvedForSEO pour chaque pays
  - Créer les relations avec les ports et certifications existants
  - _Requirements: 1.1_

- [x] 7.2 Valider les combinaisons métier
  - Identifier les 15 combinaisons produit×pays à approuver
  - Marquer approvedForSEO = true pour ces combinaisons
  - Vérifier que dataCompleteness >= 70% pour chaque combinaison
  - _Requirements: 1.2_

- [x] 7.3 Créer les templates de contenu
  - Créer les templates d'introduction pour pages produit×pays (5 variations minimum)
  - Créer les templates de FAQ par type de page (prix, comparaison, produit×pays)
  - Créer les variations de structure de contenu
  - _Requirements: 1.6_

- [x] 7.4 Créer les disclaimers
  - Créer les disclaimers pour prix estimés (5 locales)
  - Créer les disclaimers pour délais estimés (5 locales)
  - Créer les disclaimers pour coûts logistiques estimés (5 locales)
  - _Requirements: 1.10_

### 8. Testing & Quality V1

- [x] 8.1 Exécuter tous les tests property-based V1
  - Exécuter les 41 tests property-based avec minimum 100 runs chacun
  - Vérifier que tous les tests passent
  - Générer un rapport de couverture des propriétés
  - _Requirements: Toutes les requirements V1_

- [x] 8.2 Exécuter les tests unitaires V1
  - Tester tous les services individuellement
  - Tester tous les schémas Sanity
  - Tester les routes avec données mockées
  - Atteindre 80% de couverture de code minimum
  - _Requirements: Toutes les requirements V1_

- [x] 8.3 Tester l'intégration complète V1
  - Tester le flux complet de génération de page produit×pays
  - Tester le flux complet de génération de page prix
  - Tester le flux complet de génération de page comparaison
  - Tester la génération du sitemap
  - _Requirements: Toutes les requirements V1_

- [x] 8.4 Valider la qualité du contenu
  - Vérifier que toutes les pages générées ont >= 500 mots
  - Vérifier que le contenu est unique (pas de duplicate)
  - Vérifier que les FAQ sont contextuelles et variées
  - Vérifier que les disclaimers sont présents sur les données estimées
  - _Requirements: 1.6, 1.8, 1.10_


### 9. Documentation V1

- [x] 9.1 Documenter l'architecture
  - Créer ARCHITECTURE.md avec diagrammes et explications
  - Documenter tous les services et leurs responsabilités
  - Documenter le flux de génération de page
  - _Requirements: Toutes les requirements V1_

- [x] 9.2 Documenter les tests property-based
  - Créer TESTING.md avec guide des property-based tests
  - Documenter chaque propriété et son mapping aux requirements
  - Documenter comment ajouter de nouveaux tests
  - _Requirements: Toutes les requirements V1_

- [x] 9.3 Documenter le déploiement V1
  - Créer DEPLOYMENT.md avec checklist de déploiement V1
  - Documenter la stratégie de rollback
  - Documenter le monitoring post-déploiement
  - _Requirements: Toutes les requirements V1_

### 10. Déploiement V1

- [x] 10.1 Déployer en staging
  - Déployer la branche staging sur Vercel
  - Configurer Sanity dataset staging
  - Exécuter tous les tests en staging
  - Valider manuellement les pages générées
  - _Requirements: Toutes les requirements V1_

- [ ] 10.2 Valider les métriques en staging
  - Vérifier TTFB < 2s sur toutes les pages
  - Vérifier score Lighthouse >= 90
  - Vérifier que le sitemap est généré correctement
  - Vérifier que les métadonnées SEO sont correctes
  - _Requirements: 1.11, 1.12, 1.16_

- [x] 10.3 Checkpoint V1 - Validation complète
  - Vérifier que les ~30 pages V1 sont générées
  - Vérifier que toutes les pages indexables respectent les Quality_Threshold
  - Vérifier que tous les tests passent
  - Vérifier si tout build
  - Obtenir l'approbation de l'équipe pour déploiement production
  - _Requirements: Toutes les requirements V1_

- [x] 10.4 Déployer en production
  - Merger la branche staging vers main
  - Déploiement automatique via Vercel
  - Configurer le monitoring (Sentry, Vercel Analytics)
  - Surveiller les métriques pendant 24h
  - _Requirements: Toutes les requirements V1_

---

## Phase V2 (Extension - Post-V1)

### 11. Sanity Schemas V2

- [ ] 11.1 Créer le schéma DestinationPort
  - Définir les champs multilingues (name: fr, en, es, de, ru)
  - Ajouter les champs: slug, city, country (reference), locode (UN/LOCODE), coordinates (geopoint)
  - Ajouter description (multilingue), capacity (teu + note), transitTimeFromDouala (days + note)
  - Ajouter estimatedCost (amount, currency, unit, note), supportedIncoterms (references)
  - Ajouter dataCompleteness et approvedForSEO
  - Configurer le preview avec name.en + city + locode
  - _Requirements: 2.1_

- [ ]* 11.2 Tester le schéma DestinationPort
  - Vérifier que tous les champs requis sont définis
  - Vérifier la validation des champs obligatoires
  - _Requirements: 2.1_


- [ ] 11.3 Créer le schéma HarvestSeason
  - Définir les champs: product (reference), region (string), startMonth (1-12), endMonth (1-12)
  - Ajouter peakMonths (array of numbers), availability (multilingue), qualityVariations (multilingue)
  - Ajouter priceVariations (multilingue), recommendations (multilingue)
  - Ajouter dataCompleteness et approvedForSEO
  - Configurer le preview avec productName + region + mois
  - _Requirements: 2.1_

- [ ]* 11.4 Tester le schéma HarvestSeason
  - Vérifier que tous les champs requis sont définis
  - Vérifier la validation des mois (1-12)
  - _Requirements: 2.1_

### 12. Core Services V2

- [ ] 12.1 Étendre RouteCombinationValidator pour V2
  - Implémenter validateCertificationProduct()
  - Implémenter validatePortProduct()
  - Implémenter validateHarvestSeason()
  - _Requirements: 2.2, 2.3, 2.4_

- [ ]* 12.2 Tester les nouvelles validations V2
  - Tester validateCertificationProduct() avec property-based tests
  - Tester validatePortProduct() avec property-based tests
  - _Requirements: 2.2, 2.3_

- [ ] 12.3 Étendre ContentGenerator pour V2
  - Implémenter generateCertificationProductIntro()
  - Implémenter generatePortProductIntro()
  - Implémenter generateHarvestSeasonIntro()
  - Créer de nouveaux templates de FAQ pour ces types de pages
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [ ]* 12.4 Tester ContentGenerator V2
  - Tester que les FAQ sont contextuelles pour chaque type de page
  - Tester que les FAQ contiennent 3-5 questions uniques
  - _Requirements: 2.5_

- [ ] 12.5 Étendre SitemapGenerator pour V2
  - Implémenter generateCertificationProductEntries()
  - Implémenter generatePortProductEntries()
  - Implémenter generateHarvestSeasonEntries()
  - Mettre à jour generateSitemap() pour inclure V2
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 12.6 Tester SitemapGenerator V2
  - Tester que toutes les pages V2 indexables sont dans le sitemap
  - Tester que les 5 locales sont présentes pour chaque page V2
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

### 13. Routes & Pages V2

- [ ] 13.1 Créer la route Certification × Produit
  - Créer `app/[locale]/certifications/[certification-slug]-[product-slug]/page.tsx`
  - Implémenter generateStaticParams() pour combinaisons validées
  - Valider la combinaison avec RouteCombinationValidator
  - Afficher tous les produits avec cette certification
  - Inclure description de la certification et ses critères
  - Inclure les avantages de la certification
  - Inclure les documents de certification disponibles
  - Générer les métadonnées optimisées pour recherches de produits certifiés
  - _Requirements: 2.2_

- [ ]* 13.2 Tester la route Certification × Produit
  - Tester que la validation de combinaison fonctionne
  - Tester que 404 est retourné si certification invalide
  - Tester que les métadonnées sont optimisées
  - _Requirements: 2.2_


- [ ] 13.3 Créer la route Port × Produit
  - Créer `app/[locale]/logistique/export-[product-slug]-port-[port-slug]/page.tsx`
  - Implémenter generateStaticParams() pour combinaisons validées
  - Inclure les informations du port (localisation, capacités, délais)
  - Inclure les délais de transit estimés depuis Douala avec disclaimer
  - Inclure les coûts logistiques estimés avec disclaimer
  - Inclure les formalités douanières pour le pays du port
  - Afficher la date de dernière mise à jour des informations logistiques
  - _Requirements: 2.3_

- [ ]* 13.4 Tester la route Port × Produit
  - **Property 20: Estimated Data Disclaimers**
  - **Valide: Requirements 1.8.6, 1.10.2, 1.10.3, 1.10.4**
  - Tester que les disclaimers sont présents pour délais et coûts estimés
  - **Property 21: Data Freshness Indicators**
  - **Valide: Requirements 1.10.1**
  - Tester que la date de dernière mise à jour est affichée
  - _Requirements: 2.3_

- [ ] 13.5 Créer les routes Saisonnalité
  - Créer `app/[locale]/recolte/[product-slug]-cameroun-saison-[year]/page.tsx`
  - Créer `app/[locale]/calendrier-recolte/[product-slug]-afrique-ouest/page.tsx`
  - Inclure un calendrier visuel des périodes de récolte
  - Inclure les variations de qualité selon la saison
  - Inclure les variations de prix selon la saison
  - Inclure les recommandations d'achat par période
  - Configurer ISR pour régénération annuelle
  - _Requirements: 2.4_

- [ ]* 13.6 Tester les routes Saisonnalité
  - Tester que le calendrier visuel est généré
  - Tester que les variations de qualité et prix sont affichées
  - Tester que les recommandations sont présentes
  - _Requirements: 2.4_

### 14. Analytics V2

- [ ] 14.1 Configurer Google Analytics pour pages programmatiques
  - Ajouter les événements GA pour chaque type de page V2
  - Configurer les dimensions personnalisées (produit, pays, certification, port)
  - Tracker les conversions (demandes de devis) par type de page
  - Tracker les taux de rebond par axe SEO
  - _Requirements: 2.6_

- [ ] 14.2 Implémenter le système de consentement RGPD
  - Créer un banner de consentement cookies
  - Permettre l'opt-out du tracking analytics
  - Respecter les préférences utilisateur
  - _Requirements: 2.6_

- [ ]* 14.3 Tester le tracking analytics
  - Tester que les événements sont envoyés correctement
  - Tester que les dimensions personnalisées sont trackées
  - Tester que le consentement RGPD fonctionne
  - _Requirements: 2.6_

### 15. Data & Content V2

- [ ] 15.1 Créer les données V2 dans Sanity
  - Créer 5 ports de destination (Rotterdam, Anvers, Hambourg, Le Havre, Shanghai)
  - Créer 4 saisons de récolte par produit
  - Remplir tous les champs multilingues
  - Définir dataCompleteness et approvedForSEO
  - _Requirements: 2.1_

- [ ] 15.2 Valider les combinaisons métier V2
  - Identifier les ~12 combinaisons certification×produit à approuver
  - Identifier les ~15 combinaisons port×produit à approuver
  - Identifier les ~6 pages de saisonnalité à approuver
  - Marquer approvedForSEO = true
  - _Requirements: 2.2, 2.3, 2.4_


- [ ] 15.3 Créer les templates de contenu V2
  - Créer les templates pour pages certification×produit
  - Créer les templates pour pages port×produit
  - Créer les templates pour pages saisonnalité
  - Créer les FAQ contextuelles pour chaque type de page
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

### 16. Testing & Quality V2

- [ ] 16.1 Exécuter tous les tests V2
  - Exécuter les tests property-based pour les nouvelles fonctionnalités
  - Exécuter les tests unitaires pour les nouveaux services
  - Exécuter les tests d'intégration pour les nouvelles routes
  - _Requirements: Toutes les requirements V2_

- [ ] 16.2 Valider la qualité du contenu V2
  - Vérifier que toutes les pages V2 ont >= 500 mots
  - Vérifier que les FAQ sont contextuelles et variées
  - Vérifier que les disclaimers sont présents
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

### 17. Documentation V2

- [ ] 17.1 Mettre à jour la documentation
  - Mettre à jour ARCHITECTURE.md avec les nouveaux composants V2
  - Mettre à jour TESTING.md avec les nouveaux tests
  - Mettre à jour DEPLOYMENT.md avec la checklist V2
  - _Requirements: Toutes les requirements V2_

### 18. Déploiement V2

- [ ] 18.1 Déployer V2 en staging
  - Déployer la branche staging avec V2
  - Exécuter tous les tests en staging
  - Valider manuellement les nouvelles pages
  - _Requirements: Toutes les requirements V2_

- [ ] 18.2 Checkpoint V2 - Validation complète
  - Vérifier que les ~33 pages V2 supplémentaires sont générées
  - Vérifier que le taux d'indexabilité >= 80%
  - Vérifier que les analytics fonctionnent
  - Obtenir l'approbation pour production
  - _Requirements: Toutes les requirements V2_

- [ ] 18.3 Déployer V2 en production
  - Merger vers main
  - Surveiller les métriques pendant 24h
  - Vérifier que les analytics trackent correctement
  - _Requirements: Toutes les requirements V2_

---

## Phase V3 (Avancé - Post-V2)

### 19. Sanity Schemas V3

- [ ] 19.1 Créer le schéma Incoterm
  - Définir les champs: code (string uppercase), name (multilingue), slug
  - Ajouter description (multilingue), sellerResponsibilities (multilingue), buyerResponsibilities (multilingue)
  - Ajouter applicableProducts (references), applicablePorts (references), requiredDocuments (array)
  - Ajouter dataCompleteness et approvedForSEO
  - Configurer le preview avec code + name.en
  - _Requirements: 3.1_

- [ ]* 19.2 Tester le schéma Incoterm
  - Vérifier que tous les champs requis sont définis
  - Vérifier la validation du code (uppercase)
  - _Requirements: 3.1_

- [ ] 19.3 Créer le schéma ContainerType
  - Définir les champs: type (string), slug, name (multilingue)
  - Ajouter capacity (value + unit), dimensions (length, width, height, volume)
  - Ajouter suitableProducts (references), pricing (basePrice, currency, note)
  - Ajouter description (multilingue), dataCompleteness, approvedForSEO
  - Configurer le preview avec type + capacity
  - _Requirements: 3.1_


- [ ]* 19.4 Tester le schéma ContainerType
  - Vérifier que tous les champs requis sont définis
  - Vérifier la validation des champs obligatoires
  - _Requirements: 3.1_

### 20. Core Services V3

- [ ] 20.1 Étendre RouteCombinationValidator pour V3
  - Implémenter validateIncotermProductPort() pour combinaisons à 3 paramètres
  - Implémenter validateContainerProduct()
  - _Requirements: 3.2, 3.3_

- [ ]* 20.2 Tester les validations V3
  - Tester validateIncotermProductPort() avec property-based tests
  - Tester que les combinaisons invalides sont rejetées
  - _Requirements: 3.2, 3.3_

- [ ] 20.3 Étendre ContentGenerator pour V3
  - Implémenter generateIncotermProductPortIntro()
  - Implémenter generateContainerProductIntro()
  - Créer les templates de FAQ pour ces types de pages
  - _Requirements: 3.2, 3.3_

- [ ] 20.4 Étendre SitemapGenerator pour V3
  - Implémenter generateIncotermProductPortEntries()
  - Implémenter generateContainerProductEntries()
  - Mettre à jour generateSitemap() pour inclure V3
  - _Requirements: 3.2, 3.3_

- [ ] 20.5 Optimiser InternalLinkingEngine
  - Implémenter le prefetching intelligent basé sur le comportement utilisateur
  - Optimiser la sélection des liens connexes
  - Améliorer la variation des anchor texts
  - _Requirements: 3.5_

### 21. Routes & Pages V3

- [ ] 21.1 Créer la route Incoterm × Produit × Port
  - Créer `app/[locale]/incoterms/[product-slug]-[incoterm]-[port-slug]/page.tsx`
  - Implémenter generateStaticParams() pour combinaisons validées (~9 pages)
  - Valider que l'incoterm est applicable au produit et au port
  - Inclure la définition complète de l'incoterm
  - Inclure les responsabilités de l'acheteur et du vendeur
  - Inclure le prix estimé pour ce produit avec cet incoterm + disclaimer
  - Inclure les documents requis pour cet incoterm
  - Inclure une comparaison avec d'autres incoterms disponibles
  - Retourner 404 si incoterm non applicable
  - _Requirements: 3.2_

- [ ]* 21.2 Tester la route Incoterm × Produit × Port
  - Tester la validation de combinaison à 3 paramètres
  - Tester que 404 est retourné si incoterm non applicable
  - Tester que les disclaimers sont présents
  - _Requirements: 3.2_

- [ ] 21.3 Créer les routes Volume/Container
  - Créer `app/[locale]/commande/[product-slug]-container-[container-type]/page.tsx`
  - Créer `app/[locale]/commande/[product-slug]-bulk-[quantity]-tonnes/page.tsx`
  - Inclure les spécifications du conteneur (dimensions, capacité)
  - Inclure le prix estimé pour cette quantité + disclaimer
  - Inclure les options de conditionnement disponibles
  - Afficher un avertissement si quantité < MOQ
  - _Requirements: 3.3_

- [ ]* 21.4 Tester les routes Volume/Container
  - Tester que les spécifications du conteneur sont affichées
  - Tester que l'avertissement MOQ est affiché si nécessaire
  - _Requirements: 3.3_


### 22. Analytics Avancés V3

- [ ] 22.1 Implémenter le tracking avancé
  - Tracker les sources de trafic avec attribution détaillée
  - Tracker les parcours utilisateurs entre pages programmatiques
  - Tracker les interactions utilisateurs (clics FAQ, téléchargements, formulaires)
  - Créer des segments d'audience par type de page visitée
  - Tracker les performances de conversion par combinaison de paramètres
  - _Requirements: 3.4_

- [ ] 22.2 Créer les rapports automatisés
  - Implémenter des rapports hebdomadaires automatisés des performances
  - Identifier les combinaisons de routes les plus performantes
  - Créer des alertes pour les métriques critiques
  - _Requirements: 3.4_

- [ ]* 22.3 Tester les analytics avancés
  - Tester que les parcours utilisateurs sont trackés
  - Tester que les segments d'audience sont créés
  - Tester que les rapports sont générés
  - _Requirements: 3.4_

### 23. Optimisations Performance Avancées V3

- [ ] 23.1 Implémenter le edge caching
  - Configurer le edge caching via CDN
  - Optimiser la distribution géographique
  - Implémenter le stale-while-revalidate avancé
  - _Requirements: 3.5_

- [ ] 23.2 Optimiser le Critical Rendering Path
  - Minimiser le CSS critique
  - Inline le CSS critique dans le HTML
  - Optimiser le chargement des fonts
  - Atteindre FCP < 1 seconde
  - _Requirements: 3.5_

- [ ] 23.3 Implémenter le lazy loading progressif
  - Lazy load progressif pour images et graphiques
  - Utiliser Intersection Observer pour le chargement à la demande
  - Optimiser les images avec formats modernes (WebP, AVIF)
  - _Requirements: 3.5_

- [ ] 23.4 Configurer le monitoring Core Web Vitals
  - Monitorer LCP, FID, CLS en temps réel
  - Créer des alertes si dégradation
  - Intégrer avec Vercel Analytics
  - _Requirements: 3.5_

- [ ]* 23.5 Tester les performances avancées
  - Tester que le score Lighthouse >= 95
  - Tester que FCP < 1 seconde
  - Tester que les Core Web Vitals sont au vert
  - _Requirements: 3.5_

### 24. Data & Content V3

- [ ] 24.1 Créer les données V3 dans Sanity
  - Créer 7 incoterms (FOB, CIF, CFR, EXW, FCA, DAP, DDP)
  - Créer 3 types de conteneurs (20ft, 40ft, 40ft HC)
  - Remplir tous les champs multilingues
  - Définir les relations applicableProducts et applicablePorts
  - Définir dataCompleteness et approvedForSEO
  - _Requirements: 3.1_

- [ ] 24.2 Valider les combinaisons métier V3
  - Identifier les ~9 combinaisons incoterm×produit×port à approuver
  - Identifier les ~6 combinaisons container×produit à approuver
  - Marquer approvedForSEO = true
  - _Requirements: 3.2, 3.3_

- [ ] 24.3 Créer les templates de contenu V3
  - Créer les templates pour pages incoterm×produit×port
  - Créer les templates pour pages container×produit
  - Créer les FAQ contextuelles pour ces types de pages
  - _Requirements: 3.2, 3.3_


### 25. Testing & Quality V3

- [ ] 25.1 Exécuter tous les tests V3
  - Exécuter les tests property-based pour les nouvelles fonctionnalités
  - Exécuter les tests unitaires pour les nouveaux services
  - Exécuter les tests d'intégration pour les nouvelles routes
  - Exécuter les tests de performance avancés
  - _Requirements: Toutes les requirements V3_

- [ ] 25.2 Valider la qualité du contenu V3
  - Vérifier que toutes les pages V3 ont >= 500 mots
  - Vérifier que les FAQ sont contextuelles et variées
  - Vérifier que les disclaimers sont présents
  - _Requirements: 3.2, 3.3_

- [ ] 25.3 Valider les performances V3
  - Vérifier que score Lighthouse >= 95 sur toutes les pages
  - Vérifier que FCP < 1 seconde
  - Vérifier que tous les Core Web Vitals sont au vert
  - _Requirements: 3.5_

### 26. Documentation V3

- [ ] 26.1 Mettre à jour la documentation complète
  - Mettre à jour ARCHITECTURE.md avec les composants V3
  - Mettre à jour TESTING.md avec les nouveaux tests
  - Mettre à jour DEPLOYMENT.md avec la checklist V3
  - Créer TROUBLESHOOTING.md avec les problèmes courants et solutions
  - _Requirements: Toutes les requirements V3_

- [ ] 26.2 Créer la documentation utilisateur
  - Documenter comment ajouter de nouveaux pays/ports/incoterms dans Sanity
  - Documenter comment valider les combinaisons métier
  - Documenter comment interpréter les rapports analytics
  - _Requirements: Toutes les requirements V3_

### 27. Déploiement V3

- [ ] 27.1 Déployer V3 en staging
  - Déployer la branche staging avec V3
  - Exécuter tous les tests en staging
  - Valider manuellement les nouvelles pages
  - Valider les performances avancées
  - _Requirements: Toutes les requirements V3_

- [ ] 27.2 Checkpoint V3 - Validation complète
  - Vérifier que les ~15 pages V3 supplémentaires sont générées
  - Vérifier que score Lighthouse >= 95
  - Vérifier que Core Web Vitals sont au vert
  - Vérifier que les analytics avancés fonctionnent
  - Obtenir l'approbation pour production
  - _Requirements: Toutes les requirements V3_

- [ ] 27.3 Déployer V3 en production
  - Merger vers main
  - Surveiller les métriques pendant 24h
  - Vérifier que les performances sont optimales
  - Vérifier que les analytics avancés trackent correctement
  - _Requirements: Toutes les requirements V3_

- [ ] 27.4 Checkpoint Final - Système Complet
  - Vérifier que les ~78 pages totales sont générées
  - Vérifier que ~390 URLs sont dans le sitemap (avec toutes les locales)
  - Vérifier que le taux d'indexabilité >= 80%
  - Vérifier que tous les tests property-based passent (41 propriétés)
  - Générer le rapport final de validation
  - _Requirements: Toutes les requirements V1, V2, V3_

---

## Notes

- Les tâches marquées avec `*` sont optionnelles et peuvent être skippées pour un MVP plus rapide
- Chaque tâche de test property-based référence explicitement la propriété du design document
- Les checkpoints permettent de valider la progression avant de passer à la phase suivante
- Chaque phase est complètement déployable indépendamment
- Les requirements sont référencés pour chaque tâche pour assurer la traçabilité

