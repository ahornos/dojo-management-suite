/**
 * @file iban.ts
 * @description IBAN sanitizers used by ValidationPipe `@Transform` before `@IsIBAN()`.
 */

/**
 * ISO 13616 mod-97 of a decimal digit string.
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
 * Compact IBAN: strip every non-alphanumeric character and uppercase.
 * Empty / whitespace-only strings stay empty so optional `@IsIBAN()` can skip them.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Compact alphanumeric string, or the original value.
 */
export function compactIban(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/**
 * Builds an ES IBAN from a 20-digit Spanish CCC.
 *
 * @param {string} ccc - Twenty digits.
 * @returns {string} `ES` + check digits + CCC.
 */
function spanishCccToIban(ccc: string): string {
  const check = 98 - mod97(`${ccc}142800`);
  return `ES${String(check).padStart(2, '0')}${ccc}`;
}

/**
 * Sanitizer for mandate / config IBAN fields: compact separators, wrap Spanish CCC as ES IBAN.
 * Blank input stays blank so `@IsOptional` + `@ValidateIf` can skip `@IsIBAN()`.
 *
 * @param {unknown} value - Raw JSON body value.
 * @returns {unknown} Compact IBAN string, or the original value when not a string.
 */
export function toIban(value: unknown): unknown {
  const compact = compactIban(value);
  if (typeof compact !== 'string' || compact === '') return compact;
  if (/^\d{20}$/.test(compact)) {
    return spanishCccToIban(compact);
  }
  return compact;
}
