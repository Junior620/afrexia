'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface MobileRFQButtonProps {
  cartCount: number;
  onClick: () => void;
  translations: {
    requestQuote: string;
    itemsInCart: string;
  };
}

/**
 * MobileRFQButton Component
 * Sticky bottom bar for mobile devices that shows RFQ cart count and opens drawer
 * 
 * Features:
 * - Displays only on mobile (< 768px)
 * - Sticky positioning at bottom of viewport
 * - Shows cart count badge when items are added
 * - Opens RFQ drawer on click
 * - Smooth slide-up animation
 * 
 * Requirements: 4.12, 13.5
 */
export const MobileRFQButton: React.FC<MobileRFQButtonProps> = ({
  cartCount,
  onClick,
  translations,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'md:hidden', // Only show on mobile
        'bg-white border-t-2 border-gray-200 shadow-2xl',
        'px-4 py-3',
        'transform transition-transform duration-300 ease-in-out',
        'safe-area-inset-bottom' // Handle iOS safe area
      )}
    >
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center justify-center gap-3',
          'bg-primary hover:bg-primary-dark',
          'text-white font-semibold',
          'px-6 py-4 rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'active:scale-95',
          'min-h-[44px]' // Ensure minimum touch target size
        )}
        aria-label={`${translations.requestQuote}${cartCount > 0 ? ` - ${cartCount} ${translations.itemsInCart}` : ''}`}
      >
        {/* Cart Icon */}
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          
          {/* Count Badge */}
          {cartCount > 0 && (
            <span
              className={cn(
                'absolute -top-2 -right-2',
                'flex items-center justify-center',
                'min-w-[20px] h-5 px-1.5',
                'bg-red-500 text-white',
                'text-xs font-bold',
                'rounded-full',
                'border-2 border-white',
                'animate-in zoom-in duration-200'
              )}
              aria-label={`${cartCount} items`}
            >
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>

        {/* Button Text */}
        <span className="text-base">
          {translations.requestQuote}
        </span>

        {/* Arrow Icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};
