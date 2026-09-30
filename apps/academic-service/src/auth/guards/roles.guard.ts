import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@dms/database/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * @class RolesGuard
 * @description Guard responsible for enforcing Role-Based Access Control (RBAC).
 * It reads the required roles via reflection and compares them against the user's role extracted from the JWT.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * @description Evaluates if the current authenticated user has the necessary role to access the route.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {boolean} True if access is granted.
   * @throws {ForbiddenException} If the user lacks the required role.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have the required role to perform this action');
    }
    
    return true;
  }
}