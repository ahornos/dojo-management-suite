/**
 * @file academic.controller.ts
 * @description API Gateway controller responsible for routing academic domain requests.
 * Acts as a reverse proxy forwarding requests to the internal academic-service.
 */

import { Controller, All, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';

/**
 * @class AcademicController
 * @description Intercepts requests under the 'academic' prefix and proxies them 
 * to the underlying academic microservice keeping the global /api prefix.
 */
@ApiTags('Academic Proxy')
@ApiBearerAuth()
@Controller('academic')
export class AcademicController {
  // Internal URL resolved from the environment, defaulting to the Docker service name or local port 3002
  private readonly targetUrl = process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3002';

  constructor(private readonly proxyService: ProxyService) {}

  /**
   * @description Forwards all academy discipline requests to the academic service.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('disciplines*')
  @ApiOperation({ summary: 'Forward all academy discipline requests' })
  async proxyDisciplines(@Req() req: Request) {
    // Maps /api/academic/disciplines -> http://localhost:3002/api/disciplines
    const targetPath = req.originalUrl.replace('/api/academic', '/api');
    return this.proxyService.forwardRequest(`${this.targetUrl}${targetPath}`, req);
  }

  /**
   * @description Forwards all student profile and roster requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('students*')
  @ApiOperation({ summary: 'Forward all student profile requests' })
  async proxyStudents(@Req() req: Request) {
    const targetPath = req.originalUrl.replace('/api/academic', '/api');
    return this.proxyService.forwardRequest(`${this.targetUrl}${targetPath}`, req);
  }

  /**
   * @description Forwards all attendance logging and tracking requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('attendances*')
  @ApiOperation({ summary: 'Forward all attendance logging requests' })
  async proxyAttendances(@Req() req: Request) {
    const targetPath = req.originalUrl.replace('/api/academic', '/api');
    return this.proxyService.forwardRequest(`${this.targetUrl}${targetPath}`, req);
  }

  /**
   * @description Forwards all belt grading and graduation requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the academic-service.
   */
  @All('graduations*')
  @ApiOperation({ summary: 'Forward all belt graduation requests' })
  async proxyGraduations(@Req() req: Request) {
    const targetPath = req.originalUrl.replace('/api/academic', '/api');
    return this.proxyService.forwardRequest(`${this.targetUrl}${targetPath}`, req);
  }
}