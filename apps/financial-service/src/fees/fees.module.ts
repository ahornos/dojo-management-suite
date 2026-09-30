import { Module } from '@nestjs/common';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * @file fees.module.ts
 * @description NestJS module for managing fee tiers and student fee configurations.
 */
@Module({
  imports: [PrismaModule],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}