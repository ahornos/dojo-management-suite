/**
 * @file jwt.strategy.ts
 * @description Passport JWT strategy for validating incoming bearer tokens.
 * Extracts the token payload and maps user metadata, including the multi-role array,
 * into the Express request object (req.user). The signing secret comes exclusively
 * from `ConfigService`; there is no fallback value.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser, JwtPayload } from '@dms/shared-types';

/**
 * @class JwtStrategy
 * @description Verifies bearer tokens issued by the auth-service using the shared `JWT_SECRET`.
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
   * Validates the decoded JWT payload and constructs the user context for request guards.
   *
   * @param {JwtPayload} payload - The decoded JWT token payload.
   * @returns {AuthenticatedUser} User context injected into req.user.
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
