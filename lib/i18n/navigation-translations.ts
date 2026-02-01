/**
 * Navigation State Management Translations
 * 
 * Provides localized messages for:
 * - Error messages
 * - ARIA labels
 * - Placeholder text
 * - Debug messages
 * 
 * Requirements: 20.1, 20.2, 20.3, 20.4
 * from responsive-intelligent-navigation/requirements.md
 */

import { Locale } from '@/types';

/**
 * Navigation translation keys
 */
export interface NavigationTranslations {
  errors: {
    storageUnavailable: string;
    storageQuotaExceeded: string;
    stateCorrupted: string;
    restorationFailed: string;
    captureFailedGeneric: string;
    invalidStateKey: string;
    elementNotFound: string;
    focusRestorationFailed: string;
  };
  aria: {
    navigationRestored: string;
    scrollPositionRestored: string;
    sectionRestored: string;
    focusRestored: string;
    stateCapturing: string;
    layoutStabilizing: string;
  };
  placeholders: {
    loadingState: string;
    restoringPosition: string;
    capturingState: string;
  };
  debug: {
    stateCaptured: string;
    stateRestored: string;
    priorityResolved: string;
    layoutStabilized: string;
    focusCaptured: string;
    focusRestored: string;
    operationQueued: string;
    operationCompleted: string;
  };
}

/**
 * French translations for navigation state management
 */
const navigationTranslationsFr: NavigationTranslations = {
  errors: {
    storageUnavailable: 'Le stockage de session n\'est pas disponible. La restauration de l\'état de navigation est désactivée.',
    storageQuotaExceeded: 'Le quota de stockage est dépassé. Impossible de sauvegarder l\'état de navigation.',
    stateCorrupted: 'L\'état de navigation sauvegardé est corrompu. Retour à la position par défaut.',
    restorationFailed: 'Échec de la restauration de la position de défilement. Retour en haut de la page.',
    captureFailedGeneric: 'Impossible de capturer l\'état de navigation actuel.',
    invalidStateKey: 'Clé d\'état de navigation invalide.',
    elementNotFound: 'L\'élément cible n\'a pas été trouvé sur la page.',
    focusRestorationFailed: 'Impossible de restaurer le focus sur l\'élément précédent.',
  },
  aria: {
    navigationRestored: 'Navigation restaurée à la position précédente',
    scrollPositionRestored: 'Position de défilement restaurée',
    sectionRestored: 'Section restaurée',
    focusRestored: 'Focus restauré sur l\'élément précédent',
    stateCapturing: 'Capture de l\'état de navigation en cours',
    layoutStabilizing: 'Stabilisation de la mise en page en cours',
  },
  placeholders: {
    loadingState: 'Chargement de l\'état de navigation...',
    restoringPosition: 'Restauration de la position...',
    capturingState: 'Sauvegarde de la position...',
  },
  debug: {
    stateCaptured: 'État de navigation capturé',
    stateRestored: 'État de navigation restauré',
    priorityResolved: 'Priorité de restauration résolue',
    layoutStabilized: 'Mise en page stabilisée',
    focusCaptured: 'Focus capturé',
    focusRestored: 'Focus restauré',
    operationQueued: 'Opération mise en file d\'attente',
    operationCompleted: 'Opération terminée',
  },
};

/**
 * English translations for navigation state management
 */
const navigationTranslationsEn: NavigationTranslations = {
  errors: {
    storageUnavailable: 'Session storage is not available. Navigation state restoration is disabled.',
    storageQuotaExceeded: 'Storage quota exceeded. Unable to save navigation state.',
    stateCorrupted: 'Saved navigation state is corrupted. Returning to default position.',
    restorationFailed: 'Failed to restore scroll position. Returning to top of page.',
    captureFailedGeneric: 'Unable to capture current navigation state.',
    invalidStateKey: 'Invalid navigation state key.',
    elementNotFound: 'Target element was not found on the page.',
    focusRestorationFailed: 'Unable to restore focus to previous element.',
  },
  aria: {
    navigationRestored: 'Navigation restored to previous position',
    scrollPositionRestored: 'Scroll position restored',
    sectionRestored: 'Section restored',
    focusRestored: 'Focus restored to previous element',
    stateCapturing: 'Capturing navigation state',
    layoutStabilizing: 'Stabilizing layout',
  },
  placeholders: {
    loadingState: 'Loading navigation state...',
    restoringPosition: 'Restoring position...',
    capturingState: 'Saving position...',
  },
  debug: {
    stateCaptured: 'Navigation state captured',
    stateRestored: 'Navigation state restored',
    priorityResolved: 'Restoration priority resolved',
    layoutStabilized: 'Layout stabilized',
    focusCaptured: 'Focus captured',
    focusRestored: 'Focus restored',
    operationQueued: 'Operation queued',
    operationCompleted: 'Operation completed',
  },
};

