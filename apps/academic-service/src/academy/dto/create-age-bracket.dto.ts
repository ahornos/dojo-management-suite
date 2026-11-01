/**
 * @file create-age-bracket.dto.ts
 * @description Body for adding a tenant-owned age range.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, MaxLength, Min } from 'class-validator';

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
 * Validated body of `POST /academy/age-brackets`.
 */
export class CreateAgeBracketDto {
  @ApiProperty({ example: 'Kids' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiPropertyOptional({ example: 'kids', description: 'Stable filter key. Derived from `name` when omitted.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsOptional()
  @IsString()
  @Matches(/^[a-z][a-z0-9_]{0,39}$/)
  code?: string;

  @ApiProperty({ example: 3 })
  @Transform(({ value }) => toInt(value))
  @IsInt()
  @Min(0)
  minAge: number;

  @ApiProperty({ example: 6 })
  @Transform(({ value }) => toInt(value))
  @IsInt()
  @Min(0)
  maxAge: number;

  @ApiPropertyOptional({ example: 10 })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
