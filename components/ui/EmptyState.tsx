import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * EmptyState Component
 * Reusable empty state component for various scenarios
 * Requirements: Task 24.3 - Empty states
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('text-center py-12 px-4', className)}>
      {/* Icon */}
      {icon && (
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

/**
 * NoProductsFound Component
 * Empty state for when no products match filters
 * Requirements: Requirement 2.11
 */
interface NoProductsFoundProps {
  locale: string;
  hasActiveFilters: boolean;
  onClearFilters?: () => void;
}

export const NoProductsFound: React.FC<NoProductsFoundProps> = ({
  locale,
  hasActiveFilters,
  onClearFilters,
}) => {
  const messages: Record<string, { title: string; description: string; clearFilters: string }> = {
    fr: {
      title: 'Aucun produit trouvé',
      description: hasActiveFilters
        ? 'Aucun produit ne correspond à vos critères de recherche. Essayez d\'ajuster vos filtres.'
        : 'Aucun produit disponible pour le moment.',
      clearFilters: 'Effacer les filtres',
    },
    en: {
      title: 'No products found',
      description: hasActiveFilters
        ? 'No products match your search criteria. Try adjusting your filters.'
        : 'No products available at the moment.',
      clearFilters: 'Clear filters',
    },
    es: {
      title: 'No se encontraron productos',
      description: hasActiveFilters
        ? 'Ningún producto coincide con sus criterios de búsqueda. Intente ajustar sus filtros.'
        : 'No hay productos disponibles en este momento.',
      clearFilters: 'Borrar filtros',
    },
    de: {
      title: 'Keine Produkte gefunden',
      description: hasActiveFilters
        ? 'Keine Produkte entsprechen Ihren Suchkriterien. Versuchen Sie, Ihre Filter anzupassen.'
        : 'Derzeit sind keine Produkte verfügbar.',
      clearFilters: 'Filter löschen',
    },
    ru: {
      title: 'Продукты не найдены',
      description: hasActiveFilters
        ? 'Ни один продукт не соответствует вашим критериям поиска. Попробуйте изменить фильтры.'
        : 'В настоящее время нет доступных продуктов.',
      clearFilters: 'Очистить фильтры',
    },
  };

  const t = messages[locale] || messages.en;

  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      }
      title={t.title}
      description={t.description}
      action={hasActiveFilters && onClearFilters ? {
        label: t.clearFilters,
        onClick: onClearFilters,
      } : undefined}
    />
  );
};

/**
 * EmptyRFQCart Component
 * Empty state for RFQ cart
 */
interface EmptyRFQCartProps {
  locale: string;
  onClose?: () => void;
}

export const EmptyRFQCart: React.FC<EmptyRFQCartProps> = ({
  locale,
  onClose,
}) => {
  const messages: Record<string, { title: string; description: string; browse: string }> = {
    fr: {
      title: 'Panier vide',
      description: 'Ajoutez des produits à votre panier pour demander un devis.',
      browse: 'Parcourir les produits',
    },
    en: {
      title: 'Empty Cart',
      description: 'Add products to your cart to request a quote.',
      browse: 'Browse Products',
    },
    es: {
      title: 'Carrito vacío',
      description: 'Agregue productos a su carrito para solicitar una cotización.',
      browse: 'Explorar productos',
    },
    de: {
      title: 'Leerer Warenkorb',
      description: 'Fügen Sie Produkte zu Ihrem Warenkorb hinzu, um ein Angebot anzufordern.',
      browse: 'Produkte durchsuchen',
    },
    ru: {
      title: 'Пустая корзина',
      description: 'Добавьте продукты в корзину, чтобы запросить предложение.',
      browse: 'Просмотреть продукты',
    },
  };

  const t = messages[locale] || messages.en;

  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      }
      title={t.title}
      description={t.description}
      action={onClose ? {
        label: t.browse,
        onClick: onClose,
      } : undefined}
    />
  );
};

/**
 * NoSearchResults Component
 * Empty state for search with no results
 */
interface NoSearchResultsProps {
  locale: string;
  searchQuery: string;
  onClearSearch?: () => void;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  locale,
  searchQuery,
  onClearSearch,
}) => {
  const messages: Record<string, { title: string; description: string; clearSearch: string }> = {
    fr: {
      title: 'Aucun résultat',
      description: `Aucun produit ne correspond à "${searchQuery}". Essayez un autre terme de recherche.`,
      clearSearch: 'Effacer la recherche',
    },
    en: {
      title: 'No results',
      description: `No products match "${searchQuery}". Try a different search term.`,
      clearSearch: 'Clear search',
    },
    es: {
      title: 'Sin resultados',
      description: `Ningún producto coincide con "${searchQuery}". Intente con otro término de búsqueda.`,
      clearSearch: 'Borrar búsqueda',
    },
    de: {
      title: 'Keine Ergebnisse',
      description: `Keine Produkte entsprechen "${searchQuery}". Versuchen Sie einen anderen Suchbegriff.`,
      clearSearch: 'Suche löschen',
    },
    ru: {
      title: 'Нет результатов',
      description: `Ни один продукт не соответствует "${searchQuery}". Попробуйте другой поисковый запрос.`,
      clearSearch: 'Очистить поиск',
    },
  };

  const t = messages[locale] || messages.en;

  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title={t.title}
      description={t.description}
      action={onClearSearch ? {
        label: t.clearSearch,
        onClick: onClearSearch,
      } : undefined}
    />
  );
};
