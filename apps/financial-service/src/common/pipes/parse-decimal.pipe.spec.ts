/**
 * @file parse-decimal.pipe.spec.ts
 * @description Unit tests for `ParseDecimalPipe`: exact decimal parsing and strict rejection of malformed amounts.
 */

import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@dms/database/client';
import { INVALID_MONETARY_AMOUNT, ParseDecimalPipe } from './parse-decimal.pipe';

describe('ParseDecimalPipe', () => {
  const pipe = new ParseDecimalPipe();

  it.each([['0'], ['49'], ['49.9'], ['49.90'], ['33.33'], ['12345678.99']])('parses "%s" into an exact Decimal', (raw) => {
    const result = pipe.transform(raw);

    expect(result).toBeInstanceOf(Prisma.Decimal);
    expect(result.toString()).toBe(new Prisma.Decimal(raw).toString());
  });

  it.each([[''], ['abc'], ['-5'], ['1.234'], ['1,50'], ['1e3'], ['NaN'], ['Infinity'], ['.5'], ['5.'], [' 5'], ['123456789']])(
    'rejects "%s" with the INVALID_MONETARY_AMOUNT code',
    (raw) => {
      expect(() => pipe.transform(raw)).toThrow(BadRequestException);
      expect(() => pipe.transform(raw)).toThrow(INVALID_MONETARY_AMOUNT);
    },
  );

  it('rejects non-string input', () => {
    expect(() => pipe.transform(undefined as unknown as string)).toThrow(BadRequestException);
  });
});
