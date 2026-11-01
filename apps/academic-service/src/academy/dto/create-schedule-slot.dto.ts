/**
 * @file create-schedule-slot.dto.ts
 * @description Body for adding a weekly master-calendar class slot.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
 * Validated body of `POST /academy/schedule-slots`.
 */
export class CreateScheduleSlotDto {
  @ApiProperty({ example: 1, description: 'ISO weekday: 1 = Monday … 7 = Sunday.' })
  @Transform(({ value }) => toInt(value))
  @IsInt()
  @Min(1)
  @Max(7)
  weekday: number;

  @ApiProperty({ example: '18:00' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @Matches(TIME_HH_MM, { message: 'INVALID_SCHEDULE_TIME' })
  startTime: string;

  @ApiProperty({ example: '19:30' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @Matches(TIME_HH_MM, { message: 'INVALID_SCHEDULE_TIME' })
  endTime: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  disciplineId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  instructorUserId: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @ApiPropertyOptional({ type: [String], description: 'Logical AgeBracket ids.' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  ageBracketIds?: string[];

  @ApiPropertyOptional({ description: 'Optional class label (e.g. Kids BJJ).' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
