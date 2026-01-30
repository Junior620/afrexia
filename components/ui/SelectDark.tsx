'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectDarkOption {
  value: string;
  label: string;
}

export interface SelectDarkProps {
  label?: string;
  placeholder?: string;
  options: SelectDarkOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * SelectDark component for dark premium catalog
 * Style dark avec glass effect
 * Support single et multi-select
 * Recherche intégrée pour longues listes
 * Navigation clavier
 * 
 * Requirements: 3.3, 3.4
 */
export const SelectDark: React.FC<SelectDarkProps> = ({
  label,
  placeholder = 'Select...',
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  error,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectId = `select-dark-${React.useId()}`;
  const errorId = `${selectId}-error`;

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected values as array
  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
    ? [value]
    : [];

  // Get display text
  const displayText = selectedValues.length > 0
    ? multiple
      ? `${selectedValues.length} selected`
      : options.find((opt) => opt.value === selectedValues[0])?.label || placeholder
    : placeholder;

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          e.preventDefault();
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0) {
      const optionElement = document.getElementById(
        `${selectId}-option-${focusedIndex}`
      );
      optionElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, selectId]);

  const hasError = !!error;

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[#B0D4B8] mb-2 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <button
        id={selectId}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={hasError}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'w-full px-4 py-3 min-h-[44px]',
          'flex items-center justify-between gap-2',
          'rounded-xl border text-left',
          'text-base transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1410]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Glass effect
          'bg-[rgba(26,40,32,0.6)]',
          'backdrop-blur-[12px]',
          hasError
            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
            : 'border-[rgba(255,255,255,0.1)] focus:border-[rgba(255,255,255,0.2)] focus:ring-[#A89858] hover:border-[rgba(255,255,255,0.2)]',
          selectedValues.length > 0 ? 'text-[#E8F5E9]' : 'text-[#80996F]'
        )}
      >
        <span className="truncate">{displayText}</span>
        <svg
          className={cn(
            'w-5 h-5 text-[#80996F] transition-transform flex-shrink-0',
            isOpen && 'transform rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2',
            'bg-[#1A2820] rounded-xl border border-[rgba(255,255,255,0.1)]',
            'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
            'backdrop-blur-[12px]',
            'max-h-60 overflow-hidden'
          )}
          role="listbox"
          aria-multiselectable={multiple}
        >
          {searchable && (
            <div className="p-2 border-b border-[rgba(255,255,255,0.1)]">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(-1);
                }}
                placeholder="Search..."
                className={cn(
                  'w-full px-3 py-2 text-sm',
                  'bg-[rgba(26,40,32,0.6)] text-[#E8F5E9]',
                  'border border-[rgba(255,255,255,0.1)] rounded-lg',
                  'placeholder:text-[#80996F]',
                  'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:border-[rgba(255,255,255,0.2)]'
                )}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#80996F] text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isFocused = index === focusedIndex;

                return (
                  <button
                    key={option.value}
                    id={`${selectId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full px-4 py-3 text-left text-sm',
                      'flex items-center justify-between gap-2',
                      'transition-colors duration-150',
                      'focus:outline-none',
                      isFocused && 'bg-[rgba(255,255,255,0.05)]',
                      isSelected
                        ? 'bg-[rgba(74,154,98,0.2)] text-[#4A9A62] font-semibold'
                        : 'text-[#E8F5E9] hover:bg-[rgba(255,255,255,0.05)]'
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-[#4A9A62] flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

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
    </div>
  );
};

SelectDark.displayName = 'SelectDark';
