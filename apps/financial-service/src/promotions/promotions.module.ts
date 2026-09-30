import { Module } from '@nestjs/common';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * @file promotions.module.ts
 * @description NestJS module for managing promotional campaigns, discount rules, and dynamic fee calculations.
 */
@Module({
  imports: [PrismaModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}