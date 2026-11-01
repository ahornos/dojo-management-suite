/**
 * @file internal-api-key.guard.ts
 * @description Guard authenticating service-to-service calls with the shared internal API key.
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'crypto';
import { INTERNAL_API_KEY_HEADER } from '@dms/shared-types';

/**
 * Accepts a request only when `x-internal-api-key` matches `INTERNAL_API_KEY`.
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
   * @param {ExecutionContext} context - Incoming request context.
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
   * @param {string} value - Raw key.
   * @returns {Buffer} SHA-256 digest.
   */
  private static digest(value: string): Buffer {
    return createHash('sha256').update(value).digest();
  }
}
