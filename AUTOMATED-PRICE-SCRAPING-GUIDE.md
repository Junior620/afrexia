# Guide d'Implémentation : Système d'Automatisation des Prix

## Vue d'Ensemble

Ce guide documente l'implémentation complète d'un système automatisé de récupération et mise à jour des prix des matières premières (cacao et café) depuis des sources externes (ICE London et ONCC Cameroon).

## Architecture du Système

### Sources de Données

1. **Cacao - ICE London Cocoa Futures**
   - URL: https://www.ice.com/products/37089076/London-Cocoa-Futures/data?marketId=7758984
   - Unité: `£ / T ICE London` (Livre Sterling par Tonne)
   - Technologie: Playwright (navigateur headless)
   - Raison: Le site charge les données dynamiquement avec JavaScript
   - XPath: `/html/body/div[1]/div/main/div/div/div/div/div/div[4]/div/div/div[1]/table/tbody[1]/tr[1]/td[2]`
   - Horaire: 18h30 WAT (17h30 UTC) du lundi au vendredi
   - Prix capturé: Prix de clôture (marché ferme à 17h00 London time)

2. **Café - ONCC Cameroon**
   - URL: https://www.oncc.cm/prices
   - Unité: `FCFA/KG FOB ONCC` (Franc CFA par Kilogramme FOB)
   - Technologie: Cheerio (HTML statique)
   - Produits: Café Arabica et Café Robusta
   - XPath Arabica: `/html/body/main/div/div[5]/div/div/section[2]/section/section[2]/span[1]`
   - XPath Robusta: `/html/body/main/div/div[6]/div/div/section[2]/section/section[2]/span[1]`
   - Horaire: 14h00 WAT (13h00 UTC) du lundi au vendredi

### Composants du Système

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Cron Jobs                         │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ Cocoa Cron (18h30)   │  │ Coffee Cron (14h00)  │        │
│  └──────────┬───────────┘  └──────────┬───────────┘        │
└─────────────┼──────────────────────────┼────────────────────┘
              │                          │
              ▼                          ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  Playwright      │      │  Cheerio         │
    │  (ICE Scraping)  │      │  (ONCC Scraping) │
    └────────┬─────────┘      └────────┬─────────┘
             │                         │
             └────────────┬────────────┘
                          ▼
              ┌───────────────────────┐
              │  PriceServiceServer   │
              │  (Calcul variations)  │
              └───────────┬───────────┘
                          ▼
              ┌───────────────────────┐
              │    Sanity CMS         │
              │  (commodityPrice)     │
              └───────────┬───────────┘
                          ▼
              ┌───────────────────────┐
              │   API Route /prices   │
              └───────────┬───────────┘
                          ▼
              ┌───────────────────────┐
              │  PriceTickerSection   │
              │  (Affichage UI)       │
              └───────────────────────┘
```

## Étape 1 : Dépendances NPM

### Installation

```bash
npm install playwright cheerio
```

### package.json

```json
{
  "dependencies": {
    "playwright": "^1.57.0",
    "cheerio": "^1.2.0"
  }
}
```


## Étape 2 : Schéma Sanity CMS

### Fichier: `schemaTypes/commodityPrice.ts`

```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'commodityPrice',
  title: 'Prix des Matières Premières',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Produit',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'unit',
      title: 'Unité',
      type: 'string',
      initialValue: 'FCFA/KG FOB ONCC',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trend',
      title: 'Tendance',
      type: 'string',
      options: {
        list: [
          { title: 'Hausse', value: 'up' },
          { title: 'Baisse', value: 'down' },
          { title: 'Stable', value: 'stable' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'change',
      title: 'Variation (%)',
      type: 'number',
      description: 'Variation en pourcentage (positif pour hausse, négatif pour baisse)',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Dernière mise à jour',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'URL ou nom de la source des données',
    }),
  ],
  preview: {
    select: {
      title: 'product',
      price: 'price',
      unit: 'unit',
      trend: 'trend',
    },
    prepare({ title, price, unit, trend }) {
      const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
      return {
        title: `${title}`,
        subtitle: `${price} ${unit} ${trendIcon}`,
      };
    },
  },
});
```

### Enregistrer le schéma dans `schemaTypes/index.ts`

```typescript
import commodityPrice from './commodityPrice';

