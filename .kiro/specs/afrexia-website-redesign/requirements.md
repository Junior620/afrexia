# Requirements Document - Afrexia Website Redesign

## Introduction

Afrexia est une entreprise camerounaise spécialisée dans l'export de commodités agricoles africaines (cacao, café, bois, poivre, maïs) vers les marchés internationaux. Ce document définit les exigences pour la refonte complète de leur site web B2B, visant à remplacer le site Wix actuel par une plateforme premium Next.js qui inspire confiance, génère des leads qualifiés et se positionne comme un acteur sérieux du secteur sur les marchés internationaux.

## Glossary

- **System**: Le site web Afrexia (frontend Next.js + CMS Sanity + services tiers)
- **User**: Visiteur du site (acheteur international, grossiste, agent, investisseur)
- **RFQ**: Request for Quote - Demande de devis
- **CMS**: Content Management System (Sanity)
- **Product_Page**: Page détaillée d'un produit agricole
- **Lead**: Contact commercial qualifié généré via formulaire
- **Core_Web_Vitals**: Métriques de performance web (LCP, FID, CLS)
- **Schema_Markup**: Données structurées Schema.org pour SEO
- **Hreflang**: Balises HTML pour versions linguistiques alternatives
- **EUDR**: European Union Deforestation Regulation
- **Incoterms**: International Commercial Terms (conditions de livraison)
- **MOQ**: Minimum Order Quantity
- **QA**: Quality Assurance
- **Image_Optimizer**: Système d'optimisation d'images (Next Image + WebP/AVIF)
- **Animation_System**: Système d'animations (GSAP + ScrollTrigger)
- **Form_Handler**: Gestionnaire de formulaires (validation + anti-spam + envoi email)
- **Analytics_System**: Système de tracking (Plausible + GA4 + Vercel Analytics)
- **Navigation_System**: Système de navigation multilingue
- **SEO_System**: Système d'optimisation pour moteurs de recherche

## Requirements

### Requirement 1: Architecture et Navigation du Site

**User Story:** En tant qu'acheteur international, je veux naviguer facilement entre les sections du site dans ma langue, afin de trouver rapidement les informations produits et services dont j'ai besoin.

#### Acceptance Criteria

1. THE Navigation_System SHALL provide access to all primary pages (Home, Products, Solutions, Quality, Traceability, About, Resources, Blog, Contact, RFQ)
2. WHEN a User selects a language (FR/EN), THE System SHALL display all content in that language and update the URL structure to include the language prefix (/fr or /en)
3. THE Navigation_System SHALL maintain consistent navigation structure across all pages with visual indication of current page
4. WHEN a User navigates between pages, THE System SHALL preserve the selected language preference
5. THE System SHALL provide a sitemap accessible to search engines and users

### Requirement 2: Pages Produits Détaillées

**User Story:** En tant qu'acheteur B2B, je veux consulter des fiches produits complètes avec spécifications techniques, origines, certifications et options de commande, afin d'évaluer si le produit correspond à mes besoins.

#### Acceptance Criteria

1. WHEN a User visits a Product_Page, THE System SHALL display product gallery, origin map, technical specifications, grading information, packaging options, Incoterms, MOQ, and QA certifications
2. THE Product_Page SHALL provide downloadable product specification sheets in PDF format
3. WHEN a User clicks on product images, THE System SHALL open a lightbox gallery with full-resolution images
4. THE Product_Page SHALL display an interactive Mapbox map showing product origin locations
5. THE Product_Page SHALL include prominent CTA buttons for requesting quotes
6. THE System SHALL create individual Product_Pages for each commodity (cacao, café, poivre, bois, maïs)

### Requirement 3: Formulaire RFQ (Request for Quote)

**User Story:** En tant qu'acheteur intéressé, je veux soumettre une demande de devis détaillée, afin de recevoir une proposition commerciale adaptée à mes besoins.

#### Acceptance Criteria

1. WHEN a User submits the RFQ form with valid data, THE Form_Handler SHALL validate all required fields, verify reCAPTCHA v3 score, and send the request via Resend email service
2. WHEN the RFQ form is submitted successfully, THE System SHALL display a confirmation message and send a confirmation email to the User
3. WHEN a User attempts to submit the RFQ form with invalid data, THE Form_Handler SHALL display specific error messages for each invalid field
4. THE RFQ form SHALL collect product selection, quantity, delivery terms (Incoterms), destination country, timeline, and contact information
5. THE Form_Handler SHALL prevent spam submissions by validating reCAPTCHA v3 with minimum score threshold
6. WHEN a User starts filling the RFQ form, THE System SHALL save form progress to browser LocalStorage with 7-day TTL
7. THE System SHALL provide a "Clear draft" option to delete saved form progress
8. THE System SHALL NOT store sensitive form data (messages, personal details) in LocalStorage without explicit user consent

