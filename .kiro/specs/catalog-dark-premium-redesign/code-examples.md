# Code Examples: Catalog Dark Premium Redesign

## Tailwind Config - Dark Theme

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Premium Theme
        'dark-bg': {
          primary: '#0A1410',
          secondary: '#1A2820',
          tertiary: '#141D18',
        },
        'dark-text': {
          primary: '#E8F5E9',
          secondary: '#B0D4B8',
          muted: '#80996F',
        },
        'dark-primary': '#4A9A62',
        'dark-secondary': '#5AAA72',
        'dark-accent': '#A89858',
        'dark-border': 'rgba(255,255,255,0.1)',
        'dark-border-hover': 'rgba(255,255,255,0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
```

## Glass Effect Utilities

```css
/* app/globals.css */

.glass-panel {
  background: rgba(26, 40, 32, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.glass-card {
  background: rgba(26, 40, 32, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border-radius: 28px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0,0,0,0.4);
  border-color: rgba(255,255,255,0.2);
}

.glass-input {
  background: rgba(26, 40, 32, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #E8F5E9;
}

.glass-input:focus {
  outline: 2px solid #A89858;
  outline-offset: 2px;
  border-color: rgba(255,255,255,0.2);
}

.glass-input::placeholder {
  color: #80996F;
}
```

## ButtonDark Component

```typescript
// components/ui/ButtonDark.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonDarkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
}

export const ButtonDark: React.FC<ButtonDarkProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2',
    'font-semibold rounded-xl transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2 focus:ring-offset-dark-bg-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Variants
      'bg-dark-primary hover:bg-dark-secondary text-white shadow-lg hover:shadow-xl': variant === 'primary',
      'bg-transparent border-2 border-dark-border hover:border-dark-border-hover text-dark-text-primary': variant === 'secondary',
      'bg-transparent hover:bg-dark-bg-tertiary text-dark-text-primary': variant === 'ghost',
      
      // Sizes
      'px-4 py-2 text-sm min-h-[36px]': size === 'sm',
      'px-6 py-3 text-base min-h-[44px]': size === 'md',
      'px-8 py-4 text-lg min-h-[52px]': size === 'lg',
    },
    className
  );

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};
```

## ProductCardDark Component (Simplifié)

```typescript
// components/catalog-dark/ProductCardDark.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { ButtonDark } from '@/components/ui/ButtonDark';
import { BadgeDark } from '@/components/ui/BadgeDark';

interface ProductCardDarkProps {
  product: Product;
  locale: 'fr' | 'en';
  onQuoteClick: () => void;
}

