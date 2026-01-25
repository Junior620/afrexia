import Link from 'next/link';
import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Navigation } from './Navigation';

interface HeaderProps {
  locale: Locale;
}

/**
 * Main header component with logo, navigation, and language switcher
 * Sticky header with backdrop blur effect
 */
export function Header({ locale }: HeaderProps) {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-2xl font-bold text-primary transition-colors hover:text-primary-dark"
        >
          <span>Afrexia</span>
        </Link>

        {/* Desktop Navigation */}
        <Navigation locale={locale} navItems={navItems} />

        {/* Right side: Language switcher and RFQ button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher locale={locale} />
          
          <Link
            href={`/${locale}/rfq`}
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark sm:block"
          >
            {rfqLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
