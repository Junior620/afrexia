'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Navigation } from './Navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  locale: Locale;
}

/**
 * Main header component with logo, navigation, and language switcher
 * Sticky header with backdrop blur effect
 */
export function Header({ locale }: HeaderProps) {
  const { theme } = useTheme();
  const [logoError, setLogoError] = useState(false);

  // Reset logo error state when theme changes
  useEffect(() => {
    setLogoError(false);
  }, [theme]);
  
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
      href: `/${locale}/resources`,
      label: getTranslation(locale, 'navigation.resources'),
    },
    {
      href: `/${locale}/blog`,
      label: getTranslation(locale, 'navigation.blog'),
    },
    {
      href: `/${locale}/contact`,
      label: getTranslation(locale, 'navigation.contact'),
    },
  ];

  const rfqLabel = getTranslation(locale, 'navigation.rfq');
  const rfqItem = { href: `/${locale}/rfq`, label: rfqLabel };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-dark-border/30 dark:bg-dark-bg-primary/95 dark:supports-[backdrop-filter]:bg-dark-bg-primary/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Afrexia home"
        >
          <Image
            src={theme === 'dark' && !logoError ? '/assets/logo-dark.png' : '/assets/logo.png'}
            alt="Afrexia"
            width={180}
            height={63}
            priority
            className={`h-14 w-auto ${theme === 'dark' && logoError ? 'brightness-[1.2] contrast-[0.9]' : ''}`}
            onError={() => {
              // Fallback to standard logo if dark logo fails to load
              if (theme === 'dark' && !logoError) {
                console.warn('Dark mode logo failed to load, falling back to standard logo with CSS filter');
                setLogoError(true);
              }
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <Navigation locale={locale} navItems={navItems} rfqItem={rfqItem} />

        {/* Right side: Language switcher, theme toggle, and RFQ button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          
          {/* RFQ button - hidden on mobile, shown on tablet+ */}
          <Link
            href={`/${locale}/rfq`}
            className="hidden rounded-lg bg-primary px-4 py-2 min-h-[44px] text-sm font-semibold text-white transition-colors hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-secondary sm:flex sm:items-center"
            aria-label={rfqLabel}
          >
            {rfqLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
