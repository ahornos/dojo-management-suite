/**
 * @file i18n-locale.ts
 * @description Maps the active i18next language onto BCP 47 tags used by `Intl`.
 */

/**
 * Resolves a date/number locale. English uses US order (`MM/DD/YYYY`);
 * Spanish and Catalan use European order (`DD/MM/YYYY`).
 *
 * @param {string} language - i18next language (`en`, `es`, `ca`, or a regional tag).
 * @returns {string} BCP 47 locale tag.
 */
export function localeTagFromLanguage(language: string): string {
  const base = language.split('-')[0]?.toLowerCase() ?? 'es';
  if (base === 'en') {
    return 'en-US';
  }
  if (base === 'ca') {
    return 'ca-ES';
  }
  return 'es-ES';
}
