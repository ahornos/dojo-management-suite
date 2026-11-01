import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FeesModule } from './fees/fees.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CashModule } from './cash/cash.module';
import { RemittancesModule } from './remittances/remittances.module';
import { BankMandatesModule } from './bank-mandates/bank-mandates.module';
import { FinancialConfigModule } from './financial-config/financial-config.module';
import { FederationsModule } from './federations/federations.module';
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
      // Monorepo root is the single catalog; local `.env` is a leftover fallback only.
      envFilePath: ['../../.env', '.env'],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    FeesModule,
    DiscountsModule,
    CashModule,
    RemittancesModule,
    BankMandatesModule,
    FinancialConfigModule,
    FederationsModule,
  ],
})
export class AppModule {}