export const schemaTypes = [
  // ... autres schémas
  commodityPrice,
];
```


## Étape 3 : Service Sanity (Server-Side)

### Fichier: `src/infrastructure/cms/PriceServiceServer.ts`

```typescript
import { sanityClient } from './SanityClient';

interface PriceData {
  product: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
}

export class PriceServiceServer {
  /**
   * Récupère tous les prix depuis Sanity
   */
  static async getPrices(): Promise<PriceData[]> {
    const query = `*[_type == "commodityPrice"] | order(product asc) {
      product,
      price,
      unit,
      trend,
      change,
      source,
      lastUpdated
    }`;

    return await sanityClient.fetch(query);
  }

  /**
   * Met à jour ou crée les prix dans Sanity
   */
  static async updatePrices(prices: PriceData[]): Promise<void> {
    for (const priceData of prices) {
      // Chercher si le produit existe déjà
      const existing = await sanityClient.fetch(
        `*[_type == "commodityPrice" && product == $product][0]`,
        { product: priceData.product }
      );

      if (existing) {
        // Mettre à jour
        await sanityClient
          .patch(existing._id)
          .set({
            price: priceData.price,
            unit: priceData.unit,
            trend: priceData.trend,
            change: priceData.change,
            source: priceData.source,
            lastUpdated: new Date().toISOString(),
          })
          .commit();
      } else {
        // Créer nouveau document
        await sanityClient.create({
          _type: 'commodityPrice',
          product: priceData.product,
          price: priceData.price,
          unit: priceData.unit,
          trend: priceData.trend,
          change: priceData.change,
          source: priceData.source,
          lastUpdated: new Date().toISOString(),
        });
      }
    }
  }
}
```

## Étape 4 : Cron Job Cacao (Playwright)

### Fichier: `src/app/api/cron/update-cocoa-price/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PriceServiceServer } from '@/infrastructure/cms/PriceServiceServer';
import { chromium } from 'playwright';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface PriceData {
  product: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
}

/**
 * Scrape ICE London Cocoa Futures avec Playwright
 */
async function fetchCocoaPriceFromICE(): Promise<PriceData> {
  let browser;
  try {
    // Lancer navigateur headless
    browser = await chromium.launch({ headless: true });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
    
    const page = await context.newPage();
    
    // Naviguer vers ICE
    await page.goto(
      'https://www.ice.com/products/37089076/London-Cocoa-Futures/data?marketId=7758984',
      { waitUntil: 'networkidle', timeout: 30000 }
    );
    
    // Attendre la table
    await page.waitForSelector('table tbody tr td', { timeout: 10000 });
    
    // Extraire le prix avec XPath
    const priceElement = page.locator(
      'xpath=/html/body/div[1]/div/main/div/div/div/div/div/div[4]/div/div/div[1]/table/tbody[1]/tr[1]/td[2]'
    ).first();
    
    const priceText = await priceElement.textContent();
    
    if (!priceText) {
      throw new Error('Price element found but no text content');
    }
    
    // Parser le prix
    const priceMatch = priceText.trim().match(/[\d,]+\.?\d*/);
    if (!priceMatch) {
      throw new Error(`No price found in ICE text: ${priceText}`);
    }
    
    const price = parseFloat(priceMatch[0].replace(/,/g, ''));
    
    if (isNaN(price) || price <= 0) {
      throw new Error(`Invalid ICE cocoa price: ${price}`);
    }
    
    await browser.close();
    
    return {
      product: 'Cacao',
      price,
      unit: '£ / T ICE London',
      trend: 'stable',
      change: 0,
      source: 'ICE',
    };
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier le secret du cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Récupérer les prix actuels depuis Sanity
    const currentPrices = await PriceServiceServer.getPrices();

    // 2. Fetch nouveau prix depuis ICE
    const newCocoaPrice = await fetchCocoaPriceFromICE();

    // 3. Calculer la variation automatiquement
    const oldPrice = currentPrices.find((p) => p.product === 'Cacao');

    let priceWithTrend = newCocoaPrice;

    if (oldPrice) {
      const priceDiff = newCocoaPrice.price - oldPrice.price;
      const percentChange = (priceDiff / oldPrice.price) * 100;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (percentChange > 0.1) {
        trend = 'up';
      } else if (percentChange < -0.1) {
        trend = 'down';
      }

      priceWithTrend = {
        ...newCocoaPrice,
        trend,
        change: parseFloat(percentChange.toFixed(2)),
      };
    }

    // 4. Mettre à jour dans Sanity
    await PriceServiceServer.updatePrices([priceWithTrend]);

    return NextResponse.json({
      success: true,
      message: 'Updated cocoa closing price',
      prices: [priceWithTrend],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update cocoa price' },
      { status: 500 }
    );
  }
}
```


## Étape 5 : Cron Job Café (Cheerio)

### Fichier: `src/app/api/cron/update-coffee-prices/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PriceServiceServer } from '@/infrastructure/cms/PriceServiceServer';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

