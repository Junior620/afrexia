# Requirements Document: Product Catalog Redesign

## Introduction

This document specifies the requirements for redesigning the product catalog page for a B2B export/commodities website specializing in cocoa, coffee, and agricultural products. The redesign addresses critical usability, conversion, and B2B functionality gaps in the current implementation while maintaining the premium luxury export brand identity.

The system targets international industrial buyers, chocolatiers, and traders who require quick access to product specifications, compliance documentation, and streamlined RFQ (Request for Quote) workflows.

## Glossary

- **System**: The product catalog page and its associated components
- **Catalog_Page**: The main product listing page at /products
- **Product_Card**: Individual product display component within the grid
- **RFQ_Drawer**: Side panel component for submitting quote requests
- **Filter_Bar**: Sticky component for filtering and searching products
- **Quick_View**: Modal overlay showing key product specifications
- **Trust_Strip**: Component displaying B2B credibility elements
- **EUDR**: EU Deforestation Regulation compliance indicator
- **COA**: Certificate of Analysis
- **MOQ**: Minimum Order Quantity
- **Incoterms**: International Commercial Terms for shipping
- **Multi_Product_RFQ**: Capability to request quotes for multiple products simultaneously
- **Catalog_PDF**: Downloadable PDF version of the product catalog
- **QA_Documentation**: Quality Assurance documentation available for products
- **Chain_of_Custody**: Traceability documentation from origin to delivery

## Requirements

### Requirement 1: Page Structure and Layout

**User Story:** As an international buyer, I want a well-organized catalog page with clear hierarchy, so that I can quickly scan available products and access key information without excessive scrolling.

#### Acceptance Criteria

1. WHEN the catalog page loads, THE System SHALL display a compact header section that occupies no more than 20% of viewport height
2. THE System SHALL display a sticky filter bar that remains visible during scroll
3. WHEN displaying products, THE System SHALL use a responsive grid layout (1 column mobile, 2-3 columns tablet, 3-4 columns desktop)
4. THE System SHALL include a process and compliance section below the product grid
5. THE System SHALL include a footer CTA section for multi-product RFQ
6. WHEN the viewport width is below 768px, THE System SHALL adapt the layout to single-column mobile view
7. THE System SHALL ensure the first product cards are visible above the fold on desktop viewports (1440px width)

### Requirement 2: Product Filtering and Search

**User Story:** As a buyer, I want to filter products by multiple criteria and search by keywords, so that I can quickly find products matching my specific requirements.

#### Acceptance Criteria

1. THE System SHALL provide a search input field that filters products by name, category, and tags
2. THE System SHALL provide filter controls for product category
3. THE System SHALL provide filter controls for origin countries
4. THE System SHALL provide filter controls for availability status
5. THE System SHALL provide filter controls for EUDR compliance status
6. THE System SHALL provide filter controls for certifications
7. THE System SHALL provide filter controls for supported Incoterms
8. THE System SHALL provide filter controls for MOQ ranges
9. WHEN a user applies filters, THE System SHALL update the product grid to show only matching products
10. WHEN a user applies multiple filters, THE System SHALL apply AND logic (products must match all selected filters)
11. WHEN no products match the applied filters, THE System SHALL display a message indicating no results found
12. THE System SHALL display the count of filtered products
13. THE System SHALL provide a "Clear all filters" action when filters are active

### Requirement 3: Enhanced Product Card Display

**User Story:** As a buyer, I want product cards that clearly display key information with good readability, so that I can evaluate products without clicking through to detail pages.

#### Acceptance Criteria

1. WHEN displaying a product card, THE System SHALL include a hero image with optimized loading
2. WHEN displaying a product card, THE System SHALL apply a gradient overlay to ensure text readability on images
3. WHEN displaying a product card, THE System SHALL show availability badges (In Stock, Limited, Pre-order)
4. WHEN displaying a product card, THE System SHALL show EUDR Ready badge when applicable
5. WHEN displaying a product card, THE System SHALL show certification badges when applicable
6. THE System SHALL display product name as a heading with minimum 20px font size
7. THE System SHALL display product subtitle or category
8. THE System SHALL display quick specifications including origin, MOQ, and primary Incoterm
9. THE System SHALL display QA documentation availability indicator
10. THE System SHALL provide a primary CTA button for requesting a quote
11. THE System SHALL provide a secondary action link for viewing full specifications
12. WHEN a user hovers over a product card on desktop, THE System SHALL apply visual feedback (elevation, border, or scale)
13. THE System SHALL ensure all text meets WCAG AA contrast requirements against backgrounds
14. THE System SHALL use consistent card dimensions and spacing across the grid

### Requirement 4: Request for Quote (RFQ) Workflow

