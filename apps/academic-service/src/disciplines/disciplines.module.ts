import { Module } from '@nestjs/common';
import { DisciplinesService } from './disciplines.service';
import { DisciplinesController } from './disciplines.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DisciplinesController],
  providers: [DisciplinesService, PrismaService],
  exports: [DisciplinesService],
})
export class DisciplinesModule {}