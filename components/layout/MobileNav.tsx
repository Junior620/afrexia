'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';
import { trapFocus } from '@/lib/accessibility/focus-trap';

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  locale: Locale;
  navItems: NavItem[];
  rfqItem: NavItem;
}

/**
 * Mobile navigation menu with hamburger toggle
 * Includes keyboard navigation, focus trapping, and body scroll lock
 * 
 * Requirements:
 * - 5.1: Slide-in animation within 300ms
 * - 5.2: Focus trap when menu is open
 * - 5.3: Close on link click
 * - 5.4: Close on ESC key with focus return to hamburger
 * - 5.5: Body scroll lock when menu open
 * - 5.6: Close on outside click
 * - 6.2: Minimum 44x44px touch targets
 * - 6.3: Visible focus indicators
 * - 6.4: ARIA labels for navigation elements
 * - 6.5: Screen reader announcements for menu state
 * - 6.6: ESC key support for closing menu
 * - 20.2: Localized ARIA labels
 */
export function MobileNav({ locale, navItems, rfqItem }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Get localized labels (Requirement 20.2)
  const mainNavLabel = getTranslation(locale, 'accessibility.mainNavigation');
  const mobileNavLabel = getTranslation(locale, 'accessibility.mobileNavigation');
  const openMenuLabel = getTranslation(locale, 'accessibility.openMenu');
  const closeMenuLabel = getTranslation(locale, 'accessibility.closeMenu');
  const menuExpandedLabel = getTranslation(locale, 'accessibility.menuExpanded');
  const menuCollapsedLabel = getTranslation(locale, 'accessibility.menuCollapsed');

  // Close menu when route changes (Requirement 5.3)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open (Requirement 5.5)
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus trap when menu is open (Requirement 5.2)
  useEffect(() => {
    if (!isOpen || !navRef.current) return;

    const cleanup = trapFocus(navRef.current);
    return cleanup;
  }, [isOpen]);

  // Handle escape key to close menu and return focus (Requirement 5.4)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        // Return focus to hamburger button
        setTimeout(() => {
          hamburgerRef.current?.focus();
        }, 100);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Handle outside click to close menu (Requirement 5.6)
  const handleOverlayClick = () => {
    setIsOpen(false);
    // Return focus to hamburger button
    setTimeout(() => {
      hamburgerRef.current?.focus();
    }, 100);
  };

  // Handle close button click
  const handleClose = () => {
    setIsOpen(false);
    // Return focus to hamburger button
    setTimeout(() => {
      hamburgerRef.current?.focus();
    }, 100);
  };

  return (
    <>
      {/* Hamburger button - minimum 44x44px touch target (Requirement 6.2) */}
      <button
        ref={hamburgerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary rounded-lg"
        aria-label={isOpen ? closeMenuLabel : openMenuLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {/* Animated hamburger icon with 300ms transition (Requirement 5.1) */}
        <span
          className={`h-0.5 w-6 bg-primary dark:bg-dark-primary transition-all duration-300 ${
            isOpen ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-primary dark:bg-dark-primary transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-primary dark:bg-dark-primary transition-all duration-300 ${
            isOpen ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      {/* Mobile menu overlay - closes on click (Requirement 5.6) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu - drawer style with 300ms slide animation (Requirement 5.1) */}
      <nav
        id="mobile-menu"
        ref={navRef as React.RefObject<HTMLElement>}
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-dark-bg-secondary shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={mobileNavLabel}
      >
        {/* Screen reader announcement for menu state (Requirement 6.5) */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {isOpen ? menuExpandedLabel : menuCollapsedLabel}
        </div>
        <div className="flex h-full flex-col p-6 overflow-y-auto">
          {/* Close button - minimum 44x44px touch target (Requirement 6.2) */}
          <button
            onClick={handleClose}
            className="mb-8 self-end flex h-11 w-11 items-center justify-center text-2xl text-primary dark:text-dark-primary hover:text-primary-dark dark:hover:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary rounded-lg"
            aria-label={closeMenuLabel}
          >
            ×
          </button>

          {/* Navigation links - minimum 44x44px touch targets (Requirement 6.2) */}
          <ul className="flex flex-col gap-2" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 min-h-[44px] text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary ${
                    isActive(item.href)
                      ? 'bg-primary text-white dark:bg-dark-primary'
                      : 'text-primary dark:text-dark-text-primary hover:bg-light dark:hover:bg-dark-bg-tertiary'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            
            {/* RFQ button - prominent in mobile menu */}
            <li className="mt-4 pt-4 border-t border-neutral/20 dark:border-dark-border/30">
              <Link
                href={rfqItem.href}
                className={`block rounded-lg px-4 py-3 min-h-[44px] text-lg font-semibold text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary ${
                  isActive(rfqItem.href)
                    ? 'bg-primary-dark text-white dark:bg-dark-secondary'
                    : 'bg-primary text-white hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-secondary'
                }`}
                aria-current={isActive(rfqItem.href) ? 'page' : undefined}
              >
                {rfqItem.label}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
