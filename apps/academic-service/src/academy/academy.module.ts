/**
 * @file academy.module.ts
 * @description Wires academy operational settings (identity, age brackets, weekly schedule).
 */

import { Module } from '@nestjs/common';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Academy settings bounded to the academic service. Financial/SEPA stays in financial-service.
 */
@Module({
  controllers: [AcademyController],
  providers: [AcademyService, PrismaService],
  exports: [AcademyService],
})
export class AcademyModule {}
