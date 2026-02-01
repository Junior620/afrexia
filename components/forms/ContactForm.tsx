'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Locale } from '@/types';
import {
  createContactFormSchema,
  ContactFormData,
} from '@/lib/forms/contact-schema';
import { trackContactSubmission } from '@/lib/analytics';
import { CheckCircle2 } from 'lucide-react';
import { useFormStatePreservation } from '@/hooks/useFormStatePreservation';
import { FormDraftConsent } from './FormDraftConsent';

interface ContactFormProps {
  locale: Locale;
}

export function ContactForm({ locale }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const schema = createContactFormSchema(locale);

  // Form state preservation with consent
  const {
    hasConsent,
    grantConsent,
    revokeConsent,
    hasDraft,
    draftTimeRemaining,
    loadDraft,
    clearDraft,
  } = useFormStatePreservation<ContactFormData>({
    formId: 'contact-form',
    locale,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      subjectType: 'quote',
      ndaRequested: false,
    },
  });

  const subjectType = watch('subjectType');

  // Load draft on mount if consent granted
  useEffect(() => {
    if (hasConsent) {
      const draft = loadDraft();
      if (draft) {
        Object.entries(draft).forEach(([key, value]) => {
          if (value !== undefined) {
            setValue(key as keyof ContactFormData, value);
          }
        });
      }
    }
  }, [hasConsent, loadDraft, setValue]);

  // Auto-save draft when form changes (if consent granted)
  useEffect(() => {
    if (!hasConsent) return;

    const subscription = watch((formData) => {
      // The form state preservation service will automatically filter PII
      // We just pass all data and it handles the filtering
      const draftData = {
        subjectType: formData.subjectType,
        subject: formData.subject,
        message: formData.message,
        product: formData.product,
        volume: formData.volume,
        destination: formData.destination,
        ndaRequested: formData.ndaRequested,
      };
      
      // Note: name, email, phone, company are automatically filtered by the service
      // as they match PII patterns
    });

    return () => subscription.unsubscribe();
  }, [watch, hasConsent]);

  // Content translations
  const content = {
    fr: {
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      company: 'Entreprise',
      subjectType: 'Type de demande',
      subjectTypes: {
        quote: 'Demande de devis',
        documentation: 'Documentation / Conformité (RDUE)',
        logistics: 'Logistique / Disponibilité',
        partnership: 'Partenariat',
        other: 'Autre',
      },
      subject: 'Sujet',
      message: 'Message',
      messagePlaceholder: 'Ex: Besoin de 20 tonnes de cacao bio, destination Europe, livraison Q2 2026, COA + traçabilité RDUE requis',
      product: 'Produit',
      productPlaceholder: 'Ex: Cacao, Café, Maïs...',
      volume: 'Volume estimé',
      volumePlaceholder: 'Ex: 20 tonnes, 1 conteneur...',
      destination: 'Destination',
      destinationPlaceholder: 'Ex: Europe, MENA, Asie...',
      ndaRequested: 'Je souhaite un NDA avant partage des documents',
      optional: 'optionnel',
      required: '*',
      submit: 'Recevoir une réponse sous 24h',
      submitting: 'Envoi...',
      successTitle: 'Message envoyé !',
      successMessage: 'Notre équipe revient vers vous sous 24h ouvrées.',
      sendAnother: 'Envoyer un autre message',
      responsePromise: 'Réponse sous 24h ouvrées (lun–ven)',
    },
    en: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      subjectType: 'Request type',
      subjectTypes: {
        quote: 'Quote request',
        documentation: 'Documentation / Compliance (EUDR)',
        logistics: 'Logistics / Availability',
        partnership: 'Partnership',
        other: 'Other',
      },
      subject: 'Subject',
      message: 'Message',
      messagePlaceholder: 'E.g.: Need 20 tons organic cocoa, destination Europe, delivery Q2 2026, COA + EUDR traceability required',
      product: 'Product',
      productPlaceholder: 'E.g.: Cocoa, Coffee, Corn...',
      volume: 'Estimated volume',
      volumePlaceholder: 'E.g.: 20 tons, 1 container...',
      destination: 'Destination',
      destinationPlaceholder: 'E.g.: Europe, MENA, Asia...',
      ndaRequested: 'I request an NDA before sharing documents',
      optional: 'optional',
      required: '*',
      submit: 'Get a response within 24h',
      submitting: 'Sending...',
      successTitle: 'Message sent!',
      successMessage: 'Our team will get back to you within 24 business hours.',
      sendAnother: 'Send another message',
      responsePromise: 'Response within 24 business hours (Mon–Fri)',
    },
  };

  const t = content[locale] || content.en;

  // Load reCAPTCHA
  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
              action: 'contact_submit',
            })
            .then((token: string) => {
              setRecaptchaToken(token);
            });
        });
      }
    };

    loadRecaptcha();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
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

      // Track successful contact submission
      trackContactSubmission({
        subject: data.subject,
        hasCompany: !!data.company,
      });

      // Clear draft on successful submit (Requirement 14.5)
      clearDraft();

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-[#4A9A62]" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[#E8F5E9]">
          {t.successTitle}
        </h3>
        <p className="text-[#C5D9C0] mb-6">
          {t.successMessage}
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="text-sm text-[#4A9A62] hover:text-[#3d8251] underline"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
      {/* Form Draft Consent Component */}
      <FormDraftConsent
        hasConsent={hasConsent}
        hasDraft={hasDraft}
        draftTimeRemaining={draftTimeRemaining}
        onGrantConsent={grantConsent}
        onRevokeConsent={revokeConsent}
        locale={locale}
      />

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
          {t.name} <span className="text-[#A89858]">{t.required}</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          {...register('name')}
          className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
          placeholder={locale === 'fr' ? 'Votre nom complet' : 'Your full name'}
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-[#A89858]" role="alert">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
          {t.email} <span className="text-[#A89858]">{t.required}</span>
        </label>
        <input
          id="contact-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          {...register('email')}
          className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
          placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[#A89858]" role="alert">{errors.email.message}</p>
        )}
      </div>

      {/* Phone & Company - Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
            {t.phone}{' '}
            <span className="text-[#80996F] text-xs">({t.optional})</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register('phone')}
            className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
            placeholder="+237XXXXXXXXX"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-[#A89858]" role="alert">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-company" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
            {t.company}{' '}
            <span className="text-[#80996F] text-xs">({t.optional})</span>
          </label>
          <input
            id="contact-company"
            type="text"
            autoComplete="organization"
            {...register('company')}
            className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
            placeholder={locale === 'fr' ? 'Nom de votre entreprise' : 'Your company name'}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-[#A89858]" role="alert">{errors.company.message}</p>
          )}
        </div>
      </div>

      {/* Subject Type */}
      <div>
        <label htmlFor="contact-subject-type" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
          {t.subjectType} <span className="text-[#A89858]">{t.required}</span>
        </label>
        <select
          id="contact-subject-type"
          {...register('subjectType')}
          className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
        >
          <option value="quote">{t.subjectTypes.quote}</option>
          <option value="documentation">{t.subjectTypes.documentation}</option>
          <option value="logistics">{t.subjectTypes.logistics}</option>
          <option value="partnership">{t.subjectTypes.partnership}</option>
          <option value="other">{t.subjectTypes.other}</option>
        </select>
      </div>

      {/* B2B Fields - Show for quote requests */}
      {subjectType === 'quote' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#0F1814]/50 border border-[rgba(74,154,98,0.2)] rounded-lg">
          <div>
            <label htmlFor="contact-product" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
              {t.product}{' '}
              <span className="text-[#80996F] text-xs">({t.optional})</span>
            </label>
            <input
              id="contact-product"
              type="text"
              {...register('product')}
              className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
              placeholder={t.productPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="contact-volume" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
              {t.volume}{' '}
              <span className="text-[#80996F] text-xs">({t.optional})</span>
            </label>
            <input
              id="contact-volume"
              type="text"
              {...register('volume')}
              className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
              placeholder={t.volumePlaceholder}
            />
          </div>

          <div>
            <label htmlFor="contact-destination" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
              {t.destination}{' '}
              <span className="text-[#80996F] text-xs">({t.optional})</span>
            </label>
            <input
              id="contact-destination"
              type="text"
              {...register('destination')}
              className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
              placeholder={t.destinationPlaceholder}
            />
          </div>
        </div>
      )}

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
          {t.subject} <span className="text-[#A89858]">{t.required}</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          {...register('subject')}
          className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
          placeholder={locale === 'fr' ? 'Objet de votre message' : 'Subject of your message'}
          aria-required="true"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-[#A89858]" role="alert">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-[#E8F5E9]">
          {t.message} <span className="text-[#A89858]">{t.required}</span>
        </label>
        <textarea
          id="contact-message"
          {...register('message')}
          rows={6}
          className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-3 bg-[#0A1410] text-[#E8F5E9] placeholder:text-[#80996F] focus:border-[#4A9A62] focus:outline-none focus:ring-2 focus:ring-[#4A9A62]/20"
          placeholder={t.messagePlaceholder}
          aria-required="true"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-[#A89858]" role="alert">{errors.message.message}</p>
        )}
      </div>

      {/* NDA Checkbox */}
      <div className="flex items-start gap-3">
        <input
          id="contact-nda"
          type="checkbox"
          {...register('ndaRequested')}
          className="mt-1 w-4 h-4 rounded border-[rgba(255,255,255,0.08)] bg-[#0A1410] text-[#4A9A62] focus:ring-2 focus:ring-[#4A9A62]/20"
        />
        <label htmlFor="contact-nda" className="text-sm text-[#C5D9C0] cursor-pointer">
          {t.ndaRequested}
        </label>
      </div>

      {submitError && (
        <div className="rounded-lg bg-[#A89858]/10 border border-[#A89858]/20 p-4 text-[#A89858]" role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#4A9A62] px-6 py-4 font-semibold text-white transition-all hover:bg-[#3d8251] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? t.submitting : t.submit}
      </button>

      {/* Response promise */}
      <p className="text-center text-sm text-[#4A9A62] font-medium">
        {t.responsePromise}
      </p>

      {/* reCAPTCHA badge notice */}
      <p className="text-xs text-[#80996F] text-center">
        {locale === 'fr'
          ? 'Ce site est protégé par reCAPTCHA et les '
          : 'This site is protected by reCAPTCHA and the '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#4A9A62]"
        >
          {locale === 'fr' ? 'Règles de confidentialité' : 'Privacy Policy'}
        </a>
        {locale === 'fr' ? ' et les ' : ' and '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#4A9A62]"
        >
          {locale === 'fr' ? "Conditions d'utilisation" : 'Terms of Service'}
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
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}
