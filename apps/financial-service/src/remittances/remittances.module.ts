import { Module } from '@nestjs/common';
import { RemittancesController } from './remittances.controller';
import { RemittancesService } from './remittances.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * @file remittances.module.ts
 * @description NestJS module for handling SEPA direct debit mandates and bank remittance files.
 */
@Module({
  imports: [PrismaModule],
  controllers: [RemittancesController],
  providers: [RemittancesService],
  exports: [RemittancesService],
})
export class RemittancesModule {}