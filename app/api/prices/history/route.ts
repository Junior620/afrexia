import { NextRequest, NextResponse } from 'next/server';
import { PriceServiceServer } from '@/lib/sanity/priceService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product');
    const limit = parseInt(searchParams.get('limit') ?? '30', 10);

    const history = product
      ? await PriceServiceServer.getPriceHistory(product, limit)
      : await PriceServiceServer.getAllPriceHistory(limit);

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json([], { status: 500 });
  }
}
