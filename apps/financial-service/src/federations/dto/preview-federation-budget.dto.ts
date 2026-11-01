/**
 * @file preview-federation-budget.dto.ts
 * @description Holder counts used to project a seasonal federation payout before charges exist.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

/**
 * Coerces numeric query/body values to integers.
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
 * Validated body of `POST /financial/federations/:id/budget`.
 */
export class PreviewFederationBudgetDto {
  @ApiProperty({ example: '2026-2027' })
  @IsString()
  @Matches(/^\d{4}-\d{4}$/, { message: 'INVALID_SEASON' })
  season: string;

  @ApiPropertyOptional({ default: 0 })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  studentCount?: number;

  @ApiPropertyOptional({ default: 0 })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  instructorCount?: number;

  @ApiPropertyOptional({ default: 0 })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  technicalDirectorCount?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  includeClubFee?: boolean;
}
