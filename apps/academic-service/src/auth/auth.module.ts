import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

/**
 * @class AuthModule
 * @description Lightweight auth module for token verification.
 * Does not issue tokens; `JwtStrategy` validates them with the shared `JWT_SECRET`
 * obtained from the global ConfigModule (no fallback secret).
 */
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
