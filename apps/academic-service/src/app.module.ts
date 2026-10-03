import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';
import { GraduationsModule } from './graduations/graduations.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
import { AuthModule } from './auth/auth.module';

/**
 * @class AppModule
 * @description Root module of the Academic Service. Orchestrates all domain modules 
 * including security (AuthModule), database (PrismaModule), and core academic features.
 */
@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    StudentsModule,
    AttendancesModule, 
    GraduationsModule, 
    DisciplinesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}