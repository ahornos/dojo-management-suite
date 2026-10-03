import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      service: 'API Gateway',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}