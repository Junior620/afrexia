'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { RFQFormData, RFQValidationErrors, ContactInfo, DeliveryInfo, RFQProduct } from '@/types/rfq';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { trackRFQSubmission } from '@/lib/analytics';
import { getThumbnailImageUrl } from '@/lib/sanity/image-url';

export interface RFQDrawerProps {
  selectedProducts: Product[];
  locale: string;
  translations: RFQDrawerTranslations;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RFQFormData) => Promise<void>;
  onRemoveProduct: (productId: string) => void;
}

export interface RFQDrawerTranslations {
  title: string;
  close: string;
  selectedProducts: string;
  addMore: string;
  removeProduct: string;
  contactInfo: string;
  orderDetails: string;
  additionalNotes: string;
  fields: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    company: string;
    companyPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    quantity: string;
    quantityPlaceholder: string;
    unit: string;
    deliveryLocation: string;
    deliveryLocationPlaceholder: string;
    incoterm: string;
    incotermPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
  };
  trustElements: {
    response24h: string;
    ndaAvailable: string;
    secureData: string;
  };
  submit: string;
  submitting: string;
  success: string;
  successMessage: string;
  error: string;
  errorMessage: string;
  emptyCart: string;
  emptyCartMessage: string;
}

/**
 * RFQDrawer Component
 * Slide-out drawer for submitting quote requests with pre-filled product information
 * 
 * Features:
 * - Slide from right animation (480px desktop, 100vw mobile)
 * - Selected products list with thumbnails and quantity inputs
 * - Contact form with validation
 * - Order details (delivery location, incoterm)
 * - Trust elements display
 * - Submit button with loading state
 * - Session storage persistence
 * 
 * Requirements: 4.1-4.12
 */
