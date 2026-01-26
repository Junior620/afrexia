'use client';

import Link from 'next/link';
import { trackCTAClick } from '@/lib/analytics';

interface CTAButtonProps {
  href: string;
  text: string;
  ctaLocation: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  children?: React.ReactNode;
}

/**
 * CTA button with analytics tracking
 * Tracks clicks before navigation
 */
export function CTAButton({
  href,
  text,
  ctaLocation,
  variant = 'primary',
  className,
  children,
}: CTAButtonProps) {
  const handleClick = () => {
    trackCTAClick({
      ctaText: text,
      ctaLocation,
      ctaDestination: href,
    });
  };

  const baseClasses = 'inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-white hover:bg-light text-primary border-2 border-primary',
    ghost: 'bg-white/10 hover:bg-white/20 text-white border-2 border-white',
  };

  const finalClassName = className || `${baseClasses} ${variantClasses[variant]}`;

  return (
    <Link href={href} onClick={handleClick} className={finalClassName}>
      {children || text}
    </Link>
  );
}
