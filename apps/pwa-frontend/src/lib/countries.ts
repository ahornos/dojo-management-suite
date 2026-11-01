/**
 * @file countries.ts
 * @description ISO 3166-1 alpha-2 catalog used by `CountrySelector`. Spain is first (default).
 */

/** ISO 3166-1 alpha-2 codes shown in country dropdowns. */
export const COUNTRY_CODES = [
  'ES',
  'AD',
  'AR',
  'AT',
  'AU',
  'BE',
  'BO',
  'BR',
  'CA',
  'CH',
  'CL',
  'CO',
  'CR',
  'CU',
  'CZ',
  'DE',
  'DK',
  'DO',
  'EC',
  'FI',
  'FR',
  'GB',
  'GR',
  'GT',
  'HN',
  'IE',
  'IT',
  'JP',
  'MA',
  'MX',
  'NL',
  'NO',
  'PA',
  'PE',
  'PL',
  'PT',
  'PY',
  'RO',
  'SE',
  'SV',
  'US',
  'UY',
  'VE',
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

/** Default academy / federation country. */
export const DEFAULT_COUNTRY: CountryCode = 'ES';

/**
 * @param {string | null | undefined} value - Raw country input.
 * @returns {string} Uppercase ISO code, or Spain when empty.
 */
export function normalizeCountry(value: string | null | undefined): string {
  const trimmed = value?.trim().toUpperCase() ?? '';
  return trimmed || DEFAULT_COUNTRY;
}
