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
    email: 'contact@afrexia.com',
    phone: '+237 XXX XXX XXX',
    address: locale === 'fr' ? 'Douala, Cameroun' : 'Douala, Cameroon',
  };

  return (
    <footer className="border-t border-neutral/20 bg-primary text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src="/assets/logo.png"
                alt="Afrexia"
                width={180}
                height={60}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-white/80">
              {getTranslation(locale, 'footer.tagline')}
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm text-white/80">
              <p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </p>
              <p>{contactInfo.address}</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-4 font-semibold">
              {getTranslation(locale, 'footer.products')}
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold">
              {getTranslation(locale, 'footer.company')}
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="mb-4 font-semibold">
              {getTranslation(locale, 'footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="mb-4 mt-6 font-semibold">
              {getTranslation(locale, 'footer.legal')}
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social media and certifications */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">
                {getTranslation(locale, 'footer.followUs')}:
              </span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    aria-label={social.platform}
                  >
                    {/* Icon placeholder - will be replaced with actual icons */}
                    <span className="text-xs">{social.icon[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Certification logos placeholder */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">
                {locale === 'fr' ? 'Certifications' : 'Certifications'}:
              </span>
              <div className="flex gap-3">
                {/* Placeholder for certification logos */}
                <div className="h-8 w-8 rounded bg-white/10" />
                <div className="h-8 w-8 rounded bg-white/10" />
                <div className="h-8 w-8 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-white/60">
          <p>
            {getTranslation(locale, 'footer.copyright', { year: currentYear.toString() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