**User Story:** As a buyer, I want a streamlined process to request quotes for one or multiple products, so that I can initiate business inquiries with minimal friction.

#### Acceptance Criteria

1. WHEN a user clicks a product's quote CTA, THE System SHALL open an RFQ drawer with the product pre-selected
2. THE RFQ_Drawer SHALL display the selected product(s) with thumbnail and name
3. THE RFQ_Drawer SHALL provide input fields for contact information (name, email, company, phone)
4. THE RFQ_Drawer SHALL provide input fields for quantity and delivery location
5. THE RFQ_Drawer SHALL provide a textarea for additional requirements or questions
6. THE RFQ_Drawer SHALL include trust elements (24h response time, NDA available)
7. WHEN a user submits an RFQ, THE System SHALL validate all required fields
8. WHEN RFQ validation fails, THE System SHALL display clear error messages
9. WHEN RFQ validation succeeds, THE System SHALL submit the request and display a confirmation message
10. THE System SHALL provide a multi-product RFQ capability allowing users to add multiple products to a quote request
11. THE System SHALL display a floating action button or cart icon showing the count of products added to multi-product RFQ
12. WHEN on mobile viewport, THE System SHALL display a sticky CTA button for accessing the RFQ drawer

### Requirement 5: Quick View Modal

**User Story:** As a buyer, I want to preview key product specifications in a modal overlay, so that I can evaluate products without navigating away from the catalog page.

#### Acceptance Criteria

1. WHEN a user clicks a "Quick View" action on a product card, THE System SHALL open a modal overlay
2. THE Quick_View modal SHALL display the product hero image
3. THE Quick_View modal SHALL display comprehensive specifications (origin, grade, packaging, MOQ, lead time, Incoterms)
4. THE Quick_View modal SHALL display available certifications and compliance badges
5. THE Quick_View modal SHALL display available documents (COA, spec sheets, chain of custody)
6. THE Quick_View modal SHALL provide a CTA button for requesting a quote
7. THE Quick_View modal SHALL provide a link to the full product detail page
8. WHEN a user clicks outside the modal or presses ESC key, THE System SHALL close the Quick_View modal
9. THE Quick_View modal SHALL be keyboard accessible with proper focus management

### Requirement 6: Trust and Credibility Elements

**User Story:** As an international buyer, I want to see trust indicators and compliance information, so that I can feel confident in the supplier's credibility and regulatory compliance.

#### Acceptance Criteria

1. THE System SHALL display a trust strip component with B2B credibility elements
2. THE Trust_Strip SHALL include "24h response time" indicator
3. THE Trust_Strip SHALL include "NDA available" indicator
4. THE Trust_Strip SHALL include "EUDR compliant" indicator
5. THE Trust_Strip SHALL include "QA documented" indicator
6. THE Trust_Strip SHALL include "COA & spec sheets available" indicator
7. WHEN displaying product cards, THE System SHALL show document availability icons for products with COA, spec sheets, or chain of custody documentation
8. THE System SHALL display certification badges with recognizable icons or logos
9. THE System SHALL provide a process and compliance section explaining the company's quality and traceability standards

### Requirement 7: Catalog Download and Lead Generation

**User Story:** As a buyer, I want to download a PDF catalog of all products, so that I can review offerings offline and share with colleagues.

#### Acceptance Criteria

1. THE System SHALL provide a "Download Catalog PDF" CTA button
2. WHEN a user clicks the download catalog button, THE System SHALL present a form requesting contact information
3. THE System SHALL validate the contact information before allowing download
4. WHEN validation succeeds, THE System SHALL provide the PDF catalog file for download
5. THE System SHALL track catalog download events for analytics
6. THE Catalog_PDF SHALL include all products with images, specifications, and contact information

### Requirement 8: Internationalization and Localization

**User Story:** As an international buyer, I want the catalog page in my preferred language, so that I can understand product information and CTAs clearly.

#### Acceptance Criteria

1. THE System SHALL support French (FR) language
2. THE System SHALL support English (EN) language
3. THE System SHALL support Spanish (ES) language
4. THE System SHALL support German (DE) language
5. THE System SHALL support Russian (RU) language
6. WHEN a user selects a language, THE System SHALL display all UI text, labels, and CTAs in that language
7. THE System SHALL display product names and descriptions in the selected language when translations are available
8. THE System SHALL use the locale parameter from the URL path to determine the active language

### Requirement 9: Performance and Optimization

**User Story:** As a user on various devices and network conditions, I want the catalog page to load quickly and perform smoothly, so that I can browse products without delays.

#### Acceptance Criteria

