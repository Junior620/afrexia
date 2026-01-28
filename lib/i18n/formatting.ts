import { Locale } from '@/types';

/**
 * Locale-specific formatting configurations
 */
const localeConfigs: Record<
  Locale,
  {
    dateFormat: Intl.DateTimeFormatOptions;
    numberFormat: Intl.NumberFormatOptions;
    currencyFormat: Intl.NumberFormatOptions;
    textDirection: 'ltr' | 'rtl';
  }
> = {
  fr: {
    dateFormat: { day: '2-digit', month: '2-digit', year: 'numeric' },
    numberFormat: { useGrouping: true },
    currencyFormat: { style: 'currency', currency: 'EUR' },
    textDirection: 'ltr',
  },
  en: {
    dateFormat: { month: '2-digit', day: '2-digit', year: 'numeric' },
    numberFormat: { useGrouping: true },
    currencyFormat: { style: 'currency', currency: 'USD' },
    textDirection: 'ltr',
  },
  es: {
    dateFormat: { day: '2-digit', month: '2-digit', year: 'numeric' },
    numberFormat: { useGrouping: true },
    currencyFormat: { style: 'currency', currency: 'EUR' },
    textDirection: 'ltr',
  },
  de: {
    dateFormat: { day: '2-digit', month: '2-digit', year: 'numeric' },
    numberFormat: { useGrouping: true },
    currencyFormat: { style: 'currency', currency: 'EUR' },
    textDirection: 'ltr',
  },
  ru: {
    dateFormat: { day: '2-digit', month: '2-digit', year: 'numeric' },
    numberFormat: { useGrouping: true },
    currencyFormat: { style: 'currency', currency: 'RUB' },
    textDirection: 'ltr',
  },
};

/**
 * Format a date according to locale conventions
 * @param date - The date to format
 * @param locale - The locale to use for formatting
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale: Locale): string {
  const config = localeConfigs[locale];
  return new Intl.DateTimeFormat(locale, config.dateFormat).format(date);
}

/**
 * Format a number according to locale conventions
 * @param number - The number to format
 * @param locale - The locale to use for formatting
 * @returns Formatted number string
 */
export function formatNumber(number: number, locale: Locale): string {
  const config = localeConfigs[locale];
  return new Intl.NumberFormat(locale, config.numberFormat).format(number);
}

/**
 * Format a currency value according to locale conventions
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting
 * @param currency - Optional currency code (defaults to locale's default currency)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: Locale,
  currency?: string
): string {
  const config = localeConfigs[locale];
  const currencyOptions = currency
    ? { ...config.currencyFormat, currency }
    : config.currencyFormat;
  return new Intl.NumberFormat(locale, currencyOptions).format(amount);
}

/**
 * Get the text direction for a locale
 * @param locale - The locale to check
 * @returns Text direction ('ltr' or 'rtl')
 */
export function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  return localeConfigs[locale].textDirection;
}
