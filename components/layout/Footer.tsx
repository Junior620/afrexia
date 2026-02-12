import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

interface FooterProps {
  locale: Locale;
}

/**
 * Footer component with sitemap, contact info, social links, and certifications
 */
export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Navigation sections
  const productLinks = [
    { href: `/${locale}/products`, label: getTranslation(locale, 'navigation.products') },
  ];

  const companyLinks = [
    { href: `/${locale}/about`, label: getTranslation(locale, 'navigation.about') },
    { href: `/${locale}/solutions`, label: getTranslation(locale, 'navigation.solutions') },
    { href: `/${locale}/quality`, label: getTranslation(locale, 'navigation.quality') },
    { href: `/${locale}/traceability`, label: getTranslation(locale, 'navigation.traceability') },
  ];

  const resourceLinks = [
    { href: `/${locale}/resources`, label: getTranslation(locale, 'navigation.resources') },
    { href: `/${locale}/blog`, label: getTranslation(locale, 'navigation.blog') },
    { href: `/${locale}/contact`, label: getTranslation(locale, 'navigation.contact') },
  ];

  const legalLinks = [
    { href: `/${locale}/privacy`, label: getTranslation(locale, 'footer.privacyPolicy') },
    { href: `/${locale}/terms`, label: getTranslation(locale, 'footer.termsOfService') },
  ];

  // Social media links (placeholder - to be configured)
  const socialLinks = [
    { platform: 'LinkedIn', href: '#', icon: 'linkedin' },
    { platform: 'Twitter', href: '#', icon: 'twitter' },
    { platform: 'Facebook', href: '#', icon: 'facebook' },
  ];

  // Contact information
  const contactInfo = {
    email: 'kemajoujulien@afrexiacmr.com',
    phone: '+237 658 112 510 / +33 753 195 242',
    address: locale === 'fr' ? 'Douala, Cameroun' : 'Douala, Cameroon',
  };

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0A1410]">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-[100%] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1200px]">
        {/* Main footer content - Vertical stack on mobile, horizontal on tablet+ */}
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div className="space-y-6">
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src="/assets/logo.png"
                alt="Afrexia"
                width={180}
                height={60}
                className="h-14 w-auto brightness-110"
              />
            </Link>
            <p className="text-sm text-[#C5D9C0] leading-relaxed">
              {getTranslation(locale, 'footer.tagline')}
            </p>
            
            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2 text-[#C5D9C0] hover:text-[#A89858] transition-colors group"
              >
                <svg className="w-4 h-4 text-[#4A9A62] group-hover:text-[#A89858] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contactInfo.email}
              </a>
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-[#C5D9C0] hover:text-[#A89858] transition-colors group"
              >
                <svg className="w-4 h-4 text-[#4A9A62] group-hover:text-[#A89858] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {contactInfo.phone}
              </a>
              <p className="flex items-center gap-2 text-[#C5D9C0]">
                <svg className="w-4 h-4 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {contactInfo.address}
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-5 text-sm font-semibold text-[#E8F5E9] uppercase tracking-wider">
              {getTranslation(locale, 'footer.products')}
            </h4>
            <ul className="space-y-3 text-sm">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#C5D9C0] hover:text-[#A89858] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#4A9A62] group-hover:bg-[#A89858] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-5 text-sm font-semibold text-[#E8F5E9] uppercase tracking-wider">
              {getTranslation(locale, 'footer.company')}
            </h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#C5D9C0] hover:text-[#A89858] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#4A9A62] group-hover:bg-[#A89858] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="mb-5 text-sm font-semibold text-[#E8F5E9] uppercase tracking-wider">
              {getTranslation(locale, 'footer.quickLinks')}
            </h4>
            <ul className="space-y-3 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#C5D9C0] hover:text-[#A89858] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#4A9A62] group-hover:bg-[#A89858] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="mb-5 mt-8 text-sm font-semibold text-[#E8F5E9] uppercase tracking-wider">
              {getTranslation(locale, 'footer.legal')}
            </h4>
            <ul className="space-y-3 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#C5D9C0] hover:text-[#A89858] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#4A9A62] group-hover:bg-[#A89858] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social media and certifications */}
        <div className="mt-16 border-t border-[rgba(255,255,255,0.08)] pt-10">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            {/* Social links */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm text-[#80996F] font-medium">
                {getTranslation(locale, 'footer.followUs')}:
              </span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#C5D9C0] transition-all hover:bg-[rgba(74,154,98,0.15)] hover:border-[rgba(74,154,98,0.3)] hover:text-[#4A9A62]"
                    aria-label={social.platform}
                  >
                    {social.icon === 'linkedin' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    )}
                    {social.icon === 'twitter' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    )}
                    {social.icon === 'facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Certification badges */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm text-[#80996F] font-medium">
                {locale === 'fr' ? 'Conformité' : 'Compliance'}:
              </span>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)]">
                  <svg className="w-4 h-4 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#4A9A62]">EUDR</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]">
                  <svg className="w-4 h-4 text-[#C5D9C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#C5D9C0]">ISO</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]">
                  <svg className="w-4 h-4 text-[#C5D9C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#C5D9C0]">QA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.08)] text-center">
          <p className="text-sm text-[#80996F]">
            {getTranslation(locale, 'footer.copyright', { year: currentYear.toString() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
