/**
 * @file jwt.strategy.ts
 * @description Passport JWT strategy used to protect the administrative endpoints of the auth-service.
 * The signing secret is read exclusively from `ConfigService`; there is no fallback value.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser, JwtPayload } from '@dms/shared-types';

/**
 * @class JwtStrategy
 * @description Verifies bearer tokens and maps the payload to the shared `AuthenticatedUser` shape.
 * Depends on `ConfigService`, which must expose `JWT_SECRET`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @param {ConfigService} configService - Provides the mandatory `JWT_SECRET`.
   * @throws {Error} If `JWT_SECRET` is not configured.
   */
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Converts the verified JWT payload into the `req.user` context.
   *
   * @param {JwtPayload} payload - Decoded and verified token claims.
   * @returns {AuthenticatedUser} User context injected into the request.
   */
  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
      // Deny by default: a token without a roles array carries no privileges.
      roles: Array.isArray(payload.roles) ? payload.roles : [],
    };
  }
}
