import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';
import { PromotionsModule } from './promotions/promotions.module';
import { DisciplinesModule } from './disciplines/disciplines.module';

@Module({
  imports: [PrismaModule, StudentsModule,AttendancesModule, PromotionsModule, DisciplinesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}