export const RFQDrawer: React.FC<RFQDrawerProps> = ({
  selectedProducts,
  locale,
  translations,
  isOpen,
  onClose,
  onSubmit,
  onRemoveProduct,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<RFQFormData>({
    products: [],
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
  });

  const [errors, setErrors] = useState<RFQValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Initialize product quantities from selected products
  useEffect(() => {
    const productQuantities: RFQProduct[] = selectedProducts.map((product) => {
      // Check if we already have a quantity for this product
      const existing = formData.products.find((p) => p.id === product.id);
      return {
        id: product.id,
        quantity: existing?.quantity || product.moq.value,
        unit: product.moq.unit,
      };
    });

    setFormData((prev) => ({
      ...prev,
      products: productQuantities,
    }));
  }, [selectedProducts]);

  // Load form data from session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('rfq-form-data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData((prev) => ({
            ...prev,
            contact: parsed.contact || prev.contact,
            delivery: parsed.delivery || prev.delivery,
            notes: parsed.notes || prev.notes,
          }));
        } catch (e) {
          console.error('Failed to parse saved RFQ data:', e);
        }
      }
    }
  }, []);

  // Save form data to session storage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('rfq-form-data', JSON.stringify({
        contact: formData.contact,
        delivery: formData.delivery,
        notes: formData.notes,
      }));
    }
  }, [formData.contact, formData.delivery, formData.notes]);

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

    // Contact validation
    if (!formData.contact.name.trim()) {
      newErrors['contact.name'] = translations.fields.name + ' is required';
    } else if (formData.contact.name.trim().length < 2) {
      newErrors['contact.name'] = 'Minimum 2 characters';
    }

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

    // Phone is optional but validate format if provided
    if (formData.contact.phone.trim() && !/^[\d\s\+\-\(\)]+$/.test(formData.contact.phone)) {
      newErrors['contact.phone'] = 'Invalid phone number';
    }

    // Delivery validation
    if (!formData.delivery.location.trim()) {
      newErrors['delivery.location'] = translations.fields.deliveryLocation + ' is required';
    } else if (formData.delivery.location.trim().length < 2) {
      newErrors['delivery.location'] = 'Minimum 2 characters';
    }

    // Product quantity validation
    formData.products.forEach((rfqProduct, index) => {
      const product = selectedProducts.find((p) => p.id === rfqProduct.id);
      if (product) {
        if (!rfqProduct.quantity || rfqProduct.quantity <= 0) {
          newErrors[`products.${index}.quantity`] = 'Quantity is required';
        } else if (rfqProduct.quantity < product.moq.value) {
          newErrors[`products.${index}.quantity`] = `Minimum ${product.moq.value} ${product.moq.unit}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = new Set([
      'contact.name',
      'contact.email',
      'contact.company',
      'contact.phone',
      'delivery.location',
      ...formData.products.map((_, i) => `products.${i}.quantity`),
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
      
      // Track RFQ submission
      trackRFQSubmission({
        productId: formData.products[0]?.id,
        productName: selectedProducts[0]?.name,
        quantity: formData.products.reduce((sum, p) => sum + p.quantity, 0),
        incoterm: formData.delivery.incoterm,
        country: formData.delivery.location,
      });
      
      // Clear form data from session storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('rfq-form-data');
      }

      // Close drawer after 2 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
        // Reset form
        setFormData({
          products: [],
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

  // Handle product quantity change
  const handleQuantityChange = (productId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, quantity } : p
      ),
    }));
  };

  // Incoterm options
  const incotermOptions: SelectOption[] = [
    { value: 'FOB', label: 'FOB - Free On Board' },
    { value: 'CIF', label: 'CIF - Cost, Insurance & Freight' },
    { value: 'DAP', label: 'DAP - Delivered At Place' },
    { value: 'EXW', label: 'EXW - Ex Works' },
    { value: 'FCA', label: 'FCA - Free Carrier' },
    { value: 'CPT', label: 'CPT - Carriage Paid To' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[200] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed right-0 top-0 h-full z-[201]',
          'bg-white shadow-2xl',
          'w-full md:w-[480px]',
          'overflow-y-auto',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rfq-drawer-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
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
          
          <h2 id="rfq-drawer-title" className="text-xl font-bold text-gray-900">
            {translations.title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Success Message */}
          {submitSuccess && (
            <div 
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
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
                  <h3 className="font-semibold text-green-900">{translations.success}</h3>
                  <p className="text-sm text-green-700 mt-1">{translations.successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div 
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
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
                  <h3 className="font-semibold text-red-900">{translations.error}</h3>
                  <p className="text-sm text-red-700 mt-1">{translations.errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Selected Products */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {translations.selectedProducts}
              </h3>

              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="font-semibold text-gray-900">{translations.emptyCart}</p>
                  <p className="text-sm text-gray-600 mt-1">{translations.emptyCartMessage}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((product, index) => {
                    const rfqProduct = formData.products.find((p) => p.id === product.id);
                    const quantityError = errors[`products.${index}.quantity`];
                    const isQuantityTouched = touchedFields.has(`products.${index}.quantity`);

                    return (
                      <div
                        key={product.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
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
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            MOQ: {product.moq.value} {product.moq.unit}
                          </p>

                          {/* Quantity Input */}
                          <div className="mt-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={product.moq.value}
                                step={product.moq.value}
                                value={rfqProduct?.quantity || product.moq.value}
                                onChange={(e) =>
                                  handleQuantityChange(product.id, parseInt(e.target.value) || 0)
                                }
                                onBlur={() => handleBlur(`products.${index}.quantity`)}
                                className={cn(
                                  'w-24 px-3 py-2 text-sm border-2 rounded',
                                  'focus:outline-none focus:ring-2 focus:ring-primary',
                                  quantityError && isQuantityTouched
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                )}
                                aria-label={`${translations.fields.quantity} for ${product.name}`}
                              />
                              <span className="text-sm text-gray-600">{product.moq.unit}</span>
                            </div>
                            {quantityError && isQuantityTouched && (
                              <p className="text-xs text-red-600 mt-1">{quantityError}</p>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => onRemoveProduct(product.id)}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label={`${translations.removeProduct} ${product.name}`}
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {translations.contactInfo}
              </h3>

              <div className="space-y-4">
                <Input
                  label={translations.fields.name}
                  placeholder={translations.fields.namePlaceholder}
                  value={formData.contact.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  onBlur={() => handleBlur('contact.name')}
                  error={touchedFields.has('contact.name') ? errors['contact.name'] : undefined}
                  required
                />

                <Input
                  label={translations.fields.email}
                  type="email"
                  placeholder={translations.fields.emailPlaceholder}
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  onBlur={() => handleBlur('contact.email')}
                  error={touchedFields.has('contact.email') ? errors['contact.email'] : undefined}
                  required
                />

                <Input
                  label={translations.fields.company}
                  placeholder={translations.fields.companyPlaceholder}
                  value={formData.contact.company}
                  onChange={(e) => handleContactChange('company', e.target.value)}
                  onBlur={() => handleBlur('contact.company')}
                  error={touchedFields.has('contact.company') ? errors['contact.company'] : undefined}
                  required
                />

                <Input
                  label={translations.fields.phone}
                  type="tel"
                  placeholder={translations.fields.phonePlaceholder}
                  value={formData.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  onBlur={() => handleBlur('contact.phone')}
                  error={touchedFields.has('contact.phone') ? errors['contact.phone'] : undefined}
                />
              </div>
            </section>

            {/* Order Details */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {translations.orderDetails}
              </h3>

              <div className="space-y-4">
                <Input
                  label={translations.fields.deliveryLocation}
                  placeholder={translations.fields.deliveryLocationPlaceholder}
                  value={formData.delivery.location}
                  onChange={(e) => handleDeliveryChange('location', e.target.value)}
                  onBlur={() => handleBlur('delivery.location')}
                  error={touchedFields.has('delivery.location') ? errors['delivery.location'] : undefined}
                  required
                />

                <Select
                  label={translations.fields.incoterm}
                  placeholder={translations.fields.incotermPlaceholder}
                  options={incotermOptions}
                  value={formData.delivery.incoterm}
                  onChange={(value) => handleDeliveryChange('incoterm', value as string)}
                />
              </div>
            </section>

            {/* Additional Notes */}
            <section>
              <label
                htmlFor="rfq-notes"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {translations.additionalNotes}
              </label>
              <textarea
                id="rfq-notes"
                rows={4}
                placeholder={translations.fields.notesPlaceholder}
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </section>

            {/* Trust Elements */}
            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{translations.trustElements.response24h}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span>{translations.trustElements.ndaAvailable}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{translations.trustElements.secureData}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting || submitSuccess || selectedProducts.length === 0}
              className="w-full"
            >
              {isSubmitting ? translations.submitting : translations.submit}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
