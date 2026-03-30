# Guide des Tests Property-Based - SEO Programmatique Afrexia

Ce document décrit l'approche de test par propriétés (property-based testing) utilisée pour valider le système de SEO programmatique. Les tests sont situés dans `__tests__/properties/`.

---

## Table des Matières

1. [Concepts Fondamentaux](#concepts-fondamentaux)
2. [Structure des Tests](#structure-des-tests)
3. [Catalogue des Propriétés](#catalogue-des-propriétés)
4. [Exécuter les Tests](#exécuter-les-tests)
5. [Ajouter de Nouveaux Tests](#ajouter-de-nouveaux-tests)
6. [Arbitraires Réutilisables](#arbitraires-réutilisables)

---

## Concepts Fondamentaux

### Property-Based Testing (PBT)

Contrairement aux tests unitaires classiques qui vérifient des cas précis, le PBT génère des milliers d'entrées aléatoires et vérifie qu'une **propriété** reste vraie pour toutes ces entrées.

```
Test classique : generateTitle("Cacao export Pays-Bas") → "Cacao export Pays-Bas | Afrexia" (50 chars ✓)
Test property  : POUR TOUT titre en entrée → le titre généré fait toujours 50-60 caractères
```

### Outil : fast-check

Tous les tests utilisent [fast-check](https://fast-check.dev/). Les concepts clés :

- **`fc.property(...arbitraries, predicate)`** — définit une propriété à vérifier
- **`fc.assert(property, { numRuns: 100 })`** — exécute la propriété N fois avec des données aléatoires
- **Arbitrary** — générateur de données aléatoires typées (`fc.string()`, `fc.integer()`, `fc.record()`, etc.)
- **Shrinking** — en cas d'échec, fast-check réduit automatiquement l'entrée au plus petit contre-exemple

---

## Structure des Tests

```
__tests__/properties/
├── contentGenerator.properties.test.ts        # Propriétés 1, 12, 14, 16
├── routeCombinationValidator.properties.test.ts # Propriétés 2, 3
├── indexabilityController.properties.test.ts  # Propriétés 19, 25
├── metadataGenerator.properties.test.ts       # Propriétés 6, 29, 30, 31, 32
├── sitemapGenerator.properties.test.ts        # Propriétés 17, 26, 27, 28
├── internalLinkingEngine.properties.test.ts   # Propriétés 33, 34, 35
├── routes.properties.test.ts                  # Propriétés 4, 5, 15, 18, 36, 37, 38, 39, 40, 41
└── dataFreshness.properties.test.ts           # Propriétés 20, 21
```

---

## Catalogue des Propriétés

### Propriété 1 — Multilingual Fallback Consistency

**Fichier :** `contentGenerator.properties.test.ts`
**Requirements :** 1.1.2, 1.7.5
**Composant :** `ContentGenerator.applyLanguageFallback()`

Garantit que toute traduction manquante utilise l'anglais comme fallback, et que le résultat est toujours une chaîne non vide.

| Cas testé | Comportement attendu |
|-----------|---------------------|
| Locale disponible dans `LocalizedString` | Retourne la valeur de la locale demandée |
| Locale absente (es/de/ru manquant) | Retourne la valeur anglaise |
| Fallback utilisé | Un warning est loggé |
| Toutes locales présentes | Aucun warning loggé |

---

### Propriété 2 — Route Combination Validation

**Fichier :** `routeCombinationValidator.properties.test.ts`
**Requirements :** 1.2.1, 1.2.2, 1.2.5
**Composant :** `RouteCombinationValidator.validateProductCountry()`

Garantit que seules les combinaisons avec `approvedForSEO=true` ET `dataCompleteness >= 70` sont acceptées.

| Cas testé | Comportement attendu |
|-----------|---------------------|
| `approvedForSEO=false` (quelle que soit la complétude) | `isValid=false` avec raison |
| `dataCompleteness < 70` (même si approuvé) | `isValid=false` avec raison |
| `approvedForSEO=true` ET `dataCompleteness >= 70` | `isValid=true` |
| Résultat rejeté | `reason` est toujours une chaîne non vide |

---

### Propriété 3 — Rejected Combination Logging

**Fichier :** `routeCombinationValidator.properties.test.ts`
**Requirements :** 1.2.6
**Composant :** `RouteCombinationValidator.logRejectedCombination()`

Garantit que chaque combinaison rejetée génère exactement un log structuré contenant le slug produit, le slug pays, la raison, et un timestamp.

---

### Propriété 4 — Route Pattern Consistency

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.3.1
**Composant :** `isrConfig.getPageTypeFromPath()`

Garantit que les routes générées respectent les patterns définis :
- Produit × Pays : `/[locale]/produits/[product-slug]/export-[country-slug]`
- Prix : `/[locale]/prix/[product-slug]-cameroun`
- Comparaison : `/[locale]/guide/[product-a]-vs-[product-b]`

---

### Propriété 5 — Page Data Completeness

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.3.2, 1.3.3, 1.3.4, 1.3.5

Documente que chaque page produit × pays contient les données produit, pays, certifications et ports. Validé via les tests d'intégration (`__tests__/integration/`).

---

### Propriété 6 — Schema.org Structured Data Presence

**Fichier :** `metadataGenerator.properties.test.ts`
**Requirements :** 1.12.3, 1.12.4
**Composant :** `MetadataGenerator.generateProductSchema()`

Garantit que toute page produit contient un schéma `Product` avec un `Offer` imbriqué, et que le nom du produit est toujours présent.

---

### Propriété 12 — Minimum Content Length

**Fichier :** `contentGenerator.properties.test.ts`
**Requirements :** 1.6.6
**Composant :** `ContentGenerator.meetsMinimumLength()`, `calculateContentLength()`

Garantit que :
- `meetsMinimumLength()` retourne `true` si et seulement si le total de mots est ≥ 500
- `calculateContentLength()` somme correctement les `wordCount` de tous les blocs

---

### Propriété 14 — Content Source Marking

**Fichier :** `contentGenerator.properties.test.ts`
**Requirements :** 1.6.8, 1.8.1
**Composant :** `ContentGenerator.markContentSource()`

Garantit que tout bloc de contenu créé via `markContentSource()` possède :
- Un `sourceType` valide parmi `sanity | calculated | template | editorial`
- Une `locale` correspondant à la locale demandée
- Un `wordCount` ≥ 0

---

### Propriété 15 — Multilingual Content Consistency

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.7.1, 1.7.2, 1.7.3, 1.7.4

Garantit que toutes les locales supportées (`fr`, `en`, `es`, `de`, `ru`) sont des préfixes de route valides, et que le temps de revalidation ISR est correct pour chaque variante de locale.

---

### Propriété 16 — Fallback Usage Logging

**Fichier :** `contentGenerator.properties.test.ts`
**Requirements :** 1.7.6
**Composant :** `ContentGenerator.applyLanguageFallback()`

Garantit que chaque utilisation du fallback anglais génère exactement un warning contenant le mot `"fallback"`, et qu'aucun warning n'est émis quand la locale est disponible.

---

### Propriété 17 — Sitemap Locale Variants

**Fichier :** `sitemapGenerator.properties.test.ts`
**Requirements :** 1.7.7
**Composant :** `SitemapGenerator.entriesToXML()`

Garantit que toute page indexable a ses 5 variantes de locale dans le sitemap, et que le XML généré contient bien les 5 URLs correspondantes.

---

### Propriété 18 — Unsupported Locale Redirect

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.7.8
**Composant :** `isrConfig.getPageTypeFromPath()`

Garantit que les locales non supportées ne correspondent à aucun type de page connu (retourne `null`), ce qui déclenche la redirection vers le français dans le middleware.

---

### Propriété 19 — High Fallback Content Non-Indexability

**Fichier :** `indexabilityController.properties.test.ts`
**Requirements :** 1.7.9, 1.9.4
**Composant :** `IndexabilityController.determineIndexability()`

Garantit que toute page avec plus de 30% de blocs en fallback (locale différente de la locale dominante) est marquée `noindex`.

| Fallback % | Résultat |
|-----------|---------|
| > 30% | `isIndexable=false`, raison contient "Fallback" |
| ≤ 30% | Pas rejeté pour raison de fallback |

---

### Propriété 20 — Estimated Data Disclaimers

**Fichier :** `dataFreshness.properties.test.ts`
**Requirements :** 1.8.6, 1.10.2, 1.10.3, 1.10.4
**Composant :** `ContentGenerator.generateDisclaimer()`

Garantit que des disclaimers non vides existent pour les 3 types de données estimées (`price`, `delay`, `logistics`) dans les 5 locales. Le disclaimer de prix doit contenir un langage indicatif ou une invitation à contacter.

---

### Propriété 21 — Data Freshness Indicators

**Fichier :** `dataFreshness.properties.test.ts`
**Requirements :** 1.10.1

Garantit que les dates de fraîcheur sont des chaînes ISO valides (`YYYY-MM-DD`), et que les données de plus de 90 jours sont identifiables comme périmées.

---

### Propriété 25 — Quality Threshold Non-Indexability

**Fichier :** `indexabilityController.properties.test.ts`
**Requirements :** 1.9.4
**Composant :** `IndexabilityController.determineIndexability()`, `generateRobotsMetaTag()`

Garantit que les trois seuils de qualité sont appliqués :

| Seuil | Condition de rejet | Raison dans le rapport |
|-------|-------------------|----------------------|
| Complétude données | `dataCompleteness < 70` | Contient "Data completeness" |
| Longueur contenu | Total mots < 500 | Contient "Content length" |
| Fallback linguistique | Fallback > 30% | Contient "Fallback" |

Garantit aussi que `generateRobotsMetaTag()` retourne `"noindex, follow"` ou `"index, follow"` selon la décision.

---

### Propriété 26 — Non-Indexable Pages Excluded from Sitemap

**Fichier :** `sitemapGenerator.properties.test.ts`
**Requirements :** 1.9.6, 1.11.6
**Composant :** `SitemapGenerator.entriesToXML()`

Garantit que le XML généré contient exactement autant d'éléments `<url>` que d'entrées fournies — ni plus, ni moins. Les sections vides ne produisent aucune URL.

---

### Propriété 27 — Sitemap Entry Completeness

**Fichier :** `sitemapGenerator.properties.test.ts`
**Requirements :** 1.11.3, 1.11.4, 1.11.5
**Composant :** `SitemapGenerator.entriesToXML()`

Garantit que toute entrée du sitemap possède `lastmod`, `changefreq`, `priority`, et que le XML produit est bien formé (déclaration XML, balises `<urlset>` ouvrante et fermante).

---

### Propriété 28 — Price Page Changefreq

**Fichier :** `sitemapGenerator.properties.test.ts`
**Requirements :** 1.11.5

Garantit que toutes les pages de prix ont `changefreq="daily"` dans le sitemap XML.

---

### Propriété 29 — Metadata Title Length Optimization

**Fichier :** `metadataGenerator.properties.test.ts`
**Requirements :** 1.12.1
**Composant :** `MetadataGenerator.optimizeTitle()`, `generatePageMetadata()`

Garantit que :
- `optimizeTitle()` préserve les titres déjà dans la plage 50-60 caractères
- `optimizeTitle()` tronque les titres > 60 caractères à ≤ 60 caractères
- `generatePageMetadata()` produit toujours un titre ≤ 60 caractères

---

### Propriété 30 — Metadata Description Length Optimization

**Fichier :** `metadataGenerator.properties.test.ts`
**Requirements :** 1.12.2
**Composant :** `MetadataGenerator.optimizeDescription()`, `generatePageMetadata()`

Garantit que :
- `optimizeDescription()` préserve les descriptions dans la plage 150-160 caractères
- `optimizeDescription()` tronque les descriptions > 160 caractères à ≤ 160 caractères
- `generatePageMetadata()` produit toujours une description ≤ 160 caractères

---

### Propriété 31 — FAQ Schema.org Presence

**Fichier :** `metadataGenerator.properties.test.ts`
**Requirements :** 1.12.6
**Composant :** `MetadataGenerator.generateFAQSchema()`

Garantit que toute liste de FAQ produit un schéma `FAQPage` avec autant de `Question` que de FAQ, chacune ayant un `acceptedAnswer` de type `Answer`.

---

### Propriété 32 — Social Sharing Metadata

**Fichier :** `metadataGenerator.properties.test.ts`
**Requirements :** 1.12.7, 1.12.8
**Composant :** `MetadataGenerator.generatePageMetadata()`

Garantit que toute page contient :
- Open Graph : `title`, `description`, `url`
- Twitter Card : `card` (commence par `"summary"`), `title`, `description`
- Hreflang pour les 5 locales + `x-default` (pointant vers `/fr/`)
- URL canonique contenant la locale et le slug

---

### Propriété 33 — Internal Links Presence

**Fichier :** `internalLinkingEngine.properties.test.ts`
**Requirements :** 1.13.1, 1.13.2, 1.13.3, 1.13.4, 1.13.5
**Composant :** `InternalLinkingEngine.generateRelatedLinks()`, `generateBreadcrumb()`

Garantit que :
- `generateRelatedLinks()` retourne entre 0 et 6 liens
- `generateBreadcrumb()` retourne 4 items pour `product-country`, 3 pour `price` et `comparison`
- Les items du breadcrumb ont des positions séquentielles à partir de 1
- Tous les liens ont une URL et un `anchorText` non vides

---

### Propriété 34 — Anchor Text Variation

**Fichier :** `internalLinkingEngine.properties.test.ts`
**Requirements :** 1.13.6
**Composant :** `InternalLinkingEngine.varyAnchorText()`

Garantit que :
- `varyAnchorText()` retourne toujours une valeur du pool fourni
- Le résultat est déterministe pour le même seed (reproductibilité)
- Retourne le seed si le pool est vide

---

### Propriété 35 — Indexable Link Prioritization

**Fichier :** `internalLinkingEngine.properties.test.ts`
**Requirements :** 1.13.7
**Composant :** `InternalLinkingEngine.generateRelatedLinks()`

Garantit que :
- Les liens indexables apparaissent avant les liens non-indexables dans les résultats
- Un lien marqué `isIndexable=true` correspond bien à une URL dans le set `indexableUrls`
- Aucun lien dupliqué dans les résultats

---

### Propriété 36 — Custom 404 Page

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.14.1, 1.14.3, 1.14.4, 1.14.5

Documente que la page `app/[locale]/not-found.tsx` contient des suggestions de pages similaires, un formulaire de recherche, et des liens vers les pages populaires. Validé structurellement via les tests unitaires dans `__tests__/unit/routes/notFoundPage.test.ts`.

---

### Propriété 37 — Invalid Route Logging

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.14.2
**Composant :** `isrErrorHandler.handleISRError()`

Garantit que chaque erreur de route invalide est loggée avec le chemin (`path`) dans le payload.

---

### Propriété 38 — ISR Regeneration Error Handling

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.15.5
**Composant :** `isrErrorHandler.withISRRegeneration()`

Garantit que :
- Toute erreur de régénération est re-throwée (Next.js sert alors la version en cache)
- L'erreur est loggée avec `path`, `type`, et `timestamp`
- Une régénération réussie ne produit aucun log d'erreur

---

### Propriété 39 — Cache Headers Presence

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.15.7
**Composant :** `cacheHeaders.generateCacheHeaders()`, `generateETag()`

Garantit que :
- Tout type de page génère un header `Cache-Control` avec `s-maxage` et `stale-while-revalidate`
- Le header contient la directive `public`
- L'ETag est déterministe pour le même contenu et différent pour des contenus différents
- `stale-while-revalidate` vaut la moitié de `s-maxage`

---

### Propriété 40 — Page Performance TTFB

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.16.4

Propriété documentée. Nécessite des tests E2E (Lighthouse CI, WebPageTest, Playwright). Exigence : TTFB < 2000ms, garanti par l'ISR et les React Server Components.

---

### Propriété 41 — Lighthouse Performance Score

**Fichier :** `routes.properties.test.ts`
**Requirements :** 1.16.5

Propriété documentée. Nécessite Lighthouse CI en staging/production. Exigence : score ≥ 90, garanti par `next/image`, les RSC, et le streaming HTML.

---

## Exécuter les Tests

```bash
# Tous les tests property-based
npx vitest run __tests__/properties

# Un fichier spécifique
npx vitest run __tests__/properties/contentGenerator.properties.test.ts

# Avec couverture de code
npx vitest run --coverage __tests__/properties

# En mode watch (développement)
npx vitest __tests__/properties
```

---

## Ajouter de Nouveaux Tests

### 1. Choisir le bon fichier

Ajouter le test dans le fichier correspondant au composant testé, ou créer un nouveau fichier `[composant].properties.test.ts`.

### 2. Structure d'un test property-based

```typescript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { maFonction } from '@/lib/seo/monComposant';

describe('Property N: Nom de la propriété', () => {
  it('description de ce qui doit toujours être vrai', () => {
    fc.assert(
      fc.property(
        // Arbitraires : générateurs de données aléatoires
        fc.integer({ min: 0, max: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        // Prédicat : la propriété à vérifier
        (nombre, texte) => {
          const resultat = maFonction(nombre, texte);
          expect(resultat).toBeTruthy(); // doit être vrai pour TOUTES les entrées
        }
      ),
      { numRuns: 100 } // minimum 100 runs
    );
  });
});
```

### 3. Arbitraires courants

```typescript
// Types de base
fc.string({ minLength: 1, maxLength: 200 })
fc.integer({ min: 0, max: 100 })
fc.boolean()
fc.uuid()
fc.webUrl()
fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })

// Sélection dans un ensemble fixe
fc.constantFrom('fr', 'en', 'es', 'de', 'ru')

// Objets structurés
fc.record({
  name: fc.string({ minLength: 1 }),
  value: fc.integer({ min: 0, max: 100 }),
})

// Tableaux
fc.array(fc.string(), { minLength: 1, maxLength: 10 })

// Regex
fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/)

// Transformation
fc.integer({ min: 0, max: 100 }).map((n) => n / 100)

// Filtrage (à utiliser avec parcimonie)
fc.string().filter((s) => s.length > 5)

// Chaînage (dépendance entre arbitraires)
fc.integer({ min: 0, max: 100 }).chain((n) =>
  fc.record({ value: fc.constant(n), doubled: fc.constant(n * 2) })
)
```

### 4. Arbitraires réutilisables du projet

Ces arbitraires sont définis dans chaque fichier de test et peuvent être copiés :

```typescript
// Locale
const localeArb: fc.Arbitrary<Locale> = fc.constantFrom('fr', 'en', 'es', 'de', 'ru');

// Slug URL-safe
const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/);

// LocalizedString avec fr+en obligatoires
const localizedStringArb = fc.record({
  fr: fc.string({ minLength: 1, maxLength: 200 }),
  en: fc.string({ minLength: 1, maxLength: 200 }),
  es: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  de: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  ru: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
});

// Product
const productArb: fc.Arbitrary<Product> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('product' as const),
  name: fc.record({ fr: fc.string({ minLength: 1 }), en: fc.string({ minLength: 1 }) }),
  slug: slugArb.map((s) => ({ current: s })),
});

// ExportCountry (valide pour SEO)
const validCountryArb: fc.Arbitrary<ExportCountry> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('exportCountry' as const),
  name: fc.record({ fr: fc.string({ minLength: 1 }), en: fc.string({ minLength: 1 }) }),
  slug: slugArb.map((s) => ({ current: s })),
  code: fc.stringMatching(/^[A-Z]{2}$/),
  dataCompleteness: fc.integer({ min: 70, max: 100 }),
  approvedForSEO: fc.constant(true),
});
```

### 5. Bonnes pratiques

- **Minimum 100 runs** : toujours passer `{ numRuns: 100 }` à `fc.assert()`
- **Préconditions** : utiliser `fc.pre(condition)` plutôt que `.filter()` pour les préconditions complexes
- **Propriétés indépendantes** : chaque `it()` teste une seule propriété
- **Nommage** : préfixer le `describe` avec `Property N: ` pour traçabilité
- **Mapping requirements** : documenter les requirements validés dans le JSDoc du fichier
- **Mocks** : utiliser `vi.spyOn` avec `beforeEach`/`afterEach` pour les effets de bord (logs)
- **Tests async** : utiliser `fc.asyncProperty` et `await fc.assert(...)` pour les fonctions async

### 6. Documenter le mapping requirement → propriété

Ajouter en en-tête du fichier :

```typescript
/**
 * Property-Based Tests: MonComposant
 *
 * **Validates: Requirements X.Y, X.Z**
 *
 * Properties covered:
 * - Property N: Nom de la propriété
 */
```

---

## Récapitulatif : Propriétés par Requirement

| Requirement | Propriétés |
|-------------|-----------|
| 1.1.2 | 1 (Multilingual Fallback Consistency) |
| 1.2.1, 1.2.2, 1.2.5 | 2 (Route Combination Validation) |
| 1.2.6 | 3 (Rejected Combination Logging) |
| 1.3.1 | 4 (Route Pattern Consistency) |
| 1.3.2–1.3.5 | 5 (Page Data Completeness) |
| 1.6.6 | 12 (Minimum Content Length) |
| 1.6.8, 1.8.1 | 14 (Content Source Marking) |
| 1.7.1–1.7.4 | 15 (Multilingual Content Consistency) |
| 1.7.5 | 1 (Multilingual Fallback Consistency) |
| 1.7.6 | 16 (Fallback Usage Logging) |
| 1.7.7 | 17 (Sitemap Locale Variants) |
| 1.7.8 | 18 (Unsupported Locale Redirect) |
| 1.7.9, 1.9.4 | 19 (High Fallback Content Non-Indexability) |
| 1.8.6, 1.10.2–1.10.4 | 20 (Estimated Data Disclaimers) |
| 1.10.1 | 21 (Data Freshness Indicators) |
| 1.11.3–1.11.5 | 27 (Sitemap Entry Completeness) |
| 1.11.5 | 28 (Price Page Changefreq) |
| 1.11.6, 1.9.6 | 26 (Non-Indexable Pages Excluded from Sitemap) |
| 1.12.1 | 29 (Metadata Title Length Optimization) |
| 1.12.2 | 30 (Metadata Description Length Optimization) |
| 1.12.3, 1.12.4 | 6 (Schema.org Structured Data Presence) |
| 1.12.6 | 31 (FAQ Schema.org Presence) |
| 1.12.7, 1.12.8 | 32 (Social Sharing Metadata) |
| 1.13.1–1.13.5 | 33 (Internal Links Presence) |
| 1.13.6 | 34 (Anchor Text Variation) |
| 1.13.7 | 35 (Indexable Link Prioritization) |
| 1.14.1, 1.14.3–1.14.5 | 36 (Custom 404 Page) |
| 1.14.2 | 37 (Invalid Route Logging) |
| 1.15.5 | 38 (ISR Regeneration Error Handling) |
| 1.15.7 | 39 (Cache Headers Presence) |
| 1.16.4 | 40 (Page Performance TTFB) |
| 1.16.5 | 41 (Lighthouse Performance Score) |
