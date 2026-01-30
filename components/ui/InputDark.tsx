'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputDarkProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * InputDark component for dark premium catalog
 * Style dark avec glass effect
 * States: default, focus, error, disabled
 * Support label, placeholder, helper text, error message
 * Accessibility: aria-labels, aria-describedby
 * 
 * Requirements: 3.4, 5.2
 */
export const InputDark = React.forwardRef<HTMLInputElement, InputDarkProps>(
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
    const inputId = id || `input-dark-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = !!error;

    const inputClasses = [
      'w-full px-4 py-3 min-h-[44px]',
      'rounded-xl border',
      'text-base text-[#E8F5E9]',
      'placeholder:text-[#80996F]',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1410]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Glass effect
      'bg-[rgba(26,40,32,0.6)]',
      'backdrop-blur-[12px]',
    ];

    const stateClasses = hasError
      ? [
          'border-[#DC2626]',
          'focus:border-[#DC2626] focus:ring-[#DC2626]',
        ]
      : [
          'border-[rgba(255,255,255,0.1)]',
          'focus:border-[rgba(255,255,255,0.2)] focus:ring-[#A89858]',
          'hover:border-[rgba(255,255,255,0.2)]',
        ];

    const wrapperClasses = icon
      ? 'relative'
      : '';

    const iconClasses = cn(
      'absolute top-1/2 -translate-y-1/2 flex items-center justify-center',
      'text-[#80996F] pointer-events-none',
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
            className="block text-xs font-semibold text-[#B0D4B8] mb-2 uppercase tracking-wider"
          >
            {label}
            {props.required && (
              <span className="text-[#DC2626] ml-1" aria-label="required">
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
            className="mt-2 text-sm text-[#DC2626] flex items-center gap-1"
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
            className="mt-2 text-sm text-[#80996F]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputDark.displayName = 'InputDark';
