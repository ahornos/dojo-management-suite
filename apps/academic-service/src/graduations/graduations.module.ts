import { Module } from '@nestjs/common';
import { GraduationsService } from './graduations.service';
import { GraduationsController } from './graduations.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GraduationsController],
  providers: [GraduationsService, PrismaService],
  exports: [GraduationsService],
})
export class GraduationsModule {}