'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Input component with validation states for forms
 * Supports label, placeholder, error message, helper text
 * Includes focus styles and accessibility attributes
 * 
 * Requirements: 11.1, 11.2, 11.10
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = !!error;

    const inputClasses = [
      'w-full px-4 py-3 min-h-[44px]', // Minimum 44px touch target
      'rounded-lg border-2',
      'text-base text-gray-900',
      'placeholder:text-gray-400',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    ];

    const stateClasses = hasError
      ? [
          'border-red-500',
          'focus:border-red-500 focus:ring-red-500',
        ]
      : [
          'border-gray-300',
          'focus:border-primary focus:ring-primary',
          'hover:border-gray-400',
        ];

    const wrapperClasses = icon
      ? 'relative'
      : '';

    const iconClasses = cn(
      'absolute top-1/2 -translate-y-1/2 flex items-center justify-center',
      'text-gray-400 pointer-events-none',
      iconPosition === 'left' ? 'left-3' : 'right-3'
    );

    const inputWithIconClasses = icon
      ? iconPosition === 'left'
        ? 'pl-10'
        : 'pr-10'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        <div className={wrapperClasses}>
          {icon && (
            <span className={iconClasses} aria-hidden="true">
              {icon}
            </span>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              ...inputClasses,
              ...stateClasses,
              inputWithIconClasses,
              className
            )}
            aria-invalid={hasError}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            {...props}
          />
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
