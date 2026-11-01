/**
 * @file update-age-bracket.dto.ts
 * @description Partial update for a tenant-owned age range. `code` is immutable after create.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

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
 * Coerces numeric body values to integers.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Integer, or the original value.
 */
function toInt(value: unknown): unknown {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number.parseInt(value, 10);
  return value;
}

/**
 * Validated body of `PATCH /academy/age-brackets/:id`.
 */
export class UpdateAgeBracketDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAge?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
