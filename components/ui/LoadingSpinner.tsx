import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

/**
 * LoadingSpinner Component
 * Animated loading spinner for form submissions and async operations
 * Requirements: Task 24.2 - Loading states
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-current border-t-transparent',
          sizeClasses[size]
        )}
        role="status"
        aria-label={label || 'Loading'}
      >
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
      {label && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </div>
  );
};

interface ButtonLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

/**
 * ButtonLoading Component
 * Wrapper for buttons with loading state
 * Requirements: Task 24.2 - Loading states
 */
export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  loadingText,
  children,
}) => {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2">
        <LoadingSpinner size="sm" />
        {loadingText || children}
      </span>
    );
  }

  return <>{children}</>;
};