/**
 * Spanish translations for navigation state management
 */
const navigationTranslationsEs: NavigationTranslations = {
  errors: {
    storageUnavailable: 'El almacenamiento de sesión no está disponible. La restauración del estado de navegación está deshabilitada.',
    storageQuotaExceeded: 'Cuota de almacenamiento excedida. No se puede guardar el estado de navegación.',
    stateCorrupted: 'El estado de navegación guardado está corrupto. Volviendo a la posición predeterminada.',
    restorationFailed: 'Error al restaurar la posición de desplazamiento. Volviendo al inicio de la página.',
    captureFailedGeneric: 'No se puede capturar el estado de navegación actual.',
    invalidStateKey: 'Clave de estado de navegación no válida.',
    elementNotFound: 'No se encontró el elemento objetivo en la página.',
    focusRestorationFailed: 'No se puede restaurar el foco en el elemento anterior.',
  },
  aria: {
    navigationRestored: 'Navegación restaurada a la posición anterior',
    scrollPositionRestored: 'Posición de desplazamiento restaurada',
    sectionRestored: 'Sección restaurada',
    focusRestored: 'Foco restaurado en el elemento anterior',
    stateCapturing: 'Capturando estado de navegación',
    layoutStabilizing: 'Estabilizando diseño',
  },
  placeholders: {
    loadingState: 'Cargando estado de navegación...',
    restoringPosition: 'Restaurando posición...',
    capturingState: 'Guardando posición...',
  },
  debug: {
    stateCaptured: 'Estado de navegación capturado',
    stateRestored: 'Estado de navegación restaurado',
    priorityResolved: 'Prioridad de restauración resuelta',
    layoutStabilized: 'Diseño estabilizado',
    focusCaptured: 'Foco capturado',
    focusRestored: 'Foco restaurado',
    operationQueued: 'Operación en cola',
    operationCompleted: 'Operación completada',
  },
};

/**
 * German translations for navigation state management
 */
const navigationTranslationsDe: NavigationTranslations = {
  errors: {
    storageUnavailable: 'Sitzungsspeicher ist nicht verfügbar. Die Wiederherstellung des Navigationsstatus ist deaktiviert.',
    storageQuotaExceeded: 'Speicherkontingent überschritten. Navigationsstatus kann nicht gespeichert werden.',
    stateCorrupted: 'Gespeicherter Navigationsstatus ist beschädigt. Rückkehr zur Standardposition.',
    restorationFailed: 'Wiederherstellung der Scrollposition fehlgeschlagen. Rückkehr zum Seitenanfang.',
    captureFailedGeneric: 'Aktueller Navigationsstatus kann nicht erfasst werden.',
    invalidStateKey: 'Ungültiger Navigationsstatusschlüssel.',
    elementNotFound: 'Zielelement wurde auf der Seite nicht gefunden.',
    focusRestorationFailed: 'Fokus kann nicht auf vorheriges Element wiederhergestellt werden.',
  },
  aria: {
    navigationRestored: 'Navigation zur vorherigen Position wiederhergestellt',
    scrollPositionRestored: 'Scrollposition wiederhergestellt',
    sectionRestored: 'Abschnitt wiederhergestellt',
    focusRestored: 'Fokus auf vorheriges Element wiederhergestellt',
    stateCapturing: 'Navigationsstatus wird erfasst',
    layoutStabilizing: 'Layout wird stabilisiert',
  },
  placeholders: {
    loadingState: 'Navigationsstatus wird geladen...',
    restoringPosition: 'Position wird wiederhergestellt...',
    capturingState: 'Position wird gespeichert...',
  },
  debug: {
    stateCaptured: 'Navigationsstatus erfasst',
    stateRestored: 'Navigationsstatus wiederhergestellt',
    priorityResolved: 'Wiederherstellungspriorität aufgelöst',
    layoutStabilized: 'Layout stabilisiert',
    focusCaptured: 'Fokus erfasst',
    focusRestored: 'Fokus wiederhergestellt',
    operationQueued: 'Operation in Warteschlange',
    operationCompleted: 'Operation abgeschlossen',
  },
};

