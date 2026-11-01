/**
 * @file find-mandate-query.dto.ts
 * @description Query for loading a payer's SEPA mandate in the current tenant.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

/**
 * `GET /financial/mandates?payerUserId=` or `GET /financial/mandates?id=`
 */
export class FindMandateQueryDto {
  @ApiPropertyOptional({ description: 'Auth-service user id of the payer who owns the mandate.' })
  @IsOptional()
  @IsUUID()
  payerUserId?: string;

  @ApiPropertyOptional({ description: 'Mandate UUID when looking up a specific record.' })
  @IsOptional()
  @IsUUID()
  id?: string;
}
