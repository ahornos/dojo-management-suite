import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';

/**
 * StudentsModule groups all components related to student management
 * within the academic microservice. Identities are owned by the auth-service and reached over HTTP
 * through `UsersDirectoryClient` (hence `HttpModule`).
 */
@Module({
  imports: [HttpModule],
  controllers: [StudentsController],
  providers: [StudentsService, PrismaService, UsersDirectoryClient],
  exports: [StudentsService], // Exported in case other modules need student services
})
export class StudentsModule {}