import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * @class AuthModule
 * @description Encapsulates the authentication domain: token issuance (JwtModule), token
 * verification for protected routes (PassportModule + JwtStrategy) and the auth controller/service.
 * Depends on the global ConfigModule; `JWT_SECRET` is mandatory and has no fallback.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // Lifetime is a non-sensitive setting, so a default is acceptable (unlike the secret).
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ?? '1d') as NonNullable<
            JwtSignOptions['expiresIn']
          >,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
