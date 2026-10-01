import { Module } from '@nestjs/common';
import { CashController } from './cash.controller';
import { CashService } from './cash.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * @file cash.module.ts
 * @description NestJS module for managing cash register operations and accounting audit adjustments.
 */
@Module({
  imports: [PrismaModule],
  controllers: [CashController],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule {}