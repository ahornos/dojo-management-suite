import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { validateEnv } from './config/env.validation';

/**
 * @class AppModule
 * @description Root module of the Auth Service. Loads and validates the environment (fail-fast on a
 * missing `JWT_SECRET`), then imports database connectivity (PrismaModule) and the authentication
 * domain (AuthModule) plus the internal user directory consumed by peer services (UsersModule).
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Monorepo root is the single catalog; local `.env` is a leftover fallback only.
      envFilePath: ['../../.env', '.env'],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
