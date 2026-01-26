'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Locale } from '@/types';
import {
  rfqFormSchema,
  RFQFormData,
  quantityUnits,
  incoterms,
} from '@/lib/forms/rfq-schema';
import { saveDraft, loadDraft, clearDraft } from '@/lib/forms/draft-storage';
import { trackRFQSubmission } from '@/lib/analytics';

type Step = 'product' | 'logistics' | 'contact';

interface Product {
  _id: string;
  name: {
    fr: string;
    en: string;
  };
  category: string;
}

interface RFQFormProps {
  products: Product[];
  locale: Locale;
  preselectedProductId?: string;
}

export function RFQForm({
  products,
  locale,
  preselectedProductId,
}: RFQFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>('product');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const steps: Step[] = ['product', 'logistics', 'contact'];
  const currentStepIndex = steps.indexOf(currentStep);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqFormSchema),
    mode: 'onBlur',
    defaultValues: {
      productId: preselectedProductId || '',
      quantityUnit: 'mt',
      incoterm: 'FOB',
      gdprConsent: false,
    },
  });

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof RFQFormData, value);
        }
      });
    }
  }, [setValue]);

  // Auto-save draft (excluding sensitive fields)
  useEffect(() => {
    const subscription = watch((formData) => {
      const draftData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
        productId: formData.productId,
        quantity: formData.quantity,
        quantityUnit: formData.quantityUnit,
        incoterm: formData.incoterm,
        destinationPort: formData.destinationPort,
        targetDate: formData.targetDate,
      };
      saveDraft(draftData);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load reCAPTCHA
  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
              action: 'rfq_submit',
            })
            .then((token: string) => {
              setRecaptchaToken(token);
            });
        });
      }
    };

    loadRecaptcha();
  }, []);

  const nextStep = async () => {
    let fieldsToValidate: (keyof RFQFormData)[] = [];

    if (currentStep === 'product') {
      fieldsToValidate = ['productId', 'quantity', 'quantityUnit'];
    } else if (currentStep === 'logistics') {
      fieldsToValidate = [
        'incoterm',
        'destinationPort',
        'targetDate',
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex]);
      }
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const onSubmit = async (data: RFQFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
          locale,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit form');
      }

      // Track successful RFQ submission
      const selectedProduct = products.find(p => p._id === data.productId);
      trackRFQSubmission({
        productId: data.productId,
        productName: selectedProduct ? selectedProduct.name[locale] : undefined,
        quantity: data.quantity,
        incoterm: data.incoterm,
        country: data.country,
      });

      setSubmitSuccess(true);
      clearDraft();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearDraft = () => {
    if (confirm(locale === 'fr' ? 'Effacer le brouillon ?' : 'Clear draft?')) {
      clearDraft();
      window.location.reload();
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-lg bg-success-light p-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-success-dark">
          {locale === 'fr' ? 'Demande envoyée !' : 'Request Sent!'}
        </h3>
        <p className="text-success-dark">
          {locale === 'fr'
            ? 'Nous vous contacterons sous peu avec un devis personnalisé.'
            : "We'll contact you shortly with a customized quote."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Request for quote form">
      {/* Progress Indicator */}
      <div className="mb-8" role="progressbar" aria-valuenow={currentStepIndex + 1} aria-valuemin={1} aria-valuemax={3} aria-label="Form progress">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    index <= currentStepIndex
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  aria-current={index === currentStepIndex ? 'step' : undefined}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    index === currentStepIndex
                      ? 'font-bold text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {locale === 'fr'
                    ? step === 'product'
                      ? 'Produit'
                      : step === 'logistics'
                        ? 'Livraison'
                        : 'Contact'
                    : step === 'product'
                      ? 'Product'
                      : step === 'logistics'
                        ? 'Logistics'
                        : 'Contact'}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-1 flex-1 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Product Selection */}
      {currentStep === 'product' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">
            {locale === 'fr' ? 'Produit & Quantité' : 'Product & Quantity'}
          </h3>

          <div>
            <label htmlFor="rfq-product" className="mb-1 block text-sm font-medium">
              {locale === 'fr' ? 'Produit' : 'Product'}{' '}
              <span className="text-destructive">*</span>
            </label>
            <select
              id="rfq-product"
              {...register('productId')}
              className="w-full rounded-lg border border-border px-4 py-2"
              aria-required="true"
              aria-invalid={errors.productId ? 'true' : 'false'}
              aria-describedby={errors.productId ? 'rfq-product-error' : undefined}
            >
              <option value="">
                {locale === 'fr'
                  ? 'Sélectionner un produit'
                  : 'Select a product'}
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name[locale]}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p id="rfq-product-error" className="mt-1 text-sm text-destructive" role="alert">
                {errors.productId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rfq-quantity" className="mb-1 block text-sm font-medium">
                {locale === 'fr' ? 'Quantité' : 'Quantity'}{' '}
                <span className="text-destructive">*</span>
              </label>
              <input
                id="rfq-quantity"
                type="number"
                inputMode="decimal"
                step="0.01"
                {...register('quantity', { valueAsNumber: true })}
                className="w-full rounded-lg border border-border px-4 py-2"
                placeholder={locale === 'fr' ? 'Entrez la quantité' : 'Enter quantity'}
                aria-required="true"
                aria-invalid={errors.quantity ? 'true' : 'false'}
                aria-describedby={errors.quantity ? 'rfq-quantity-error' : undefined}
              />
              {errors.quantity && (
                <p id="rfq-quantity-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="rfq-quantity-unit" className="mb-1 block text-sm font-medium">
                {locale === 'fr' ? 'Unité' : 'Unit'}{' '}
                <span className="text-destructive">*</span>
              </label>
              <select
                id="rfq-quantity-unit"
                {...register('quantityUnit')}
                className="w-full rounded-lg border border-border px-4 py-2"
                aria-required="true"
                aria-invalid={errors.quantityUnit ? 'true' : 'false'}
                aria-describedby={errors.quantityUnit ? 'rfq-quantity-unit-error' : undefined}
              >
                {quantityUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {locale === 'fr'
                      ? unit === 'kg'
                        ? 'Kilogrammes (kg)'
                        : unit === 'mt'
                          ? 'Tonnes Métriques (MT)'
                          : 'Conteneur(s)'
                      : unit === 'kg'
                        ? 'Kilograms (kg)'
                        : unit === 'mt'
                          ? 'Metric Tons (MT)'
                          : 'Container(s)'}
                  </option>
                ))}
              </select>
              {errors.quantityUnit && (
                <p id="rfq-quantity-unit-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.quantityUnit.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {locale === 'fr' ? 'Suivant' : 'Next'}
          </button>
        </div>
      )}

      {/* Step 2: Logistics */}
      {currentStep === 'logistics' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">
            {locale === 'fr' ? 'Détails de Livraison' : 'Delivery Details'}
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Incoterm <span className="text-destructive">*</span>
            </label>
            <select
              {...register('incoterm')}
              className="w-full rounded-lg border border-border px-4 py-2"
            >
              {incoterms.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
            {errors.incoterm && (
              <p className="mt-1 text-sm text-destructive">
                {errors.incoterm.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {locale === 'fr' ? 'Port de Destination' : 'Destination Port'}{' '}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              {...register('destinationPort')}
              className="w-full rounded-lg border border-border px-4 py-2"
              placeholder={
                locale === 'fr'
                  ? 'ex: Port de Rotterdam'
                  : 'e.g., Port of Rotterdam'
              }
            />
            {errors.destinationPort && (
              <p className="mt-1 text-sm text-destructive">
                {errors.destinationPort.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {locale === 'fr'
                ? 'Date de Livraison Souhaitée'
                : 'Target Delivery Date'}{' '}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              {...register('targetDate')}
              className="w-full rounded-lg border border-border px-4 py-2"
            />
            {errors.targetDate && (
              <p className="mt-1 text-sm text-destructive">
                {errors.targetDate.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-light"
            >
              {locale === 'fr' ? 'Retour' : 'Back'}
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {locale === 'fr' ? 'Suivant' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Information */}
      {currentStep === 'contact' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">
            {locale === 'fr' ? 'Vos Informations' : 'Your Information'}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {locale === 'fr' ? 'Prénom' : 'First Name'}{' '}
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                autoComplete="given-name"
                {...register('firstName')}
                className="w-full rounded-lg border border-border px-4 py-2"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                {locale === 'fr' ? 'Nom' : 'Last Name'}{' '}
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                autoComplete="family-name"
                {...register('lastName')}
                className="w-full rounded-lg border border-border px-4 py-2"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              {...register('email')}
              className="w-full rounded-lg border border-border px-4 py-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {locale === 'fr' ? 'Téléphone' : 'Phone'}{' '}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...register('phone')}
              className="w-full rounded-lg border border-border px-4 py-2"
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {locale === 'fr' ? 'Entreprise' : 'Company'}{' '}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              autoComplete="organization"
              {...register('company')}
              className="w-full rounded-lg border border-border px-4 py-2"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-destructive">
                {errors.company.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {locale === 'fr' ? 'Pays' : 'Country'}{' '}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              autoComplete="country-name"
              {...register('country')}
              className="w-full rounded-lg border border-border px-4 py-2"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-destructive">
                {errors.country.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {locale === 'fr'
                ? 'Exigences Supplémentaires'
                : 'Additional Requirements'}
            </label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full rounded-lg border border-border px-4 py-2"
              placeholder={
                locale === 'fr'
                  ? 'Exigences spécifiques ou questions...'
                  : 'Any specific requirements or questions...'
              }
            />
            {errors.message && (
              <p className="mt-1 text-sm text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              {...register('gdprConsent')}
              className="mt-1 h-4 w-4"
            />
            <label className="ml-2 text-sm">
              {locale === 'fr'
                ? "J'accepte la politique de confidentialité et les conditions d'utilisation"
                : 'I accept the privacy policy and terms of service'}{' '}
              <span className="text-destructive">*</span>
            </label>
          </div>
          {errors.gdprConsent && (
            <p className="text-sm text-destructive">
              {errors.gdprConsent.message}
            </p>
          )}

          {submitError && (
            <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
              {submitError}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-light"
            >
              {locale === 'fr' ? 'Retour' : 'Back'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting
                ? locale === 'fr'
                  ? 'Envoi...'
                  : 'Submitting...'
                : locale === 'fr'
                  ? 'Soumettre'
                  : 'Submit'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearDraft}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {locale === 'fr' ? 'Effacer le brouillon' : 'Clear draft'}
          </button>
        </div>
      )}

      {/* reCAPTCHA badge notice */}
      <p className="text-xs text-muted-foreground">
        {locale === 'fr'
          ? 'Ce site est protégé par reCAPTCHA et les '
          : 'This site is protected by reCAPTCHA and the '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {locale === 'fr'
            ? 'Règles de confidentialité'
            : 'Privacy Policy'}
        </a>
        {locale === 'fr' ? ' et les ' : ' and '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {locale === 'fr'
            ? "Conditions d'utilisation"
            : 'Terms of Service'}
        </a>
        {locale === 'fr' ? " de Google s'appliquent." : ' apply.'}
      </p>
    </form>
  );
}

// Extend Window interface for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