### Requirement 4: Système de Gestion de Contenu (CMS Sanity)

**User Story:** En tant qu'administrateur Afrexia, je veux gérer facilement les contenus multilingues, images et données produits, afin de maintenir le site à jour sans intervention technique.

#### Acceptance Criteria

1. THE CMS SHALL provide schemas for all content types (products, pages, blog posts, certifications, team members, resources)
2. WHEN an administrator creates or updates content in the CMS, THE System SHALL reflect changes on the frontend within 60 seconds using Incremental Static Regeneration
3. THE CMS SHALL support multilingual content with separate fields for French and English versions
4. THE CMS SHALL provide image upload with automatic optimization and multiple format generation (WebP, AVIF)
5. THE CMS SHALL validate required fields and data formats before allowing content publication
6. THE CMS SHALL support rich text editing with custom components for callouts, galleries, and embedded media

### Requirement 5: Optimisation des Images

**User Story:** En tant qu'utilisateur sur connexion mobile, je veux que les images se chargent rapidement sans sacrifier la qualité visuelle, afin d'avoir une expérience fluide.

#### Acceptance Criteria

1. WHEN the System displays an image, THE Image_Optimizer SHALL serve the most appropriate format (AVIF, WebP, or JPEG) based on browser support
2. THE Image_Optimizer SHALL implement lazy loading for all images below the fold
3. WHEN an image is requested, THE Image_Optimizer SHALL serve responsive sizes based on viewport dimensions
4. THE System SHALL achieve Largest Contentful Paint (LCP) under 2.5 seconds on 4G connections
5. THE Image_Optimizer SHALL generate and serve optimized thumbnails for gallery previews
6. THE System SHALL preload critical above-the-fold images to improve perceived performance

### Requirement 6: SEO International

**User Story:** En tant qu'acheteur potentiel recherchant des fournisseurs de cacao africain sur Google, je veux trouver Afrexia dans les premiers résultats, afin de découvrir leurs produits et services.

#### Acceptance Criteria

1. WHEN a search engine crawls the site, THE SEO_System SHALL provide complete meta tags (title, description, Open Graph, Twitter Card) for each page in both languages
2. THE SEO_System SHALL implement hreflang tags to indicate language and regional variations of each page
3. THE System SHALL generate and maintain XML sitemaps for both French and English content
4. WHEN a page is rendered, THE SEO_System SHALL include Schema.org structured data for Organization, Product, Article, and BreadcrumbList
5. THE System SHALL implement canonical URLs to prevent duplicate content issues
6. THE System SHALL generate semantic HTML with proper heading hierarchy (h1-h6) on all pages
7. THE SEO_System SHALL create SEO-friendly URLs using slugs in the appropriate language

### Requirement 7: Animations et Interactions Premium

**User Story:** En tant que visiteur du site, je veux vivre une expérience visuelle engageante avec des animations fluides, afin de percevoir Afrexia comme une entreprise premium et moderne.

#### Acceptance Criteria

1. WHEN a User scrolls through the homepage, THE Animation_System SHALL trigger scroll-based animations for hero section, statistics counters, process timeline, and product showcases
2. THE Animation_System SHALL use GSAP and ScrollTrigger for all scroll-based animations
3. WHEN animations are triggered on desktop, THE System SHALL maintain 60fps performance
4. WHEN animations are triggered on mobile devices, THE System SHALL provide smooth animations with fallback to simpler effects if performance drops below 30fps
5. THE Animation_System SHALL respect user preferences for reduced motion (prefers-reduced-motion media query) by disabling or simplifying animations
6. THE System SHALL implement smooth page transitions using Framer Motion
7. WHEN a User interacts with the supply chain map, THE Animation_System SHALL animate the visualization of product journey from origin to destination
8. THE System SHALL prioritize Core Web Vitals scores over animation complexity

### Requirement 8: Cartographie Interactive

**User Story:** En tant qu'acheteur soucieux de traçabilité, je veux visualiser sur une carte les origines des produits et la chaîne logistique, afin de vérifier la provenance et la conformité EUDR.

#### Acceptance Criteria

1. THE System SHALL integrate Mapbox maps using react-map-gl library
2. WHEN a User views a Product_Page, THE System SHALL display an interactive map showing product origin locations with custom markers
3. WHEN a User views the Traceability page, THE System SHALL display an animated supply chain map showing the journey from farm to port
4. WHEN a User clicks on a map marker, THE System SHALL display detailed information about that location (farm, warehouse, port)
5. THE System SHALL allow map zoom, pan, and rotation interactions
6. THE System SHALL optimize map loading to prevent performance degradation

