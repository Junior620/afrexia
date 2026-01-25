'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/types';
import { localeNames, localeFlags, LOCALE_COOKIE } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  locale: Locale;
}

/**
 * Language switcher component
 * Switches between FR and EN while preserving page context
 */
export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = () => {
    const newLocale: Locale = locale === 'fr' ? 'en' : 'fr';
    
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Build new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`;
    
    // Set cookie
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    // Navigate to new path
    router.push(newPath);
  };

  const alternateLocale: Locale = locale === 'fr' ? 'en' : 'fr';

  return (
    <button
      onClick={switchLanguage}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-light"
      aria-label={`Switch to ${localeNames[alternateLocale]}`}
    >
      <span className="text-lg">{localeFlags[alternateLocale]}</span>
      <span className="hidden sm:inline">{localeNames[alternateLocale]}</span>
    </button>
  );
}
