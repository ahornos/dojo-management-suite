import { Module } from '@nestjs/common';
import { FinancialController } from './financial.controller';
import { ProxyModule } from '../proxy/proxy.module';

/**
 * @module FinancialModule
 * @description Gateway module handling the routing of all financial and billing operations.
 * Imports the ProxyModule to facilitate HTTP forwarding to the internal financial-service.
 */
@Module({
  imports: [ProxyModule],
  controllers: [FinancialController],
})
export class FinancialModule {}