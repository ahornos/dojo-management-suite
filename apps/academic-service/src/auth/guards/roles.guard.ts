/**
 * @file roles.guard.ts
 * @description Guard responsible for enforcing Role-Based Access Control (RBAC).
 * It reads the required roles via reflection and compares them against the user's roles array extracted from the JWT payload.
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@dms/shared-types';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * @description Evaluates if the current authenticated user possesses at least one of the required roles to access the route.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {boolean} True if access is granted.
   * @throws {ForbiddenException} If the user lacks the required permissions.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Normalize user roles into an array, supporting multi-role configuration and legacy single role fallbacks
    const userRoles: Role[] = Array.isArray(user.roles) 
      ? user.roles 
      : (user.role ? [user.role] : []);

    // Verify if any of the user's roles match the required roles for the route
    const hasPermission = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      throw new ForbiddenException('You do not have the required role to perform this action');
    }
    
    return true;
  }
}