'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkipLinksProps {
  translations: {
    skipToContent: string;
    skipToFilters: string;
    skipToProducts: string;
  };
}

/**
 * SkipLinks Component
 * Provides keyboard navigation shortcuts to main page sections
 * 
 * Features:
 * - Hidden by default, visible on focus
 * - Allows keyboard users to skip repetitive navigation
 * - Positioned at the top of the page
 * - High contrast focus indicator
 * 
 * Requirements: 11.7
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({ translations }) => {
  const skipLinkClasses = cn(
    // Screen reader only by default
    'sr-only',
    // Visible on focus
    'focus:not-sr-only',
    'focus:absolute focus:top-4 focus:left-4 focus:z-[9999]',
    // Styling
    'px-4 py-2 rounded-lg',
    'bg-primary text-primary-foreground',
    'font-semibold text-sm',
    'shadow-lg',
    // Focus indicator (2px outline, gold color)
    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
    // Transition
    'transition-all duration-200'
  );

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className={skipLinkClasses}
      >
        {translations.skipToContent}
      </a>
      <a
        href="#catalog-filters"
        className={skipLinkClasses}
      >
        {translations.skipToFilters}
      </a>
      <a
        href="#product-grid"
        className={skipLinkClasses}
      >
        {translations.skipToProducts}
      </a>
    </div>
  );
};

SkipLinks.displayName = 'SkipLinks';
