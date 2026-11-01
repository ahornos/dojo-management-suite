/**
 * @file tenant-id.decorator.ts
 * @description Resolves the academy tenant from the `x-school-id` header forwarded by the API Gateway.
 * JWTs do not carry a tenant claim; isolation is header-based (subdomain / `VITE_DEFAULT_TENANT_ID`).
 */

import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Stable error code when a protected handler runs without `x-school-id`. */
export const MISSING_TENANT_ID = 'MISSING_TENANT_ID';

/**
 * Reads and normalizes `x-school-id` from an incoming request.
 * Exported separately from the decorator so it can be unit tested without a Nest runtime.
 *
 * @param {unknown} _data - Unused decorator argument.
 * @param {ExecutionContext} context - Execution context of the current request.
 * @returns {string} Trimmed tenant identifier.
 * @throws {BadRequestException} If the header is missing or blank (`MISSING_TENANT_ID`).
 */
export function resolveTenantId(_data: unknown, context: ExecutionContext): string {
  const request = context.switchToHttp().getRequest<{ headers?: Record<string, unknown> }>();
  const raw = request.headers?.['x-school-id'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const tenantId = typeof value === 'string' ? value.trim() : '';

  if (!tenantId) {
    throw new BadRequestException(MISSING_TENANT_ID);
  }

  return tenantId;
}

/**
 * Injects the tenant id from `x-school-id` (`@TenantId() tenantId: string`).
 * Pair with `JwtAuthGuard` on staff routes; the header is independent of the JWT.
 */
export const TenantId = createParamDecorator(resolveTenantId);
