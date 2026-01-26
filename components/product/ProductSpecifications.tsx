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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
          {(Object.keys(tabs) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
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
              <h3 className="text-xl font-bold text-foreground mb-4">
                {locale === 'fr' ? 'Métriques de Qualité' : 'Quality Metrics'}
              </h3>
              
              {specifications.qaMetrics && specifications.qaMetrics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {locale === 'fr' ? 'Métrique' : 'Metric'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {locale === 'fr' ? 'Valeur/Plage' : 'Value/Range'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {locale === 'fr' ? 'Norme' : 'Standard'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                      {specifications.qaMetrics.map((metric, index) => (
                        <tr key={index} className="hover:bg-muted">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {metric.metric}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {metric.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {metric.standard || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {locale === 'fr'
                    ? 'Aucune métrique de qualité disponible'
                    : 'No quality metrics available'}
                </p>
              )}
            </div>

            {specifications.harvestSeason && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  {locale === 'fr' ? 'Saison de Récolte' : 'Harvest Season'}
                </h4>
                <p className="text-foreground">{specifications.harvestSeason}</p>
              </div>
            )}
          </div>
        )}

        {/* Packaging Tab */}
        {activeTab === 'packaging' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {locale === 'fr' ? 'Options de Conditionnement' : 'Packaging Options'}
              </h3>
              
              {specifications.packagingOptions && specifications.packagingOptions.length > 0 ? (
                <div className="grid gap-4">
                  {specifications.packagingOptions.map((option, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{option.type}</h4>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          {option.weight}
                        </span>
                      </div>
                      {option.description?.[locale] && (
                        <p className="text-muted-foreground text-sm">{option.description[locale]}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {locale === 'fr'
                    ? 'Aucune option de conditionnement disponible'
                    : 'No packaging options available'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Logistics Tab */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            {specifications.moq && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  {locale === 'fr' ? 'Quantité Minimum de Commande (MOQ)' : 'Minimum Order Quantity (MOQ)'}
                </h4>
                <p className="text-foreground text-lg">{specifications.moq}</p>
              </div>
            )}

            {specifications.incoterms && specifications.incoterms.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-3">
                  {locale === 'fr' ? 'Incoterms Disponibles' : 'Available Incoterms'}
                </h4>
                <div className="grid gap-3">
                  {specifications.incoterms.map((incoterm) => (
                    <div
                      key={incoterm}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-primary">{incoterm}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {incotermsDescriptions[incoterm]?.[locale] || ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {specifications.availability && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  {locale === 'fr' ? 'Disponibilité' : 'Availability'}
                </h4>
                <p className="text-foreground">
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
                <h4 className="font-semibold text-foreground mb-2">
                  {locale === 'fr' ? 'Code SH (Système Harmonisé)' : 'HS Code (Harmonized System)'}
                </h4>
                <p className="text-foreground font-mono text-lg">{specifications.hsCode}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === 'fr'
                    ? 'Code de classification douanière internationale'
                    : 'International customs classification code'}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-foreground mb-3">
                {locale === 'fr' ? 'Conformité Réglementaire' : 'Regulatory Compliance'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-success-light rounded-lg">
                  <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-foreground">
                      {locale === 'fr' ? 'Conformité EUDR' : 'EUDR Compliance'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'fr'
                        ? 'Traçabilité complète et documentation de diligence raisonnable disponible'
                        : 'Full traceability and due diligence documentation available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-info-light rounded-lg">
                  <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="font-medium text-foreground">
                      {locale === 'fr' ? 'Normes Internationales' : 'International Standards'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'fr'
                        ? 'Conforme aux normes ISO et réglementations d\'importation'
                        : 'Compliant with ISO standards and import regulations'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-warning-light rounded-lg">
                  <svg className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-foreground">
                      {locale === 'fr' ? 'Documentation Complète' : 'Complete Documentation'}
                    </p>
                    <p className="text-sm text-muted-foreground">
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
