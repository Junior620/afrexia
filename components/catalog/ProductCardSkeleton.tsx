import React from 'react';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  variant?: 'traceability-first' | 'luxury-editorial';
}

/**
 * ProductCardSkeleton Component
 * Loading skeleton for product cards
 * Requirements: Task 24.2 - Loading states
 */
export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  variant = 'traceability-first',
}) => {
  const isLuxury = variant === 'luxury-editorial';

  return (
    <div
      className={cn(
        'bg-white overflow-hidden animate-pulse',
        'min-h-[480px] flex flex-col',
        {
          'rounded-[24px] md:rounded-[28px] shadow-md': isLuxury,
          'rounded-2xl shadow-sm border border-black/8': !isLuxury,
        }
      )}
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gray-200" />

      {/* Content Skeleton */}
      <div className={cn('flex-1 flex flex-col', {
        'p-6': isLuxury,
        'p-5': !isLuxury,
      })}>
        {/* Title */}
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="space-y-2 col-span-2">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>

        {/* Document Indicators */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Actions Skeleton */}
      <div className={cn('border-t border-black/8', {
        'p-6 pt-4': isLuxury,
        'p-5 pt-4': !isLuxury,
      })}>
        <div className="flex flex-col gap-3">
          <div className="h-11 bg-gray-200 rounded-lg w-full" />
          <div className="h-5 bg-gray-200 rounded w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
  variant?: 'traceability-first' | 'luxury-editorial';
}

/**
 * ProductGridSkeleton Component
 * Loading skeleton for product grid
 * Requirements: Task 24.2 - Loading states
 */
export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  variant = 'traceability-first',
}) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6">
      <div
        className={cn(
          'grid w-full',
          'grid-cols-1 gap-4',
          'md:grid-cols-2 md:gap-6',
          'lg:grid-cols-3',
          'xl:grid-cols-4'
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} variant={variant} />
        ))}
      </div>
    </div>
  );
};
