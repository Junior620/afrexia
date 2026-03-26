'use client';

import { useEffect, useState } from 'react';
import { Locale } from '@/types';

interface PriceData {
  name: string;
  price: string;
  unit: string;
  change: number;
  trend: 'up' | 'down';
}

interface PriceMarqueeProps {
  locale: Locale;
}

export function PriceMarquee({ locale }: PriceMarqueeProps) {
  const [prices] = useState<PriceData[]>([
    {
      name: locale === 'fr' ? 'Cacao FOB' : 'Cocoa FOB',
      price: '3,850',
      unit: 'USD/MT',
      change: 2.4,
      trend: 'up',
    },
    {
      name: locale === 'fr' ? 'Café Arabica FOB' : 'Arabica Coffee FOB',
      price: '2,180',
      unit: 'USD/MT',
      change: -1.2,
      trend: 'down',
    },
    {
      name: locale === 'fr' ? 'Café Robusta FOB' : 'Robusta Coffee FOB',
      price: '1,850',
      unit: 'USD/MT',
      change: 0.8,
      trend: 'up',
    },
  ]);

  const title = locale === 'fr' ? 'Prix FOB en Temps Réel' : 'Real-Time FOB Prices';

  return (
    <div className="relative w-full overflow-hidden bg-[#0A1410] border-y border-[#4A9A62]/20 py-4">
      {/* Title */}
      <div className="text-center mb-3">
        <h3 className="text-[#E8F5E9] text-sm font-semibold tracking-wide uppercase">
          {title}
        </h3>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A1410] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A1410] to-transparent z-10 pointer-events-none" />

      {/* Scrolling content - duplicate multiple times for seamless loop */}
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Repeat 4 times to ensure seamless scrolling */}
        {[...Array(4)].map((_, setIndex) => (
          <div key={setIndex} className="flex">
            {prices.map((item, index) => (
              <PriceItem key={`set-${setIndex}-${index}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceItem({ item }: { item: PriceData }) {
  return (
    <div className="inline-flex items-center gap-3 mx-8 px-6 py-3 bg-[#141D18] rounded-lg border border-[#4A9A62]/30 hover:border-[#4A9A62]/50 transition-colors">
      {/* Product name */}
      <span className="text-[#E8F5E9] font-semibold text-sm">{item.name}</span>

      {/* Separator */}
      <div className="h-6 w-px bg-[#4A9A62]/30" />

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-white font-bold text-lg">{item.price}</span>
        <span className="text-[#B0D4B8] text-xs">{item.unit}</span>
      </div>

      {/* Change indicator */}
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
          item.trend === 'up'
            ? 'bg-[#4A9A62]/20 text-[#4A9A62]'
            : 'bg-red-500/20 text-red-400'
        }`}
      >
        <span className="text-xs font-semibold">
          {item.trend === 'up' ? '↑' : '↓'} {Math.abs(item.change)}%
        </span>
      </div>
    </div>
  );
}
