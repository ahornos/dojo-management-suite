/**
 * @file localized-date.tsx
 * @description Formats calendar dates from the active i18next language.
 */

import { useTranslation } from 'react-i18next';
import { localeTagFromLanguage } from '@/lib/i18n-locale';

interface LocalizedDateProps {
  value: Date | string | null | undefined;
  className?: string;
  fallback?: string;
}

/**
 * Formats a date with numeric day/month/year in the active locale.
 *
 * @param {Date | string | null | undefined} value - Instant or ISO date.
 * @param {string} language - i18next language.
 * @param {string} [fallback='—'] - Shown when the value is missing or invalid.
 * @returns {string} Localized date, or the fallback.
 */
export function formatLocalizedDate(
  value: Date | string | null | undefined,
  language: string,
  fallback = '—',
): string {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return new Intl.DateTimeFormat(localeTagFromLanguage(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Renders a locale-aware calendar date (`DD/MM/YYYY` for `es`/`ca`, `MM/DD/YYYY` for `en`).
 *
 * @param {LocalizedDateProps} props - Value, optional class, and empty fallback.
 * @returns {JSX.Element} Formatted `<time>` element.
 */
export function LocalizedDate({ value, className, fallback = '—' }: LocalizedDateProps): JSX.Element {
  const { i18n } = useTranslation();
  const label = formatLocalizedDate(value, i18n.language, fallback);
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  const dateTime = date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : undefined;

  return (
    <time className={className} dateTime={dateTime}>
      {label}
    </time>
  );
}
