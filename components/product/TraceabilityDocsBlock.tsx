'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TraceabilityDocsBlockProps {
  locale: 'fr' | 'en';
  productId: string;
  hasSpecPDF?: boolean;
}

/**
 * TraceabilityDocsBlock - Luxury editorial block for traceability & documentation
 * 2 cards: Traceability + Documentation
 */
export function TraceabilityDocsBlock({ locale, productId, hasSpecPDF }: TraceabilityDocsBlockProps) {
  const content = locale === 'fr' ? {
    title: 'Traçabilité & Documentation',
    traceability: {
      title: 'Traçabilité',
      items: [
        'Lot ID et origine parcellaire',
        'DDS/CoC audit-ready',
        'Chaîne de custody documentée',
      ],
      link: 'Voir un exemple',
      note: 'Sous NDA si requis',
    },
    documentation: {
      title: 'Documentation',
      items: [
        'Spec sheet & COA',
        'Packing list & BL',
        'Incoterms & certifications',
      ],
      link: hasSpecPDF ? 'Télécharger un exemple' : 'Demander la documentation',
      note: 'PDF disponible',
    },
  } : {
    title: 'Traceability & Documentation',
    traceability: {
      title: 'Traceability',
      items: [
        'Lot ID and parcel origin',
        'DDS/CoC audit-ready',
        'Documented chain of custody',
      ],
      link: 'View example',
      note: 'Under NDA if required',
    },
    documentation: {
      title: 'Documentation',
      items: [
        'Spec sheet & COA',
        'Packing list & BL',
        'Incoterms & certifications',
      ],
      link: hasSpecPDF ? 'Download example' : 'Request documentation',
      note: 'PDF available',
    },
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#E8F5E9] mb-8">
          {content.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traceability Card */}
          <div className="bg-[rgba(26,40,32,0.6)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 hover:border-[rgba(168,152,88,0.3)] transition-colors backdrop-blur-[12px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] flex items-center justify-center text-[#4A9A62] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#E8F5E9] mb-2">
                  {content.traceability.title}
                </h3>
                <ul className="space-y-1.5 mb-4">
                  {content.traceability.items.map((item, index) => (
                    <li key={index} className="text-sm text-[#C5D9C0] flex items-start gap-2">
                      <span className="text-[#4A9A62] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/contact?subject=traceability&product=${productId}`}
                  className="inline-flex items-center gap-1 text-sm text-[#A89858] hover:text-[#B8A868] font-medium transition-colors"
                >
                  {content.traceability.link}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-xs text-[#80996F] mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {content.traceability.note}
                </p>
              </div>
            </div>
          </div>

          {/* Documentation Card */}
          <div className="bg-[rgba(26,40,32,0.6)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 hover:border-[rgba(168,152,88,0.3)] transition-colors backdrop-blur-[12px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(168,152,88,0.15)] border border-[rgba(168,152,88,0.3)] flex items-center justify-center text-[#A89858] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#E8F5E9] mb-2">
                  {content.documentation.title}
                </h3>
                <ul className="space-y-1.5 mb-4">
                  {content.documentation.items.map((item, index) => (
                    <li key={index} className="text-sm text-[#C5D9C0] flex items-start gap-2">
                      <span className="text-[#A89858] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={hasSpecPDF ? '#' : `/${locale}/contact?subject=documentation&product=${productId}`}
                  className="inline-flex items-center gap-1 text-sm text-[#A89858] hover:text-[#B8A868] font-medium transition-colors"
                >
                  {content.documentation.link}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-xs text-[#80996F] mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  {content.documentation.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
