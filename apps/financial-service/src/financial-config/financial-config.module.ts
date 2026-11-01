/**
 * @file financial-config.module.ts
 * @description NestJS module for the academy (tenant) SEPA creditor configuration.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FinancialConfigController } from './financial-config.controller';
import { FinancialConfigService } from './financial-config.service';

/**
 * Exposes `GET`/`PUT /financial/config`. Isolation is by `tenantId`, not a cross-service FK.
 *
 * @class FinancialConfigModule
 */
@Module({
  imports: [PrismaModule],
  controllers: [FinancialConfigController],
  providers: [FinancialConfigService],
  exports: [FinancialConfigService],
})
export class FinancialConfigModule {}
