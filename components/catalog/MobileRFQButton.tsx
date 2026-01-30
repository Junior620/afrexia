'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonDark } from '@/components/ui/ButtonDark';
import { trackQuoteClick } from '@/lib/analytics/events';
import { Product } from '@/types/product';

export interface MobileRFQButtonProps {
  product?: Product;
  locale: 'fr' | 'en';
  translations: {
    requestQuote: string;
  };
  onClick: () => void;
  className?: string;
}

/**
 * MobileRFQButtonDark Component
 * Sticky bottom CTA button for mobile devices
 * 
 * Visual Specifications:
 * - Position: fixed bottom, z-50
 * - Background: green avec glass effect
 * - Full width, 48px height
 * - Shadow top
 * - Safe area insets
 * 
 * Requirements: 5.8, 9.6
 */
export const MobileRFQButton: React.FC<MobileRFQButtonProps> = ({
  product,
  locale,
  translations,
  onClick,
  className,
}) => {
  const handleClick = () => {
    // Track analytics - Requirements: 8.2
    if (product) {
      trackQuoteClick({
        productId: product.id,
        productName: product.name,
        category: product.category,
        origin: product.origins?.[0] || 'Unknown',
        availability: product.availability,
        source: 'mobile_cta',
      });
    }

    onClick();
  };

  const containerClasses = cn(
    // Position and layout
    'fixed bottom-0 left-0 right-0',
    'z-50',
    'w-full',
    // Background with glass effect
    'bg-[rgba(74,154,98,0.95)]',
    'backdrop-blur-[12px]',
    // Shadow
    'shadow-[0_-4px_16px_rgba(0,0,0,0.3)]',
    // Padding with safe area insets
    'px-4 py-3',
    'pb-[calc(0.75rem+env(safe-area-inset-bottom))]',
    // Border
    'border-t border-[rgba(255,255,255,0.1)]',
    // Animation
    'transition-transform duration-300 ease-out',
    // Only show on mobile
    'md:hidden',
    className
  );

  return (
    <div className={containerClasses}>
      <ButtonDark
        variant="primary"
        size="lg"
        onClick={handleClick}
        className={cn(
          'w-full',
          'h-12', // 48px height
          'bg-[#4A9A62]',
          'hover:bg-[#5AAA72]',
          'active:bg-[#3A8A52]',
          'shadow-lg',
          'font-bold',
          'text-white'
        )}
        aria-label={translations.requestQuote}
      >
        {translations.requestQuote}
      </ButtonDark>
    </div>
  );
};

MobileRFQButton.displayName = 'MobileRFQButton';
