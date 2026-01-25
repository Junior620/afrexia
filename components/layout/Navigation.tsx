'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types';
import { MobileNav } from './MobileNav';

interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  locale: Locale;
  navItems: NavItem[];
}

/**
 * Navigation component with desktop and mobile views
 * Highlights active page
 */
export function Navigation({ locale, navItems }: NavigationProps) {
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
      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral hover:bg-light hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav locale={locale} navItems={navItems} />
    </>
  );
}
