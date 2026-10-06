/**
 * @file jwt.strategy.ts
 * @description Passport JWT strategy for validating incoming bearer tokens.
 * Extracts the token payload and maps user metadata, including the multi-role array, 
 * into the Express request object (req.user).
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@dms/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
    });
  }

  /**
   * Validates the decoded JWT payload and constructs the user context for request guards.
   * 
   * @param {Object} payload - The decoded JWT token payload.
   * @param {string} payload.sub - User unique identifier.
   * @param {string} payload.email - User email address.
   * @param {Role[]} payload.roles - Array of assigned system roles.
   * @returns {Object} User context injected into req.user.
   */
  async validate(payload: { sub: string; email: string; roles: Role[] }) {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles || [Role.STUDENT], // Ensures the roles array is correctly attached to req.user
    };
  }
}