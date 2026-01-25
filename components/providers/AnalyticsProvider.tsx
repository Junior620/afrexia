'use client';

import { useEffect, useState } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Analytics Provider with consent management
 * Integrates Plausible (privacy-friendly, no consent needed) and Vercel Analytics
 * Google Analytics 4 will be added when cookie consent is implemented
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check for analytics consent in localStorage
    const consent = localStorage.getItem('analytics-consent');
    setHasConsent(consent === 'true');

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      setHasConsent(event.detail.consent);
    };

    window.addEventListener(
      'analytics-consent-change' as any,
      handleConsentChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'analytics-consent-change' as any,
        handleConsentChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    // Initialize Plausible Analytics (privacy-friendly, no consent needed)
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Initialize Google Analytics 4 only with consent
    if (
      hasConsent &&
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
          page_path: window.location.pathname,
        });
      `;
      document.head.appendChild(inlineScript);
    }
  }, [hasConsent]);

  return (
    <>
      {children}
      <VercelAnalytics />
    </>
  );
}
