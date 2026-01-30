import React from 'react';
import { TrustItem } from './TrustStripDark';
import { TrustIconsDark } from './TrustIconsDark';

/**
 * Pre-configured default trust items for B2B catalog - Dark Premium Theme
 * 
 * @param translations - Translation object with trust item labels and tooltips
 * @returns Array of TrustItem objects with icons, labels, and tooltips
 */
export const getDefaultTrustItemsDark = (translations: {
  response24h: string;
  response24hTooltip?: string;
  ndaAvailable: string;
  ndaAvailableTooltip?: string;
  eudrCompliant: string;
  eudrCompliantTooltip?: string;
  qaDocumented: string;
  qaDocumentedTooltip?: string;
  coaAvailable: string;
  coaAvailableTooltip?: string;
}): TrustItem[] => {
  return [
    {
      icon: <TrustIconsDark.Clock />,
      label: translations.response24h,
      tooltip: translations.response24hTooltip || translations.response24h,
    },
    {
      icon: <TrustIconsDark.Shield />,
      label: translations.ndaAvailable,
      tooltip: translations.ndaAvailableTooltip || translations.ndaAvailable,
    },
    {
      icon: <TrustIconsDark.Leaf />,
      label: translations.eudrCompliant,
      tooltip: translations.eudrCompliantTooltip || translations.eudrCompliant,
    },
    {
      icon: <TrustIconsDark.CheckCircle />,
      label: translations.qaDocumented,
      tooltip: translations.qaDocumentedTooltip || translations.qaDocumented,
    },
    {
      icon: <TrustIconsDark.FileText />,
      label: translations.coaAvailable,
      tooltip: translations.coaAvailableTooltip || translations.coaAvailable,
    },
  ];
};
