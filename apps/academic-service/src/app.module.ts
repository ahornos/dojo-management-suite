import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';
import { GraduationsModule } from './graduations/graduations.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
import { LicensesModule } from './licenses/licenses.module';
import { AcademyModule } from './academy/academy.module';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env.validation';

/**
 * @class AppModule
 * @description Root module of the Academic Service. Loads and validates the environment (fail-fast
 * on a missing `JWT_SECRET`) and orchestrates all domain modules including security (AuthModule),
 * database (PrismaModule), and core academic features.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Monorepo root is the single catalog; local `.env` is a leftover fallback only.
      envFilePath: ['../../.env', '.env'],
      validate: validateEnv,
    }),
    PrismaModule, 
    AuthModule, 
    StudentsModule,
    AttendancesModule, 
    GraduationsModule, 
    DisciplinesModule,
    LicensesModule,
    AcademyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
