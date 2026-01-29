'use client';

import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/Button';

interface CatalogErrorBoundaryProps {
  children: ReactNode;
  locale: string;
  fallback?: ReactNode;
}

interface CatalogErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  eventId?: string;
}

/**
 * Catalog-specific Error Boundary component
 * Provides user-friendly error messages and retry functionality for catalog page
 * Requirements: Task 24.1 - Error handling
 */
export class CatalogErrorBoundary extends Component<
  CatalogErrorBoundaryProps,
  CatalogErrorBoundaryState
> {
  constructor(props: CatalogErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CatalogErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Sentry with catalog-specific context
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        catalog: {
          locale: this.props.locale,
          page: 'product-catalog',
        },
      },
      tags: {
        errorBoundary: 'catalog',
        locale: this.props.locale,
      },
    });

    this.setState({ eventId });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Catalog Error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, eventId: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { locale } = this.props;

      // Localized error messages
      const messages: Record<string, { title: string; description: string; retry: string; report: string }> = {
        fr: {
          title: 'Erreur de chargement des produits',
          description: 'Une erreur est survenue lors du chargement du catalogue. Veuillez réessayer.',
          retry: 'Réessayer',
          report: 'Signaler le problème',
        },
        en: {
          title: 'Error loading products',
          description: 'An error occurred while loading the catalog. Please try again.',
          retry: 'Retry',
          report: 'Report Issue',
        },
        es: {
          title: 'Error al cargar productos',
          description: 'Se produjo un error al cargar el catálogo. Por favor, inténtelo de nuevo.',
          retry: 'Reintentar',
          report: 'Reportar problema',
        },
        de: {
          title: 'Fehler beim Laden der Produkte',
          description: 'Beim Laden des Katalogs ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
          retry: 'Erneut versuchen',
          report: 'Problem melden',
        },
        ru: {
          title: 'Ошибка загрузки продуктов',
          description: 'Произошла ошибка при загрузке каталога. Пожалуйста, попробуйте снова.',
          retry: 'Повторить',
          report: 'Сообщить о проблеме',
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
                onClick={this.handleRetry}
                className="min-w-[140px]"
              >
                {t.retry}
              </Button>

              {this.state.eventId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    Sentry.showReportDialog({
                      eventId: this.state.eventId,
                    });
                  }}
                  className="min-w-[140px]"
                >
                  {t.report}
                </Button>
              )}
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