### Requirement 9: Performance et Core Web Vitals

**User Story:** En tant qu'utilisateur sur mobile avec connexion limitée, je veux que le site se charge rapidement et reste réactif, afin de consulter les informations sans frustration.

#### Acceptance Criteria

1. THE System SHALL achieve a Lighthouse performance score of 90+ on mobile and 95+ on desktop
2. THE System SHALL maintain Largest Contentful Paint (LCP) under 2.5 seconds
3. THE System SHALL maintain First Input Delay (FID) under 100 milliseconds
4. THE System SHALL maintain Cumulative Layout Shift (CLS) under 0.1
5. THE System SHALL implement code splitting to load only necessary JavaScript for each page
6. THE System SHALL use Next.js App Router with Server Components to minimize client-side JavaScript
7. THE System SHALL implement resource hints (preconnect, dns-prefetch) for third-party services

### Requirement 10: Système Multilingue

**User Story:** En tant qu'acheteur international, je veux consulter le site dans ma langue préférée (français ou anglais), afin de comprendre parfaitement les offres et conditions.

#### Acceptance Criteria

1. THE System SHALL support French and English languages with complete translations for all content
2. WHEN a User visits the site, THE System SHALL detect browser language and redirect to appropriate language version if no preference is set
3. THE System SHALL provide a language switcher accessible from all pages
4. WHEN a User switches language, THE System SHALL navigate to the equivalent page in the new language while preserving the current page context
5. THE System SHALL store language preference in a cookie for subsequent visits
6. THE System SHALL use URL-based language routing (/fr/products, /en/products)
7. THE CMS SHALL provide an i18nId or translationOf field for each content document to link French and English versions
8. WHEN a User switches language on a specific page, THE System SHALL use the i18nId to navigate to the equivalent translated page rather than returning to homepage

### Requirement 11: Preuves Sociales et Crédibilité

**User Story:** En tant qu'acheteur B2B évaluant un nouveau fournisseur, je veux voir des preuves de crédibilité (certifications, clients, chiffres clés), afin de faire confiance à Afrexia.

#### Acceptance Criteria

1. THE System SHALL display all relevant certifications prominently on Quality & Compliance page with certification logos and validity dates
2. THE System SHALL showcase key statistics (years of experience, export volume, countries served, certifications held) on the homepage
3. WHEN certifications are displayed, THE System SHALL provide downloadable PDF certificates
4. THE System SHALL display client testimonials and case studies where available
5. THE System SHALL show team members with photos and credentials on About page
6. THE System SHALL display industry partnerships and memberships

### Requirement 12: Ressources Téléchargeables

**User Story:** En tant qu'acheteur B2B, je veux télécharger des catalogues produits, fiches techniques et guides Incoterms, afin d'avoir la documentation nécessaire pour ma décision d'achat.

#### Acceptance Criteria

1. THE System SHALL provide a Resources page listing all downloadable documents organized by category
2. WHEN a User clicks on a resource, THE System SHALL initiate download of the PDF document
3. THE System SHALL track resource downloads via Analytics_System
4. THE CMS SHALL allow administrators to upload and manage resource documents with metadata (title, description, category, language, file size)
5. THE System SHALL display file size and format for each downloadable resource
6. THE System SHALL provide product-specific resources directly on Product_Pages

### Requirement 13: Blog et Marketing de Contenu

**User Story:** En tant qu'acheteur recherchant des informations sur le marché du cacao africain, je veux lire des articles d'expertise, afin de mieux comprendre le secteur et identifier Afrexia comme un expert.

#### Acceptance Criteria

1. THE System SHALL provide a blog section with article listing and individual article pages
2. WHEN a User views the blog listing, THE System SHALL display articles with featured image, title, excerpt, author, date, and reading time
3. THE System SHALL support article categories and tags for content organization
4. THE System SHALL implement article search functionality
5. THE System SHALL provide related articles suggestions at the end of each article
6. THE System SHALL generate RSS feed for blog content
7. THE System SHALL implement Schema.org Article markup for all blog posts

### Requirement 14: Formulaire de Contact

**User Story:** En tant que visiteur ayant une question générale, je veux contacter Afrexia facilement, afin d'obtenir des informations complémentaires.

#### Acceptance Criteria

