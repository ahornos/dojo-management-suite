/**
 * @file update-personal-data.dto.ts
 * @description Validated payload carrying login-identity fields of a user. Shared base of the
 * provisioning and personal-data update requests of the internal user directory.
 */

import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender, UserPersonalData } from '@dms/shared-types';
import { emptyToUndefined } from '../../common/transforms/empty-to-undefined';

/**
 * Optional login-identity fields. Unknown properties are rejected by the global ValidationPipe.
 * Demographics belong on StudentProfile and are not accepted here.
 */
export class UpdatePersonalDataDto implements UserPersonalData {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @Transform(emptyToUndefined)
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
