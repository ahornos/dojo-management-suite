import { Module } from '@nestjs/common';
import { FeesController } from './fees.controller';
import { InternalFeesController } from './internal-fees.controller';
import { FeesService } from './fees.service';
import { PrismaModule } from '../prisma/prisma.module';
import { InternalApiKeyGuard } from '../guards/internal-api-key.guard';

/**
 * @file fees.module.ts
 * @description NestJS module for fee tiers, student fee assignments, and internal one-off charges.
 */
@Module({
  imports: [PrismaModule],
  controllers: [FeesController, InternalFeesController],
  providers: [FeesService, InternalApiKeyGuard],
  exports: [FeesService],
})
export class FeesModule {}