export const ProductCardDark: React.FC<ProductCardDarkProps> = ({
  product,
  locale,
  onQuoteClick,
}) => {
  const imageUrl = product.heroImage 
    ? buildImageUrl(product.heroImage)
    : '/images/fallback-premium.jpg';

  const translations = locale === 'fr' ? {
    requestQuote: 'Demander un devis',
    viewSpecs: 'Voir fiche technique',
    origin: 'Origine',
    moq: 'MOQ',
    incoterm: 'Incoterms',
    microproof: 'Réponse sous 24h • NDA possible',
  } : {
    requestQuote: 'Request a Quote',
    viewSpecs: 'View Specifications',
    origin: 'Origin',
    moq: 'MOQ',
    incoterm: 'Incoterms',
    microproof: '24h response • NDA available',
  };

  return (
    <article className="glass-card group min-h-[520px] flex flex-col overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-[4/3]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.eudrReady && (
            <BadgeDark variant="eudr">EUDR-ready</BadgeDark>
          )}
          <BadgeDark variant="availability" status={product.availability}>
            {product.availability === 'available' ? (locale === 'fr' ? 'Disponible' : 'Available') : (locale === 'fr' ? 'Sur demande' : 'On Request')}
          </BadgeDark>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-6">
        {/* Product Header */}
        <h3 className="text-[22px] font-bold text-dark-text-primary leading-tight line-clamp-2 mb-2">
          {product.name}
        </h3>
        {product.subtitle && (
          <p className="text-sm text-dark-text-secondary line-clamp-1 mb-4">
            {product.subtitle}
          </p>
        )}

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs uppercase text-dark-text-muted mb-1">{translations.origin}</div>
            <div className="text-sm font-semibold text-dark-text-primary">{product.origins[0]}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-dark-text-muted mb-1">{translations.moq}</div>
            <div className="text-sm font-semibold text-dark-text-primary">{product.moq.value} {product.moq.unit}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs uppercase text-dark-text-muted mb-1">{translations.incoterm}</div>
            <div className="text-sm font-semibold text-dark-text-primary">{product.incoterms.join(', ')}</div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Actions Section */}
      <div className="p-6 pt-4 border-t border-dark-border">
        <div className="flex flex-col gap-3">
          <ButtonDark variant="primary" onClick={onQuoteClick} className="w-full">
            {translations.requestQuote}
          </ButtonDark>
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="text-center text-sm font-semibold text-dark-accent hover:text-dark-secondary transition-colors"
          >
            {translations.viewSpecs} →
          </Link>
          <p className="text-xs text-center text-dark-text-muted">
            {translations.microproof}
          </p>
        </div>
      </div>
    </article>
  );
};
```

## CatalogHeaderDark Component

```typescript
// components/catalog-dark/CatalogHeaderDark.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonDark } from '@/components/ui/ButtonDark';
import { TrustStripDark } from './TrustStripDark';

interface CatalogHeaderDarkProps {
  locale: 'fr' | 'en';
  onRequestQuote: () => void;
  onDownloadCatalog: () => void;
}

export const CatalogHeaderDark: React.FC<CatalogHeaderDarkProps> = ({
  locale,
  onRequestQuote,
  onDownloadCatalog,
}) => {
  const translations = locale === 'fr' ? {
    heading: 'Catalogue Produits',
    subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
    ctaPrimary: 'Demander un devis',
    ctaSecondary: 'Télécharger le catalogue (PDF)',
  } : {
    heading: 'Product Catalog',
    subtitle: 'Cocoa, coffee & African commodities — Documented QA, audit-ready traceability.',
    ctaPrimary: 'Request a Quote',
    ctaSecondary: 'Download Catalog (PDF)',
  };

  return (
    <header className={cn(
      'w-full max-h-[30vh] md:max-h-[30vh] max-h-[40vh]',
      'bg-gradient-to-b from-dark-bg-primary via-dark-bg-secondary to-transparent',
      'py-12 md:py-16 px-4 md:px-6'
    )}>
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* H1 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-primary leading-tight">
          {translations.heading}
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-dark-text-secondary max-w-3xl">
          {translations.subtitle}
        </p>

        {/* Trust Strip */}
        <TrustStripDark locale={locale} variant="compact" />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <ButtonDark variant="primary" size="lg" onClick={onRequestQuote}>
            {translations.ctaPrimary}
          </ButtonDark>
          <ButtonDark variant="secondary" size="lg" onClick={onDownloadCatalog}>
            {translations.ctaSecondary}
          </ButtonDark>
        </div>
      </div>
    </header>
  );
};
```

## TrustStripDark Component

```typescript
// components/catalog-dark/TrustStripDark.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TrustItem {
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
}

