/**
 * @file roles.guard.ts
 * @description Role-Based Access Control guard shared by every microservice.
 * Compares the roles required by a route (`@Roles`) with the `roles` array of the authenticated user.
 */

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser, Role } from '@dms/shared-types';
import { ROLES_KEY } from '../decorators/roles.decorator';

/** Stable error codes surfaced to API consumers (translated by the frontend). */
export const USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED';
export const INSUFFICIENT_ROLE = 'INSUFFICIENT_ROLE';

/**
 * @class RolesGuard
 * @description Grants access when the user holds at least one required role. Must run after `JwtAuthGuard`
 * so that `req.user` is populated. Depends on `Reflector`.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * @param {Reflector} reflector - Reads the `@Roles` metadata of the handler and controller.
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Evaluates whether the authenticated user may execute the current handler.
   *
   * @param {ExecutionContext} context - Execution context of the incoming request.
   * @returns {boolean} `true` when access is granted.
   * @throws {ForbiddenException} If the user is missing, or lacks every required role.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user?: Partial<AuthenticatedUser> }>();

    if (!user) {
      throw new ForbiddenException(USER_NOT_AUTHENTICATED);
    }

    // Only the `roles` array is trusted; a legacy singular `role` claim must never grant access.
    const userRoles: Role[] = Array.isArray(user.roles) ? user.roles : [];

    if (!requiredRoles.some((role) => userRoles.includes(role))) {
      throw new ForbiddenException(INSUFFICIENT_ROLE);
    }

    return true;
  }
}
