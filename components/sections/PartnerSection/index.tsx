/**
 * SCPB Partner Section Component
 * 
 * A premium, visually rich component that showcases SCPB SARL as a strategic partner.
 * Features responsive 2-column layout on desktop and stacked layout on mobile.
 * 
 * Requirements:
 * - 1.1: Positioned immediately after Services Section on homepage
 * - 1.2: Renders as distinct visual section with proper spacing
 * - 9.1: React component named PartnerSection
 * - 9.2: Accepts props for locale and optional content override
 * - 9.6: Framework-compatible with Next.js 14+ App Router
 * - 10.3: Fallback logic (locale → en → error boundary)
 */

'use client';

import { partnerSectionContent } from '@/lib/content/partner-section';
import { PartnerSectionProps } from '@/types/partner-section';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { PhotoStack } from './PhotoStack';
import { EditorialContent } from './EditorialContent';
import { StatCards } from './StatCards';
import { CTARow } from './CTARow';
import { TrustMicrocopy } from './TrustMicrocopy';

/**
 * PartnerSection container component
 * 
 * Orchestrates the partner section layout and content display.
 * Implements responsive design with 2-column desktop and stacked mobile layouts.
 * 
 * @param locale - Current locale (fr, en, es, de, ru)
 * @param content - Optional content override for testing/customization
 * @param className - Additional Tailwind CSS classes
 */
export function PartnerSection({ locale, content: contentOverride, className = '' }: PartnerSectionProps) {
  // Load content from locale-specific content object with fallback logic
  // Requirement 10.3: locale → en → error boundary
  let content = contentOverride || partnerSectionContent[locale];
  
  // Fallback to English if current locale is unavailable
  if (!content && locale !== 'en') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Partner section content missing for locale "${locale}", falling back to English`);
    }
    content = partnerSectionContent.en;
  }
  
  // If English content is also missing, show error boundary
  if (!content) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Partner section content missing for all locales');
    }
    return (
      <ErrorBoundary
        fallback={
          <section className="py-16 text-center">
            <p className="text-neutral">Partner section content unavailable</p>
          </section>
        }
      >
        {null}
      </ErrorBoundary>
    );
  }

  return (
    <section
      data-testid="partner-section"
      aria-labelledby="partner-section-title"
      className={`
        relative
        w-full
        py-16 md:py-24
        ${className}
      `.trim()}
    >
      {/* Section wrapper with max-width and responsive padding */}
      {/* Requirement 9.6: max-width 1200px, 96px desktop / 64px mobile padding */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        {/* Mobile: Stacked layout (<768px) */}
        {/* Desktop: 2-column grid layout (≥768px) with 60/40 split */}
        {/* Requirements: 2.1, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5 */}
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[50fr_50fr] md:gap-12">
          {/* Mobile: Title appears first */}
          <div className="md:hidden">
            <h2 id="partner-section-title" className="text-3xl font-bold text-partner-text-primary mb-2">
              {content.title}
            </h2>
          </div>
          
          {/* PhotoStack - left column on desktop, second on mobile */}
          <div>
            <PhotoStack images={content.images} caption={content.photoCaption} />
          </div>
          
          {/* Editorial content and CTAs - right column on desktop */}
          <div className="flex flex-col gap-6">
            <EditorialContent
              eyebrow={content.eyebrow}
              title={content.title}
              subtitle={content.subtitle}
              bodyText={content.bodyText}
              keyFacts={content.keyFacts}
            />
            
            {/* StatCards - optional trust indicators */}
            <StatCards stats={content.stats} />
            
            {/* CTARow - call-to-action buttons */}
            <CTARow
              primaryCTA={content.primaryCTA}
              secondaryCTA={content.secondaryCTA}
            />
            
            {/* TrustMicrocopy - trust indicators below CTAs */}
            <TrustMicrocopy text={content.trustMicrocopy} />
          </div>
        </div>
      </div>
    </section>
  );
}
