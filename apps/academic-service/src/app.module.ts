import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';
import { GraduationsModule } from './graduations/graduations.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
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
      // Service-local .env first, then the monorepo root .env used for local development.
      envFilePath: ['.env', '../../.env'],
      validate: validateEnv,
    }),
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