1. WHEN a User submits the contact form with valid data, THE Form_Handler SHALL send the message via Resend email service to the appropriate department
2. THE contact form SHALL collect name, email, phone, company, subject, and message
3. WHEN the contact form is submitted successfully, THE System SHALL display a confirmation message
4. THE Form_Handler SHALL validate email format and required fields before submission
5. THE Form_Handler SHALL implement reCAPTCHA v3 to prevent spam
6. THE System SHALL display contact information (email, phone, address) alongside the form

### Requirement 15: Analytics et Tracking

**User Story:** En tant qu'administrateur Afrexia, je veux comprendre le comportement des visiteurs et les sources de trafic, afin d'optimiser la stratégie marketing et le contenu du site.

#### Acceptance Criteria

1. THE Analytics_System SHALL integrate Plausible Analytics for privacy-friendly tracking without requiring cookie consent
2. THE Analytics_System SHALL integrate Google Analytics 4 for detailed behavior analysis
3. THE Analytics_System SHALL integrate Vercel Analytics for performance monitoring
4. THE System SHALL track key conversion events (RFQ submissions, contact form submissions, resource downloads, product page views)
5. WHEN Google Analytics 4 is active, THE System SHALL display a cookie consent banner compliant with GDPR requirements
6. THE System SHALL provide a "Plausible-only" mode that operates without cookie consent for privacy-focused users
7. THE System SHALL implement custom event tracking for critical user interactions (CTA clicks, video plays, map interactions)
8. THE Analytics_System SHALL respect Do Not Track browser settings when configured

### Requirement 16: Accessibilité

**User Story:** En tant qu'utilisateur avec handicap visuel, je veux naviguer le site avec un lecteur d'écran, afin d'accéder aux informations produits et services.

#### Acceptance Criteria

1. THE System SHALL maintain WCAG 2.1 Level AA compliance for all pages
2. THE System SHALL provide sufficient color contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text)
3. THE System SHALL implement proper ARIA labels for all interactive elements
4. THE System SHALL support full keyboard navigation for all interactive features
5. THE System SHALL provide alt text for all meaningful images
6. THE System SHALL implement skip-to-content links for keyboard users
7. THE System SHALL ensure form inputs have associated labels

### Requirement 17: Identité Visuelle

**User Story:** En tant que visiteur du site, je veux voir une identité visuelle cohérente qui reflète le professionnalisme d'Afrexia, afin de percevoir l'entreprise comme fiable et établie.

#### Acceptance Criteria

