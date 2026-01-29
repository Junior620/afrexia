'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { AvailabilityBadge, EUDRBadge, CertificationBadge } from '@/components/ui/Badge';
import { useFocusTrap } from '@/lib/accessibility/focus-trap';
import { trackQuickViewOpen } from '@/lib/analytics';
import { getProductDetailImageUrl } from '@/lib/sanity/image-url';

export interface QuickViewModalProps {
  product: Product;
  locale: string;
  translations: QuickViewTranslations;
  isOpen: boolean;
  onClose: () => void;
  onQuoteClick: () => void;
}

export interface QuickViewTranslations {
  title: string;
  close: string;
  specifications: string;
  certifications: string;
  documents: string;
  requestQuote: string;
  viewFullPage: string;
  availability: string;
  category: string;
  origins: string;
  moq: string;
  incoterms: string;
  packaging: string;
  grade: string;
  leadTime: string;
  notes: string;
  documentsLabels: {
    coa: string;
    specSheet: string;
    chainOfCustody: string;
  };
  availabilityLabels: {
    inStock: string;
    limited: string;
    preOrder: string;
  };
}

/**
 * QuickViewModal Component
 * Modal overlay showing comprehensive product specifications without leaving the catalog page
 * 
 * Features:
 * - Modal overlay with backdrop blur
 * - Product image, name, category, availability
 * - Comprehensive specifications (origin, grade, packaging, MOQ, lead time, incoterms)
 * - Certifications list with badges
 * - Documents list (COA, spec sheet, chain of custody)
 * - Quote CTA and product page link
 * - Close button (top-right) and ESC key support
 * - Focus trap and accessibility features
 * 
 * Requirements: 5.1-5.9, 11.8, 11.9
 */
export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  locale,
  translations,
  isOpen,
  onClose,
  onQuoteClick,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  
  // Use focus trap hook
  const focusTrapRef = useFocusTrap(isOpen);

  // Store the element that triggered the modal
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      
      // Track quick view open
      trackQuickViewOpen({
        productId: product.id,
        productName: product.name,
        category: product.category,
        origin: product.origins[0] || 'Unknown',
      });
    }
  }, [isOpen, product]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Return focus to trigger element when modal closes
  useEffect(() => {
    if (!isOpen && triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, [isOpen]);

  // Build optimized image URL from Sanity image with CDN optimization
  const imageUrl = getProductDetailImageUrl(product.heroImage);
  const imageAlt = `${product.name} - ${product.category}`;

  // Get availability label
  const getAvailabilityLabel = () => {
    const statusMap = {
      'in-stock': translations.availabilityLabels.inStock,
      'limited': translations.availabilityLabels.limited,
      'pre-order': translations.availabilityLabels.preOrder,
    };
    return statusMap[product.availability] || product.availability;
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle quote click - close modal and trigger quote action
  const handleQuoteClick = () => {
    onClose();
    onQuoteClick();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="quick-view-title"
    >
      <div
        ref={(node) => {
          if (node) {
            modalRef.current = node;
            // @ts-ignore - Assign to focus trap ref
            focusTrapRef.current = node;
          }
        }}
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl',
          'w-full max-w-3xl max-h-[90vh] overflow-y-auto',
          'md:rounded-2xl',
          // Mobile: full screen
          'sm:max-w-full sm:max-h-full sm:rounded-none',
          // Animation
          'animate-in fade-in zoom-in-95 duration-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={translations.close}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Product Image */}
            <div className="relative w-full md:w-64 h-48 md:h-64 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-cover"
              />
            </div>

            {/* Product Header Info */}
            <div className="flex-1">
              <h2
                id="quick-view-title"
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
              >
                {product.name}
              </h2>
              
              {product.subtitle && (
                <p className="text-base text-gray-600 mb-3">
                  {product.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Category */}
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{translations.category}:</span>{' '}
                  {product.category}
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    {translations.availability}:
                  </span>
                  <AvailabilityBadge
                    status={product.availability}
                    label={getAvailabilityLabel()}
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.eudrReady && (
                  <EUDRBadge label="EUDR Ready" />
                )}
                {product.certifications.slice(0, 3).map((certId) => (
                  <CertificationBadge
                    key={certId}
                    label={certId.charAt(0).toUpperCase() + certId.slice(1)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {translations.specifications}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origins */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    {translations.origins}
                  </div>
                  <div className="text-sm text-gray-900">
                    {product.origins.join(', ') || '—'}
                  </div>
                </div>
              </div>

              {/* MOQ */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    {translations.moq}
                  </div>
                  <div className="text-sm text-gray-900">
                    {product.moq.value} {product.moq.unit}
                  </div>
                </div>
              </div>

              {/* Incoterms */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    {translations.incoterms}
                  </div>
                  <div className="text-sm text-gray-900">
                    {product.incoterms.join(', ')}
                  </div>
                </div>
              </div>

              {/* Packaging */}
              {product.packaging && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {translations.packaging}
                    </div>
                    <div className="text-sm text-gray-900">
                      {product.packaging}
                    </div>
                  </div>
                </div>
              )}

              {/* Grade */}
              {product.grade && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {translations.grade}
                    </div>
                    <div className="text-sm text-gray-900">
                      {product.grade}
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Time */}
              {product.leadTime && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {translations.leadTime}
                    </div>
                    <div className="text-sm text-gray-900">
                      {product.leadTime}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certifications Section */}
          {product.certifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {translations.certifications}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.eudrReady && (
                  <EUDRBadge label="EUDR Ready" />
                )}
                {product.certifications.map((certId) => (
                  <CertificationBadge
                    key={certId}
                    label={certId.charAt(0).toUpperCase() + certId.slice(1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {(product.documents.coa || product.documents.specSheet || product.documents.chainOfCustody) && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {translations.documents}
              </h3>
              <ul className="space-y-2">
                {product.documents.coa && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-success flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{translations.documentsLabels.coa}</span>
                  </li>
                )}
                {product.documents.specSheet && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-success flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{translations.documentsLabels.specSheet}</span>
                  </li>
                )}
                {product.documents.chainOfCustody && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-success flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{translations.documentsLabels.chainOfCustody}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Additional Notes */}
          {product.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {translations.notes}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.notes}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleQuoteClick}
              className="flex-1"
            >
              {translations.requestQuote}
            </Button>
            <Link
              href={`/${locale}/products/${product.slug}`}
              prefetch={true}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg font-semibold text-base bg-white text-primary border-2 border-primary hover:bg-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              {translations.viewFullPage} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
