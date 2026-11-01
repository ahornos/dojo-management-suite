/**
 * @file licenses.module.ts
 * @description NestJS module for affiliation licenses in the academic bounded context.
 */

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';
import { FederationsClient } from '../federations/federations.client';

/**
 * Exposes `/licenses`. Identities and federation catalog are resolved over HTTP.
 */
@Module({
  imports: [HttpModule],
  controllers: [LicensesController],
  providers: [LicensesService, PrismaService, UsersDirectoryClient, FederationsClient],
  exports: [LicensesService],
})
export class LicensesModule {}
