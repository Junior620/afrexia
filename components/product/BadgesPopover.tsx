'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Badge {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

interface BadgesPopoverProps {
  badges: Badge[];
  visibleCount?: number;
  locale: 'fr' | 'en';
}

/**
 * BadgesPopover - Shows visible badges + "+N" overflow with popover
 * Premium B2B design for certifications/compliance badges
 */
export function BadgesPopover({
  badges,
  visibleCount = 3,
  locale,
}: BadgesPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const visibleBadges = badges.slice(0, visibleCount);
  const hiddenBadges = badges.slice(visibleCount);
  const hasOverflow = hiddenBadges.length > 0;

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const getVariantStyles = (variant: Badge['variant'] = 'default') => {
    switch (variant) {
      case 'success':
        return 'bg-[rgba(74,154,98,0.15)] border-[rgba(74,154,98,0.3)] text-[#4A9A62]';
      case 'warning':
        return 'bg-[rgba(168,152,88,0.15)] border-[rgba(168,152,88,0.3)] text-[#A89858]';
      default:
        return 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.85)]';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Visible badges */}
      {visibleBadges.map((badge, index) => (
        <div
          key={index}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm',
            getVariantStyles(badge.variant)
          )}
        >
          {badge.icon && (
            <span className="w-3.5 h-3.5">
              {badge.icon}
            </span>
          )}
          <span>{badge.label}</span>
        </div>
      ))}

      {/* Overflow button */}
      {hasOverflow && (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border',
              'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.7)]',
              'hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
              isOpen && 'bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.12)]'
            )}
            title={locale === 'fr' ? 'Voir toutes les certifications' : 'View all certifications'}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span>+{hiddenBadges.length}</span>
            <svg 
              className={cn(
                'w-3 h-3 transition-transform duration-200',
                isOpen && 'rotate-180'
              )} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Popover */}
          {isOpen && (
            <div
              ref={popoverRef}
              className={cn(
                'absolute top-full left-0 mt-2 z-50',
                'min-w-[240px] max-w-[320px]',
                'bg-[rgba(26,40,32,0.98)] backdrop-blur-xl',
                'border border-[rgba(255,255,255,0.12)]',
                'rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                'p-4',
                'animate-in fade-in slide-in-from-top-2 duration-200'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-[#E8F5E9] uppercase tracking-wider">
                  {locale === 'fr' ? 'Toutes les certifications' : 'All Certifications'}
                </h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#80996F] hover:text-[#E8F5E9] transition-colors"
                  aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg',
                      'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]',
                      'hover:bg-[rgba(255,255,255,0.06)] transition-colors'
                    )}
                  >
                    {badge.icon && (
                      <span className={cn(
                        'w-4 h-4 flex-shrink-0',
                        badge.variant === 'success' ? 'text-[#4A9A62]' :
                        badge.variant === 'warning' ? 'text-[#A89858]' :
                        'text-[rgba(255,255,255,0.7)]'
                      )}>
                        {badge.icon}
                      </span>
                    )}
                    <span className="text-sm text-[#E8F5E9] font-medium">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
