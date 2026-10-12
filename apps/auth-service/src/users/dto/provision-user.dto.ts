/**
 * @file provision-user.dto.ts
 * @description Validated payload of `POST /api/internal/users/provision`.
 * The grantable role is restricted to STUDENT and PARENT so an internal caller can never mint privileged accounts.
 */

import { IsEmail, IsIn, IsOptional, IsUUID } from 'class-validator';
import { ProvisionableRole, ProvisionUserRequest, Role } from '@dms/shared-types';
import { UpdatePersonalDataDto } from './update-personal-data.dto';

/**
 * Identity lookup keys (`userId` or `email`), optional personal data and the role to grant.
 */
export class ProvisionUserDto extends UpdatePersonalDataDto implements ProvisionUserRequest {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsIn([Role.STUDENT, Role.PARENT])
  role: ProvisionableRole;
}
