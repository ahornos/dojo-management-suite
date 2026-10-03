import { Module } from '@nestjs/common';
import { AcademicController } from './academic.controller';
import { ProxyModule } from '../proxy/proxy.module';

/**
 * @module AcademicModule
 * @description Gateway module handling the routing of all academic operations.
 * Imports the ProxyModule to facilitate HTTP forwarding to the internal academic-service.
 */
@Module({
  imports: [ProxyModule],
  controllers: [AcademicController],
})
export class AcademicModule {}