1. THE System SHALL use Next.js Image component for all product images with appropriate sizes attribute
2. THE System SHALL implement lazy loading for product images below the fold
3. THE System SHALL optimize images for different viewport sizes (mobile, tablet, desktop)
4. WHEN the catalog contains more than 20 products, THE System SHALL implement pagination or infinite scroll
5. THE System SHALL avoid layout shifts during image loading by reserving space
6. THE System SHALL minimize JavaScript bundle size by code splitting components
7. THE System SHALL achieve a Lighthouse performance score of 85+ on desktop
8. THE System SHALL achieve a Lighthouse performance score of 75+ on mobile

### Requirement 10: Analytics and Tracking

**User Story:** As a business stakeholder, I want to track user interactions with the catalog page, so that I can understand user behavior and optimize conversion.

#### Acceptance Criteria

1. WHEN a user applies a filter, THE System SHALL fire a "catalog_filter_used" analytics event with filter type and value
2. WHEN a product card enters the viewport, THE System SHALL fire a "product_card_view" analytics event with product ID
3. WHEN a user clicks a product card quote CTA, THE System SHALL fire a "product_card_cta_quote_click" analytics event with product ID
4. WHEN a user clicks a product card specifications link, THE System SHALL fire a "product_card_spec_click" analytics event with product ID
5. WHEN a user opens a Quick View modal, THE System SHALL fire a "quick_view_open" analytics event with product ID
6. WHEN a user submits an RFQ, THE System SHALL fire an "rfq_submit" analytics event with product IDs and form data
7. WHEN a user downloads the catalog PDF, THE System SHALL fire a "catalogue_download" analytics event
8. THE System SHALL include product metadata in analytics events (category, origin, availability)

### Requirement 11: Accessibility and Usability

**User Story:** As a user with accessibility needs, I want the catalog page to be fully accessible via keyboard and screen readers, so that I can navigate and interact with all features.

#### Acceptance Criteria

1. THE System SHALL provide keyboard navigation for all interactive elements
2. THE System SHALL display visible focus indicators on all focusable elements
3. THE System SHALL provide appropriate ARIA labels for icon-only buttons
4. THE System SHALL provide descriptive alt text for all product images
5. THE System SHALL ensure all text meets WCAG AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text)
6. THE System SHALL use semantic HTML elements (header, nav, main, section, article)
7. THE System SHALL provide skip links for keyboard users
8. WHEN a modal opens, THE System SHALL trap focus within the modal
9. WHEN a modal closes, THE System SHALL return focus to the triggering element
10. THE System SHALL announce dynamic content changes to screen readers using ARIA live regions

### Requirement 12: SEO and Discoverability

**User Story:** As a business stakeholder, I want the catalog page to be discoverable by search engines, so that potential buyers can find our products through organic search.

#### Acceptance Criteria

1. THE System SHALL include a unique H1 heading on the catalog page
2. THE System SHALL include indexable introductory text describing the product catalog
3. THE System SHALL use the URL structure /[locale]/products for the catalog page
4. THE System SHALL use the URL structure /[locale]/products/[slug] for individual product pages
5. THE System SHALL implement Schema.org ItemList structured data for the product catalog
6. THE System SHALL implement Schema.org Product structured data for individual products
7. THE System SHALL provide descriptive meta title and description tags
8. THE System SHALL provide Open Graph tags for social sharing
9. THE System SHALL ensure all product images have descriptive alt attributes
10. THE System SHALL generate an XML sitemap including all product pages

### Requirement 13: Responsive Design and Mobile Experience

**User Story:** As a mobile user, I want a catalog experience optimized for small screens, so that I can browse and request quotes on my smartphone or tablet.

#### Acceptance Criteria

1. THE System SHALL be fully functional on viewport widths from 320px to 1920px
2. WHEN viewport width is below 768px, THE System SHALL display a single-column product grid
3. WHEN viewport width is between 768px and 1024px, THE System SHALL display a 2-column product grid
4. WHEN viewport width is above 1024px, THE System SHALL display a 3-4 column product grid
5. WHEN on mobile viewport, THE System SHALL display a sticky bottom CTA bar for RFQ access
6. WHEN on mobile viewport, THE System SHALL collapse filter controls into an expandable drawer or accordion
7. WHEN on mobile viewport, THE System SHALL optimize touch targets to minimum 44x44px
8. THE System SHALL support touch gestures for closing modals and drawers
9. THE System SHALL prevent horizontal scrolling on all viewport sizes
10. THE System SHALL test responsive behavior at breakpoints: 320px, 375px, 768px, 1024px, 1440px

### Requirement 14: Component Reusability and Maintainability

**User Story:** As a developer, I want well-structured, reusable components with proper TypeScript typing, so that I can maintain and extend the catalog functionality efficiently.

#### Acceptance Criteria

