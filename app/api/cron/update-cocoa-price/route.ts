import { NextRequest, NextResponse } from 'next/server';
import { PriceServiceServer } from '@/lib/sanity/priceService';
import chromium from '@sparticuz/chromium-min';
import { chromium as playwrightChromium } from 'playwright-core';

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
 * Scrape ICE London Cocoa Futures avec chromium-min (compatible Vercel serverless)
 */
async function fetchCocoaPriceFromICE(): Promise<PriceData> {
  let browser;
  try {
    browser = await playwrightChromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
      ),
      headless: true,
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    const page = await context.newPage();

    await page.goto(
      'https://www.ice.com/products/37089076/London-Cocoa-Futures/data?marketId=7758984',
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );

    await page.waitForTimeout(5000);
    await page.waitForSelector('table tbody tr td', { timeout: 20000 });

    const priceElement = page.locator(
      'xpath=/html/body/div[1]/div/main/div/div/div/div/div/div[4]/div/div/div[1]/table/tbody[1]/tr[1]/td[2]'
    ).first();

    const priceText = await priceElement.textContent();

    if (!priceText) {
      throw new Error('Price element found but no text content');
    }

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
      unit: '£/T ICE London',
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

    // 2. Fetch nouveau prix depuis ICE London
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
    console.error('Error updating cocoa price:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cocoa price' },
      { status: 500 }
    );
  }
}
