/**
 * @file money.ts
 * @description Decimal helpers for federation pricing. Never uses JavaScript floats.
 */

import { Prisma } from '@dms/database/client';

/** Non-negative amount with at most two decimal places (`Decimal(10, 2)`). */
export const MONEY_PATTERN = /^\d{1,8}(\.\d{1,2})?$/;

/**
 * Parses a validated monetary string into `Prisma.Decimal`.
 *
 * @param {string} value - Amount such as `"45.00"`.
 * @returns {Prisma.Decimal} Exact decimal.
 */
export function toDecimal(value: string): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

/**
 * Serializes a Prisma decimal for JSON responses.
 *
 * @param {Prisma.Decimal} value - Stored amount.
 * @returns {string} Two-decimal string.
 */
export function decimalToString(value: Prisma.Decimal): string {
  return value.toFixed(2);
}
