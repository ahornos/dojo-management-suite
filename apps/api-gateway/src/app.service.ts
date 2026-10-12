import { Injectable } from '@nestjs/common';

/**
 * @class AppService
 * @description Provides the gateway liveness information consumed by health checks.
 */
@Injectable()
export class AppService {
  /**
   * Builds the liveness payload.
   *
   * @returns {{ service: string; status: string; timestamp: string }} Service name, status and ISO timestamp.
   */
  getHealthStatus() {
    return {
      service: 'API Gateway',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}