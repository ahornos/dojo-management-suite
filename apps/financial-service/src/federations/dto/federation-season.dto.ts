/**
 * @file federation-season.dto.ts
 * @description Season, license-type, and pricing-matrix payloads for a federation catalog.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MONEY_PATTERN } from '../money';

const PRICE_ROW_KINDS = ['INSTRUCTOR', 'ADULT', 'CUSTOM'] as const;

/**
 * @param {unknown} value - Raw input.
 * @returns {unknown} Trimmed string, or the original value.
 */
function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * Blank money inputs become `"0.00"`.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Compact amount string.
 */
function moneyOrZero(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? '0.00' : trimmed;
}

/**
 * One pricing-matrix row (instructor, adult, or custom birth-year band).
 */
export class FederationLicensePriceRowDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ enum: PRICE_ROW_KINDS })
  @IsIn(PRICE_ROW_KINDS)
  kind: (typeof PRICE_ROW_KINDS)[number];

  @ApiPropertyOptional({ example: 'Infantil/Juvenil' })
  @Transform(({ value }) => trimString(value))
  @ValidateIf((row: FederationLicensePriceRowDto) => row.kind === 'CUSTOM')
  @IsString()
  @IsNotEmpty({ message: 'LICENSE_PRICE_LABEL_REQUIRED' })
  label?: string;

  @ApiPropertyOptional({ example: 2010, description: 'Inclusive birth year (CUSTOM rows).' })
  @Type(() => Number)
  @ValidateIf((row: FederationLicensePriceRowDto) => row.kind === 'CUSTOM')
  @IsInt()
  @Min(1900)
  @Max(2100)
  birthYearFrom?: number | null;

  @ApiPropertyOptional({ example: '35.00' })
  @Transform(({ value }) => moneyOrZero(value))
  @IsOptional()
  @Matches(MONEY_PATTERN, { message: 'INVALID_MONETARY_AMOUNT' })
  cost?: string;

  @ApiPropertyOptional({ example: '0.00' })
  @Transform(({ value }) => moneyOrZero(value))
  @IsOptional()
  @Matches(MONEY_PATTERN, { message: 'INVALID_MONETARY_AMOUNT' })
  reduction?: string;

  @ApiPropertyOptional({ example: '40.00' })
  @Transform(({ value }) => moneyOrZero(value))
  @IsOptional()
  @Matches(MONEY_PATTERN, { message: 'INVALID_MONETARY_AMOUNT' })
  chargePrice?: string;
}

/**
 * One license product inside a season.
 */
export class FederationSeasonLicenseTypeDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: 'Licencia + Seguro de accidentes' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [FederationLicensePriceRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FederationLicensePriceRowDto)
  priceRows: FederationLicensePriceRowDto[];
}

/**
 * One pricing season for a federation.
 */
export class FederationSeasonDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: '26/27' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  seasonName: string;

  @ApiPropertyOptional({ example: 'EUR' })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim().toUpperCase();
    return trimmed === '' ? 'EUR' : trimmed;
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, { message: 'FEDERATION_CURRENCY_INVALID' })
  currency?: string;

  @ApiPropertyOptional({ example: '120.00' })
  @Transform(({ value }) => moneyOrZero(value))
  @IsOptional()
  @Matches(MONEY_PATTERN, { message: 'INVALID_MONETARY_AMOUNT' })
  clubCost?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [FederationSeasonLicenseTypeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FederationSeasonLicenseTypeDto)
  licenseTypes: FederationSeasonLicenseTypeDto[];
}
