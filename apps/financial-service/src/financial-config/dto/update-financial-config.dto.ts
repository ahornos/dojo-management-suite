/**
 * @file update-financial-config.dto.ts
 * @description Partial update payload for the academy's SEPA creditor / invoicing identity.
 * All fields are optional. Empty IBAN/BIC skip `@IsIBAN()` so a blank config can be saved.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIBAN, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { toIban } from '../../common/iban';

/**
 * Trims a string. Non-strings are left unchanged.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Trimmed string, or the original value.
 */
function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * Validated body of `PUT /financial/config`. Every field is optional.
 */
export class UpdateFinancialConfigDto {
  @ApiPropertyOptional({ description: 'Legal name of the academy (razón social).' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Tax identifier (CIF/NIF).' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ description: 'Registered postal address.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City of the registered address.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Postal code.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'ES', description: 'ISO 3166-1 alpha-2 country code.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsString()
  @Length(2, 2)
  country?: string;

  @ApiPropertyOptional({ description: 'SEPA Creditor Identifier used in pain.008.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  creditorId?: string;

  @ApiPropertyOptional({ example: 'ES9121000418450200051332', description: 'Academy creditor IBAN. Spaces and hyphens are stripped before validation.' })
  @Transform(({ value }) => toIban(value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsIBAN()
  iban?: string;

  @ApiPropertyOptional({ example: 'CAIXESBBXXX', description: 'Optional BIC / SWIFT.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  bic?: string;
}
