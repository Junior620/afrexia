'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types';
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
 * Includes keyboard navigation and focus trapping
 */
export function MobileNav({ navItems, rfqItem }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus trap when menu is open
  useEffect(() => {
    if (!isOpen || !navRef.current) return;

    const cleanup = trapFocus(navRef.current);
    return cleanup;
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Hamburger button - minimum 44x44px touch target */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span
          className={`h-0.5 w-6 bg-primary transition-all ${
            isOpen ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-primary transition-all ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-primary transition-all ${
            isOpen ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu - drawer style with improved touch targets */}
      <div
        id="mobile-menu"
        ref={navRef as React.RefObject<HTMLDivElement>}
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-full flex-col p-6">
          {/* Close button - minimum 44x44px touch target */}
          <button
            onClick={() => setIsOpen(false)}
            className="mb-8 self-end flex h-11 w-11 items-center justify-center text-2xl text-primary hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            aria-label="Close menu"
          >
            ×
          </button>

          {/* Navigation links - minimum 44x44px touch targets */}
          <nav aria-label="Mobile menu navigation">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 min-h-[44px] text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      isActive(item.href)
                        ? 'bg-primary text-white'
                        : 'text-primary hover:bg-light'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              
              {/* RFQ button - prominent in mobile menu */}
              <li className="mt-4 pt-4 border-t border-neutral/20">
                <Link
                  href={rfqItem.href}
                  className={`block rounded-lg px-4 py-3 min-h-[44px] text-lg font-semibold text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    isActive(rfqItem.href)
                      ? 'bg-primary-dark text-white'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                  aria-current={isActive(rfqItem.href) ? 'page' : undefined}
                >
                  {rfqItem.label}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
