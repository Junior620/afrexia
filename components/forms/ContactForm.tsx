'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Locale } from '@/types';
import {
  contactFormSchema,
  ContactFormData,
} from '@/lib/forms/contact-schema';
import { trackContactSubmission } from '@/lib/analytics';

interface ContactFormProps {
  locale: Locale;
}

export function ContactForm({ locale }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  });

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
      <div className="rounded-lg bg-success-light p-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-success-dark">
          {locale === 'fr' ? 'Message envoyé !' : 'Message Sent!'}
        </h3>
        <p className="text-success-dark">
          {locale === 'fr'
            ? 'Nous vous répondrons dans les plus brefs délais.'
            : "We'll get back to you as soon as possible."}
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 text-sm text-success-dark underline hover:text-success"
        >
          {locale === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Nom' : 'Name'}{' '}
          <span className="text-destructive">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          {...register('name')}
          className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={locale === 'fr' ? 'Votre nom complet' : 'Your full name'}
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1 text-sm text-destructive" role="alert">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          {...register('email')}
          className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1 text-sm text-destructive" role="alert">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Téléphone' : 'Phone'}{' '}
          <span className="text-muted-foreground text-xs">
            ({locale === 'fr' ? 'optionnel' : 'optional'})
          </span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="+1234567890"
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
        />
        {errors.phone && (
          <p id="contact-phone-error" className="mt-1 text-sm text-destructive" role="alert">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-company" className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Entreprise' : 'Company'}{' '}
          <span className="text-muted-foreground text-xs">
            ({locale === 'fr' ? 'optionnel' : 'optional'})
          </span>
        </label>
        <input
          id="contact-company"
          type="text"
          autoComplete="organization"
          {...register('company')}
          className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={
            locale === 'fr' ? 'Nom de votre entreprise' : 'Your company name'
          }
          aria-invalid={errors.company ? 'true' : 'false'}
          aria-describedby={errors.company ? 'contact-company-error' : undefined}
        />
        {errors.company && (
          <p id="contact-company-error" className="mt-1 text-sm text-destructive" role="alert">{errors.company.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Sujet' : 'Subject'}{' '}
          <span className="text-destructive">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          {...register('subject')}
          className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={
            locale === 'fr'
              ? 'Objet de votre message'
              : 'Subject of your message'
          }
          aria-required="true"
          aria-invalid={errors.subject ? 'true' : 'false'}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="mt-1 text-sm text-destructive" role="alert">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          {...register('message')}
          rows={6}
          className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={
            locale === 'fr'
              ? 'Décrivez votre demande ou question...'
              : 'Describe your inquiry or question...'
          }
          aria-required="true"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 text-sm text-destructive" role="alert">{errors.message.message}</p>
        )}
      </div>

      {submitError && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive" role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={isSubmitting}
      >
        {isSubmitting
          ? locale === 'fr'
            ? 'Envoi...'
            : 'Sending...'
          : locale === 'fr'
            ? 'Envoyer le message'
            : 'Send Message'}
      </button>

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
          {locale === 'fr' ? 'Règles de confidentialité' : 'Privacy Policy'}
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
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}
