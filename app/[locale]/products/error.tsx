'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for product catalog page
 * Next.js 15 error.tsx file for handling errors in the products route
 */
export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'products-page',
      },
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Products page error:', error);
    }
  }, [error]);

  // Get locale from URL (fallback to 'en')
  const locale = typeof window !== 'undefined' 
    ? window.location.pathname.split('/')[1] || 'en'
    : 'en';

  // Localized error messages
  const messages: Record<string, { title: string; description: string; retry: string }> = {
    fr: {
      title: 'Erreur de chargement des produits',
      description: 'Une erreur est survenue lors du chargement du catalogue. Veuillez réessayer.',
      retry: 'Réessayer',
    },
    en: {
      title: 'Error loading products',
      description: 'An error occurred while loading the catalog. Please try again.',
      retry: 'Retry',
    },
    es: {
      title: 'Error al cargar productos',
      description: 'Se produjo un error al cargar el catálogo. Por favor, inténtelo de nuevo.',
      retry: 'Reintentar',
    },
    de: {
      title: 'Fehler beim Laden der Produkte',
      description: 'Beim Laden des Katalogs ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      retry: 'Erneut versuchen',
    },
    ru: {
      title: 'Ошибка загрузки продуктов',
      description: 'Произошла ошибка при загрузке каталога. Пожалуйста, попробуйте снова.',
      retry: 'Повторить',
    },
  };

  const t = messages[locale] || messages.en;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-100">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t.title}
        </h2>
        <p className="text-gray-600 mb-8">
          {t.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={reset}
            className="min-w-[140px]"
          >
            {t.retry}
          </Button>
        </div>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
