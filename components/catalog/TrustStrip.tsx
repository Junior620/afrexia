'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TrustItem {
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
}

export interface TrustStripProps {
  items: TrustItem[];
  variant?: 'compact' | 'detailed';
  className?: string;
}

/**
 * TrustStrip component displays B2B credibility indicators
 * in a horizontal strip with icons and labels.
 * 
 * Visual Specifications:
 * - Display: Flex row, gap 24px (desktop), 16px (mobile)
 * - Each item: Icon (20x20px) + Label (14px)
 * - Color: Charcoal or dark green
 * - Hover: Tooltip with additional details
 * 
 * Default Items:
 * - 24h response time (clock icon)
 * - NDA available (document icon)
 * - EUDR compliant (leaf icon)
 * - QA documented (checkmark icon)
 * - COA & spec sheets (folder icon)
 * 
 * Requirements: 6.1-6.5
 */
export const TrustStrip: React.FC<TrustStripProps> = ({
  items,
  variant = 'compact',
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const containerClasses = cn(
    'flex flex-wrap items-center',
    'gap-4 md:gap-6',
    className
  );

  const itemClasses = cn(
    'flex items-center gap-2',
    'text-sm',
    'text-charcoal dark:text-primary',
    'transition-colors duration-200',
    variant === 'detailed' && 'hover:text-primary dark:hover:text-primary-light'
  );

  const iconClasses = 'w-5 h-5 flex-shrink-0';

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
            <span className="font-medium">{item.label}</span>
          </div>

          {/* Tooltip on hover */}
          {item.tooltip && hoveredIndex === index && (
            <div
              className={cn(
                'absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2',
                'px-3 py-2 min-w-[200px]',
                'bg-charcoal dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg',
                'pointer-events-none',
                'animate-in fade-in slide-in-from-bottom-1 duration-200'
              )}
              role="tooltip"
            >
              {item.tooltip}
              {/* Arrow */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 -mt-1"
                aria-hidden="true"
              >
                <div className="border-4 border-transparent border-t-charcoal dark:border-t-gray-800" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

TrustStrip.displayName = 'TrustStrip';

/**
 * Default trust icons for common use cases
 */
export const TrustIcons = {
  Clock: () => (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Document: () => (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Leaf: () => (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  Checkmark: () => (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Folder: () => (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  ),
};

/**
 * Pre-configured default trust items for B2B catalog
 */
export const getDefaultTrustItems = (translations: {
  response24h: string;
  ndaAvailable: string;
  eudrCompliant: string;
  qaDocumented: string;
  coaAvailable: string;
}): TrustItem[] => [
  {
    icon: <TrustIcons.Clock />,
    label: translations.response24h,
    tooltip: translations.response24h,
  },
  {
    icon: <TrustIcons.Document />,
    label: translations.ndaAvailable,
    tooltip: translations.ndaAvailable,
  },
  {
    icon: <TrustIcons.Leaf />,
    label: translations.eudrCompliant,
    tooltip: translations.eudrCompliant,
  },
  {
    icon: <TrustIcons.Checkmark />,
    label: translations.qaDocumented,
    tooltip: translations.qaDocumented,
  },
  {
    icon: <TrustIcons.Folder />,
    label: translations.coaAvailable,
    tooltip: translations.coaAvailable,
  },
];
