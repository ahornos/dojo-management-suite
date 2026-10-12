/**
 * @file update-personal-data.dto.ts
 * @description Validated payload carrying the personal data of a user. Shared base of the
 * provisioning and personal-data update requests of the internal user directory.
 */

import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { UserPersonalData } from '@dms/shared-types';
import { emptyToUndefined } from '../../common/transforms/empty-to-undefined';

/**
 * Optional personal data fields. Unknown properties are rejected by the global ValidationPipe.
 */
export class UpdatePersonalDataDto implements UserPersonalData {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  // Internal callers forward form values; '' must not fail the date check.
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
