'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { RFQFormData, RFQValidationErrors, ContactInfo, DeliveryInfo } from '@/types/rfq';
import { ButtonDark } from '@/components/ui/ButtonDark';
import { InputDark } from '@/components/ui/InputDark';
import { SelectDark, SelectDarkOption } from '@/components/ui/SelectDark';
import { trackRFQSubmission } from '@/lib/analytics';
import { getThumbnailImageUrl } from '@/lib/sanity/image-url';

export interface RFQDrawerDarkProps {
  product: Product;
  locale: 'fr' | 'en';
  translations: RFQDrawerDarkTranslations;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RFQFormData) => Promise<void>;
}

export interface RFQDrawerDarkTranslations {
  title: string;
  close: string;
  productLabel: string;
  fields: {
    quantity: string;
    quantityPlaceholder: string;
    incoterm: string;
    incotermPlaceholder: string;
    destination: string;
    destinationPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    company: string;
    companyPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
  };
  trustElements: {
    response24h: string;
    ndaAvailable: string;
  };
  submit: string;
  submitting: string;
  success: string;
  successMessage: string;
  error: string;
  errorMessage: string;
}

/**
 * RFQDrawerDark Component
 * Dark premium drawer for quote requests with pre-filled product information
 * 
 * Features:
 * - Width 480px desktop, 100vw mobile
 * - Height 100vh, fixed right
 * - Background dark avec glass overlay
 * - Animation slide from right
 * - Pre-filled product (read-only)
 * - Form validation
 * - Trust elements
 * - Loading and success states
 * 
 * Requirements: 5.1-5.9, 8.3, 8.5
 */
