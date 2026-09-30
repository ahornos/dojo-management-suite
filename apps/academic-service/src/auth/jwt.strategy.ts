import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
   * @description Validates and extracts the decoded JWT payload, attaching it to the request object.
   * @param {any} payload - The decoded JSON Web Token payload.
   * @returns {Promise<any>} An object containing the user's ID, email, and role.
   */
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}