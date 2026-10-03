import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * @file discounts.module.ts
 * @description NestJS module for managing financial discounts and dynamic fee calculations.
 */
@Module({
  imports: [PrismaModule],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export class DiscountsModule {}