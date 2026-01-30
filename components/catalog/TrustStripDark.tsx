'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TrustItem {
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
}

export interface TrustStripDarkProps {
  items: TrustItem[];
  variant?: 'compact' | 'detailed';
  className?: string;
}

/**
 * TrustStripDark component displays B2B credibility indicators
 * in a horizontal strip with icons and labels - Dark Premium Theme.
 * 
 * Visual Specifications:
 * - Layout: Flex row horizontal, gap responsive (32px desktop, 16px mobile)
 * - Each item: Icon (24px) + Label (14px)
 * - Icon color: #4A9A62 (dark green)
 * - Label color: #B0D4B8 (muted light green)
 * - Hover: Tooltip with backdrop blur
 * 
 * Default Items:
 * - 24h response time (Clock icon)
 * - NDA available (Shield icon)
 * - EUDR compliant (Leaf icon)
 * - QA documented (CheckCircle icon)
 * - COA & spec sheets (FileText icon)
 * 
 * Requirements: 2.5, 6.7
 */
export const TrustStripDark: React.FC<TrustStripDarkProps> = ({
  items,
  variant = 'compact',
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const containerClasses = cn(
    'flex flex-wrap items-center justify-center',
    'gap-4 md:gap-8',
    className
  );

  const itemClasses = cn(
    'flex items-center gap-2',
    'text-sm',
    'transition-all duration-200',
    'cursor-default'
  );

  const iconClasses = 'w-6 h-6 flex-shrink-0 text-[#4A9A62]';
  const labelClasses = 'font-medium text-[#B0D4B8]';

  return (
    <div className={containerClasses} role="list" aria-label="Trust indicators">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          role="listitem"
        >
          <div className={itemClasses}>
            <span className={iconClasses} aria-hidden="true">
              {item.icon}
            </span>
            <span className={labelClasses}>{item.label}</span>
          </div>

          {/* Tooltip on hover with backdrop blur */}
          {item.tooltip && hoveredIndex === index && (
            <div
              className={cn(
                'absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2',
                'px-4 py-2 min-w-[200px]',
                'bg-[rgba(26,40,32,0.9)] backdrop-blur-[12px]',
                'border border-[rgba(255,255,255,0.1)]',
                'text-[#E8F5E9] text-xs rounded-lg',
                'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
                'pointer-events-none',
                'animate-in fade-in slide-in-from-bottom-1 duration-200'
              )}
              role="tooltip"
            >
              {item.tooltip}
              {/* Arrow */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]"
                aria-hidden="true"
              >
                <div className="border-[6px] border-transparent border-t-[rgba(26,40,32,0.9)]" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

TrustStripDark.displayName = 'TrustStripDark';

// Note: Import TrustIconsDark separately to use getDefaultTrustItemsDark
// Example: import { TrustIconsDark } from '@/components/catalog';
// const items = getDefaultTrustItemsDark(translations, TrustIconsDark);
