/**
 * @file parse-decimal.pipe.ts
 * @description Route-parameter pipe that parses a monetary amount into an exact `Prisma.Decimal`,
 * avoiding the precision loss of `Number()` / `ParseFloatPipe` for money values.
 */

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma } from '@dms/database/client';

/** Stable machine-readable error code mapped by the frontend to a translation key. */
export const INVALID_MONETARY_AMOUNT = 'INVALID_MONETARY_AMOUNT';

/** Non-negative amount with at most two decimal places (matches `Decimal(10, 2)` columns). */
const MONETARY_AMOUNT_PATTERN = /^\d{1,8}(\.\d{1,2})?$/;

/**
 * Converts a textual amount (e.g. `"49.90"`) into a `Prisma.Decimal`.
 */
@Injectable()
export class ParseDecimalPipe implements PipeTransform<string, Prisma.Decimal> {
  /**
   * Parses and validates the raw parameter.
   *
   * @param {string} value - Raw route parameter.
   * @returns {Prisma.Decimal} The exact decimal amount.
   * @throws {BadRequestException} `INVALID_MONETARY_AMOUNT` if the value is not a non-negative amount with up to 2 decimals.
   */
  transform(value: string): Prisma.Decimal {
    if (typeof value !== 'string' || !MONETARY_AMOUNT_PATTERN.test(value)) {
      throw new BadRequestException(INVALID_MONETARY_AMOUNT);
    }

    return new Prisma.Decimal(value);
  }
}
