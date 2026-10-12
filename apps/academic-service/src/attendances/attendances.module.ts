import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';

/**
 * AttendancesModule handles class attendance records. Student names are resolved from the auth-service
 * over HTTP through `UsersDirectoryClient` (hence `HttpModule`).
 */
@Module({
  imports: [HttpModule],
  controllers: [AttendancesController],
  providers: [AttendancesService, PrismaService, UsersDirectoryClient],
  exports: [AttendancesService],
})
export class AttendancesModule {}