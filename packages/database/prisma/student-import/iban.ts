/**
 * @file iban.ts
 * @description IBAN compacting and checksum for the student import (same rules as staff forms).
 */

/**
 * @param {string} numeric - Digit string.
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
 * Strips separators and uppercases. Blank stays blank.
 *
 * @param {string} iban - Raw IBAN or Spanish CCC.
 * @returns {string} Alphanumeric compact form.
 */
export function compactIban(iban: string): string {
  return iban.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/**
 * Wraps a 20-digit Spanish CCC as an ES IBAN; otherwise returns the compact value.
 *
 * @param {string} iban - Raw account number.
 * @returns {string} Compact IBAN, or empty.
 */
export function toIban(iban: string): string {
  const compact = compactIban(iban);
  if (/^\d{20}$/.test(compact)) {
    const check = 98 - mod97(`${compact}142800`);
    return `ES${String(check).padStart(2, '0')}${compact}`;
  }
  return compact;
}

/**
 * ISO 13616 checksum.
 *
 * @param {string} iban - Raw or compact IBAN.
 * @returns {boolean} Whether the number is a valid IBAN.
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
