/**
 * @file delete-federation-query.dto.ts
 * @description SUPER_ADMIN delete mode: soft (hide) or hard (cascade wipe).
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

/** Allowed `DELETE /financial/federations/:id` modes. */
export const FEDERATION_DELETE_MODES = ['soft', 'hard'] as const;

export type FederationDeleteMode = (typeof FEDERATION_DELETE_MODES)[number];

/**
 * Validated query of `DELETE /financial/federations/:id`.
 */
export class DeleteFederationQueryDto {
  @ApiPropertyOptional({ enum: FEDERATION_DELETE_MODES, default: 'soft' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsOptional()
  @IsIn(FEDERATION_DELETE_MODES, { message: 'FEDERATION_DELETE_MODE_INVALID' })
  mode?: FederationDeleteMode;
}
