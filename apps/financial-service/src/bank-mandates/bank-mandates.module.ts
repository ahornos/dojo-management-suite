/**
 * @file bank-mandates.module.ts
 * @description NestJS module for SEPA bank-mandate registration in the financial bounded context.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BankMandatesController } from './bank-mandates.controller';
import { BankMandatesService } from './bank-mandates.service';

/**
 * Exposes `POST|GET /financial/mandates` and `PATCH /financial/mandates/:id/sign`.
 * Does not import academic or auth Prisma models.
 *
 * @class BankMandatesModule
 */
@Module({
  imports: [PrismaModule],
  controllers: [BankMandatesController],
  providers: [BankMandatesService],
  exports: [BankMandatesService],
})
export class BankMandatesModule {}
