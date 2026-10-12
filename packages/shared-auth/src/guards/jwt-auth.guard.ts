/**
 * @file jwt-auth.guard.ts
 * @description Guard that authenticates requests through the Passport `jwt` strategy.
 * Each service registers that strategy in its own `AuthModule` (it owns the JWT secret handling).
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from '@dms/shared-types';

/** Stable error code returned when the bearer token is absent, malformed, expired or badly signed. */
export const INVALID_OR_MISSING_TOKEN = 'INVALID_OR_MISSING_TOKEN';

/**
 * @class JwtAuthGuard
 * @description Rejects requests lacking a valid, unexpired bearer token with HTTP 401.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Normalises every authentication failure to a 401.
   *
   * @param {unknown} err - Error raised by the strategy, if any.
   * @param {TUser | false | null} user - User produced by the strategy, or a falsy value on failure.
   * @returns {TUser} The authenticated user.
   * @throws {Error} The strategy error when one was raised.
   * @throws {UnauthorizedException} If there is no authenticated user.
   */
  handleRequest<TUser = AuthenticatedUser>(err: unknown, user: TUser | false | null): TUser {
    if (err || !user) {
      throw err instanceof Error ? err : new UnauthorizedException(INVALID_OR_MISSING_TOKEN);
    }

    return user;
  }
}
