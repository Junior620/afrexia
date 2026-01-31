'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StickyCTAProps {
  locale: 'fr' | 'en';
  productId: string;
  productName: string;
  quoteHref: string;
  pdfHref: string;
  hasPDF: boolean;
  badges?: Array<{ label: string; icon?: React.ReactNode }>;
}

/**
 * StickyCTA - Sticky CTA bar that appears after 300px scroll
 * Shows [Demander un devis] [Fiche PDF] + badges
 * Premium B2B design with dark theme
 */
export function StickyCTA({
  locale,
  productId,
  productName,
  quoteHref,
  pdfHref,
  hasPDF,
  badges = [],
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after 300px scroll
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-[rgba(10,20,16,0.98)] backdrop-blur-xl',
        'border-t border-[rgba(255,255,255,0.08)]',
        'shadow-[0_-4px_24px_rgba(0,0,0,0.3)]',
        'transform transition-transform duration-300 ease-out',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product name + badges (hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-3 flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#E8F5E9] truncate">
              {productName}
            </h3>
            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                {badges.slice(0, 2).map((badge, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] text-[#4A9A62]"
                  >
                    {badge.icon && <span className="w-3 h-3">{badge.icon}</span>}
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* PDF CTA */}
            <a
              href={pdfHref}
              className={cn(
                'flex-1 lg:flex-none inline-flex items-center justify-center gap-2',
                'px-4 lg:px-6 py-2.5',
                'rounded-lg font-medium text-sm',
                'bg-transparent hover:bg-[rgba(168,152,88,0.1)]',
                'text-[#A89858] border border-[rgba(168,152,88,0.3)] hover:border-[rgba(168,152,88,0.5)]',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]'
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">
                {hasPDF
                  ? locale === 'fr' ? 'Fiche PDF' : 'PDF Spec'
                  : locale === 'fr' ? 'Recevoir PDF' : 'Get PDF'}
              </span>
              <span className="sm:hidden">PDF</span>
            </a>

            {/* Primary CTA */}
            <a
              href={quoteHref}
              className={cn(
                'flex-1 lg:flex-none inline-flex items-center justify-center gap-2',
                'px-6 lg:px-8 py-2.5',
                'rounded-lg font-semibold text-sm',
                'bg-[#4A9A62] hover:bg-[#5AAA72] text-white',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md',
                'focus:outline-none focus:ring-2 focus:ring-[#4A9A62] focus:ring-offset-2 focus:ring-offset-[#0A1410]'
              )}
            >
              <span>{locale === 'fr' ? 'Demander un devis' : 'Request Quote'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
