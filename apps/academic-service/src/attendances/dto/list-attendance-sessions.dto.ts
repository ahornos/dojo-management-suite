/**
 * @file list-attendance-sessions.dto.ts
 * @description Query filters for listing class sessions.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * Normalizes a query date to a string (query parsers may wrap a single value in an array).
 *
 * @param {unknown} value - Raw query value.
 * @returns {unknown} Trimmed string, or the original value.
 */
function asDateQuery(value: unknown): unknown {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === 'string' ? raw.trim() : raw;
}

/**
 * Validated query of `GET /attendances/sessions`.
 */
export class ListAttendanceSessionsDto {
  @ApiPropertyOptional({ example: '2026-11-01' })
  @Transform(({ value }) => asDateQuery(value))
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-11-30' })
  @Transform(({ value }) => asDateQuery(value))
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  disciplineId?: string;
}
