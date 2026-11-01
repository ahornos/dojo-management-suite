/**
 * @file create-bank-mandate.dto.ts
 * @description Client payload for `POST /financial/mandates`. `mandateReference` is optional
 * on the wire; `BankMandatesService` always generates a unique reference and `signatureDate`.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIBAN, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { toIban } from '../../common/iban';

/**
 * Trims a string. Empty / whitespace-only values become `undefined` so `@IsOptional()` skips them.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Trimmed string, `undefined` when blank, or the original value.
 */
function emptyToUndefined(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * Normalizes a Spanish national ID (DNI/NIF/NIE): strip spaces and uppercase.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Compact ID, or the original value.
 */
function compactDni(value: unknown): unknown {
  return typeof value === 'string' ? value.replace(/\s+/g, '').toUpperCase() : value;
}

/**
 * Validated body of `POST /financial/mandates`.
 */
export class CreateBankMandateDto {
  @ApiProperty({ description: 'Auth-service user id of the payer who owns the IBAN (parent or adult student).' })
  @IsUUID()
  payerUserId: string;

  @ApiProperty({ example: 'ES9121000418450200051332', description: 'Debtor IBAN. Spaces and hyphens are stripped before validation.' })
  @Transform(({ value }) => toIban(value))
  @IsIBAN()
  iban: string;

  @ApiPropertyOptional({ example: 'CAIXESBBXXX', description: 'Optional BIC / SWIFT. Empty string is treated as omitted.' })
  @Transform(({ value }) => emptyToUndefined(value))
  @IsOptional()
  @IsString()
  bic?: string;

  /**
   * Optional client-supplied reference. `BankMandatesService` always overwrites it with a unique
   * `DMS-MANDATE-<timestamp>-<hex>` value so callers cannot collide on the unique constraint.
   */
  @ApiPropertyOptional({ description: 'Ignored when present; the service generates a unique mandate reference.' })
  @Transform(({ value }) => emptyToUndefined(value))
  @IsOptional()
  @IsString()
  mandateReference?: string;

  @ApiProperty({ example: 'Ana Garcia', description: 'Legal name of the bank account holder (SEPA debtor).' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty({ example: '12345678Z', description: 'DNI/NIF/NIE of the account holder (CaixaBank SEPA requirement).' })
  @Transform(({ value }) => compactDni(value))
  @IsString()
  @IsNotEmpty()
  accountHolderDni: string;
}
