import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { AcademyModule } from '../academy/academy.module';
import { GraduationsModule } from '../graduations/graduations.module';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';

/**
 * AttendancesModule handles class attendance records. Student names are resolved from the auth-service
 * over HTTP through `UsersDirectoryClient` (hence `HttpModule`). Academy settings supply the weekly
 * schedule used to generate daily sessions; graduations supply roster eligibility flags.
 */
@Module({
  imports: [HttpModule, AcademyModule, GraduationsModule],
  controllers: [AttendancesController],
  providers: [AttendancesService, PrismaService, UsersDirectoryClient],
  exports: [AttendancesService],
})
export class AttendancesModule {}