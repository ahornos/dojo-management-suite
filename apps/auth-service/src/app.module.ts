import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

/**
 * @class AppModule
 * @description Root module of the Auth Service, importing database connectivity (PrismaModule) 
 * and authentication domain features (AuthModule).
 */
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}