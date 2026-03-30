# Business Combinations — Programmatic SEO

## Overview

This document defines the 15 approved product×country combinations for the programmatic SEO system (task 7.2).

Out of 20 possible combinations (4 products × 5 countries), 15 are approved based on commercial relevance, market size, and trade data.

---

## Approved Combinations (15)

| # | Product | Country | Code | Justification |
|---|---------|---------|------|---------------|
| 1 | Cacao | Pays-Bas | NL | Rotterdam is Europe's largest port and a major cocoa trading hub |
| 2 | Cacao | Belgique | BE | Antwerp handles >60% of world cocoa beans; world-class chocolate industry |
| 3 | Cacao | Allemagne | DE | Major chocolate and confectionery industry |
| 4 | Cacao | France | FR | Major chocolate market; strong Franco-Cameroonian trade ties |
| 5 | Cacao | Chine | CN | Rapidly growing cocoa/chocolate consumption market |
| 6 | Café Arabica | Pays-Bas | NL | Major coffee trading hub; Amsterdam Coffee Festival |
| 7 | Café Arabica | Belgique | BE | Established specialty coffee market |
| 8 | Café Arabica | Allemagne | DE | Largest coffee market in Europe; Hamburg is the main EU coffee port |
| 9 | Café Arabica | France | FR | Major coffee market; strong cultural affinity for quality coffee |
| 10 | Café Robusta | Pays-Bas | NL | Major coffee trading and re-export hub |
| 11 | Café Robusta | Allemagne | DE | Large robusta demand for blends and espresso |
| 12 | Café Robusta | France | FR | France is a top robusta consumer (espresso culture) |
| 13 | Cajou | Pays-Bas | NL | Major nut trading and distribution hub for Europe |
| 14 | Cajou | Allemagne | DE | Large nut snack and food industry market |
| 15 | Cajou | Chine | CN | World's largest cashew consumer |

---

## Excluded Combinations (5)

| Product | Country | Code | Reason |
|---------|---------|------|--------|
| Café Arabica | Chine | CN | Nascent specialty coffee market; lower commercial priority for V1 |
| Café Robusta | Belgique | BE | Belgium primarily imports arabica; robusta demand is limited |
| Café Robusta | Chine | CN | China's robusta market is small; lower ROI for V1 |
| Cajou | Belgique | BE | Belgium is not a significant cashew market |
| Cajou | France | FR | France imports cashews but not a priority market vs NL/DE/CN |

These combinations can be added in a future iteration once V1 pages are validated.

---

## Data Completeness Requirements

All approved combinations must meet:

- `approvedForSEO = true`
- `dataCompleteness >= 70%`

The `approvedForSEO` flag is set at the **exportCountry** level in Sanity. All 5 export countries already have `approvedForSEO = true` and `dataCompleteness >= 70%` (set in task 7.1).

The 15 approved combinations are enforced at query time via `getApprovedExportCountries()` in `lib/sanity/seoQueries.ts`, which filters on `approvedForSEO == true && dataCompleteness >= 70`.

The 5 excluded combinations are handled by **not** creating product×country page routes for those pairs. The `generateStaticParams()` function in the route page only generates routes for approved countries, and the product slugs for the excluded combinations are simply not paired.

---

## Current Data Completeness (from task 7.1)

| Country | Code | dataCompleteness | approvedForSEO |
|---------|------|-----------------|----------------|
| Pays-Bas | NL | 85% | ✅ true |
| Belgique | BE | 90% | ✅ true |
| Allemagne | DE | 88% | ✅ true |
| France | FR | 90% | ✅ true |
| Chine | CN | 80% | ✅ true |

All countries meet the `>= 70%` threshold.

---

## How Combinations Are Enforced

The system uses a two-level approval mechanism:

1. **Country-level approval** (`exportCountry.approvedForSEO`): Controls whether a country is eligible for SEO pages at all.
2. **Route-level filtering** (`RouteCombinationValidator`): The validator in `lib/seo/routeCombinationValidator.ts` checks both `approvedForSEO` and `dataCompleteness >= 70%` before generating a route.

The 5 excluded combinations are managed by the `EXCLUDED_COMBINATIONS` list in `scripts/validate-business-combinations.ts`, which documents them for reference and can be used to verify no routes are accidentally generated for them.

---

## Running the Validation Script

```bash
npx tsx scripts/validate-business-combinations.ts
```

This script:
1. Connects to Sanity and fetches all export countries
2. Fetches all published products
3. Verifies all 15 approved combinations have `approvedForSEO = true` and `dataCompleteness >= 70%`
4. Reports any issues found
5. Optionally updates Sanity data if `--fix` flag is passed
