/**
 * @file batch-issue-licenses.dto.ts
 * @description Filters plus optional sale amount for massive license issuance.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsOptional, IsUUID, Matches } from 'class-validator';
import { PreviewLicensesDto } from './preview-licenses.dto';

const MONEY_PATTERN = /^\d{1,8}(\.\d{1,2})?$/;

/**
 * Validated body of `POST /licenses/batch`. Reuses preview filters.
 */
export class BatchIssueLicensesDto extends PreviewLicensesDto {
  @ApiPropertyOptional({ example: '40.00' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @Matches(MONEY_PATTERN, { message: 'INVALID_MONETARY_AMOUNT' })
  amountCharged?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional({ description: 'When true, persist sale as already collected.' })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({ description: 'Student profile ids issued at zero charge (staff children, designated).' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  exemptStudentProfileIds?: string[];

  @ApiPropertyOptional({
    description: 'When true, instructors/directors are charged. Default is exempt (zero sale).',
  })
  @IsOptional()
  @IsBoolean()
  chargeStaff?: boolean;

  @ApiPropertyOptional({ description: 'Also persist the club licensing cost in financial-service.' })
  @IsOptional()
  @IsBoolean()
  includeClubFee?: boolean;

  @ApiPropertyOptional({ description: 'ISO-8601 instant used for seasonal month threshold (tests / backfill).' })
  @IsOptional()
  @IsDateString()
  @Type(() => String)
  issuedAt?: string;
}
