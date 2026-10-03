import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProxyModule } from '../proxy/proxy.module';

/**
 * @module AuthModule
 * @description Gateway module responsible for handling and routing authentication requests.
 * Imports the ProxyModule to facilitate HTTP forwarding to the internal auth-service.
 */
@Module({
  imports: [ProxyModule],
  controllers: [AuthController],
})
export class AuthModule {}