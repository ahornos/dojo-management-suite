import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FeesModule } from './fees/fees.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CashModule } from './cash/cash.module';
import { RemittancesModule } from './remittances/remittances.module';
import { validateEnv } from './config/env.validation';

/**
 * @file app.module.ts
 * @description Root module of the financial-service microservice. Loads and validates the
 * environment (fail-fast on a missing `JWT_SECRET`) and registers the JWT security baseline.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Service-local .env first, then the monorepo root .env used for local development.
      envFilePath: ['.env', '../../.env'],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    FeesModule,
    DiscountsModule,
    CashModule,
    RemittancesModule
  ],
})
export class AppModule {}
