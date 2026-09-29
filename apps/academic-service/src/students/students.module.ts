import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * StudentsModule groups all components related to student management
 * within the academic microservice.
 */
@Module({
  controllers: [StudentsController],
  providers: [StudentsService, PrismaService],
  exports: [StudentsService], // Exported in case other modules need student services
})
export class StudentsModule {}