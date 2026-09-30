import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

/**
 * @class AuthModule
 * @description Lightweight auth module for token verification. 
 * Does not issue tokens, only validates them using the shared JWT_SECRET.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}