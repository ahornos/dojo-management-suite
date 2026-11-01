/**
 * @file create-attendance-session.dto.ts
 * @description Body for opening a class session used by the quick check-in grid.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID, Matches, Min } from 'class-validator';

const TIME_HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

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
 * Validated body of `POST /attendances/sessions`.
 */
export class CreateAttendanceSessionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  disciplineId: string;

  @ApiProperty({ example: '2026-11-01', description: 'Class calendar date (`YYYY-MM-DD` or ISO instant).' })
  @IsString()
  date: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'Defaults to the authenticated instructor.' })
  @IsOptional()
  @IsUUID()
  instructorUserId?: string;

  @ApiPropertyOptional({ description: 'Optional headcount cap for the room.' })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @ApiPropertyOptional({ description: 'Marks an ad-hoc session outside the master calendar.' })
  @IsOptional()
  @IsBoolean()
  isExceptional?: boolean;

  @ApiPropertyOptional({ example: '10:00' })
  @IsOptional()
  @IsString()
  @Matches(TIME_HH_MM, { message: 'INVALID_SCHEDULE_TIME' })
  startTime?: string;

  @ApiPropertyOptional({ example: '11:30' })
  @IsOptional()
  @IsString()
  @Matches(TIME_HH_MM, { message: 'INVALID_SCHEDULE_TIME' })
  endTime?: string;

  @ApiPropertyOptional({ type: [String], description: 'Logical AgeBracket ids for the roster default filter.' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  ageBracketIds?: string[];
}
