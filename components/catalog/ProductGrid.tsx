'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { ProductCard, ProductCardTranslations } from './ProductCard';
import { trackProductCardView } from '@/lib/analytics';
import { NoProductsFound } from '@/components/ui/EmptyState';

export interface ProductGridProps {
  products: Product[];
  locale: string;
  translations: ProductCardTranslations;
  variant?: 'traceability-first' | 'luxury-editorial';
  onQuoteClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onProductView: (product: Product) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * ProductGrid Component
 * Responsive grid layout for displaying product cards
 * 
 * Features:
 * - Responsive columns: 1 (mobile), 2 (tablet), 3-4 (desktop)
 * - Breakpoints: 768px, 1024px, 1280px
 * - Gap: 24px desktop, 16px mobile
 * - Max width: 1440px, centered
 * - Empty state handling
 * 
 * Requirements: 1.3, 13.2-13.4
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  locale,
  translations,
  variant = 'traceability-first',
  onQuoteClick,
  onQuickView,
  onProductView,
  hasActiveFilters = false,
  onClearFilters,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const viewedProductsRef = useRef<Set<string>>(new Set());

  // Set up Intersection Observer for tracking product card views
  useEffect(() => {
    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.getAttribute('data-product-id');
            
            // Only track each product once
            if (productId && !viewedProductsRef.current.has(productId)) {
              viewedProductsRef.current.add(productId);
              
              // Find product data
              const product = products.find((p) => p.id === productId);
              if (product) {
                // Track analytics
                trackProductCardView({
                  productId: product.id,
                  productName: product.name,
                  category: product.category,
                  origin: product.origins[0] || 'Unknown',
                  availability: product.availability,
                });
                
                // Call parent callback
                onProductView(product);
              }
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of card is visible
        rootMargin: '0px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [products, onProductView]);

  // Handle empty state
  if (products.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <NoProductsFound
          locale={locale}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6">
      {/* Responsive Grid Layout */}
      <div
        className={cn(
          // Base grid styles
          'grid w-full',
          // Mobile: 1 column, 16px gap
          'grid-cols-1 gap-4',
          // Tablet (768px+): 2 columns, 24px gap
          'md:grid-cols-2 md:gap-6',
          // Desktop (1024px+): 3 columns
          'lg:grid-cols-3',
          // Large Desktop (1280px+): 4 columns
          'xl:grid-cols-4'
        )}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-product-id={product.id}
            ref={(node) => {
              if (node && observerRef.current) {
                observerRef.current.observe(node);
              }
            }}
          >
            <ProductCard
              product={product}
              locale={locale}
              translations={translations}
              variant={variant}
              onQuoteClick={() => {
                onQuoteClick(product);
              }}
              onQuickView={() => {
                onQuickView(product);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
