/**
 * @file batch-federation-charges.dto.ts
 * @description Holders to charge for a federation season (club fee optional).
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { LicenseHolderType } from '@dms/shared-types';

const PERSON_HOLDER_TYPES = [
  LicenseHolderType.STUDENT,
  LicenseHolderType.INSTRUCTOR,
  LicenseHolderType.TECHNICAL_DIRECTOR,
] as const;

/**
 * One person to include in the seasonal federation charge batch.
 */
export class FederationChargeHolderDto {
  @ApiProperty({ enum: PERSON_HOLDER_TYPES })
  @IsIn(PERSON_HOLDER_TYPES)
  holderType: (typeof PERSON_HOLDER_TYPES)[number];

  @ApiPropertyOptional({ description: 'Auth-service user id. Omit for minors (no User).' })
  @IsOptional()
  @IsUUID()
  holderUserId?: string;

  @ApiPropertyOptional({ description: 'Academic student profile id when holderType is STUDENT.' })
  @IsOptional()
  @IsUUID()
  studentProfileId?: string;

  @ApiPropertyOptional({ description: 'Academic license id when already issued.' })
  @IsOptional()
  @IsUUID()
  licenseId?: string;

  @ApiPropertyOptional({ example: '35.00', description: 'Override catalog cost (Decimal string).' })
  @IsOptional()
  @Matches(/^\d{1,8}(\.\d{1,2})?$/, { message: 'INVALID_MONETARY_AMOUNT' })
  costAmount?: string;

  @ApiPropertyOptional({ example: '40.00', description: 'Override catalog sale (Decimal string).' })
  @IsOptional()
  @Matches(/^\d{1,8}(\.\d{1,2})?$/, { message: 'INVALID_MONETARY_AMOUNT' })
  saleAmount?: string;
}

/**
 * Validated body of `POST /financial/federations/:id/charges`.
 */
export class BatchFederationChargesDto {
  @ApiProperty({ example: '2026-2027' })
  @IsString()
  @Matches(/^\d{4}-\d{4}$/, { message: 'INVALID_SEASON' })
  season: string;

  @ApiPropertyOptional({ description: 'When true, also persist the club fee row for this season.' })
  @IsOptional()
  @IsBoolean()
  includeClubFee?: boolean;

  @ApiProperty({ type: [FederationChargeHolderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FederationChargeHolderDto)
  holders: FederationChargeHolderDto[];
}
