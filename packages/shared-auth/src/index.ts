/**
 * @file index.ts
 * @description Public API of `@dms/shared-auth`.
 */

export { ROLES_KEY, Roles } from './decorators/roles.decorator';
export { CurrentUser, resolveCurrentUser, MISSING_AUTHENTICATED_USER } from './decorators/current-user.decorator';
export { TenantId, resolveTenantId, MISSING_TENANT_ID } from './decorators/tenant-id.decorator';
export { ClientIp, resolveClientIp } from './decorators/client-ip.decorator';
export { JwtAuthGuard, INVALID_OR_MISSING_TOKEN } from './guards/jwt-auth.guard';
export { RolesGuard, USER_NOT_AUTHENTICATED, INSUFFICIENT_ROLE } from './guards/roles.guard';
