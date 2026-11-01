/**
 * @file session-roster-query.dto.ts
 * @description Optional age-bracket filters for the session check-in roster.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

/**
 * Coerces numeric query values to integers.
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
 * Splits a comma-separated query or repeated query param into codes.
 *
 * @param {unknown} value - Raw query value.
 * @returns {unknown} String array, or the original value.
 */
function asCodeList(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.flatMap((item) => (typeof item === 'string' ? item.split(',') : [])).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return value;
}

/**
 * Validated query of `GET /attendances/sessions/:sessionId`.
 */
export class SessionRosterQueryDto {
  @ApiPropertyOptional({ description: 'Single age-bracket code (legacy).' })
  @IsOptional()
  @IsString()
  ageBracket?: string;

  @ApiPropertyOptional({ description: 'Comma-separated age-bracket codes to intersect with the session filter.' })
  @Transform(({ value }) => asCodeList(value))
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ageBrackets?: string[];

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
}
