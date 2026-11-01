/**
 * @file preview-licenses.dto.ts
 * @description Filters for massive affiliation-license generation preview.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { LicenseHolderType } from '@dms/shared-types';

const PERSON_HOLDER_TYPES = [
  LicenseHolderType.STUDENT,
  LicenseHolderType.INSTRUCTOR,
  LicenseHolderType.TECHNICAL_DIRECTOR,
] as const;

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
 * Selected-student batch bodies omit filter fields (`holderType`, `season`).
 *
 * @param {object} dto - Incoming body (preview or batch).
 * @returns {boolean} Whether `studentProfileIds` selects explicit holders.
 */
function hasSelectedStudents(dto: object): boolean {
  const ids = (dto as { studentProfileIds?: unknown }).studentProfileIds;
  return Array.isArray(ids) && ids.length > 0;
}

/**
 * Validated body of `POST /licenses/preview` and `POST /licenses/batch`.
 */
export class PreviewLicensesDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  federationId: string;

  @ApiProperty({ example: '2026-2027', description: 'Catalog season label (`YYYY-YYYY` or federation seasonName).' })
  @ValidateIf((dto: object) => !hasSelectedStudents(dto))
  @IsString()
  @IsNotEmpty()
  season: string;

  @ApiProperty({ enum: PERSON_HOLDER_TYPES })
  @ValidateIf((dto: object) => !hasSelectedStudents(dto))
  @IsIn(PERSON_HOLDER_TYPES)
  holderType: (typeof PERSON_HOLDER_TYPES)[number];

  @ApiPropertyOptional({ description: 'Exact age in years (sets min and max).' })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

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

  @ApiPropertyOptional({ description: 'Only students enrolled in this discipline.' })
  @IsOptional()
  @IsUUID()
  disciplineId?: string;

  @ApiPropertyOptional({ description: 'Only profiles created before this ISO date.' })
  @IsOptional()
  @IsDateString()
  enrollmentDateBefore?: string;

  @ApiPropertyOptional({ description: 'Financial-service FederationLicenseType id used to price and persist the batch.' })
  @IsOptional()
  @IsUUID()
  licenseTypeId?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Student lifecycle statuses. Defaults to ACTIVE when omitted.',
  })
  @IsOptional()
  @IsArray()
  @IsIn(['ACTIVE', 'TRIAL', 'PAUSED', 'DROPPED'], { each: true })
  statuses?: Array<'ACTIVE' | 'TRIAL' | 'PAUSED' | 'DROPPED'>;

  @ApiPropertyOptional({ description: 'Inclusive UTC birth-year lower bound (custom age bracket).' })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  birthYearFrom?: number;

  @ApiPropertyOptional({ description: 'Inclusive UTC birth-year upper bound (custom age bracket).' })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  birthYearTo?: number;
}
