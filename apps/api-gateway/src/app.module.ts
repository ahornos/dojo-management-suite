import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProxyModule } from './proxy/proxy.module';
import { AcademicController } from './academic/academic.controller';
import { FinancialController } from './financial/financial.controller';

/**
 * @file app.module.ts
 * @description Root module of the API Gateway. Configures environment variables,
 * global rate limiting protection, proxy services, and domain routing controllers.
 */
@Module({
  imports: [
    // 1. Load global environment variables (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configure Rate Limiting (Throttler)
    // Limits clients to 100 requests per 60 seconds globally to prevent abuse or DDoS.
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),

    // 3. Import Proxy communication module
    ProxyModule,
  ],
  controllers: [
    AcademicController,
    FinancialController,
  ],
  providers: [
    // 4. Bind the ThrottlerGuard globally across all API Gateway endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}