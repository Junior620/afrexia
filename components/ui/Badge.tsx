'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'availability' | 'certification' | 'eudr' | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Badge component for product badges
 * Supports variants: availability, certification, EUDR
 * Pill shape with appropriate sizing (12-13px font)
 * 
 * Requirements: 3.3, 3.4, 3.5
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className,
  icon,
}) => {
  const baseClasses = [
    'inline-flex items-center gap-1.5',
    'px-3 py-1.5',
    'rounded-full',
    'text-xs font-semibold',
    'whitespace-nowrap',
    'backdrop-blur-sm',
  ];

  const variantClasses: Record<BadgeVariant, string[]> = {
    availability: [
      'bg-success/90 text-white',
      'border border-success',
    ],
    certification: [
      'bg-primary/90 text-white',
      'border border-primary',
    ],
    eudr: [
      'bg-success/90 text-white',
      'border border-success',
    ],
    default: [
      'bg-gray-100 text-gray-700',
      'border border-gray-200',
    ],
  };

  return (
    <span
      className={cn(
        ...baseClasses,
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

Badge.displayName = 'Badge';

/**
 * Availability badge with predefined styles
 */
export const AvailabilityBadge: React.FC<{
  status: 'in-stock' | 'limited' | 'pre-order';
  label: string;
}> = ({ status, label }) => {
  const statusConfig = {
    'in-stock': {
      variant: 'availability' as BadgeVariant,
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
    limited: {
      variant: 'availability' as BadgeVariant,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    'pre-order': {
      variant: 'default' as BadgeVariant,
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
  };

  const config = statusConfig[status] || statusConfig['in-stock']; // Fallback to 'in-stock' if status is invalid

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {label}
    </Badge>
  );
};

/**
 * EUDR Ready badge with leaf icon
 */
export const EUDRBadge: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Badge
      variant="eudr"
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
    </Badge>
  );
};

/**
 * Certification badge
 */
export const CertificationBadge: React.FC<{
  label: string;
  icon?: React.ReactNode;
}> = ({ label, icon }) => {
  return (
    <Badge variant="certification" icon={icon}>
      {label}
    </Badge>
  );
};
