import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';

@Module({
  imports: [PrismaModule, StudentsModule,AttendancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}