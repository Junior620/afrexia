'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

interface PriceData {
  name: string;
  price: string;
  unit: string;
  change: number;
  trend: 'up' | 'down';
}

interface PriceTickerBarProps {
  locale: Locale;
  initialPrices?: Array<{
    product: string;
    price: number;
    unit: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export function PriceTickerBar({ locale, initialPrices = [] }: PriceTickerBarProps) {
  const fallbackPrices: PriceData[] = [
    {
      name: getTranslation(locale, 'prices.cocoa'),
      price: '2,392',
      unit: '£/T ICE London',
      change: 0,
      trend: 'up',
    },
    {
      name: getTranslation(locale, 'prices.arabicaCoffee'),
      price: '1,280',
      unit: 'FCFA/KG FOB ONCC',
      change: 0,
      trend: 'up',
    },
    {
      name: getTranslation(locale, 'prices.robustaCoffee'),
      price: '950',
      unit: 'FCFA/KG FOB ONCC',
      change: 0,
      trend: 'up',
    },
  ];

  // Map server prices if available, otherwise use fallback
  const serverMapped: PriceData[] = initialPrices.map((item) => ({
    name: item.product,
    price: item.price.toLocaleString('fr-FR'),
    unit: item.unit,
    change: Math.abs(item.change ?? 0),
    trend: item.trend === 'down' ? 'down' : 'up',
  }));

  const [prices, setPrices] = useState<PriceData[]>(
    serverMapped.length > 0 ? serverMapped : fallbackPrices
  );

  useEffect(() => {
    // Only re-fetch if we didn't get server prices
    if (initialPrices.length > 0) return;

    fetch('/api/prices')
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) return;
        const mapped: PriceData[] = data.map((item: {
          product: string;
          price: number;
          unit: string;
          change: number;
          trend: 'up' | 'down' | 'stable';
        }) => ({
          name: item.product,
          price: item.price.toLocaleString('fr-FR'),
          unit: item.unit,
          change: Math.abs(item.change ?? 0),
          trend: item.trend === 'down' ? 'down' : 'up',
        }));
        setPrices(mapped);
      })
      .catch(() => {});
  }, [initialPrices.length]);

  return (
    <div className="relative w-full overflow-hidden bg-black border-b border-[#4A9A62]/30 py-2 shadow-lg">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4A9A62]/5 to-transparent animate-shimmer" />

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Scrolling ticker */}
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, setIndex) => (
          <div key={setIndex} className="flex">
            {prices.map((item, index) => (
              <TickerItem key={`${setIndex}-${index}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TickerItem({ item }: { item: PriceData }) {
  return (
    <div className="inline-flex items-center gap-3 mx-6 px-4 py-1.5 rounded-lg border border-[#4A9A62]/30 hover:border-[#4A9A62]/60 transition-colors duration-300 group">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4A9A62] animate-pulse" />
        <span className="text-[#E8F5E9] font-bold text-xs tracking-wide uppercase">{item.name}</span>
      </div>

      <div className="h-4 w-px bg-[#4A9A62]/30" />

      <div className="flex items-baseline gap-1">
        <span className="text-white font-extrabold text-sm">{item.price}</span>
        <span className="text-[#B0D4B8] text-[10px] uppercase tracking-wider">{item.unit}</span>
      </div>

      <div
        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
          item.trend === 'up'
            ? 'bg-[#4A9A62]/20 text-[#4A9A62]'
            : 'bg-red-500/20 text-red-400'
        }`}
      >
        <span>{item.trend === 'up' ? '▲' : '▼'}</span>
        <span>{item.change}%</span>
      </div>
    </div>
  );
}
