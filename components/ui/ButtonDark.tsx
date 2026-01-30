'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonDarkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

/**
 * ButtonDark component for dark premium catalog
 * Variants: primary (green), secondary (outline), ghost
 * States: default, hover, focus, disabled, loading
 * Sizes: sm, md, lg
 * Icon support: left/right positioning
 * 
 * Requirements: 2.3, 2.4, 5.3
 */
export const ButtonDark = React.forwardRef<HTMLButtonElement, ButtonDarkProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'rounded-lg font-semibold',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1410]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const sizeClasses = {
      sm: 'px-4 py-2 min-h-[36px] text-sm',
      md: 'px-6 py-3 min-h-[44px] text-base',
      lg: 'px-8 py-4 min-h-[52px] text-lg',
    };

    const variantClasses = {
      primary: [
        'bg-[#4A9A62] text-white',
        'hover:bg-[#5AAA72]',
        'focus:ring-[#A89858]',
        'active:bg-[#3A8A52]',
      ],
      secondary: [
        'bg-transparent text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)]',
        'hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.3)]',
        'focus:ring-[#A89858]',
        'active:bg-[rgba(255,255,255,0.1)]',
      ],
      ghost: [
        'bg-transparent text-[#B0D4B8] border border-[rgba(255,255,255,0.1)]',
        'hover:bg-[rgba(255,255,255,0.05)]',
        'focus:ring-[#A89858]',
        'active:bg-[rgba(255,255,255,0.1)]',
      ],
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          ...baseClasses,
          sizeClasses[size],
          ...variantClasses[variant],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

ButtonDark.displayName = 'ButtonDark';
