'use client';

import { useState } from 'react';

interface PackagingOption {
  type: string;
  weight: string;
  description?: {
    fr?: string;
    en?: string;
  };
}

interface QAMetric {
  metric: string;
  value: string;
  standard?: string;
}

interface ProductSpecificationsProps {
  specifications: {
    qaMetrics?: QAMetric[];
    packagingOptions?: PackagingOption[];
    moq?: string;
    incoterms?: string[];
    hsCode?: string;
    harvestSeason?: string;
    availability?: string;
  };
  locale: 'fr' | 'en';
}

type Tab = 'grading' | 'packaging' | 'logistics' | 'compliance';

export function ProductSpecifications({ specifications, locale }: ProductSpecificationsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('grading');

  const tabs: Record<Tab, { fr: string; en: string }> = {
    grading: { fr: 'Qualité & Grading', en: 'Quality & Grading' },
    packaging: { fr: 'Conditionnement', en: 'Packaging' },
    logistics: { fr: 'Logistique', en: 'Logistics' },
    compliance: { fr: 'Conformité', en: 'Compliance' },
  };

  const availabilityLabels: Record<string, { fr: string; en: string }> = {
    in_stock: { fr: 'En stock', en: 'In Stock' },
    pre_order: { fr: 'Pré-commande', en: 'Pre-Order' },
    seasonal: { fr: 'Saisonnier', en: 'Seasonal' },
    out_of_stock: { fr: 'Rupture de stock', en: 'Out of Stock' },
  };

  const incotermsDescriptions: Record<string, { fr: string; en: string }> = {
    FOB: {
      fr: 'Free On Board - Le vendeur livre la marchandise à bord du navire',
      en: 'Free On Board - Seller delivers goods on board the vessel',
    },
    CIF: {
      fr: 'Cost, Insurance and Freight - Le vendeur paie le coût, l\'assurance et le fret',
      en: 'Cost, Insurance and Freight - Seller pays cost, insurance and freight',
    },
    CFR: {
      fr: 'Cost and Freight - Le vendeur paie le coût et le fret',
      en: 'Cost and Freight - Seller pays cost and freight',
    },
    EXW: {
      fr: 'Ex Works - La marchandise est disponible dans les locaux du vendeur',
      en: 'Ex Works - Goods available at seller\'s premises',
    },
    FCA: {
      fr: 'Free Carrier - Le vendeur livre la marchandise au transporteur',
      en: 'Free Carrier - Seller delivers goods to carrier',
    },
    DAP: {
      fr: 'Delivered At Place - Le vendeur livre à destination',
      en: 'Delivered At Place - Seller delivers to destination',
    },
    DDP: {
      fr: 'Delivered Duty Paid - Le vendeur paie tous les frais jusqu\'à destination',
      en: 'Delivered Duty Paid - Seller pays all costs to destination',
    },
  };

  return (
    <div className="bg-[rgba(26,40,32,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.2)] overflow-hidden backdrop-blur-[12px]">
      {/* Tabs */}
      <div className="border-b border-[rgba(255,255,255,0.08)]">
        <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
          {(Object.keys(tabs) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab
                    ? 'border-[#A89858] text-[#A89858]'
                    : 'border-transparent text-[#80996F] hover:text-[#E8F5E9] hover:border-[rgba(255,255,255,0.1)]'
                }
              `}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tabs[tab][locale]}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Grading Tab */}
        {activeTab === 'grading' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#E8F5E9] mb-4">
                {locale === 'fr' ? 'Métriques de Qualité' : 'Quality Metrics'}
              </h3>
              
              {specifications.qaMetrics && specifications.qaMetrics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[rgba(255,255,255,0.08)]">
                    <thead className="bg-[rgba(10,20,16,0.5)]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#80996F] uppercase tracking-wider">
                          {locale === 'fr' ? 'Métrique' : 'Metric'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#80996F] uppercase tracking-wider">
                          {locale === 'fr' ? 'Valeur/Plage' : 'Value/Range'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#80996F] uppercase tracking-wider">
                          {locale === 'fr' ? 'Norme' : 'Standard'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[rgba(26,40,32,0.3)] divide-y divide-[rgba(255,255,255,0.08)]">
                      {specifications.qaMetrics.map((metric, index) => (
                        <tr key={index} className="hover:bg-[rgba(26,40,32,0.5)] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#E8F5E9]">
                            {metric.metric}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C5D9C0]">
                            {metric.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#80996F]">
                            {metric.standard || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-[rgba(10,20,16,0.3)] rounded-lg border border-[rgba(255,255,255,0.08)]">
                  <svg className="w-12 h-12 mx-auto mb-3 text-[#80996F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-[#C5D9C0] mb-4">
                    {locale === 'fr'
                      ? 'Données disponibles sur demande (PDF/COA)'
                      : 'Data available on request (PDF/COA)'}
                  </p>
                  <a
                    href={`/${locale}/contact?subject=quality-metrics`}
                    className="inline-flex items-center gap-2 text-sm text-[#A89858] hover:text-[#B8A868] font-medium transition-colors"
                  >
                    {locale === 'fr' ? 'Recevoir la fiche complète' : 'Get complete spec sheet'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {specifications.harvestSeason && (
              <div>
                <h4 className="font-semibold text-[#E8F5E9] mb-2">
                  {locale === 'fr' ? 'Saison de Récolte' : 'Harvest Season'}
                </h4>
                <p className="text-[#C5D9C0]">{specifications.harvestSeason}</p>
              </div>
            )}
          </div>
        )}

        {/* Packaging Tab */}
        {activeTab === 'packaging' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#E8F5E9] mb-4">
                {locale === 'fr' ? 'Options de Conditionnement' : 'Packaging Options'}
              </h3>
              
              {specifications.packagingOptions && specifications.packagingOptions.length > 0 ? (
                <div className="grid gap-4">
                  {specifications.packagingOptions.map((option, index) => (
                    <div
                      key={index}
                      className="border border-[rgba(255,255,255,0.08)] rounded-lg p-4 hover:border-[#A89858] transition-colors bg-[rgba(10,20,16,0.3)]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-[#E8F5E9]">{option.type}</h4>
                        <span className="bg-[rgba(74,154,98,0.2)] text-[#4A9A62] px-3 py-1 rounded-full text-sm font-medium border border-[rgba(74,154,98,0.3)]">
                          {option.weight}
                        </span>
                      </div>
                      {option.description?.[locale] && (
                        <p className="text-[#80996F] text-sm">{option.description[locale]}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-[rgba(10,20,16,0.3)] rounded-lg border border-[rgba(255,255,255,0.08)]">
                  <svg className="w-12 h-12 mx-auto mb-3 text-[#80996F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-[#C5D9C0] mb-4">
                    {locale === 'fr'
                      ? 'Options de conditionnement sur demande'
                      : 'Packaging options available on request'}
                  </p>
                  <a
                    href={`/${locale}/contact?subject=packaging`}
                    className="inline-flex items-center gap-2 text-sm text-[#A89858] hover:text-[#B8A868] font-medium transition-colors"
                  >
                    {locale === 'fr' ? 'Discuter des options' : 'Discuss options'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logistics Tab */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            {specifications.moq && (
              <div>
                <h4 className="font-semibold text-[#E8F5E9] mb-2">
                  {locale === 'fr' ? 'Quantité Minimum de Commande (MOQ)' : 'Minimum Order Quantity (MOQ)'}
                </h4>
                <p className="text-[#C5D9C0] text-lg">{specifications.moq}</p>
              </div>
            )}

            {specifications.incoterms && specifications.incoterms.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#E8F5E9] mb-3">
                  {locale === 'fr' ? 'Incoterms Disponibles' : 'Available Incoterms'}
                </h4>
                <div className="grid gap-3">
                  {specifications.incoterms.map((incoterm) => (
                    <div
                      key={incoterm}
                      className="border border-[rgba(255,255,255,0.08)] rounded-lg p-4 hover:border-[#A89858] transition-colors bg-[rgba(10,20,16,0.3)]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#A89858]">{incoterm}</span>
                      </div>
                      <p className="text-sm text-[#80996F]">
                        {incotermsDescriptions[incoterm]?.[locale] || ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {specifications.availability && (
              <div>
                <h4 className="font-semibold text-[#E8F5E9] mb-2">
                  {locale === 'fr' ? 'Disponibilité' : 'Availability'}
                </h4>
                <p className="text-[#C5D9C0]">
                  {availabilityLabels[specifications.availability]?.[locale] || specifications.availability}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {specifications.hsCode && (
              <div>
                <h4 className="font-semibold text-[#E8F5E9] mb-2">
                  {locale === 'fr' ? 'Code SH (Système Harmonisé)' : 'HS Code (Harmonized System)'}
                </h4>
                <p className="text-[#C5D9C0] font-mono text-lg">{specifications.hsCode}</p>
                <p className="text-sm text-[#80996F] mt-1">
                  {locale === 'fr'
                    ? 'Code de classification douanière internationale'
                    : 'International customs classification code'}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-[#E8F5E9] mb-3">
                {locale === 'fr' ? 'Conformité Réglementaire' : 'Regulatory Compliance'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg">
                  <svg className="w-6 h-6 text-[#4A9A62] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#E8F5E9]">
                      {locale === 'fr' ? 'Conformité EUDR' : 'EUDR Compliance'}
                    </p>
                    <p className="text-sm text-[#C5D9C0]">
                      {locale === 'fr'
                        ? 'Traçabilité complète et documentation de diligence raisonnable disponible'
                        : 'Full traceability and due diligence documentation available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[rgba(168,152,88,0.15)] border border-[rgba(168,152,88,0.3)] rounded-lg">
                  <svg className="w-6 h-6 text-[#A89858] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#E8F5E9]">
                      {locale === 'fr' ? 'Normes Internationales' : 'International Standards'}
                    </p>
                    <p className="text-sm text-[#C5D9C0]">
                      {locale === 'fr'
                        ? 'Conforme aux normes ISO et réglementations d\'importation'
                        : 'Compliant with ISO standards and import regulations'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[rgba(128,153,111,0.15)] border border-[rgba(128,153,111,0.3)] rounded-lg">
                  <svg className="w-6 h-6 text-[#80996F] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#E8F5E9]">
                      {locale === 'fr' ? 'Documentation Complète' : 'Complete Documentation'}
                    </p>
                    <p className="text-sm text-[#C5D9C0]">
                      {locale === 'fr'
                        ? 'Certificats d\'origine, analyses de laboratoire et documents d\'exportation'
                        : 'Certificates of origin, lab analyses and export documentation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
