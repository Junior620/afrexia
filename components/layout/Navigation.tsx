'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { MobileNav } from './MobileNav';

interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  locale: Locale;
  navItems: NavItem[];
  rfqItem: NavItem;
}

/**
 * Navigation component with desktop and mobile views
 * Highlights active page with proper hover states
 * 
 * Requirements:
 * - 3.1: Desktop navigation bar with hover states
 * - 6.2: Minimum touch target sizes (44x44px)
 * - 6.3: Visible focus indicators
 * - 6.4: ARIA labels for navigation elements
 * - 20.2: Localized ARIA labels
 */
export function Navigation({ locale, navItems, rfqItem }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for home page
    if (href === `/${locale}`) {
      return pathname === `/${locale}`;
    }
    // Starts with for other pages
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation - hidden below xl breakpoint (1280px) */}
      <nav className="hidden xl:block" aria-label={getTranslation(locale, 'accessibility.mainNavigation')}>
        <ul className="flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-lg px-3 py-2 min-h-[44px] flex items-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary'
                    : 'text-neutral hover:bg-light hover:text-primary dark:text-dark-text-secondary dark:hover:bg-dark-bg-secondary dark:hover:text-dark-primary'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation - shown below xl breakpoint (1280px) */}
      <MobileNav locale={locale} navItems={navItems} rfqItem={rfqItem} />
    </>
  );
}