interface PriceData {
  product: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
}

/**
 * Scrape ONCC Cameroon avec Cheerio
 */
async function fetchCoffeePricesFromONCC(): Promise<PriceData[]> {
  try {
    const response = await fetch('https://www.oncc.cm/prices', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`ONCC returned status ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const prices: PriceData[] = [];

    const extractPrice = (selector: string, productName: string): PriceData | null => {
      try {
        const element = $(selector);
        if (!element.length) return null;

        const priceText = element.text().trim();
        const priceMatch = priceText.match(/[\d\s,]+/);
        if (!priceMatch) return null;

        const price = parseInt(priceMatch[0].replace(/[\s,]/g, ''), 10);

        if (isNaN(price) || price <= 0) return null;

        return {
          product: productName,
          price,
          unit: 'FCFA/KG FOB ONCC',
          trend: 'stable',
          change: 0,
          source: 'ONCC',
        };
      } catch (err) {
        return null;
      }
    };

    // Extraire Arabica
    const arabicaPrice = extractPrice(
      'body > main > div > div:nth-child(5) > div > div > section:nth-child(2) > section > section:nth-child(2) > span:first-child',
      'Café Arabica'
    );

    // Extraire Robusta
    const robustaPrice = extractPrice(
      'body > main > div > div:nth-child(6) > div > div > section:nth-child(2) > section > section:nth-child(2) > span:first-child',
      'Café Robusta'
    );

    if (arabicaPrice) prices.push(arabicaPrice);
    if (robustaPrice) prices.push(robustaPrice);

    if (prices.length === 0) {
      throw new Error('No coffee prices found on ONCC website');
    }

    return prices;
  } catch (error) {
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier le secret du cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Récupérer les prix actuels depuis Sanity
    const currentPrices = await PriceServiceServer.getPrices();

    // 2. Fetch nouveaux prix depuis ONCC
    const newCoffeePrices = await fetchCoffeePricesFromONCC();

    // 3. Calculer les variations automatiquement
    const pricesWithTrends = newCoffeePrices.map((newPrice) => {
      const oldPrice = currentPrices.find((p) => p.product === newPrice.product);

      if (!oldPrice) return newPrice;

      const priceDiff = newPrice.price - oldPrice.price;
      const percentChange = (priceDiff / oldPrice.price) * 100;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (percentChange > 0.1) {
        trend = 'up';
      } else if (percentChange < -0.1) {
        trend = 'down';
      }

      return {
        ...newPrice,
        trend,
        change: parseFloat(percentChange.toFixed(2)),
      };
    });

    // 4. Mettre à jour dans Sanity
    await PriceServiceServer.updatePrices(pricesWithTrends);

    return NextResponse.json({
      success: true,
      message: `Updated ${pricesWithTrends.length} coffee prices`,
      prices: pricesWithTrends,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update coffee prices' },
      { status: 500 }
    );
  }
}
```

## Étape 6 : Configuration Vercel Cron

### Fichier: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/update-coffee-prices",
      "schedule": "0 13 * * 1-5"
    },
    {
      "path": "/api/cron/update-cocoa-price",
      "schedule": "30 17 * * 1-5"
    }
  ]
}
```

### Explication des horaires (Cron Syntax)

- `0 13 * * 1-5` : À 13h00 UTC (14h00 WAT) du lundi au vendredi
- `30 17 * * 1-5` : À 17h30 UTC (18h30 WAT) du lundi au vendredi

Format: `minute hour day month weekday`
- `0-59` : minutes
- `0-23` : heures (UTC)
- `1-31` : jour du mois
- `1-12` : mois
- `0-6` : jour de la semaine (0 = dimanche, 1 = lundi, ..., 5 = vendredi)


## Étape 7 : Variables d'Environnement

### Fichier: `.env.local` (développement)

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token

# Cron Job Security
CRON_SECRET=your_random_secret_here

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Configuration Vercel (production)

Dans Vercel Dashboard → Settings → Environment Variables :

1. `NEXT_PUBLIC_SANITY_PROJECT_ID` : ID du projet Sanity
2. `NEXT_PUBLIC_SANITY_DATASET` : Dataset Sanity (production)
3. `SANITY_API_TOKEN` : Token avec permissions d'écriture
4. `CRON_SECRET` : Secret aléatoire pour sécuriser les cron jobs
5. `NEXT_PUBLIC_BASE_URL` : URL de production (ex: https://ste-scpb.com)

## Étape 8 : Scripts de Test Locaux

### Script Test Cacao: `scripts/test-cocoa-cron.js`

```javascript
const { chromium } = require('playwright');

