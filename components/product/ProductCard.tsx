import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { urlFor } from '@/sanity/lib/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: {
      fr: string;
      en: string;
    };
    slug: {
      fr: { current: string };
      en: { current: string };
    };
    category: string;
    description: {
      fr: any;
      en: any;
    };
    gallery: any[];
    certifications?: Array<{
      _id: string;
      name: string;
      logo?: any;
    }>;
    availability: string;
  };
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const name = product.name[locale];
  const slug = product.slug[locale].current;
  
  // Extract plain text from block content description
  const getDescriptionText = (description: any): string => {
    if (typeof description === 'string') return description;
    if (Array.isArray(description)) {
      return description
        .filter((block: any) => block._type === 'block')
        .map((block: any) => 
          block.children
            ?.filter((child: any) => child._type === 'span')
            .map((child: any) => child.text)
            .join('')
        )
        .join(' ')
        .slice(0, 150) + '...';
    }
    return '';
  };

  const description = getDescriptionText(product.description[locale]);
  
  // Get first image from gallery
  const mainImage = product.gallery?.[0];
  const imageUrl = mainImage ? urlFor(mainImage)?.width(600).height(400).url() : '/assets/placeholder.svg';
  const imageAlt = mainImage?.alt || name;

  // Availability badge
  const availabilityLabels: Record<string, { fr: string; en: string; color: string }> = {
    in_stock: { fr: 'En stock', en: 'In Stock', color: 'bg-success-light text-success-dark' },
    pre_order: { fr: 'Pré-commande', en: 'Pre-Order', color: 'bg-info-light text-info-dark' },
    seasonal: { fr: 'Saisonnier', en: 'Seasonal', color: 'bg-warning-light text-warning-dark' },
    out_of_stock: { fr: 'Rupture', en: 'Out of Stock', color: 'bg-muted text-muted-foreground' },
  };

  const availabilityInfo = availabilityLabels[product.availability] || availabilityLabels.in_stock;
  const availabilityLabel = availabilityInfo[locale];

  // Category labels
  const categoryLabels: Record<string, { fr: string; en: string }> = {
    cocoa: { fr: 'Cacao', en: 'Cocoa' },
    coffee: { fr: 'Café', en: 'Coffee' },
    pepper: { fr: 'Poivre', en: 'Pepper' },
    wood: { fr: 'Bois', en: 'Wood' },
    corn: { fr: 'Maïs', en: 'Corn' },
  };

  const categoryLabel = categoryLabels[product.category]?.[locale] || product.category;

  return (
    <Link
      href={`/${locale}/products/${slug}`}
      className="group bg-white dark:bg-dark-bg-secondary rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted dark:bg-dark-bg-tertiary">
        <Image
          src={imageUrl || '/assets/placeholder.svg'}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 dark:border dark:border-dark-border/20"
        />
        
        {/* Availability badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availabilityInfo.color}`}>
            {availabilityLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="text-sm text-primary dark:text-dark-primary font-semibold mb-2">
          {categoryLabel}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground dark:text-dark-text-primary mb-2 group-hover:text-primary dark:group-hover:text-dark-primary transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground dark:text-dark-text-muted text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.certifications.slice(0, 3).map((cert) => (
              <div
                key={cert._id}
                className="inline-flex items-center gap-1 bg-light dark:bg-dark-bg-tertiary rounded-full px-3 py-1"
                title={cert.name}
              >
                {cert.logo && (
                  <Image
                    src={urlFor(cert.logo)?.width(24).height(24).url() || ''}
                    alt={cert.name}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                )}
                <span className="text-xs text-foreground dark:text-dark-text-primary">{cert.name}</span>
              </div>
            ))}
            {product.certifications.length > 3 && (
              <span className="text-xs text-muted-foreground dark:text-dark-text-muted">
                +{product.certifications.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center text-primary dark:text-dark-primary font-semibold text-sm group-hover:gap-2 transition-all">
          <span>{locale === 'fr' ? 'Voir les détails' : 'View Details'}</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
