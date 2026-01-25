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
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-green-900">
          {locale === 'fr' ? 'Message envoyé !' : 'Message Sent!'}
        </h3>
        <p className="text-green-800">
          {locale === 'fr'
            ? 'Nous vous répondrons dans les plus brefs délais.'
            : "We'll get back to you as soon as possible."}
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 text-sm text-green-700 underline hover:text-green-900"
        >
          {locale === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Nom' : 'Name'}{' '}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={locale === 'fr' ? 'Votre nom complet' : 'Your full name'}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Téléphone' : 'Phone'}{' '}
          <span className="text-gray-400 text-xs">
            ({locale === 'fr' ? 'optionnel' : 'optional'})
          </span>
        </label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="+1234567890"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Entreprise' : 'Company'}{' '}
          <span className="text-gray-400 text-xs">
            ({locale === 'fr' ? 'optionnel' : 'optional'})
          </span>
        </label>
        <input
          type="text"
          {...register('company')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={
            locale === 'fr' ? 'Nom de votre entreprise' : 'Your company name'
          }
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {locale === 'fr' ? 'Sujet' : 'Subject'}{' '}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('subject')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={
            locale === 'fr'
              ? 'Objet de votre message'
              : 'Subject of your message'
          }
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('message')}
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={
            locale === 'fr'
              ? 'Décrivez votre demande ou question...'
              : 'Describe your inquiry or question...'
          }
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {submitError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
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
      <p className="text-xs text-gray-500">
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
