import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FeesModule } from './fees/fees.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CashModule } from './cash/cash.module';
import { RemittancesModule } from './remittances/remittances.module';

/**
 * @file app.module.ts
 * @description Root module of the financial-service microservice.
 */
@Module({
  imports: [
    PrismaModule,
    FeesModule,
    DiscountsModule,
    CashModule,
    RemittancesModule
  ],
})
export class AppModule {}