/**
 * @file federation-list-query.dto.ts
 * @description Query filters for `GET /financial/federations` (search + lifecycle status).
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

/** Staff list filter: live active/inactive, or soft-deleted (SUPER_ADMIN only). */
export const FEDERATION_LIST_STATUSES = ['ACTIVE', 'INACTIVE', 'DELETED'] as const;

export type FederationListStatus = (typeof FEDERATION_LIST_STATUSES)[number];

/**
 * @param {unknown} value - Raw query value.
 * @returns {unknown} Trimmed string, or the original value.
 */
function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * Validated query of `GET /financial/federations`.
 */
export class FederationListQueryDto {
  @ApiPropertyOptional({ description: 'Case-insensitive search on name, acronym, email, or country.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: FEDERATION_LIST_STATUSES })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsOptional()
  @IsIn(FEDERATION_LIST_STATUSES, { message: 'FEDERATION_LIST_STATUS_INVALID' })
  status?: FederationListStatus;
}
