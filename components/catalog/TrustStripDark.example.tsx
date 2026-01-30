/**
 * TrustStripDark Component Examples
 * 
 * This file demonstrates various usage patterns for the TrustStripDark component
 * in the dark premium catalog redesign.
 */

import React from 'react';
import { TrustStripDark, TrustItem } from './TrustStripDark';
import { TrustIconsDark } from './TrustIconsDark';
import { getDefaultTrustItemsDark } from './TrustStripDarkHelpers';

/**
 * Example 1: Default Trust Items (French)
 */
export const DefaultTrustItemsFR = () => {
  const translations = {
    response24h: '24h',
    response24hTooltip: 'Réponse sous 24 heures',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA disponible sur demande',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'Conforme EUDR',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'Documentation QA complète',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & fiches techniques disponibles',
  };

  const items = getDefaultTrustItemsDark(translations);

  return (
    <div className="bg-[#0A1410] p-8">
      <TrustStripDark items={items} />
    </div>
  );
};

/**
 * Example 2: Default Trust Items (English)
 */
export const DefaultTrustItemsEN = () => {
  const translations = {
    response24h: '24h',
    response24hTooltip: '24-hour response time',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA available upon request',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'EUDR compliant',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'Documented QA',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & spec sheets available',
  };

  const items = getDefaultTrustItemsDark(translations);

  return (
    <div className="bg-[#0A1410] p-8">
      <TrustStripDark items={items} />
    </div>
  );
};

/**
 * Example 3: Compact Variant
 */
export const CompactVariant = () => {
  const items: TrustItem[] = [
    {
      icon: <TrustIconsDark.Clock />,
      label: '24h',
      tooltip: 'Réponse sous 24 heures',
    },
    {
      icon: <TrustIconsDark.Shield />,
      label: 'NDA',
      tooltip: 'NDA disponible',
    },
    {
      icon: <TrustIconsDark.Leaf />,
      label: 'EUDR',
      tooltip: 'Conforme EUDR',
    },
  ];

  return (
    <div className="bg-[#0A1410] p-8">
      <TrustStripDark items={items} variant="compact" />
    </div>
  );
};

/**
 * Example 4: Detailed Variant
 */
export const DetailedVariant = () => {
  const items: TrustItem[] = [
    {
      icon: <TrustIconsDark.Clock />,
      label: 'Réponse sous 24h',
      tooltip: 'Notre équipe vous répond dans les 24 heures ouvrées',
    },
    {
      icon: <TrustIconsDark.Shield />,
      label: 'NDA disponible',
      tooltip: 'Accord de confidentialité disponible sur demande',
    },
    {
      icon: <TrustIconsDark.Leaf />,
      label: 'EUDR-ready',
      tooltip: 'Traçabilité conforme au règlement européen sur la déforestation',
    },
    {
      icon: <TrustIconsDark.CheckCircle />,
      label: 'QA documentée',
      tooltip: 'Documentation complète de contrôle qualité',
    },
    {
      icon: <TrustIconsDark.FileText />,
      label: 'COA & fiches techniques',
      tooltip: 'Certificats d\'analyse et fiches techniques disponibles',
    },
  ];

  return (
    <div className="bg-[#0A1410] p-8">
      <TrustStripDark items={items} variant="detailed" />
    </div>
  );
};

/**
 * Example 5: Custom Styling
 */
export const CustomStyling = () => {
  const translations = {
    response24h: '24h',
    ndaAvailable: 'NDA',
    eudrCompliant: 'EUDR',
    qaDocumented: 'QA',
    coaAvailable: 'COA',
  };

  const items = getDefaultTrustItemsDark(translations);

  return (
    <div className="bg-[#0A1410] p-8">
      <TrustStripDark 
        items={items} 
        className="border-t border-[rgba(255,255,255,0.1)] pt-6"
      />
    </div>
  );
};

/**
 * Example 6: In Header Context
 */
export const InHeaderContext = () => {
  const translations = {
    response24h: '24h',
    response24hTooltip: 'Réponse sous 24 heures',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA disponible',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'Conforme EUDR',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'QA documentée',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA disponibles',
  };

  const items = getDefaultTrustItemsDark(translations);

  return (
    <div className="bg-gradient-to-b from-[#0A1410] to-[#1A2820] p-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold text-[#4A9A62]">
          Catalogue Produits
        </h1>
        <p className="text-lg text-[#B0D4B8] max-w-2xl mx-auto">
          Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.
        </p>
        <TrustStripDark items={items} />
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-[#4A9A62] text-white rounded-lg hover:bg-[#5AAA72] transition-colors">
            Demander un devis
          </button>
          <button className="px-6 py-3 border border-[rgba(255,255,255,0.2)] text-[#E8F5E9] rounded-lg hover:border-[rgba(255,255,255,0.3)] transition-colors">
            Télécharger le catalogue (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 7: Mobile Responsive
 */
export const MobileResponsive = () => {
  const translations = {
    response24h: '24h',
    ndaAvailable: 'NDA',
    eudrCompliant: 'EUDR',
    qaDocumented: 'QA',
    coaAvailable: 'COA',
  };

  const items = getDefaultTrustItemsDark(translations);

  return (
    <div className="bg-[#0A1410] p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <TrustStripDark items={items} />
      </div>
    </div>
  );
};
