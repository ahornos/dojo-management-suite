/**
 * @file internal-api-key.guard.ts
 * @description Guard authenticating service-to-service calls to the internal user directory
 * with a shared secret. The endpoints it protects are not routed by the API Gateway.
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'crypto';
import { INTERNAL_API_KEY_HEADER } from '@dms/shared-types';

/**
 * @class InternalApiKeyGuard
 * @description Accepts a request only when `x-internal-api-key` matches `INTERNAL_API_KEY`.
 * Depends on `ConfigService`; construction fails fast when the key is not configured.
 */
@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  private readonly expectedDigest: Buffer;

  /**
   * @param {ConfigService} configService - Provides the mandatory `INTERNAL_API_KEY`.
   * @throws {Error} If `INTERNAL_API_KEY` is not configured.
   */
  constructor(configService: ConfigService) {
    this.expectedDigest = InternalApiKeyGuard.digest(configService.getOrThrow<string>('INTERNAL_API_KEY'));
  }

  /**
   * Compares the presented key in constant time.
   *
   * @param {ExecutionContext} context - Execution context of the incoming request.
   * @returns {boolean} `true` when the key is valid.
   * @throws {UnauthorizedException} If the header is missing or does not match.
   */
  canActivate(context: ExecutionContext): boolean {
    const { headers } = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const presented = headers[INTERNAL_API_KEY_HEADER];

    if (typeof presented !== 'string' || !timingSafeEqual(InternalApiKeyGuard.digest(presented), this.expectedDigest)) {
      throw new UnauthorizedException('INVALID_OR_MISSING_INTERNAL_API_KEY');
    }

    return true;
  }

  /**
   * Hashes a key so both sides of the comparison have equal length (required by `timingSafeEqual`).
   *
   * @param {string} value - Raw key.
   * @returns {Buffer} SHA-256 digest of the key.
   */
  private static digest(value: string): Buffer {
    return createHash('sha256').update(value).digest();
  }
}
