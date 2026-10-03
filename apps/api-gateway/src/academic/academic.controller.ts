import { Controller, All, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';

/**
 * @file academic.controller.ts
 * @description API Gateway controller responsible for routing academic domain requests.
 * Acts as a reverse proxy forwarding requests to the internal academic-service.
 */
@ApiTags('Academic Proxy')
@ApiBearerAuth()
@Controller()
export class AcademicController {
  // Internal URL resolved from the environment, defaulting to the Docker service name
  private readonly targetUrl = process.env.ACADEMIC_SERVICE_URL || 'http://academic-service:3000';

  constructor(private readonly proxyService: ProxyService) {}

  /**
   * @description Catch-all route to forward academy discipline requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('disciplines*')
  @ApiOperation({ summary: 'Forward all academy discipline requests' })
  async proxyDisciplines(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Catch-all route to forward student profile and roster requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('students*')
  @ApiOperation({ summary: 'Forward all student profile requests' })
  async proxyStudents(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Catch-all route to forward attendance logging and tracking requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('attendances*')
  @ApiOperation({ summary: 'Forward all attendance logging requests' })
  async proxyAttendances(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Catch-all route to forward belt grading and graduation requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('graduations*')
  @ApiOperation({ summary: 'Forward all belt graduation requests' })
  async proxyGraduations(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }
}