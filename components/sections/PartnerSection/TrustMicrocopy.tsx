/**
 * TrustMicrocopy Component
 * 
 * Displays trust indicators below CTAs with bullet separators.
 * Shows response time, NDA availability, and QA documentation availability.
 * 
 * Requirements:
 * - 4.6: Display trust microcopy below CTAs with bullet separators
 */

'use client';

interface TrustMicrocopyProps {
  text: string;
  className?: string;
}

/**
 * TrustMicrocopy component
 * 
 * Renders trust indicators with bullet separators (•).
 * Center-aligned on mobile, left-aligned on desktop.
 * Uses secondary text color with higher opacity for subtle emphasis.
 * 
 * @param text - Trust microcopy text with bullet separators
 * @param className - Additional Tailwind CSS classes
 */
export function TrustMicrocopy({ text, className = '' }: TrustMicrocopyProps) {
  return (
    <p
      className={`
        text-sm
        text-partner-text-secondary
        text-center
        md:text-left
        mt-4
        ${className}
      `.trim()}
      data-testid="trust-microcopy"
      role="note"
      aria-label="Trust indicators"
    >
      {text}
    </p>
  );
}