1. THE System SHALL define TypeScript interfaces for all data models (Product, Filter, RFQRequest)
2. THE System SHALL implement the Catalog_Page as a reusable component with props interface
3. THE System SHALL implement the Product_Card as a reusable component with props interface
4. THE System SHALL implement the Filter_Bar as a reusable component with props interface
5. THE System SHALL implement the RFQ_Drawer as a reusable component with props interface
6. THE System SHALL implement the Quick_View modal as a reusable component with props interface
7. THE System SHALL implement the Trust_Strip as a reusable component with props interface
8. THE System SHALL use consistent naming conventions following Next.js and React best practices
9. THE System SHALL separate business logic from presentation components
10. THE System SHALL document component props and usage with JSDoc comments

### Requirement 15: Content Management Integration

**User Story:** As a content manager, I want to manage product data through the Sanity CMS, so that I can update product information without code changes.

#### Acceptance Criteria

1. THE System SHALL fetch product data from Sanity CMS
2. THE System SHALL support all required product fields in the Sanity schema (name, category, heroImage, availability, origins, certifications, eudrReady, qaAvailable, documents, moq, incoterms, packaging, grade, leadTime, notes, tags, markets, updatedAt)
3. THE System SHALL support localized content for product names and descriptions in all five languages
4. THE System SHALL handle missing or incomplete product data gracefully
5. THE System SHALL revalidate product data on-demand when content is updated in Sanity
6. THE System SHALL support image optimization through Sanity's image pipeline
7. THE System SHALL support filtering and sorting products based on CMS data

### Requirement 16: UI Copy and Translations

**User Story:** As an international buyer, I want all UI elements, labels, and CTAs in my language, so that I can understand and interact with the catalog effectively.

#### Acceptance Criteria

1. THE System SHALL provide French translations for all UI text (headings, labels, buttons, placeholders, messages)
2. THE System SHALL provide English translations for all UI text
3. THE System SHALL provide Spanish translations for all UI text
4. THE System SHALL provide German translations for all UI text
5. THE System SHALL provide Russian translations for all UI text
6. THE System SHALL include translations for the page heading "Notre Catalogue de Produits" / "Our Product Catalog" / "Nuestro Catálogo de Productos" / "Unser Produktkatalog" / "Наш Каталог Продукции"
7. THE System SHALL include translations for the page subtitle describing premium agricultural products
8. THE System SHALL include translations for filter labels (Search, Category, Origin, Availability, Certifications, Incoterms, MOQ)
9. THE System SHALL include translations for filter placeholders ("Rechercher un produit..." / "Search for a product..." / "Buscar un producto..." / "Produkt suchen..." / "Искать продукт...")
10. THE System SHALL include translations for availability badges ("En stock" / "In Stock" / "En existencia" / "Auf Lager" / "В наличии", "Stock limité" / "Limited Stock" / "Stock limitado" / "Begrenzter Vorrat" / "Ограниченный запас", "Précommande" / "Pre-order" / "Pedido anticipado" / "Vorbestellung" / "Предзаказ")
11. THE System SHALL include translations for certification badges ("EUDR Ready", "Bio", "Fair Trade", "Rainforest Alliance")
12. THE System SHALL include translations for primary CTA ("Demander un devis" / "Request a Quote" / "Solicitar cotización" / "Angebot anfordern" / "Запросить предложение")
13. THE System SHALL include translations for secondary CTA ("Voir spécifications" / "View Specifications" / "Ver especificaciones" / "Spezifikationen ansehen" / "Посмотреть спецификации")
14. THE System SHALL include translations for quick specs labels ("Origine" / "Origin" / "Origen" / "Herkunft" / "Происхождение", "MOQ" remains "MOQ", "Incoterm" remains "Incoterm")
15. THE System SHALL include translations for trust elements ("Réponse sous 24h" / "24h Response" / "Respuesta en 24h" / "Antwort in 24h" / "Ответ в течение 24ч", "NDA disponible" / "NDA Available" / "NDA disponible" / "NDA verfügbar" / "NDA доступно", "Documentation QA" / "QA Documentation" / "Documentación QA" / "QA-Dokumentation" / "QA документация")
16. THE System SHALL include translations for RFQ drawer headings and form labels
17. THE System SHALL include translations for error messages and validation feedback
18. THE System SHALL include translations for empty states ("Aucun produit trouvé" / "No products found" / "No se encontraron productos" / "Keine Produkte gefunden" / "Продукты не найдены")
19. THE System SHALL include translations for catalog download CTA ("Télécharger le catalogue PDF" / "Download PDF Catalog" / "Descargar catálogo PDF" / "PDF-Katalog herunterladen" / "Скачать PDF каталог")
20. THE System SHALL include translations for multi-product RFQ labels ("Panier de devis" / "Quote Cart" / "Carrito de cotización" / "Angebotskorb" / "Корзина предложений")
