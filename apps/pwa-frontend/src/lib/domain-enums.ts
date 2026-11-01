/**
 * @file domain-enums.ts
 * @description Frontend mirrors of Prisma / `@dms/shared-types` enums used in forms.
 * Values must stay identical to the backend DTOs.
 */

export const GENDERS = ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'] as const;
export type Gender = (typeof GENDERS)[number];

export const STUDENT_STATUSES = ['TRIAL', 'ACTIVE', 'PAUSED', 'DROPPED'] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export const LEAVE_STATUSES = ['PAUSED', 'DROPPED'] as const;

export const LEAVE_REASONS = [
  'ECONOMIC',
  'TIME_CONFLICT',
  'INJURY',
  'MOVED',
  'DISSATISFIED',
  'OTHER',
] as const;
export type LeaveReason = (typeof LEAVE_REASONS)[number];

export const LEAVE_NOTICE_METHODS = ['PHONE', 'WHATSAPP', 'IN_PERSON', 'RECEPTION', 'OTHER'] as const;
export type LeaveNoticeMethod = (typeof LEAVE_NOTICE_METHODS)[number];

export const LICENSE_HOLDER_TYPES = ['STUDENT', 'INSTRUCTOR', 'TECHNICAL_DIRECTOR'] as const;
export type LicenseHolderType = (typeof LICENSE_HOLDER_TYPES)[number];

export const FEDERATION_CONTACT_MEDIA = ['EMAIL', 'PHONE', 'ADDRESS'] as const;
export type FederationContactMedium = (typeof FEDERATION_CONTACT_MEDIA)[number];

export const LICENSE_PRICE_ROW_KINDS = ['INSTRUCTOR', 'ADULT', 'CUSTOM'] as const;
export type LicensePriceRowKind = (typeof LICENSE_PRICE_ROW_KINDS)[number];

export const FEDERATION_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'] as const;
export type FederationCurrency = (typeof FEDERATION_CURRENCIES)[number];

const CURRENCY_ADORNMENTS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'CHF',
};

/**
 * Suffix shown on monetary inputs: known symbol when available, otherwise the ISO code.
 *
 * @param {string | undefined} currency - ISO 4217 code from the selected season.
 * @returns {string} Adornment (`€`, `$`, `£`, `CHF`, or the raw code).
 */
export function currencyAdornment(currency: string | undefined): string {
  const code = (currency ?? 'EUR').trim().toUpperCase() || 'EUR';
  return CURRENCY_ADORNMENTS[code] ?? code;
}

/**
 * True when staff must capture structured leave metadata.
 *
 * @param {string} status - Selected student lifecycle status.
 * @returns {boolean} Whether leave reason/channel fields apply.
 */
export function isLeaveStatus(status: string): boolean {
  return (LEAVE_STATUSES as readonly string[]).includes(status);
}

/**
 * Maps a form select value to a Gender enum member, or `undefined` when empty/unknown.
 *
 * @param {string | null | undefined} value - Raw form value.
 * @returns {Gender | undefined} Enum member when valid.
 */
export function toOptionalGender(value: string | null | undefined): Gender | undefined {
  if (!value) return undefined;
  return (GENDERS as readonly string[]).includes(value) ? (value as Gender) : undefined;
}
