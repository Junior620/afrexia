import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const prices = await client.fetch(
      `*[_type == "commodityPrice"] | order(product asc) {
        product,
        price,
        unit,
        trend,
        change,
        lastUpdated
      }`
    );

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json([], { status: 500 });
  }
}