/**
 * Russian translations for navigation state management
 */
const navigationTranslationsRu: NavigationTranslations = {
  errors: {
    storageUnavailable: 'Хранилище сеанса недоступно. Восстановление состояния навигации отключено.',
    storageQuotaExceeded: 'Превышена квота хранилища. Невозможно сохранить состояние навигации.',
    stateCorrupted: 'Сохраненное состояние навигации повреждено. Возврат к позиции по умолчанию.',
    restorationFailed: 'Не удалось восстановить позицию прокрутки. Возврат к началу страницы.',
    captureFailedGeneric: 'Невозможно захватить текущее состояние навигации.',
    invalidStateKey: 'Недопустимый ключ состояния навигации.',
    elementNotFound: 'Целевой элемент не найден на странице.',
    focusRestorationFailed: 'Невозможно восстановить фокус на предыдущем элементе.',
  },
  aria: {
    navigationRestored: 'Навигация восстановлена к предыдущей позиции',
    scrollPositionRestored: 'Позиция прокрутки восстановлена',
    sectionRestored: 'Раздел восстановлен',
    focusRestored: 'Фокус восстановлен на предыдущем элементе',
    stateCapturing: 'Захват состояния навигации',
    layoutStabilizing: 'Стабилизация макета',
  },
  placeholders: {
    loadingState: 'Загрузка состояния навигации...',
    restoringPosition: 'Восстановление позиции...',
    capturingState: 'Сохранение позиции...',
  },
  debug: {
    stateCaptured: 'Состояние навигации захвачено',
    stateRestored: 'Состояние навигации восстановлено',
    priorityResolved: 'Приоритет восстановления определен',
    layoutStabilized: 'Макет стабилизирован',
    focusCaptured: 'Фокус захвачен',
    focusRestored: 'Фокус восстановлен',
    operationQueued: 'Операция в очереди',
    operationCompleted: 'Операция завершена',
  },
};

/**
 * All navigation translations by locale
 */
const navigationTranslations: Record<Locale, NavigationTranslations> = {
  fr: navigationTranslationsFr,
  en: navigationTranslationsEn,
  es: navigationTranslationsEs,
  de: navigationTranslationsDe,
  ru: navigationTranslationsRu,
};

/**
 * Get navigation translations for a specific locale
 * 
 * @param locale - The locale to get translations for
 * @returns Navigation translations for the locale
 */
export function getNavigationTranslations(locale: Locale): NavigationTranslations {
  return navigationTranslations[locale] || navigationTranslations.fr;
}

/**
 * Get a specific navigation translation by key path
 * 
 * @param locale - The locale to use
 * @param key - The key path (e.g., 'errors.storageUnavailable')
 * @returns The translation string
 */
export function getNavigationTranslation(locale: Locale, key: string): string {
  const translations = getNavigationTranslations(locale);
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    console.warn(`Navigation translation key "${key}" not found for locale "${locale}"`);
    return key;
  }
  
  return value;
}

/**
 * Announce a message to screen readers
 * 
 * Creates a temporary live region to announce the message,
 * then removes it after the announcement is complete.
 * 
 * @param message - The message to announce
 * @param priority - The aria-live priority ('polite' or 'assertive')
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') {
    return;
  }

  // Create live region
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only'; // Visually hidden but accessible
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';

  // Add to document
  document.body.appendChild(liveRegion);

  // Set message (triggers announcement)
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
}

/**
 * Get locale from document or default to French
 * 
 * @returns Current locale
 */
export function getCurrentLocale(): Locale {
  if (typeof document === 'undefined') {
    return 'fr';
  }

  const htmlLang = document.documentElement.lang;
  
  // Extract locale from lang attribute (e.g., 'fr-FR' -> 'fr')
  const locale = htmlLang.split('-')[0].toLowerCase();
  
  // Validate locale
  const validLocales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
  if (validLocales.includes(locale as Locale)) {
    return locale as Locale;
  }
  
  return 'fr';
}