interface TrustStripDarkProps {
  locale: 'fr' | 'en';
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const TrustStripDark: React.FC<TrustStripDarkProps> = ({
  locale,
  variant = 'compact',
  className,
}) => {
  const items: TrustItem[] = [
    {
      icon: <ClockIcon />,
      label: '24h',
      tooltip: locale === 'fr' ? 'Réponse sous 24 heures' : '24h response',
    },
    {
      icon: <ShieldIcon />,
      label: 'NDA',
      tooltip: locale === 'fr' ? 'NDA disponible' : 'NDA available',
    },
    {
      icon: <LeafIcon />,
      label: 'EUDR',
      tooltip: locale === 'fr' ? 'Conforme EUDR' : 'EUDR compliant',
    },
    {
      icon: <CheckCircleIcon />,
      label: 'QA',
      tooltip: locale === 'fr' ? 'Documentation QA' : 'QA documentation',
    },
    {
      icon: <FileTextIcon />,
      label: 'COA',
      tooltip: locale === 'fr' ? 'COA & fiches techniques' : 'COA & spec sheets',
    },
  ];

  return (
    <div className={cn(
      'flex flex-wrap items-center justify-center',
      'gap-4 md:gap-8',
      className
    )}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 group relative"
          title={item.tooltip}
        >
          <div className="w-6 h-6 text-dark-primary">
            {item.icon}
          </div>
          <span className="text-sm font-medium text-dark-text-secondary">
            {item.label}
          </span>
          
          {/* Tooltip */}
          {item.tooltip && (
            <div className={cn(
              'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
              'px-3 py-2 rounded-lg',
              'bg-dark-bg-tertiary/90 backdrop-blur-sm',
              'border border-dark-border',
              'text-xs text-dark-text-primary whitespace-nowrap',
              'opacity-0 group-hover:opacity-100',
              'transition-opacity duration-200',
              'pointer-events-none'
            )}>
              {item.tooltip}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Icon Components (simplified)
const ClockIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LeafIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileTextIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
```

## Analytics Tracking

```typescript
// lib/analytics/catalog-events.ts

export function trackFilterUsed(
  filterType: string,
  filterValue: any,
  resultCount: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'filter_used', {
      filter_type: filterType,
      filter_value: JSON.stringify(filterValue),
      result_count: resultCount,
    });
  }
}

export function trackQuoteClick(
  product: Product,
  source: 'card' | 'mobile_cta'
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quote_click', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      origin: product.origins[0],
      availability: product.availability,
      source,
    });
  }
}

export function trackRFQSubmit(formData: RFQFormData) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'rfq_submit', {
      product_id: formData.productId,
      product_name: formData.productName,
      quantity: formData.quantity,
      incoterm: formData.incoterm,
      destination: formData.destination,
      company: formData.company,
    });
  }
}

export function trackPDFDownload(source: 'header' | 'footer') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'pdf_download', {
      source,
    });
  }
}
```

## Responsive Grid Layout

```typescript
// components/catalog-dark/ProductGridDark.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { ProductCardDark } from './ProductCardDark';

interface ProductGridDarkProps {
  products: Product[];
  locale: 'fr' | 'en';
  onQuoteClick: (product: Product) => void;
}

export const ProductGridDark: React.FC<ProductGridDarkProps> = ({
  products,
  locale,
  onQuoteClick,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className={cn(
        'grid w-full',
        // Mobile: 1 column, 16px gap
        'grid-cols-1 gap-4',
        // Tablet: 2-3 columns, 20px gap
        'md:grid-cols-2 md:gap-5',
        'lg:grid-cols-3 lg:gap-6',
        // Desktop: 3-4 columns, 24px gap
        'xl:grid-cols-4 xl:gap-6'
      )}>
        {products.map((product) => (
          <ProductCardDark
            key={product.id}
            product={product}
            locale={locale}
            onQuoteClick={() => onQuoteClick(product)}
          />
        ))}
      </div>
    </div>
  );
};
```

## Usage Example

```typescript
// app/[locale]/products-dark/page.tsx
import { ProductCatalogPageDark } from '@/components/catalog-dark/ProductCatalogPageDark';
import { getAllProducts } from '@/lib/sanity/queries';

export default async function ProductsDarkPage({
  params,
}: {
  params: Promise<{ locale: 'fr' | 'en' }>;
}) {
  const { locale } = await params;
  const products = await getAllProducts();

  return <ProductCatalogPageDark locale={locale} products={products} />;
}
```

Ces exemples de code fournissent une base solide pour démarrer l'implémentation. Ils peuvent être adaptés selon les besoins spécifiques du projet.