1. THE System SHALL use the official color palette consistently (Primary #194424, Secondary #337A49, Accent #655E2C, Light #E9EBE5, Support #80996F, Neutral #B0BCA4)
2. THE System SHALL implement the brand typography system across all text elements
3. THE System SHALL use consistent spacing, sizing, and layout patterns via Tailwind configuration
4. THE System SHALL implement shadcn/ui components styled according to brand guidelines
5. THE System SHALL maintain visual consistency across all pages and components
6. THE System SHALL provide a style guide accessible to developers and content managers

### Requirement 18: Responsive Design

**User Story:** En tant qu'utilisateur mobile, je veux consulter le site confortablement sur mon smartphone, afin d'accéder aux informations produits en déplacement.

#### Acceptance Criteria

1. THE System SHALL provide fully responsive layouts for mobile (320px+), tablet (768px+), and desktop (1024px+) viewports
2. WHEN viewed on mobile, THE System SHALL adapt navigation to a mobile-friendly menu (hamburger or drawer)
3. THE System SHALL ensure touch targets are minimum 44x44 pixels on mobile devices
4. THE System SHALL optimize font sizes for readability on all screen sizes
5. THE System SHALL test layouts on iOS Safari, Chrome Mobile, and Samsung Internet browsers
6. THE System SHALL ensure forms are easy to complete on mobile devices with appropriate input types

### Requirement 19: Email Notifications

**User Story:** En tant qu'administrateur Afrexia, je veux recevoir des notifications email formatées pour chaque RFQ et contact, afin de traiter rapidement les demandes commerciales.

#### Acceptance Criteria

1. WHEN a RFQ is submitted, THE System SHALL send a formatted email to the sales team using Resend and React Email templates
2. WHEN a contact form is submitted, THE System SHALL send a formatted email to the appropriate department
3. THE System SHALL send confirmation emails to users after form submission
4. THE System SHALL include all submitted form data in notification emails with clear formatting
5. THE System SHALL implement email templates with Afrexia branding
6. THE System SHALL handle email delivery failures gracefully and log errors

### Requirement 20: Sécurité et Protection des Données

**User Story:** En tant qu'utilisateur soumettant mes informations personnelles, je veux que mes données soient protégées, afin d'avoir confiance dans la sécurité du site.

#### Acceptance Criteria

1. THE System SHALL implement HTTPS for all pages and API endpoints
2. THE System SHALL validate and sanitize all user inputs to prevent XSS and injection attacks
3. THE System SHALL implement rate limiting on form submissions to prevent abuse
4. THE System SHALL use environment variables for all sensitive configuration (API keys, secrets)
5. THE System SHALL implement Content Security Policy (CSP) headers
6. THE System SHALL implement HTTP Strict Transport Security (HSTS) headers
7. THE System SHALL implement X-Frame-Options headers to prevent clickjacking
8. THE System SHALL comply with GDPR requirements for data collection and storage
9. THE System SHALL provide a privacy policy and terms of service accessible from all pages

### Requirement 21: Modèle de Données Produits

**User Story:** En tant qu'administrateur Afrexia, je veux un modèle de données produits structuré et complet, afin de saisir toutes les informations nécessaires pour les acheteurs B2B.

#### Acceptance Criteria

1. THE CMS SHALL provide a Product schema with fields: name, slug, category, description (multilingual), originRegions array, harvestSeason, packagingOptions array, MOQ, Incoterms array, certifications array, gallery array, specificationPDF, qaMetrics table, hsCode, availability status, and targetMarkets array
2. THE Product schema SHALL enforce required fields (name, slug, category, description) before publication
3. THE Product schema SHALL support multilingual content for name, description, and specifications
4. THE Product schema SHALL validate data formats (dates, numbers, URLs) before saving
5. THE Product schema SHALL link to related schemas (Certifications, Regions, Markets)
6. THE CMS SHALL provide preview functionality for Product pages before publication

### Requirement 22: Rôles et Permissions CMS

**User Story:** En tant qu'administrateur système, je veux définir des rôles et permissions pour l'équipe Afrexia, afin de contrôler qui peut publier, éditer ou consulter le contenu.

#### Acceptance Criteria

1. THE CMS SHALL support three user roles: Administrator, Editor, and Viewer
2. WHEN a user has Administrator role, THE CMS SHALL grant full access to create, edit, publish, and delete all content
3. WHEN a user has Editor role, THE CMS SHALL grant access to create and edit content but require Administrator approval for publication
4. WHEN a user has Viewer role, THE CMS SHALL grant read-only access to all content
5. THE CMS SHALL implement a workflow with states: Draft, In Review, and Published
6. THE CMS SHALL log all content changes with user attribution and timestamps

### Requirement 23: Traçabilité EUDR

**User Story:** En tant qu'acheteur européen, je veux comprendre comment Afrexia assure la conformité EUDR et la traçabilité des produits, afin de respecter les réglementations de l'UE sur la déforestation.

#### Acceptance Criteria

1. THE System SHALL provide a dedicated "EUDR & Traceability" page explaining the due diligence process
2. THE Traceability page SHALL display geographic origin data with coordinates for each product source
3. THE Traceability page SHALL explain the supply chain from farm to export with documentation requirements
4. THE Traceability page SHALL list compliance measures and third-party verification processes
5. THE System SHALL provide downloadable EUDR compliance documentation where available
6. THE Product_Page SHALL include traceability information specific to each commodity

### Requirement 24: Parcours Utilisateurs B2B

**User Story:** En tant qu'acheteur B2B, je veux suivre un parcours guidé selon mon profil (acheteur direct ou institutionnel), afin de trouver rapidement les informations pertinentes.

#### Acceptance Criteria

1. THE System SHALL provide a "Buyer Journey" starting from Products → Specifications → RFQ
2. THE System SHALL provide an "Institutional Journey" starting from Traceability/Quality → Partnership → Contact
3. WHEN a User lands on the homepage, THE System SHALL present clear entry points for both journeys
4. THE System SHALL track journey completion via Analytics_System
5. THE System SHALL provide contextual CTAs appropriate to each journey stage
6. THE System SHALL implement breadcrumb navigation to show journey progress

### Requirement 25: Monitoring et Observabilité

**User Story:** En tant qu'administrateur technique, je veux monitorer la santé du site et recevoir des alertes en cas de problème, afin d'assurer une disponibilité maximale.

#### Acceptance Criteria

1. THE System SHALL integrate Sentry for error tracking and monitoring
2. THE System SHALL achieve 99.9% uptime SLA via Vercel hosting
3. WHEN a critical error occurs, THE System SHALL send alerts to the technical team
4. THE System SHALL log all API requests and responses for debugging purposes
5. THE System SHALL monitor Core Web Vitals in production via Vercel Analytics
6. THE System SHALL provide a status dashboard showing system health metrics
7. THE System SHALL implement structured logging with appropriate log levels (error, warn, info, debug)
