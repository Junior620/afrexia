'use client';

import { cn } from '@/lib/utils';

interface KeyFact {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface KeyFactsGridProps {
  facts: KeyFact[];
  className?: string;
}

/**
 * KeyFactsGrid - Premium B2B key facts display
 * 2x3 grid showing critical product information
 */
export function KeyFactsGrid({ facts, className }: KeyFactsGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {facts.map((fact, index) => (
        <div
          key={index}
          className="bg-[rgba(26,40,32,0.4)] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 hover:border-[rgba(168,152,88,0.3)] transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            {fact.icon && (
              <div className="text-[#A89858] w-4 h-4">
                {fact.icon}
              </div>
            )}
            <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold">
              {fact.label}
            </p>
          </div>
          <p className="text-sm font-semibold text-[#E8F5E9] leading-snug">
            {fact.value}
          </p>
        </div>
      ))}
    </div>
  );
}
