/**
 * @file licenseDisplay.ts
 * @description Presentation helpers for affiliation-license rows (names, catalog, money).
 */

import { localeTagFromLanguage } from '@/lib/i18n-locale';
import type { Federation } from '../federations/types';
import type { AffiliationLicense } from './types';

/**
 * Holder display name: academic student profile first, then the login identity.
 *
 * @param {AffiliationLicense} license - List row.
 * @returns {string} `lastName, firstName`, or an empty string when unknown.
 */
export function licenseHolderName(license: AffiliationLicense): string {
  const student = license.student;
  const studentFirst = student?.firstName?.trim() ?? '';
  const studentLast = student?.lastName?.trim() ?? '';
  if (studentFirst || studentLast) {
    return [studentLast, studentFirst].filter(Boolean).join(', ');
  }
  const holder = license.holder;
  const holderFirst = holder?.firstName?.trim() ?? '';
  const holderLast = holder?.lastName?.trim() ?? '';
  if (holderFirst || holderLast) {
    return [holderLast, holderFirst].filter(Boolean).join(', ');
  }
  return '';
}

/**
 * Prefers the federation acronym, then the catalog name.
 *
 * @param {Federation | undefined} federation - Catalog row.
 * @returns {string} Short label, or an empty string when the catalog is missing.
 */
export function federationShortName(federation: Federation | undefined): string {
  const acronym = federation?.acronym?.trim();
  if (acronym) {
    return acronym;
  }
  return federation?.name?.trim() ?? '';
}

/**
 * Season currency from the federation catalog (defaults to EUR).
 *
 * @param {Federation | undefined} federation - Catalog row.
 * @param {string} seasonName - License season label.
 * @returns {string} ISO 4217 code.
 */
export function seasonCurrency(federation: Federation | undefined, seasonName: string): string {
  const seasons = federation?.seasons ?? [];
  const season =
    seasons.find((row) => row.seasonName === seasonName) ?? seasons.find((row) => row.isActive) ?? seasons[0];
  const code = season?.currency?.trim();
  return code || 'EUR';
}

/**
 * Formats a Decimal string as localized currency plus the ISO code.
 *
 * @param {string | undefined} amount - Already-scaled Decimal string.
 * @param {string} currency - ISO 4217 code.
 * @param {string} language - i18next language.
 * @returns {string} e.g. `25,00 € (EUR)`, or an empty string when amount is missing.
 */
export function formatLicenseAmount(amount: string | undefined, currency: string, language: string): string {
  if (!amount || amount.trim() === '') {
    return '';
  }
  const code = currency.trim() || 'EUR';
  const locale = localeTagFromLanguage(language);
  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
    return `${formatted} (${code})`;
  } catch {
    return `${amount} (${code})`;
  }
}
