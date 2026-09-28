import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [PrismaModule, StudentsModule,AttendancesModule, PromotionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}