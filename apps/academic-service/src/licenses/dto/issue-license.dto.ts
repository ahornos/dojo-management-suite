/**
 * @file issue-license.dto.ts
 * @description Individual affiliation license issuance / renewal payload.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { LicenseHolderType } from '@dms/shared-types';

const PERSON_HOLDER_TYPES = [
  LicenseHolderType.STUDENT,
  LicenseHolderType.INSTRUCTOR,
  LicenseHolderType.TECHNICAL_DIRECTOR,
] as const;

/** Non-negative amount with at most two decimal places. */
const MONEY_PATTERN = /^\d{1,8}(\.\d{1,2})?$/;

/**
 * Validated body of `POST /licenses`.
 */
export class IssueLicenseDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  federationId: string;

  @ApiProperty({ example: '2026-2027' })
  @IsString()
  @Matches(/^\d{4}-\d{4}$/, { message: 'LICENSE_SEASON_INVALID' })
  season: string;

  @ApiProperty({ enum: PERSON_HOLDER_TYPES })
  @IsIn(PERSON_HOLDER_TYPES)
  holderType: (typeof PERSON_HOLDER_TYPES)[number];

  @ApiPropertyOptional({ description: 'Auth-service user id. Omit for minors (no User).' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUUID()
  holderUserId?: string;

  @ApiPropertyOptional({ description: 'Required when holderType is STUDENT (including minors).' })
  @IsOptional()
  @IsUUID()
  studentProfileId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ description: 'ISO-8601 validity end. Defaults to 31 August of the season end year.' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional({ example: '40.00', description: 'Sale amount charged to the member.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @Matches(MONEY_PATTERN, { message: 'INVALID_MONETARY_AMOUNT' })
  amountCharged?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({ description: 'Issue at zero charge (instructor/staff or designated student).' })
  @IsOptional()
  @IsBoolean()
  isExempt?: boolean;

  @ApiPropertyOptional({ description: 'Payer User id (adult student or parent). Omit for unresolved minors.' })
  @IsOptional()
  @IsUUID()
  payerUserId?: string;

  @ApiPropertyOptional({ description: 'Financial-service FederationLicenseType id (logical).' })
  @IsOptional()
  @IsUUID()
  licenseTypeId?: string;
}
