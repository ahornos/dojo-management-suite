import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * @class AppController
 * @description Root controller for the API Gateway exposing basic health check endpoints.
 */
@ApiTags('Gateway Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * @description Verifies the operational status of the API Gateway.
   * @returns {Object} A JSON object containing the service status and current timestamp.
   */
  @Get()
  @ApiOperation({ summary: 'Verify API Gateway health status' })
  getHealth() {
    return this.appService.getHealthStatus();
  }
}