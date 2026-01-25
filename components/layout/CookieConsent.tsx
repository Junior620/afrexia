'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/types';

interface CookieConsentProps {
  locale: Locale;
}

/**
 * Cookie consent banner component
 * Manages analytics consent and triggers analytics reload
 */
export function CookieConsent({ locale }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('analytics-consent');
    if (consent === null) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analytics-consent', 'true');
    setShowBanner(false);
    
    // Dispatch custom event to trigger analytics reload
    window.dispatchEvent(
      new CustomEvent('analytics-consent-change', {
        detail: { consent: true },
      })
    );
  };

  const handleReject = () => {
    localStorage.setItem('analytics-consent', 'false');
    setShowBanner(false);
    
    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent('analytics-consent-change', {
        detail: { consent: false },
      })
    );
  };

  if (!showBanner) {
    return null;
  }

  const content = {
    fr: {
      title: 'Cookies et confidentialité',
      message:
        'Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site. Nous utilisons Plausible Analytics (sans cookies) par défaut. Acceptez-vous les cookies Google Analytics pour des analyses plus détaillées ?',
      accept: 'Accepter',
      reject: 'Refuser',
      learnMore: 'En savoir plus',
    },
    en: {
      title: 'Cookies and privacy',
      message:
        'We use cookies to improve your experience and analyze site traffic. We use Plausible Analytics (cookie-free) by default. Do you accept Google Analytics cookies for more detailed analysis?',
      accept: 'Accept',
      reject: 'Reject',
      learnMore: 'Learn more',
    },
  };

  const text = content[locale];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral/20 bg-white p-4 shadow-lg sm:p-6">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="mb-2 font-semibold text-primary">{text.title}</h3>
            <p className="text-sm text-neutral">{text.message}</p>
            <a
              href={`/${locale}/privacy`}
              className="mt-2 inline-block text-sm text-primary underline hover:text-primary-dark"
            >
              {text.learnMore}
            </a>
          </div>
          
          <div className="flex gap-3 sm:flex-shrink-0">
            <button
              onClick={handleReject}
              className="rounded-lg border-2 border-neutral px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-light"
            >
              {text.reject}
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {text.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
