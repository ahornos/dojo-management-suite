import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@dms/shared-types';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * @file roles.guard.ts
 * @description Guard enforcing Role-Based Access Control (RBAC) on financial endpoints.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Evaluates if the authenticated user possesses the required role to execute the handler.
   * 
   * @param context - Execution context containing request details
   * @returns True if access is allowed, throws ForbiddenException otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: User role is missing');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions for financial operations');
    }

    return true;
  }
}