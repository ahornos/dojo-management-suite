import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FeesModule } from './fees/fees.module';
import { PromotionsModule } from './promotions/promotions.module';

/**
 * @file app.module.ts
 * @description Root module of the financial-service microservice.
 */
@Module({
  imports: [
    PrismaModule,
    FeesModule,
    PromotionsModule
  ],
})
export class AppModule {}