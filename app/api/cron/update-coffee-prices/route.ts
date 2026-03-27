import { NextRequest, NextResponse } from 'next/server';
import { PriceServiceServer } from '@/lib/sanity/priceService';
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
    console.error('Error updating coffee prices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coffee prices' },
      { status: 500 }
    );
  }
}
