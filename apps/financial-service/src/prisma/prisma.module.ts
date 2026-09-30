import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @file prisma.module.ts
 * @description Global NestJS module providing the PrismaService instance across all feature modules.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}