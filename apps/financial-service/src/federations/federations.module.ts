/**
 * @file federations.module.ts
 * @description NestJS module for the federation catalog and seasonal payout budget.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FederationsController } from './federations.controller';
import { InternalFederationsController } from './internal-federations.controller';
import { FederationsService } from './federations.service';
import { InternalApiKeyGuard } from '../guards/internal-api-key.guard';

/**
 * Exposes `/financial/federations` (staff JWT) and `/internal/federations` (service key).
 */
@Module({
  imports: [PrismaModule],
  controllers: [FederationsController, InternalFederationsController],
  providers: [FederationsService, InternalApiKeyGuard],
  exports: [FederationsService],
})
export class FederationsModule {}
