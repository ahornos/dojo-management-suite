/**
 * @file upsert-attendance-records.dto.ts
 * @description Bulk roll-call payload for one class session.
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsUUID, ValidateNested } from 'class-validator';

const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;

/**
 * One student mark in a session.
 */
export class AttendanceRecordItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  studentProfileId: string;

  @ApiProperty({ enum: ATTENDANCE_STATUSES })
  @IsIn(ATTENDANCE_STATUSES)
  status: (typeof ATTENDANCE_STATUSES)[number];
}

/**
 * Validated body of `POST /attendances/sessions/:sessionId/records`.
 */
export class UpsertAttendanceRecordsDto {
  @ApiProperty({ type: [AttendanceRecordItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordItemDto)
  records: AttendanceRecordItemDto[];
}