async function testCocoaScraping() {
  let browser;
  
  try {
    console.log('🚀 Démarrage du test de scraping ICE...\n');
    
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
    
    const page = await context.newPage();
    
    await page.goto(
      'https://www.ice.com/products/37089076/London-Cocoa-Futures/data?marketId=7758984',
      { waitUntil: 'networkidle', timeout: 30000 }
    );
    
    await page.waitForSelector('table tbody tr td', { timeout: 10000 });
    
    const priceElement = page.locator(
      'xpath=/html/body/div[1]/div/main/div/div/div/div/div/div[4]/div/div/div[1]/table/tbody[1]/tr[1]/td[2]'
    ).first();
    
    const priceText = await priceElement.textContent();
    const priceMatch = priceText.trim().match(/[\d,]+\.?\d*/);
    const price = parseFloat(priceMatch[0].replace(/,/g, ''));
    
    console.log('✅ SUCCÈS - Prix extrait avec succès!');
    console.log(`Prix: £${price}/T`);
    
    await browser.close();
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
}

testCocoaScraping();
```


### Script Test Café: `scripts/test-coffee-cron.js`

```javascript
const cheerio = require('cheerio');

async function testCoffeeScraping() {
  try {
    console.log('🚀 Démarrage du test de scraping ONCC...\n');
    
    const response = await fetch('https://www.oncc.cm/prices', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const extractPrice = (selector, productName) => {
      const element = $(selector);
      const priceText = element.text().trim();
      const priceMatch = priceText.match(/[\d\s,]+/);
      const price = parseInt(priceMatch[0].replace(/[\s,]/g, ''), 10);
      
      return { product: productName, price, unit: 'FCFA/KG FOB ONCC' };
    };
    
    const arabicaPrice = extractPrice(
      'body > main > div > div:nth-child(5) > div > div > section:nth-child(2) > section > section:nth-child(2) > span:first-child',
      'Café Arabica'
    );
    
    const robustaPrice = extractPrice(
      'body > main > div > div:nth-child(6) > div > div > section:nth-child(2) > section > section:nth-child(2) > span:first-child',
      'Café Robusta'
    );
    
    console.log('✅ SUCCÈS - Prix extraits avec succès!');
    console.log(`Arabica: ${arabicaPrice.price} FCFA/KG`);
    console.log(`Robusta: ${robustaPrice.price} FCFA/KG`);
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    process.exit(1);
  }
}

testCoffeeScraping();
```

### Exécution des tests

```bash
# Test cacao
node scripts/test-cocoa-cron.js

# Test café
node scripts/test-coffee-cron.js
```


## Étape 9 : Configuration ESLint

Pour éviter les erreurs ESLint sur les scripts de test, ajouter dans `eslint.config.mjs` :

```javascript
globalIgnores([
  '.next/**',
  'out/**',
  'build/**',
  'node_modules/**',
  'coverage/**',
  'scripts/**/*.js',  // Ignorer les scripts de test
]),
```

## Étape 10 : Calcul Automatique des Variations

### Logique de Calcul

```typescript
// 1. Récupérer le prix précédent depuis Sanity
const oldPrice = currentPrices.find((p) => p.product === 'Cacao');

if (oldPrice) {
  // 2. Calculer la différence
  const priceDiff = newPrice - oldPrice.price;
  
  // 3. Calculer le pourcentage de variation
  const percentChange = (priceDiff / oldPrice.price) * 100;
  
  // 4. Déterminer la tendance
  let trend: 'up' | 'down' | 'stable' = 'stable';
  
  if (percentChange > 0.1) {
    trend = 'up';      // Hausse > 0.1%
  } else if (percentChange < -0.1) {
    trend = 'down';    // Baisse < -0.1%
  }
  // Sinon reste 'stable' (entre -0.1% et +0.1%)
  
  // 5. Créer l'objet avec tendance
  priceWithTrend = {
    ...newPrice,
    trend,
    change: parseFloat(percentChange.toFixed(2)),
  };
}
```

### Exemples de Calcul

```
Ancien prix: 2300 £/T
Nouveau prix: 2356 £/T

Différence: 2356 - 2300 = 56
Pourcentage: (56 / 2300) * 100 = 2.43%
Tendance: 'up' (car 2.43% > 0.1%)
```

```
Ancien prix: 3800 FCFA/KG
Nouveau prix: 3779 FCFA/KG

Différence: 3779 - 3800 = -21
Pourcentage: (-21 / 3800) * 100 = -0.55%
Tendance: 'down' (car -0.55% < -0.1%)
```


## Étape 11 : Déploiement et Configuration

### 1. Pousser le code sur GitHub

```bash
git add .
git commit -m "feat: implement automated price scraping system"
git push origin main
```

### 2. Déployer sur Vercel

Le déploiement se fait automatiquement via GitHub integration.

### 3. Configurer les variables d'environnement dans Vercel

Dashboard → Settings → Environment Variables :
- Ajouter toutes les variables listées à l'Étape 7

### 4. Ajouter les prix initiaux dans Sanity Studio

1. Aller sur https://votre-projet.sanity.studio
2. Créer 3 documents de type "Prix des Matières Premières" :
   - Cacao : prix initial, unité `£ / T ICE London`, tendance `stable`
   - Café Arabica : prix initial, unité `FCFA/KG FOB ONCC`, tendance `stable`
   - Café Robusta : prix initial, unité `FCFA/KG FOB ONCC`, tendance `stable`

### 5. Vérifier les Cron Jobs dans Vercel

Dashboard → Cron Jobs :
- Vérifier que les 2 cron jobs sont listés
- Vérifier les horaires d'exécution
- Consulter les logs après la première exécution

### 6. Tester manuellement les endpoints

```bash
# Test cron cacao (avec le CRON_SECRET)
curl -X GET https://votre-site.com/api/cron/update-cocoa-price \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test cron café
curl -X GET https://votre-site.com/api/cron/update-coffee-prices \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```


## Étape 12 : Considérations Playwright sur Vercel

### Problème Potentiel

Playwright peut ne pas fonctionner directement sur Vercel serverless à cause de la taille des binaires Chromium.

### Solution : Utiliser @sparticuz/chromium

Si Playwright échoue en production, installer `@sparticuz/chromium` :

```bash
npm install @sparticuz/chromium
```

Modifier le code du cron cacao :

```typescript
import chromium from '@sparticuz/chromium';
import { chromium as playwrightChromium } from 'playwright-core';

async function fetchCocoaPriceFromICE(): Promise<PriceData> {
  let browser;
  try {
    browser = await playwrightChromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    
    // ... reste du code identique
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}
```

### Alternative : Utiliser Puppeteer

Si Playwright pose problème, Puppeteer est une alternative :

```bash
npm install puppeteer-core @sparticuz/chromium
```

```typescript
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```


## Étape 13 : Monitoring et Logs

### Consulter les logs Vercel

1. Dashboard Vercel → Deployments → Sélectionner le déploiement
2. Onglet "Functions" → Sélectionner le cron job
3. Voir les logs d'exécution

### Logs à surveiller

```
✅ Succès:
- "Successfully fetched cocoa closing price from ICE: £2356/T"
- "Successfully updated 2 coffee prices with trends"
- "Cacao: 2300 → 2356 (2.43%) - up"

❌ Erreurs possibles:
- "Price element found but no text content" → XPath incorrect
- "ONCC returned status 500" → Site ONCC down
- "Unauthorized" → CRON_SECRET incorrect
- "Failed to update cocoa price" → Erreur Sanity
```

### Alertes recommandées

Configurer des alertes Vercel pour :
- Échecs de cron jobs (status 500)
- Timeouts (> 60 secondes)
- Erreurs d'authentification

## Étape 14 : Maintenance

### Vérifications régulières

1. **Vérifier les XPath** : Les sites peuvent changer leur structure HTML
2. **Tester les scripts locaux** : Exécuter `test-cocoa-cron.js` et `test-coffee-cron.js`
3. **Consulter les logs Vercel** : Vérifier les exécutions quotidiennes
4. **Vérifier Sanity** : S'assurer que les prix sont bien mis à jour

### Que faire si un scraping échoue ?

1. Exécuter le script de test local pour identifier le problème
2. Inspecter le site source (ICE ou ONCC) pour voir les changements
3. Mettre à jour le XPath ou le sélecteur CSS si nécessaire
4. Redéployer sur Vercel

### Mise à jour des XPath

Si le site change sa structure :

```typescript
// Ancien XPath
const priceElement = page.locator('xpath=/html/body/div[1]/div/main/...');

// Nouveau XPath (à trouver avec DevTools)
const priceElement = page.locator('xpath=/html/body/div[2]/div/main/...');
```


## Résumé des Fichiers Créés/Modifiés

### Nouveaux fichiers

```
scpb/schemaTypes/commodityPrice.ts
src/infrastructure/cms/PriceServiceServer.ts
src/app/api/cron/update-cocoa-price/route.ts
src/app/api/cron/update-coffee-prices/route.ts
scripts/test-cocoa-cron.js
scripts/test-coffee-cron.js
vercel.json
```

### Fichiers modifiés

```
scpb/schemaTypes/index.ts (ajouter commodityPrice)
package.json (ajouter playwright et cheerio)
eslint.config.mjs (ignorer scripts/)
.env.local (ajouter CRON_SECRET)
```

## Points Clés à Retenir

1. **Playwright pour ICE** : Nécessaire car le site charge les données avec JavaScript
2. **Cheerio pour ONCC** : Suffisant car le HTML est statique
3. **Calcul automatique des variations** : Compare avec le prix précédent dans Sanity
4. **2 cron jobs séparés** : Horaires différents pour cacao (18h30) et café (14h00)
5. **Sécurité** : CRON_SECRET pour authentifier les requêtes
6. **Unités flexibles** : Le schéma Sanity accepte différentes unités
7. **Tests locaux** : Scripts pour valider le scraping avant déploiement

## Ressources Utiles

- [Playwright Documentation](https://playwright.dev/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Sanity Client](https://www.sanity.io/docs/js-client)
- [Cron Syntax](https://crontab.guru/)

## Support

Pour toute question ou problème :
1. Vérifier les logs Vercel
2. Tester les scripts locaux
3. Inspecter les sites sources (ICE et ONCC)
4. Vérifier les variables d'environnement

---

**Date de création** : Mars 2026  
**Version** : 1.0  
**Auteur** : Système d'automatisation SCPB
