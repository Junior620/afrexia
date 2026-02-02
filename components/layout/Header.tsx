'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Navigation } from './Navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  locale: Locale;
}

/**
 * Main header component with logo, navigation, and language switcher
 * Sticky header with backdrop blur effect and dynamic height calculation
 * 
 * Requirements:
 * - 3.1: Responsive navigation with mobile menu below 768px
 * - 6.2: Minimum touch target sizes (44x44px)
 */
export function Header({ locale }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);

  // Calculate and expose header height for scroll offset calculations
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.getBoundingClientRect().height;
        // Set CSS custom property for use in other components
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);
  
  // Build navigation items from translations
  const navItems = [
    { href: `/${locale}`, label: getTranslation(locale, 'navigation.home') },
    {
      href: `/${locale}/products`,
      label: getTranslation(locale, 'navigation.products'),
    },
    {
      href: `/${locale}/solutions`,
      label: getTranslation(locale, 'navigation.solutions'),
    },
    {
      href: `/${locale}/quality`,
      label: getTranslation(locale, 'navigation.quality'),
    },
    {
      href: `/${locale}/traceability`,
      label: getTranslation(locale, 'navigation.traceability'),
    },
    {
      href: `/${locale}/about`,
      label: getTranslation(locale, 'navigation.about'),
    },
    {
      href: `/${locale}/team`,
      label: getTranslation(locale, 'navigation.team'),
    },
    {
      href: `/${locale}/contact`,
      label: getTranslation(locale, 'navigation.contact'),
    },
  ];

  const rfqLabel = getTranslation(locale, 'navigation.rfq');
  const rfqItem = { href: `/${locale}/rfq`, label: rfqLabel };

  return (
    <header 
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-neutral/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-dark-border/30 dark:bg-dark-bg-primary/95 dark:supports-[backdrop-filter]:bg-dark-bg-primary/80"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Minimum 44x44px touch target */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 min-h-[44px] min-w-[44px] transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary rounded-lg"
          aria-label={getTranslation(locale, 'navigation.home')}
        >
          <Image
            src="/assets/logo-dark.png"
            alt="Afrexia"
            width={180}
            height={63}
            priority
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <Navigation locale={locale} navItems={navItems} rfqItem={rfqItem} />

        {/* Right side: Language switcher, theme toggle, and RFQ button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          
          {/* RFQ button - hidden on mobile/tablet, shown on xl+ - Minimum 44x44px touch target */}
          <Link
            href={`/${locale}/rfq`}
            className="hidden rounded-lg bg-primary px-4 py-2 min-h-[44px] min-w-[44px] text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-primary dark:hover:bg-dark-secondary dark:focus:ring-dark-primary xl:flex xl:items-center"
            aria-label={rfqLabel}
          >
            {rfqLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
