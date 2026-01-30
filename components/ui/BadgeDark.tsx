'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeDarkVariant = 'availability' | 'eudr' | 'certification';
export type BadgeDarkSize = 'sm' | 'md';

export interface BadgeDarkProps {
  variant: BadgeDarkVariant;
  size?: BadgeDarkSize;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * BadgeDark component for dark premium catalog
 * Variants: availability, eudr, certification
 * Style pill avec backdrop blur
 * Sizes: sm (12px), md (14px)
 * 
 * Requirements: 4.2
 */
export const BadgeDark: React.FC<BadgeDarkProps> = ({
  variant,
  size = 'md',
  children,
  className,
  icon,
}) => {
  const baseClasses = [
    'inline-flex items-center gap-1.5',
    'px-3 py-1.5',
    'rounded-full',
    'font-semibold',
    'whitespace-nowrap',
    'backdrop-blur-[12px]',
  ];

  const sizeClasses = {
    sm: 'text-xs', // 12px
    md: 'text-sm', // 14px
  };

  const variantClasses: Record<BadgeDarkVariant, string[]> = {
    availability: [
      'bg-[rgba(74,154,98,0.9)]',
      'text-white',
      'border border-[#4A9A62]',
    ],
    eudr: [
      'bg-[rgba(74,154,98,0.9)]',
      'text-white',
      'border border-[#4A9A62]',
    ],
    certification: [
      'bg-[rgba(168,152,88,0.9)]',
      'text-white',
      'border border-[#A89858]',
    ],
  };

  return (
    <span
      className={cn(
        ...baseClasses,
        sizeClasses[size],
        ...variantClasses[variant],
        className
      )}
    >
      {icon && (
        <span className="flex-shrink-0 w-3.5 h-3.5" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

BadgeDark.displayName = 'BadgeDark';

/**
 * Availability badge with predefined styles for dark theme
 */
export const AvailabilityBadgeDark: React.FC<{
  status: 'available' | 'on-request' | 'out-of-stock';
  label: string;
  size?: BadgeDarkSize;
}> = ({ status, label, size = 'md' }) => {
  const statusConfig = {
    'available': {
      variant: 'availability' as BadgeDarkVariant,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    'on-request': {
      variant: 'availability' as BadgeDarkVariant,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    'out-of-stock': {
      variant: 'availability' as BadgeDarkVariant,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];

  return (
    <BadgeDark variant={config.variant} icon={config.icon} size={size}>
      {label}
    </BadgeDark>
  );
};

/**
 * EUDR Ready badge with leaf icon for dark theme
 */
export const EUDRBadgeDark: React.FC<{ 
  label: string;
  size?: BadgeDarkSize;
}> = ({ label, size = 'md' }) => {
  return (
    <BadgeDark
      variant="eudr"
      size={size}
      icon={
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      }
    >
      {label}
    </BadgeDark>
  );
};

/**
 * Certification badge for dark theme
 */
export const CertificationBadgeDark: React.FC<{
  label: string;
  icon?: React.ReactNode;
  size?: BadgeDarkSize;
}> = ({ label, icon, size = 'md' }) => {
  const defaultIcon = (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <BadgeDark variant="certification" icon={icon || defaultIcon} size={size}>
      {label}
    </BadgeDark>
  );
};
