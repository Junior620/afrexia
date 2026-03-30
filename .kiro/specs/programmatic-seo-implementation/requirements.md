# Requirements Document

## Introduction

Ce document définit les exigences pour l'implémentation du SEO programmatique sur le site Afrexia. L'objectif est de générer automatiquement des pages optimisées pour capter du trafic longue traîne et cibler des recherches spécifiques liées à l'export de commodités agricoles africaines (cacao, café, cajou) vers les marchés internationaux.

Le système génère des pages dynamiques en utilisant les données existantes dans Sanity CMS (produits, prix, certifications) et en ajoutant de nouvelles entités (pays d'export, ports, incoterms, saisonnalité). 

**Approche par phases:** Le déploiement est organisé en trois phases progressives pour garantir une implémentation réaliste, maintenable et mesurable. Chaque phase apporte une valeur métier claire et s'appuie sur les fondations de la phase précédente.

- **V1 (MVP - Livrable immédiat)**: Axes fondamentaux avec ROI immédiat
  - Produit × Pays d'export (~15 pages)
  - Prix en temps réel (~5 pages)
  - Guides/Comparaisons (~10 pages)
  - Infrastructure de base: Sitemap, Métadonnées SEO, Maillage interne, Gestion erreurs, ISR
  - Sélection intelligente des combinaisons
  - Contrôle qualité et anti-indexation
  - **Total V1: ~30 pages validées métier**

- **V2 (Extension - Post-V1)**: Axes à valeur ajoutée
  - Certification × Produit (~12 pages)
  - Port × Produit (~15 pages)
  - Saisonnalité/Récolte (~6 pages)
  - FAQ contextuelles
  - Tracking analytics de base
  - **Total V2: ~33 pages supplémentaires**

- **V3 (Avancé - Post-V2)**: Axes complexes
  - Incoterm × Produit × Port (~9 pages)
  - Volume/Container (~6 pages)
  - Analytics avancés avec dimensions personnalisées
  - Optimisations performances avancées
  - **Total V3: ~15 pages supplémentaires**

**Volumétrie:** Le système génère uniquement les combinaisons de routes validées métier et supportées par des données de qualité suffisante. Chaque combinaison doit répondre à une intention de recherche identifiable et disposer de contenu substantiel. Les pages ne respectant pas les seuils de qualité ne sont pas générées ou sont marquées comme non-indexables.


## Glossary

- **SEO_System**: Le système de génération automatique de pages SEO programmatiques
- **Content_Generator**: Le composant responsable de la génération de contenu unique pour chaque page
- **Route_Manager**: Le gestionnaire de routes dynamiques Next.js pour les pages programmatiques
- **Sanity_Schema**: Les schémas de données dans Sanity CMS
- **Metadata_Generator**: Le générateur de métadonnées SEO (title, description, schema.org)
- **Sitemap_Generator**: Le générateur de sitemap XML étendu
- **ISR_System**: Le système de régénération statique incrémentale de Next.js
- **Export_Country**: Un pays de destination pour l'export (Pays-Bas, Belgique, Allemagne, France, Chine)
- **Destination_Port**: Un port maritime de destination (Rotterdam, Anvers, Hambourg, Le Havre, Shanghai)
- **Incoterm**: Un terme commercial international (FOB, CIF, CFR, EXW, FCA, DAP, DDP)
- **Product_Category**: Une catégorie de produit (Cacao, Café Arabica, Café Robusta, Cajou)
- **Certification_Type**: Un type de certification (Rainforest Alliance, Fair Trade, Bio, UTZ)
- **Price_Data**: Les données de prix en temps réel depuis Sanity
- **Harvest_Season**: La période de récolte d'un produit
- **Container_Type**: Un type de conteneur (20ft, 40ft, bulk)
- **Content_Source_Type**: Le type de source de contenu (Sanity CMS, calculé/dérivé, template, éditorial validé manuellement)
- **Quality_Threshold**: Le seuil de qualité minimum requis pour générer et indexer une page (complétude des données, longueur du contenu, pertinence SEO)
- **Route_Combination_Validator**: Le validateur de combinaisons de routes approuvées métier avec vérification de l'intention de recherche
- **Data_Freshness_Indicator**: L'indicateur de fraîcheur des données avec disclaimers appropriés pour les estimations
- **Indexability_Controller**: Le contrôleur qui détermine si une page doit être indexée par les moteurs de recherche selon sa qualité

## Requirements V1 (MVP - Livrable Immédiat)

### Requirement 1.1: Créer les schémas Sanity de base pour V1

**User Story:** En tant que développeur, je veux créer les schémas Sanity essentiels pour les pays d'export et les données de base, afin de pouvoir gérer ces données dans le CMS pour la V1.

#### Acceptance Criteria

1. THE Sanity_Schema SHALL définir un schéma "exportCountry" avec les champs name (multilingue: fr, en, es, de, ru), code ISO, flag, description (multilingue), et targetMarkets
2. THE Sanity_Schema SHALL définir les champs multilingues avec fallback explicite vers l'anglais si traduction manquante
3. THE Sanity_Schema SHALL marquer les champs obligatoires pour garantir la qualité des données
4. WHEN un schéma est créé, THE Sanity_Schema SHALL inclure la validation des champs requis
5. WHEN un schéma est créé, THE Sanity_Schema SHALL inclure un preview personnalisé pour l'interface Sanity Studio
6. THE Sanity_Schema SHALL inclure un champ "dataCompleteness" (pourcentage) pour indiquer la complétude des données
7. THE Sanity_Schema SHALL inclure un champ "approvedForSEO" (boolean) pour valider les combinaisons métier


### Requirement 1.2: Implémenter la validation des combinaisons de routes

**User Story:** En tant que responsable SEO, je veux que seules les combinaisons de routes pertinentes et supportées par des données soient générées, afin d'éviter les pages artificielles sans valeur SEO.

#### Acceptance Criteria

1. THE Route_Combination_Validator SHALL générer uniquement les combinaisons approuvées métier (approvedForSEO = true dans Sanity)
2. THE Route_Combination_Validator SHALL vérifier que chaque combinaison dispose de données suffisantes (dataCompleteness >= 70%)
3. THE Route_Combination_Validator SHALL valider l'existence d'une intention de recherche identifiable pour chaque combinaison
4. THE Route_Combination_Validator SHALL exclure les combinaisons redondantes ou sans pertinence commerciale
5. WHEN une combinaison ne respecte pas les critères, THE Route_Combination_Validator SHALL ne pas générer la route
6. THE Route_Combination_Validator SHALL logger les combinaisons rejetées avec la raison du rejet
7. THE Route_Combination_Validator SHALL fournir un rapport des combinaisons validées vs rejetées

### Requirement 1.3: Implémenter les routes dynamiques pour l'Axe 1 (Produit × Pays d'export)

**User Story:** En tant qu'acheteur international, je veux accéder à des pages spécifiques par produit et pays de destination, afin de trouver des informations pertinentes pour mon marché.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes dynamiques au format "/[locale]/produits/[product-slug]/export-[country-slug]"
2. WHEN un utilisateur accède à une route valide, THE Route_Manager SHALL générer une page avec les données du produit et du pays
3. THE Content_Generator SHALL générer du contenu unique incluant les spécificités logistiques pour le pays cible
4. THE Content_Generator SHALL inclure les certifications requises pour le marché cible
5. THE Content_Generator SHALL inclure les ports de destination recommandés pour le pays
6. THE Metadata_Generator SHALL générer des métadonnées SEO uniques avec title et description optimisés
7. THE Metadata_Generator SHALL inclure des données structurées schema.org de type Product et Offer
8. WHEN une route invalide est demandée, THE Route_Manager SHALL retourner une erreur 404

### Requirement 1.4: Implémenter les routes dynamiques pour l'Axe 2 (Prix en temps réel)

**User Story:** En tant qu'acheteur, je veux consulter les prix actuels des produits, afin de prendre des décisions d'achat informées.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes dynamiques au format "/[locale]/prix/[product-slug]-cameroun"
2. WHEN un utilisateur accède à une page de prix, THE Price_Data SHALL afficher le prix actuel depuis Sanity
3. THE Price_Data SHALL afficher l'historique des prix sur 30 jours minimum
4. THE Content_Generator SHALL inclure un graphique d'évolution des prix
5. THE Content_Generator SHALL inclure la tendance (hausse, baisse, stable) et le pourcentage de variation
6. THE Content_Generator SHALL inclure la source des données de prix avec date de dernière mise à jour
7. THE Metadata_Generator SHALL générer des métadonnées avec le prix actuel dans le title
8. THE ISR_System SHALL régénérer la page toutes les 24 heures pour maintenir les prix à jour


### Requirement 1.5: Implémenter les routes dynamiques pour l'Axe 3 (Comparaisons et guides)

**User Story:** En tant qu'acheteur, je veux comparer différents produits ou origines, afin de choisir l'option la plus adaptée à mes besoins.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes au format "/[locale]/guide/[product-a]-vs-[product-b]"
2. THE Route_Manager SHALL créer des routes au format "/[locale]/guide/[product]-[origin-a]-vs-[origin-b]"
3. THE Content_Generator SHALL générer des tableaux comparatifs avec prix, qualité, certifications, et disponibilité
4. THE Content_Generator SHALL inclure des recommandations basées sur les cas d'usage
5. THE Content_Generator SHALL inclure des sections sur les différences de goût, qualité, et applications
6. THE Metadata_Generator SHALL générer des métadonnées optimisées pour les requêtes de comparaison
7. WHEN les produits comparés n'existent pas, THE Route_Manager SHALL retourner une erreur 404

### Requirement 1.6: Générer du contenu unique pour éviter le duplicate content

**User Story:** En tant que développeur SEO, je veux que chaque page générée ait du contenu unique, afin d'éviter les pénalités Google pour duplicate content.

#### Acceptance Criteria

1. THE Content_Generator SHALL utiliser des templates avec des variations de contenu basées sur les données
2. THE Content_Generator SHALL générer des introductions uniques pour chaque combinaison de paramètres
3. THE Content_Generator SHALL inclure des données spécifiques (prix, certifications, délais) pour différencier les pages
4. THE Content_Generator SHALL varier la structure des sections selon le type de page
5. THE Content_Generator SHALL inclure des FAQ uniques basées sur le contexte de la page (3 à 5 questions)
6. FOR ALL pages générées, THE Content_Generator SHALL garantir un minimum de 500 mots de contenu unique
7. THE Content_Generator SHALL éviter la répétition de phrases identiques entre pages similaires
8. THE Content_Generator SHALL distinguer clairement le contenu provenant de Sanity, le contenu calculé, et le contenu template

### Requirement 1.7: Implémenter le support multilingue complet

**User Story:** En tant qu'acheteur international, je veux accéder aux pages dans ma langue, afin de comprendre facilement les informations.

#### Acceptance Criteria

1. THE Route_Manager SHALL supporter les locales français (fr), anglais (en), espagnol (es), allemand (de), et russe (ru) pour toutes les routes programmatiques
2. THE Content_Generator SHALL générer du contenu dans la langue de la locale demandée
3. THE Metadata_Generator SHALL générer des métadonnées dans la langue appropriée
4. THE Metadata_Generator SHALL inclure les balises hreflang pour toutes les variantes linguistiques
5. WHEN une traduction d'un champ Sanity n'est pas disponible, THE Content_Generator SHALL utiliser l'anglais comme fallback
6. WHEN un fallback est utilisé, THE Content_Generator SHALL logger l'occurrence pour amélioration future
7. THE Sitemap_Generator SHALL inclure toutes les variantes linguistiques de chaque page
8. THE Route_Manager SHALL rediriger les locales non supportées vers la locale par défaut (français)
9. FOR SEO purposes, THE Indexability_Controller SHALL marquer comme non-indexable les pages avec plus de 30% de contenu en fallback


### Requirement 1.8: Distinguer les types de contenu et leur source

**User Story:** En tant que responsable qualité, je veux identifier clairement la source de chaque type de contenu, afin de maintenir le contrôle qualité et la gouvernance des données.

#### Acceptance Criteria

1. THE Content_Generator SHALL marquer chaque bloc de contenu avec son Content_Source_Type
2. THE Content_Source_Type "sanity" SHALL identifier le contenu provenant directement de Sanity CMS
3. THE Content_Source_Type "calculated" SHALL identifier le contenu dérivé ou calculé à partir de données Sanity (ex: tendances de prix, moyennes)
4. THE Content_Source_Type "template" SHALL identifier le contenu généré par template sans données spécifiques
5. THE Content_Source_Type "editorial" SHALL identifier le contenu validé manuellement par l'équipe éditoriale
6. WHEN du contenu calculé ou estimé est affiché, THE Content_Generator SHALL inclure un disclaimer approprié
7. THE Content_Generator SHALL logger la distribution des types de contenu par page pour audit qualité

### Requirement 1.9: Implémenter le contrôle qualité et l'anti-indexation

**User Story:** En tant que responsable SEO, je veux que seules les pages de qualité suffisante soient indexées, afin de maintenir la réputation du site auprès des moteurs de recherche.

#### Acceptance Criteria

1. THE Indexability_Controller SHALL définir un Quality_Threshold minimum de 70% de complétude des données
2. THE Indexability_Controller SHALL définir un Quality_Threshold minimum de 500 mots de contenu unique
3. THE Indexability_Controller SHALL définir un Quality_Threshold maximum de 30% de contenu en fallback linguistique
4. IF une page ne respecte pas les Quality_Threshold, THEN THE Indexability_Controller SHALL marquer la page avec meta robots "noindex, follow"
5. IF une page ne respecte pas les Quality_Threshold, THEN THE Route_Manager MAY choisir de ne pas générer la page
6. THE Indexability_Controller SHALL exclure les pages non-indexables du sitemap XML
7. THE Indexability_Controller SHALL fournir un rapport des pages générées vs indexables vs non-indexables

### Requirement 1.10: Gérer la source de vérité et la fraîcheur des données estimées

**User Story:** En tant que responsable commercial, je veux que les données estimées soient clairement identifiées avec leur source et leur fraîcheur, afin d'éviter les problèmes juridiques ou commerciaux.

#### Acceptance Criteria

1. THE Data_Freshness_Indicator SHALL inclure la date de dernière mise à jour pour toutes les données affichées
2. WHEN des prix estimés sont affichés, THE Content_Generator SHALL inclure un disclaimer "Prix indicatif, contactez-nous pour un devis précis"
3. WHEN des délais estimés sont affichés, THE Content_Generator SHALL inclure un disclaimer "Délais indicatifs, variables selon les conditions"
4. WHEN des coûts logistiques estimés sont affichés, THE Content_Generator SHALL inclure un disclaimer "Coûts estimatifs, sujets à variation"
5. THE Content_Generator SHALL inclure la source de calcul ou d'estimation pour chaque donnée estimée
6. THE Content_Generator SHALL inclure une méthode de contact pour obtenir des informations précises et à jour
7. THE Data_Freshness_Indicator SHALL alerter si des données ont plus de 90 jours sans mise à jour


### Requirement 1.11: Générer un sitemap XML pour les pages V1

**User Story:** En tant que moteur de recherche, je veux découvrir toutes les pages programmatiques V1 via le sitemap, afin de les indexer efficacement.

#### Acceptance Criteria

1. THE Sitemap_Generator SHALL générer un sitemap XML incluant toutes les pages programmatiques V1 indexables
2. THE Sitemap_Generator SHALL organiser le sitemap en sections par axe SEO (produit×pays, prix, guides)
3. THE Sitemap_Generator SHALL inclure la date de dernière modification pour chaque URL
4. THE Sitemap_Generator SHALL définir des priorités appropriées (0.7-0.8) pour les pages programmatiques
5. THE Sitemap_Generator SHALL définir des changefreq appropriées selon le type de page (daily pour prix, weekly pour autres)
6. THE Sitemap_Generator SHALL exclure les pages marquées noindex du sitemap
7. THE Sitemap_Generator SHALL régénérer le sitemap à chaque déploiement

### Requirement 1.12: Générer des métadonnées SEO optimisées avec schema.org

**User Story:** En tant que moteur de recherche, je veux des métadonnées structurées, afin d'afficher des rich snippets dans les résultats de recherche.

#### Acceptance Criteria

1. THE Metadata_Generator SHALL générer des balises title uniques de 50-60 caractères
2. THE Metadata_Generator SHALL générer des meta descriptions uniques de 150-160 caractères
3. THE Metadata_Generator SHALL inclure des données structurées schema.org de type Product pour les pages produit
4. THE Metadata_Generator SHALL inclure des données structurées schema.org de type Offer avec prix et disponibilité
5. THE Metadata_Generator SHALL inclure des données structurées schema.org de type BreadcrumbList
6. THE Metadata_Generator SHALL inclure des données structurées schema.org de type FAQPage pour les pages avec FAQ
7. THE Metadata_Generator SHALL inclure les balises Open Graph pour le partage social
8. THE Metadata_Generator SHALL inclure les balises Twitter Card pour le partage sur Twitter

### Requirement 1.13: Implémenter un système de maillage interne intelligent

**User Story:** En tant que développeur SEO, je veux créer un maillage interne fort entre les pages programmatiques, afin d'améliorer le crawl et le PageRank interne.

#### Acceptance Criteria

1. THE Content_Generator SHALL inclure des liens vers des pages connexes dans chaque page
2. THE Content_Generator SHALL lier les pages produit × pays vers les pages prix correspondantes
3. THE Content_Generator SHALL lier les pages guides vers les pages produit × pays pertinentes
4. THE Content_Generator SHALL inclure un breadcrumb avec liens cliquables
5. THE Content_Generator SHALL inclure une section "Pages connexes" avec 4 à 6 liens pertinents
6. THE Content_Generator SHALL varier les anchor texts des liens internes pour éviter la sur-optimisation
7. THE Content_Generator SHALL prioriser les liens vers les pages indexables (pas vers les pages noindex)


### Requirement 1.14: Implémenter la gestion des erreurs et des pages 404 personnalisées

**User Story:** En tant qu'utilisateur, je veux être guidé vers du contenu pertinent quand une page n'existe pas, afin de ne pas quitter le site.

#### Acceptance Criteria

1. WHEN une route programmatique invalide est demandée, THE Route_Manager SHALL retourner une page 404 personnalisée
2. THE Route_Manager SHALL logger les tentatives d'accès à des routes invalides pour analyse
3. THE Content_Generator SHALL afficher des suggestions de pages similaires sur la page 404
4. THE Content_Generator SHALL inclure un formulaire de recherche sur la page 404
5. THE Content_Generator SHALL inclure des liens vers les pages les plus populaires
6. WHEN une combinaison de paramètres n'existe pas dans Sanity, THE Route_Manager SHALL retourner une 404
7. THE Route_Manager SHALL retourner un statut HTTP 404 approprié (pas de 200 avec contenu 404)

### Requirement 1.15: Implémenter l'ISR (Incremental Static Regeneration) de base

**User Story:** En tant que développeur, je veux que les pages soient régénérées automatiquement, afin de maintenir les données à jour sans rebuild complet.

#### Acceptance Criteria

1. THE ISR_System SHALL configurer un revalidate de 86400 secondes (24h) pour les pages de prix
2. THE ISR_System SHALL configurer un revalidate de 604800 secondes (7 jours) pour les pages produit × pays
3. THE ISR_System SHALL configurer un revalidate de 604800 secondes (7 jours) pour les pages de comparaison
4. WHEN une page est demandée après expiration du revalidate, THE ISR_System SHALL régénérer la page en arrière-plan
5. WHEN une régénération échoue, THE ISR_System SHALL servir la version en cache et logger l'erreur
6. THE ISR_System SHALL mettre en cache les pages générées pour servir les requêtes suivantes rapidement
7. THE ISR_System SHALL configurer des headers de cache appropriés (Cache-Control, ETag)

### Requirement 1.16: Implémenter les optimisations de performance de base

**User Story:** En tant qu'utilisateur, je veux que les pages se chargent rapidement, afin d'avoir une bonne expérience de navigation.

#### Acceptance Criteria

1. THE Route_Manager SHALL utiliser les composants React Server Components pour réduire le JavaScript côté client
2. THE Content_Generator SHALL optimiser les images avec next/image et lazy loading
3. THE Route_Manager SHALL implémenter le prefetching des liens internes visibles
4. WHEN une page est demandée, THE Route_Manager SHALL la servir en moins de 2 secondes (TTFB)
5. THE Route_Manager SHALL obtenir un score Lighthouse de 90+ pour les performances
6. THE Route_Manager SHALL minimiser le JavaScript côté client pour les pages programmatiques
7. THE Route_Manager SHALL utiliser le streaming HTML pour améliorer le First Contentful Paint


## Requirements V2 (Extension - Post-V1)

### Requirement 2.1: Créer les schémas Sanity avancés pour V2

**User Story:** En tant que développeur, je veux créer les schémas Sanity pour les certifications, ports et saisonnalité, afin de pouvoir gérer ces données dans le CMS pour la V2.

#### Acceptance Criteria

1. THE Sanity_Schema SHALL définir un schéma "destinationPort" avec les champs name (multilingue), city, country, code LOCODE, coordinates, et description
2. THE Sanity_Schema SHALL définir un schéma "certificationType" avec les champs name (multilingue), description (multilingue), criteria, benefits, et applicableProducts
3. THE Sanity_Schema SHALL définir un schéma "harvestSeason" avec les champs product, startMonth, endMonth, regions, et availability
4. WHEN un schéma est créé, THE Sanity_Schema SHALL inclure la validation des champs requis
5. WHEN un schéma est créé, THE Sanity_Schema SHALL inclure un preview personnalisé pour l'interface Sanity Studio
6. THE Sanity_Schema SHALL inclure les champs dataCompleteness et approvedForSEO pour chaque schéma
7. THE Sanity_Schema SHALL supporter les 5 locales (fr, en, es, de, ru) pour tous les champs multilingues

### Requirement 2.2: Implémenter les routes dynamiques pour l'Axe 4 (Certification × Produit)

**User Story:** En tant qu'acheteur soucieux de la durabilité, je veux trouver des produits avec des certifications spécifiques, afin de respecter mes engagements RSE.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes au format "/[locale]/certifications/[certification-slug]-[product-slug]"
2. WHEN un utilisateur accède à une page de certification, THE Content_Generator SHALL afficher tous les produits avec cette certification
3. THE Content_Generator SHALL inclure la description de la certification et ses critères
4. THE Content_Generator SHALL inclure les avantages de la certification pour l'acheteur
5. THE Content_Generator SHALL inclure les documents de certification disponibles
6. THE Metadata_Generator SHALL générer des métadonnées optimisées pour les recherches de produits certifiés
7. WHEN la certification n'existe pas, THE Route_Manager SHALL retourner une erreur 404
8. THE Route_Combination_Validator SHALL valider que la combinaison certification × produit est approuvée métier

### Requirement 2.3: Implémenter les routes dynamiques pour l'Axe 5 (Port de destination)

**User Story:** En tant qu'acheteur, je veux connaître les options logistiques vers mon port de destination, afin de planifier mes importations.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes au format "/[locale]/logistique/export-[product-slug]-port-[port-slug]"
2. THE Content_Generator SHALL inclure les informations du port (localisation, capacités, délais)
3. THE Content_Generator SHALL inclure les délais de transit estimés depuis Douala avec disclaimer approprié
4. THE Content_Generator SHALL inclure les coûts logistiques estimés avec disclaimer approprié
5. THE Content_Generator SHALL inclure les formalités douanières pour le pays du port
6. THE Metadata_Generator SHALL générer des métadonnées optimisées pour les recherches logistiques
7. WHEN le port n'existe pas, THE Route_Manager SHALL retourner une erreur 404
8. THE Data_Freshness_Indicator SHALL inclure la date de dernière mise à jour des informations logistiques


### Requirement 2.4: Implémenter les routes dynamiques pour l'Axe 6 (Saisonnalité et récolte)

**User Story:** En tant qu'acheteur, je veux connaître les périodes de récolte et la disponibilité saisonnière, afin de planifier mes achats au meilleur moment.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes au format "/[locale]/recolte/[product-slug]-cameroun-saison-[year]"
2. THE Route_Manager SHALL créer des routes au format "/[locale]/calendrier-recolte/[product-slug]-afrique-ouest"
3. THE Content_Generator SHALL inclure un calendrier visuel des périodes de récolte
4. THE Content_Generator SHALL inclure les variations de qualité selon la saison
5. THE Content_Generator SHALL inclure les variations de prix selon la saison
6. THE Content_Generator SHALL inclure les recommandations d'achat par période
7. THE Metadata_Generator SHALL générer des métadonnées avec l'année et la saison
8. THE ISR_System SHALL régénérer les pages annuellement pour mettre à jour l'année

### Requirement 2.5: Implémenter un système de génération de FAQ contextuelles avancées

**User Story:** En tant qu'acheteur, je veux trouver des réponses aux questions fréquentes sur chaque page, afin d'obtenir rapidement les informations dont j'ai besoin.

#### Acceptance Criteria

1. THE Content_Generator SHALL générer 3 à 5 FAQ uniques par page basées sur le contexte
2. THE Content_Generator SHALL varier les questions selon le type de page (produit, prix, certification, port, saisonnalité)
3. THE Content_Generator SHALL inclure des réponses détaillées avec des données spécifiques
4. THE Content_Generator SHALL formater les FAQ avec un markup schema.org FAQPage
5. THE Content_Generator SHALL inclure des liens internes vers d'autres pages pertinentes dans les réponses
6. WHEN une page concerne les prix, THE Content_Generator SHALL inclure des FAQ sur les variations de prix
7. WHEN une page concerne la logistique, THE Content_Generator SHALL inclure des FAQ sur les délais et coûts

### Requirement 2.6: Implémenter un système de tracking analytics de base

**User Story:** En tant que responsable marketing, je veux suivre les performances des pages programmatiques, afin d'optimiser la stratégie SEO.

#### Acceptance Criteria

1. THE Route_Manager SHALL inclure des événements Google Analytics pour chaque type de page
2. THE Route_Manager SHALL tracker les paramètres de page (produit, pays, certification, port) comme dimensions personnalisées
3. THE Route_Manager SHALL tracker les conversions (demandes de devis) par type de page
4. THE Route_Manager SHALL tracker les taux de rebond par axe SEO
5. THE Route_Manager SHALL respecter le RGPD avec un système de consentement cookies
6. THE Route_Manager SHALL permettre l'opt-out du tracking analytics
7. THE Route_Manager SHALL fournir un rapport mensuel des performances par axe SEO


## Requirements V3 (Avancé - Post-V2)

### Requirement 3.1: Créer les schémas Sanity complets pour V3

**User Story:** En tant que développeur, je veux créer les schémas Sanity pour les incoterms et types de conteneurs, afin de pouvoir gérer ces données dans le CMS pour la V3.

#### Acceptance Criteria

1. THE Sanity_Schema SHALL définir un schéma "incoterm" avec les champs code, name (multilingue), description (multilingue), responsibilities, et applicableProducts
2. THE Sanity_Schema SHALL définir un schéma "containerType" avec les champs type, capacity, dimensions, suitableProducts, et pricing
3. WHEN un schéma est créé, THE Sanity_Schema SHALL inclure la validation des champs requis
4. WHEN un schéma est créé, THE Sanity_Schema SHALL inclure un preview personnalisé pour l'interface Sanity Studio
5. THE Sanity_Schema SHALL inclure les champs dataCompleteness et approvedForSEO pour chaque schéma
6. THE Sanity_Schema SHALL supporter les 5 locales (fr, en, es, de, ru) pour tous les champs multilingues
7. THE Sanity_Schema SHALL inclure des relations entre incoterms et ports applicables

### Requirement 3.2: Implémenter les routes dynamiques pour l'Axe 7 (Incoterm × Produit × Port)

**User Story:** En tant qu'acheteur, je veux comprendre les implications des différents incoterms pour mes achats, afin de choisir le terme commercial le plus avantageux.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes au format "/[locale]/incoterms/[product-slug]-[incoterm]-[port-slug]"
2. THE Content_Generator SHALL inclure la définition complète de l'incoterm
3. THE Content_Generator SHALL inclure les responsabilités de l'acheteur et du vendeur
4. THE Content_Generator SHALL inclure le prix estimé pour ce produit avec cet incoterm avec disclaimer approprié
5. THE Content_Generator SHALL inclure les documents requis pour cet incoterm
6. THE Content_Generator SHALL inclure une comparaison avec d'autres incoterms disponibles
7. THE Metadata_Generator SHALL générer des métadonnées optimisées pour les recherches d'incoterms
8. WHEN l'incoterm n'est pas applicable au produit ou au port, THE Route_Manager SHALL retourner une erreur 404

### Requirement 3.3: Implémenter les routes dynamiques pour l'Axe 8 (Volume et quantité)

**User Story:** En tant qu'acheteur, je veux connaître les options d'achat par volume, afin de commander la quantité adaptée à mes besoins.

#### Acceptance Criteria

1. THE Route_Manager SHALL créer des routes au format "/[locale]/commande/[product-slug]-container-[container-type]"
2. THE Route_Manager SHALL créer des routes au format "/[locale]/commande/[product-slug]-bulk-[quantity]-tonnes"
3. THE Content_Generator SHALL inclure les spécifications du conteneur (dimensions, capacité)
4. THE Content_Generator SHALL inclure le prix estimé pour cette quantité avec disclaimer approprié
5. THE Content_Generator SHALL inclure les options de conditionnement disponibles
6. THE Content_Generator SHALL inclure le MOQ (Minimum Order Quantity) et les paliers de prix
7. THE Metadata_Generator SHALL générer des métadonnées avec la quantité dans le title
8. WHEN la quantité est inférieure au MOQ, THE Content_Generator SHALL afficher un avertissement


### Requirement 3.4: Implémenter un système de tracking analytics avancé

**User Story:** En tant que responsable marketing, je veux suivre en détail les performances des pages programmatiques, afin d'optimiser finement la stratégie SEO.

#### Acceptance Criteria

1. THE Route_Manager SHALL tracker les sources de trafic vers les pages programmatiques avec attribution détaillée
2. THE Route_Manager SHALL tracker les parcours utilisateurs entre les pages programmatiques
3. THE Route_Manager SHALL tracker les interactions utilisateurs (clics sur FAQ, téléchargements, formulaires)
4. THE Route_Manager SHALL créer des segments d'audience par type de page visitée
5. THE Route_Manager SHALL tracker les performances de conversion par combinaison de paramètres
6. THE Route_Manager SHALL fournir des rapports hebdomadaires automatisés des performances
7. THE Route_Manager SHALL identifier les combinaisons de routes les plus performantes pour priorisation

### Requirement 3.5: Implémenter les optimisations de performance avancées

**User Story:** En tant qu'utilisateur, je veux que les pages se chargent très rapidement même avec du contenu riche, afin d'avoir une excellente expérience de navigation.

#### Acceptance Criteria

1. THE Route_Manager SHALL implémenter le prefetching intelligent basé sur le comportement utilisateur
2. THE Route_Manager SHALL utiliser le edge caching pour servir les pages depuis les CDN les plus proches
3. THE Content_Generator SHALL implémenter le lazy loading progressif pour les images et graphiques
4. THE Route_Manager SHALL obtenir un score Lighthouse de 95+ pour les performances
5. THE Route_Manager SHALL optimiser le Critical Rendering Path pour un FCP < 1 seconde
6. THE ISR_System SHALL implémenter le stale-while-revalidate pour servir instantanément les pages en cache
7. THE Route_Manager SHALL monitorer les Core Web Vitals et alerter si dégradation

## Annexe: Calcul de Volumétrie

### V1 (MVP)
- Produit × Pays: 4 produits × 5 pays = 20 pages (après validation métier: ~15 pages)
- Prix: 4 produits = 4 pages
- Guides/Comparaisons: ~10 pages validées
- **Total V1: ~30 pages** (× 5 locales = 150 URLs au sitemap)

### V2 (Extension)
- Certification × Produit: 3 certifications × 4 produits = 12 pages
- Port × Produit: 5 ports × 4 produits = 20 pages (après validation: ~15 pages)
- Saisonnalité: 4 produits × 1-2 variations = ~6 pages
- **Total V2: ~33 pages** (× 5 locales = 165 URLs supplémentaires)

### V3 (Avancé)
- Incoterm × Produit × Port: Combinaisons validées ~9 pages
- Volume/Container: 4 produits × 1-2 options = ~6 pages
- **Total V3: ~15 pages** (× 5 locales = 75 URLs supplémentaires)

### Total Global
- **~78 pages uniques** (après validation métier et contrôle qualité)
- **~390 URLs au sitemap** (avec toutes les locales)
- Seules les pages avec dataCompleteness >= 70% et approvedForSEO = true sont générées
- Seules les pages respectant les Quality_Threshold sont indexables

