/**
 * @file update-federation.dto.ts
 * @description Partial update of a federation catalog row.
 */

import { PartialType } from '@nestjs/swagger';
import { CreateFederationDto } from './create-federation.dto';

/**
 * Every create field is optional for `PATCH /financial/federations/:id`.
 */
export class UpdateFederationDto extends PartialType(CreateFederationDto) {}
