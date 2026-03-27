import { NextRequest, NextResponse } from 'next/server';
import { PriceServiceServer } from '@/lib/sanity/priceService';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface PriceData {
  product: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
}

/**
 * Fetch cocoa price from Yahoo Finance API (no browser needed)
 * Symbol: CC=F = Cocoa Futures (ICE)
 */
async function fetchCocoaPriceFromYahoo(): Promise<PriceData> {
  const symbol = 'CC%3DF'; // CC=F encoded
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance returned status ${response.status}`);
  }

  const data = await response.json();
  const result = data?.chart?.result?.[0];
  const meta = result?.meta;

  if (!meta?.regularMarketPrice) {
    throw new Error('No price data found in Yahoo Finance response');
  }

  const price = parseFloat(meta.regularMarketPrice.toFixed(2));

  if (isNaN(price) || price <= 0) {
    throw new Error(`Invalid cocoa price from Yahoo: ${price}`);
  }

  return {
    product: 'Cacao',
    price,
    unit: '$/T ICE',
    trend: 'stable',
    change: 0,
    source: 'Yahoo Finance (ICE)',
  };
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

    // 2. Fetch nouveau prix depuis Yahoo Finance (ICE Cocoa Futures)
    const newCocoaPrice = await fetchCocoaPriceFromYahoo();

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