export const RFQDrawerDark: React.FC<RFQDrawerDarkProps> = ({
  product,
  translations,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<RFQFormData>(() => ({
    products: product ? [{
      id: product.id,
      quantity: product.moq.value,
      unit: product.moq.unit,
    }] : [],
    contact: {
      name: '',
      email: '',
      company: '',
      phone: '',
    },
    delivery: {
      location: '',
      incoterm: '',
    },
    notes: '',
  }));

  const [errors, setErrors] = useState<RFQValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Update form data when product changes
  useEffect(() => {
    if (product && isOpen) {
      setFormData((prev) => ({
        ...prev,
        products: [{
          id: product.id,
          quantity: product.moq.value,
          unit: product.moq.unit,
        }],
      }));
    }
  }, [product, isOpen]);

  // Lock body scroll when drawer is open
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

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: RFQValidationErrors = {};

    // Check if product exists
    if (!product || !formData.products[0]) {
      newErrors['products.0.quantity'] = 'Product is required';
      setErrors(newErrors);
      return false;
    }

    // Quantity validation
    if (!formData.products[0].quantity || formData.products[0].quantity <= 0) {
      newErrors['products.0.quantity'] = 'Quantity is required';
    } else if (formData.products[0].quantity < product.moq.value) {
      newErrors['products.0.quantity'] = `Minimum ${product.moq.value} ${product.moq.unit}`;
    }

    // Contact validation
    if (!formData.contact.email.trim()) {
      newErrors['contact.email'] = translations.fields.email + ' is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors['contact.email'] = 'Invalid email address';
    }

    if (!formData.contact.company.trim()) {
      newErrors['contact.company'] = translations.fields.company + ' is required';
    } else if (formData.contact.company.trim().length < 2) {
      newErrors['contact.company'] = 'Minimum 2 characters';
    }

    // Delivery validation
    if (!formData.delivery.location.trim()) {
      newErrors['delivery.location'] = translations.fields.destination + ' is required';
    } else if (formData.delivery.location.trim().length < 2) {
      newErrors['delivery.location'] = 'Minimum 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = new Set([
      'products.0.quantity',
      'contact.email',
      'contact.company',
      'delivery.location',
    ]);
    setTouchedFields(allFields);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      
      // Track RFQ submission - Requirements: 8.3, 8.5
      trackRFQSubmission({
        productId: product.id,
        productName: product.name,
        quantity: formData.products[0].quantity,
        incoterm: formData.delivery.incoterm,
        country: formData.delivery.location,
      });

      // Close drawer after 2 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
        // Reset form
        setFormData({
          products: [{
            id: product.id,
            quantity: product.moq.value,
            unit: product.moq.unit,
          }],
          contact: { name: '', email: '', company: '', phone: '' },
          delivery: { location: '', incoterm: '' },
          notes: '',
        });
        setTouchedFields(new Set());
      }, 2000);
    } catch (error) {
      console.error('RFQ submission error:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle field blur
  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    validateForm();
  };

  // Handle contact field change
  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  // Handle delivery field change
  const handleDeliveryChange = (field: keyof DeliveryInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [field]: value,
      },
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      products: [{
        ...prev.products[0],
        quantity,
      }],
    }));
  };

  // Incoterm options
  const incotermOptions: SelectDarkOption[] = [
    { value: 'FOB', label: 'FOB - Free On Board' },
    { value: 'CIF', label: 'CIF - Cost, Insurance & Freight' },
    { value: 'DAP', label: 'DAP - Delivered At Place' },
    { value: 'EXW', label: 'EXW - Ex Works' },
    { value: 'FCA', label: 'FCA - Free Carrier' },
    { value: 'CPT', label: 'CPT - Carriage Paid To' },
  ];

  // Don't render if not open or no product
  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[200] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer - Requirements: 5.1 */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed right-0 top-0 h-full z-[201]',
          'bg-[#0A1410] shadow-[-4px_0_32px_rgba(0,0,0,0.5)]',
          'w-full md:w-[480px]',
          'overflow-y-auto',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rfq-drawer-dark-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0A1410] border-b border-[rgba(255,255,255,0.1)] px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#B0D4B8] hover:text-[#E8F5E9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A89858] rounded"
            aria-label={translations.close}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold">{translations.close}</span>
          </button>
          
          <h2 id="rfq-drawer-dark-title" className="text-xl font-bold text-[#E8F5E9]">
            {translations.title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Success Message - Requirements: 5.7 */}
          {submitSuccess && (
            <div 
              className="mb-6 p-4 bg-[rgba(74,154,98,0.15)] border border-[#4A9A62] rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-[#4A9A62] flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-[#4A9A62]">{translations.success}</h3>
                  <p className="text-sm text-[#B0D4B8] mt-1">{translations.successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message - Requirements: 5.7 */}
          {submitError && (
            <div 
              className="mb-6 p-4 bg-[rgba(220,38,38,0.15)] border border-[#DC2626] rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-[#DC2626] flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-[#DC2626]">{translations.error}</h3>
                  <p className="text-sm text-[#B0D4B8] mt-1">{translations.errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Product (Read-only) - Requirements: 5.2 */}
            <section>
              <h3 className="text-xs font-semibold text-[#B0D4B8] mb-3 uppercase tracking-wider">
                {translations.productLabel}
              </h3>

              <div className="flex gap-4 p-4 bg-[rgba(26,40,32,0.6)] backdrop-blur-[12px] rounded-xl border border-[rgba(255,255,255,0.1)]">
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#1A2820]">
                  <Image
                    src={getThumbnailImageUrl(product.heroImage)}
                    alt={`${product.name} - ${product.category}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#E8F5E9] text-sm line-clamp-2">
                    {product.name}
                  </h4>
                  {product.subtitle && (
                    <p className="text-xs text-[#80996F] mt-1">
                      {product.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-[#80996F] mt-1">
                    MOQ: {product.moq.value} {product.moq.unit}
                  </p>
                </div>
              </div>
            </section>

            {/* Quantity Field - Requirements: 5.2, 5.3 */}
            <div>
              <label
                htmlFor="rfq-quantity"
                className="block text-xs font-semibold text-[#B0D4B8] mb-2 uppercase tracking-wider"
              >
                {translations.fields.quantity}
                <span className="text-[#DC2626] ml-1" aria-label="required">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="rfq-quantity"
                  type="number"
                  min={product.moq.value}
                  step={product.moq.value}
                  value={formData.products[0].quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                  onBlur={() => handleBlur('products.0.quantity')}
                  className={cn(
                    'flex-1 px-4 py-3 min-h-[44px]',
                    'rounded-xl border text-base text-[#E8F5E9]',
                    'placeholder:text-[#80996F]',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1410]',
                    'bg-[rgba(26,40,32,0.6)] backdrop-blur-[12px]',
                    errors['products.0.quantity'] && touchedFields.has('products.0.quantity')
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                      : 'border-[rgba(255,255,255,0.1)] focus:border-[rgba(255,255,255,0.2)] focus:ring-[#A89858] hover:border-[rgba(255,255,255,0.2)]'
                  )}
                  aria-label={`${translations.fields.quantity} for ${product.name}`}
                  required
                />
                <span className="text-sm text-[#B0D4B8] whitespace-nowrap">{product.moq.unit}</span>
              </div>
              {errors['products.0.quantity'] && touchedFields.has('products.0.quantity') && (
                <p className="mt-2 text-sm text-[#DC2626] flex items-center gap-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors['products.0.quantity']}
                </p>
              )}
              <p className="mt-2 text-xs text-[#80996F]">
                MOQ: {product.moq.value} {product.moq.unit}
              </p>
            </div>

            {/* Incoterm Field - Requirements: 5.2 */}
            <SelectDark
              label={translations.fields.incoterm}
              placeholder={translations.fields.incotermPlaceholder}
              options={incotermOptions}
              value={formData.delivery.incoterm}
              onChange={(value) => handleDeliveryChange('incoterm', value as string)}
            />

            {/* Destination Field - Requirements: 5.2, 5.3 */}
            <InputDark
              label={translations.fields.destination}
              placeholder={translations.fields.destinationPlaceholder}
              value={formData.delivery.location}
              onChange={(e) => handleDeliveryChange('location', e.target.value)}
              onBlur={() => handleBlur('delivery.location')}
              error={touchedFields.has('delivery.location') ? errors['delivery.location'] : undefined}
              required
            />

            {/* Email Field - Requirements: 5.2, 5.3 */}
            <InputDark
              label={translations.fields.email}
              type="email"
              placeholder={translations.fields.emailPlaceholder}
              value={formData.contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              onBlur={() => handleBlur('contact.email')}
              error={touchedFields.has('contact.email') ? errors['contact.email'] : undefined}
              required
            />

            {/* Company Field - Requirements: 5.2, 5.3 */}
            <InputDark
              label={translations.fields.company}
              placeholder={translations.fields.companyPlaceholder}
              value={formData.contact.company}
              onChange={(e) => handleContactChange('company', e.target.value)}
              onBlur={() => handleBlur('contact.company')}
              error={touchedFields.has('contact.company') ? errors['contact.company'] : undefined}
              required
            />

            {/* Notes Field - Requirements: 5.2 */}
            <div>
              <label
                htmlFor="rfq-notes"
                className="block text-xs font-semibold text-[#B0D4B8] mb-2 uppercase tracking-wider"
              >
                {translations.fields.notes}
              </label>
              <textarea
                id="rfq-notes"
                rows={4}
                placeholder={translations.fields.notesPlaceholder}
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className={cn(
                  'w-full px-4 py-3 min-h-[44px]',
                  'rounded-xl border text-base text-[#E8F5E9]',
                  'placeholder:text-[#80996F]',
                  'transition-all duration-200 resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1410]',
                  'bg-[rgba(26,40,32,0.6)] backdrop-blur-[12px]',
                  'border-[rgba(255,255,255,0.1)] focus:border-[rgba(255,255,255,0.2)] focus:ring-[#A89858] hover:border-[rgba(255,255,255,0.2)]'
                )}
              />
            </div>

            {/* Trust Elements - Requirements: 5.5 */}
            <div className="bg-[rgba(74,154,98,0.1)] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#B0D4B8]">
                <svg className="w-5 h-5 text-[#4A9A62] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{translations.trustElements.response24h}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#B0D4B8]">
                <svg className="w-5 h-5 text-[#4A9A62] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span>{translations.trustElements.ndaAvailable}</span>
              </div>
            </div>

            {/* Submit Button - Requirements: 5.6 */}
            <ButtonDark
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting || submitSuccess}
              className="w-full"
            >
              {isSubmitting ? translations.submitting : translations.submit}
            </ButtonDark>
          </form>
        </div>
      </div>
    </>
  );
};
