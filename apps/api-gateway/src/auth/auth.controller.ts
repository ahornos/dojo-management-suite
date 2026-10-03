/**
 * @file auth.controller.ts
 * @description API Gateway controller for authentication routing.
 * Acts as a reverse proxy, forwarding client requests to the internal auth-service.
 */

import { Controller, Post, Req, All } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  // Resolves the internal URL from the environment, defaulting to the Docker service name
  private readonly targetUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';

  constructor(private readonly proxyService: ProxyService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  async login(@Req() req: Request): Promise<any> {
    // Restaurado el prefijo /api que el auth-service requiere internamente
    return this.proxyService.forwardRequest(`${this.targetUrl}/api/auth/login`, req);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}/api/auth/register`, req);
  }

  @All('*')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Forward any other auth-related request' })
  async proxyAll(@Req() req: Request): Promise<any> {
    // Reenviamos la URL original intacta (ej: /api/auth/profile)
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }
}