'use client';

interface Proof {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface WhyBuyersChooseProps {
  locale: 'fr' | 'en';
}

/**
 * WhyBuyersChoose - 3 trust proofs for B2B buyers
 * Specs claires, Traçabilité EUDR, Logistique maîtrisée
 */
export function WhyBuyersChoose({ locale }: WhyBuyersChooseProps) {
  const proofs: Proof[] = locale === 'fr' ? [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Specs claires & constantes',
      description: 'Documentation technique complète et analyses de laboratoire',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Traçabilité du lot au port',
      description: 'EUDR-ready avec documentation de diligence raisonnable',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      title: 'Logistique maîtrisée',
      description: 'FOB/CIF, packing list & COA inclus',
    },
  ] : [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Clear & consistent specs',
      description: 'Complete technical documentation and lab analyses',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Lot-to-port traceability',
      description: 'EUDR-ready with due diligence documentation',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      title: 'Controlled logistics',
      description: 'FOB/CIF, packing list & COA included',
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-[rgba(26,40,32,0.3)] border-y border-[rgba(255,255,255,0.08)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {proofs.map((proof, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] flex items-center justify-center text-[#4A9A62]">
                {proof.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E8F5E9] mb-1">
                  {proof.title}
                </h3>
                <p className="text-sm text-[#80996F] leading-relaxed">
                  {proof.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
