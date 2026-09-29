import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService, PrismaService],
  exports: [AttendancesService],
})
export class AttendancesModule {}