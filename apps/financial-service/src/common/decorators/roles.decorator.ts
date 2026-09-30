import { SetMetadata } from '@nestjs/common';
import { Role } from '@dms/database/client';

export const ROLES_KEY = 'roles';

/**
 * @file roles.decorator.ts
 * @description Decorator used to attach required roles metadata to route handlers.
 * 
 * @param roles - List of allowed roles required to access the endpoint
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);