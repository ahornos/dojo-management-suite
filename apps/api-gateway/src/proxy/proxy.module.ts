import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './proxy.service';

/**
 * @module ProxyModule
 * @description Encapsulates the HTTP proxy logic used by the API Gateway to route
 * requests to internal microservices safely.
 */
@Module({
  imports: [HttpModule],
  providers: [ProxyService],
  exports: [ProxyService, HttpModule],
})
export class ProxyModule {}