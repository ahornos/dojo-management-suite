/**
 * @file roles.decorator.ts
 * @description Metadata decorator declaring which roles may access a route or controller.
 */

import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { Role } from '@dms/shared-types';

/** Reflection key under which required roles are stored. */
export const ROLES_KEY = 'roles';

/**
 * Restricts a handler or controller to users holding at least one of the given roles.
 *
 * @param {...Role[]} roles - Roles allowed to access the route.
 * @returns {CustomDecorator<string>} Decorator attaching the roles metadata.
 */
export const Roles = (...roles: Role[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
