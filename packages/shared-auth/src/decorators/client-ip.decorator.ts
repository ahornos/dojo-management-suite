/**
 * @file client-ip.decorator.ts
 * @description Resolves the caller IP from gateway-stamped headers (`x-forwarded-for`, `x-real-ip`).
 * Never trust an IP sent in a JSON body — clients can spoof it.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Picks the leftmost hop from an `X-Forwarded-For` value.
 *
 * @param {unknown} raw - Header value (string or string[]).
 * @returns {string} Trimmed IP, or empty when absent.
 */
function firstForwardedHop(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== 'string' || value.trim() === '') return '';
  return value.split(',')[0]?.trim() ?? '';
}

/**
 * Reads the client IP from a request. Exported for unit tests without a Nest runtime.
 *
 * @param {unknown} _data - Unused decorator argument.
 * @param {ExecutionContext} context - Execution context of the current request.
 * @returns {string} Client IP, or `unknown` when nothing can be resolved.
 */
export function resolveClientIp(_data: unknown, context: ExecutionContext): string {
  const request = context.switchToHttp().getRequest<{
    headers?: Record<string, unknown>;
    ip?: string;
    socket?: { remoteAddress?: string };
  }>();

  const forwarded = firstForwardedHop(request.headers?.['x-forwarded-for']);
  if (forwarded) return forwarded;

  const realIp = firstForwardedHop(request.headers?.['x-real-ip']);
  if (realIp) return realIp;

  const direct = request.ip?.trim() || request.socket?.remoteAddress?.trim();
  return direct && direct.length > 0 ? direct : 'unknown';
}

/**
 * Injects the caller IP (`@ClientIp() ip: string`) from gateway-propagated headers.
 */
export const ClientIp = createParamDecorator(resolveClientIp);
