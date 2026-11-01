/**
 * @file user-by-roles.dto.ts
 * @description Validated body of `POST /api/internal/users/by-roles`.
 */

import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { Role, UserByRolesRequest } from '@dms/shared-types';

/**
 * Role filter for the internal user directory.
 */
export class UserByRolesDto implements UserByRolesRequest {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
