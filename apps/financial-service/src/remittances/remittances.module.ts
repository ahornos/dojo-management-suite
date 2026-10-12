import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RemittancesController } from './remittances.controller';
import { RemittancesService } from './remittances.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';

/**
 * @file remittances.module.ts
 * @description NestJS module for handling SEPA direct debit mandates and bank remittance files.
 * Debtor identities are resolved from the auth-service over HTTP through `UsersDirectoryClient` (hence `HttpModule`).
 */
@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [RemittancesController],
  providers: [RemittancesService, UsersDirectoryClient],
  exports: [RemittancesService],
})
export class RemittancesModule {}