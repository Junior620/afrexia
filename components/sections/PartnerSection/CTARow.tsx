/**
 * CTARow Component
 * 
 * Displays primary and secondary call-to-action buttons for the partner section.
 * Handles both external links (opens in new tab) and internal navigation.
 * 
 * Requirements:
 * - 5.1: Display two CTAs in horizontal row on desktop
 * - 5.2: Primary CTA with gold accent styling
 * - 5.3: Secondary CTA with outline styling
 * - 5.4: External link handling with security attributes
 * - 5.5: Internal navigation for secondary CTA
 * - 5.6: Visible hover states with smooth transitions
 * - 5.7: Visible focus states for keyboard accessibility
 * - 6.3: Use existing site gold accent color
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { CTAConfig } from '@/types/partner-section';

interface CTARowProps {
  primaryCTA: CTAConfig;
  secondaryCTA: CTAConfig;
  className?: string;
}

/**
 * CTARow component
 * 
 * Renders two CTA buttons with appropriate styling and link handling.
 * Primary CTA uses solid gold accent background, secondary uses outline style.
 * External links open in new tabs with security attributes.
 * 
 * @param primaryCTA - Configuration for primary call-to-action
 * @param secondaryCTA - Configuration for secondary call-to-action
 * @param className - Additional Tailwind CSS classes
 */
export function CTARow({ primaryCTA, secondaryCTA, className = '' }: CTARowProps) {
  /**
   * Validate URL format
   * Requirement 13.3: Validate partner URL format before rendering
   */
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid URL format:', url);
      }
      return false;
    }
  };

  // Validate URLs for external CTAs
  const primaryUrlValid = !primaryCTA.external || isValidUrl(primaryCTA.href);
  const secondaryUrlValid = !secondaryCTA.external || isValidUrl(secondaryCTA.href);

  // Base button styles shared by both CTAs
  // Requirement 3.3: Full-width on mobile
  const baseButtonStyles = `
    inline-flex
    items-center
    justify-center
    rounded-full
    px-6
    py-3
    font-semibold
    text-base
    min-h-[44px]
    w-full
    sm:w-auto
    transition-all
    duration-300
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-accent
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[#1a1a1a]
  `.trim();

  // Disabled button styles
  const disabledStyles = `
    opacity-50
    cursor-not-allowed
    pointer-events-none
  `.trim();

  // Primary button: solid gold accent background
  // Requirement 5.2: bg-accent hover:bg-accent-dark, shadow-md
  const primaryButtonStyles = `
    ${baseButtonStyles}
    bg-accent
    text-white
    shadow-md
    hover:bg-accent-dark
    hover:shadow-lg
    hover:scale-105
    ${!primaryUrlValid ? disabledStyles : ''}
  `.trim();

  // Secondary button: outline style with transparent background
  // Requirement 5.3: border-2 border-accent, transparent bg, hover:bg-accent/10
  const secondaryButtonStyles = `
    ${baseButtonStyles}
    border-2
    border-accent
    bg-transparent
    text-accent
    hover:bg-accent/10
    hover:border-accent-dark
    ${!secondaryUrlValid ? disabledStyles : ''}
  `.trim();

  return (
    <nav
      className={`
        flex
        flex-col
        sm:flex-row
        gap-4
        ${className}
      `.trim()}
      data-testid="cta-row"
      aria-label="Partner actions"
    >
      {/* Primary CTA */}
      {primaryCTA.external ? (
        // External link: opens in new tab with security attributes
        // Requirement 5.4: target="_blank" rel="noopener noreferrer"
        // Requirement 13.3: Disable button if URL is invalid, show tooltip
        <div className="relative group/cta w-full sm:w-auto">
          <a
            href={primaryUrlValid ? primaryCTA.href : '#'}
            target={primaryUrlValid ? "_blank" : undefined}
            rel={primaryUrlValid ? "noopener noreferrer" : undefined}
            className={primaryButtonStyles}
            aria-label={primaryUrlValid ? `${primaryCTA.label} (opens in new tab)` : `${primaryCTA.label} (invalid URL)`}
            {...(!primaryUrlValid && { 'aria-disabled': 'true' })}
            onClick={(e) => {
              if (!primaryUrlValid) {
                e.preventDefault();
              }
            }}
          >
            {primaryCTA.label}
          </a>
          {/* Tooltip for invalid URL */}
          {!primaryUrlValid && (
            <div
              className="
                absolute
                bottom-full
                left-1/2
                -translate-x-1/2
                mb-2
                px-3
                py-2
                bg-red-900/90
                text-white
                text-sm
                rounded-lg
                whitespace-nowrap
                opacity-0
                group-hover/cta:opacity-100
                transition-opacity
                duration-200
                pointer-events-none
                z-10
              "
              role="tooltip"
            >
              Invalid URL format
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-red-900/90" />
            </div>
          )}
        </div>
      ) : (
        // Internal link: uses Next.js Link component
        // Requirement 5.5: Internal navigation
        <Link
          href={primaryCTA.href}
          className={primaryButtonStyles}
        >
          {primaryCTA.label}
        </Link>
      )}

      {/* Secondary CTA */}
      {secondaryCTA.external ? (
        // External link: opens in new tab with security attributes
        // Requirement 13.3: Disable button if URL is invalid, show tooltip
        <div className="relative group/cta w-full sm:w-auto">
          <a
            href={secondaryUrlValid ? secondaryCTA.href : '#'}
            target={secondaryUrlValid ? "_blank" : undefined}
            rel={secondaryUrlValid ? "noopener noreferrer" : undefined}
            className={secondaryButtonStyles}
            aria-label={secondaryUrlValid ? `${secondaryCTA.label} (opens in new tab)` : `${secondaryCTA.label} (invalid URL)`}
            {...(!secondaryUrlValid && { 'aria-disabled': 'true' })}
            onClick={(e) => {
              if (!secondaryUrlValid) {
                e.preventDefault();
              }
            }}
          >
            {secondaryCTA.label}
          </a>
          {/* Tooltip for invalid URL */}
          {!secondaryUrlValid && (
            <div
              className="
                absolute
                bottom-full
                left-1/2
                -translate-x-1/2
                mb-2
                px-3
                py-2
                bg-red-900/90
                text-white
                text-sm
                rounded-lg
                whitespace-nowrap
                opacity-0
                group-hover/cta:opacity-100
                transition-opacity
                duration-200
                pointer-events-none
                z-10
              "
              role="tooltip"
            >
              Invalid URL format
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-red-900/90" />
            </div>
          )}
        </div>
      ) : (
        // Internal link: uses Next.js Link component
        <Link
          href={secondaryCTA.href}
          className={secondaryButtonStyles}
        >
          {secondaryCTA.label}
        </Link>
      )}
    </nav>
  );
}
