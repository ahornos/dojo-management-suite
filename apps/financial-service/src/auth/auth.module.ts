import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

/**
 * @class AuthModule
 * @description Registers the Passport `jwt` strategy that `JwtAuthGuard` relies on.
 * Only validates tokens issued by the auth-service; the shared `JWT_SECRET` is read from
 * the global ConfigModule and has no fallback value.
 */
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
