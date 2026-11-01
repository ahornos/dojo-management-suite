/**
 * @file update-schedule-slot.dto.ts
 * @description Partial update for a weekly master-calendar class slot.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const TIME_HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

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
 * Validated body of `PATCH /academy/schedule-slots/:id`.
 */
export class UpdateScheduleSlotDto {
  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  weekday?: number;

  @ApiPropertyOptional({ example: '18:00' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @Matches(TIME_HH_MM, { message: 'INVALID_SCHEDULE_TIME' })
  startTime?: string;

  @ApiPropertyOptional({ example: '19:30' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @Matches(TIME_HH_MM, { message: 'INVALID_SCHEDULE_TIME' })
  endTime?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  disciplineId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  instructorUserId?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  ageBracketIds?: string[];

  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
