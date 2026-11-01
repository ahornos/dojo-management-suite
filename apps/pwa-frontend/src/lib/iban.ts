/**
 * @file iban.ts
 * @description Shared IBAN helpers for staff forms. Checksum matches `@IsIBAN()` / ISO 13616.
 */

/**
 * Compact IBAN: strip every non-alphanumeric character (spaces, hyphens, dots) and uppercase.
 *
 * @param {string} iban - Raw IBAN or Spanish CCC input.
 * @returns {string} Normalized alphanumeric string.
 */
export function compactIban(iban: string): string {
  return iban.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/**
 * ISO 13616 mod-97 of a decimal digit string (used for check digits and IBAN checksum).
 *
 * @param {string} numeric - Digits only.
 * @returns {number} Remainder in `0..96`.
 */
function mod97(numeric: string): number {
  let remainder = 0;
  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder;
}

/**
 * Builds an ES IBAN from a 20-digit Spanish CCC (bank + branch + control + account).
 *
 * @param {string} ccc - Twenty digits.
 * @returns {string} `ES` + check digits + CCC.
 */
function spanishCccToIban(ccc: string): string {
  // `ES00` expands to 142800; check digits are 98 − (CCC||ES00 mod 97).
  const check = 98 - mod97(`${ccc}142800`);
  return `ES${String(check).padStart(2, '0')}${ccc}`;
}

/**
 * Normalizes pasted account numbers: compact separators, and wrap a 20-digit Spanish CCC as an ES IBAN.
 *
 * @param {string} iban - Raw IBAN or CCC.
 * @returns {string} Compact IBAN, or empty when the input is blank.
 */
export function toIban(iban: string): string {
  const compact = compactIban(iban);
  if (/^\d{20}$/.test(compact)) {
    return spanishCccToIban(compact);
  }
  return compact;
}

/**
 * ISO 13616 checksum (mod-97). Accepts spaced, hyphenated, or Spanish CCC input.
 *
 * @param {string} iban - Compact, spaced, or CCC account number.
 * @returns {boolean} Whether the checksum is valid.
 */
export function isValidIban(iban: string): boolean {
  const compact = toIban(iban);
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(compact)) return false;

  const rearranged = compact.slice(4) + compact.slice(0, 4);
  let digits = '';
  for (const char of rearranged) {
    digits += /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
  }
  return mod97(digits) === 1;
}
