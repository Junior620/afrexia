'use client';

import { useEffect } from 'react';
import { trackProductView } from '@/lib/analytics';
import { Locale } from '@/types';

interface ProductViewTrackerProps {
  productId: string;
  productName: string;
  productCategory: string;
  locale: Locale;
}

/**
 * Client component to track product page views
 * Automatically tracks when the component mounts
 */
export function ProductViewTracker({
  productId,
  productName,
  productCategory,
  locale,
}: ProductViewTrackerProps) {
  useEffect(() => {
    // Track product view on mount
    trackProductView({
      productId,
      productName,
      productCategory,
      locale,
    });
  }, [productId, productName, productCategory, locale]);

  // This component doesn't render anything
  return null;
}
