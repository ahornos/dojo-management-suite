import { Controller, Post, Get, Req, All } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';

/**
 * @class AuthController
 * @description API Gateway controller for authentication routing.
 * It acts as a reverse proxy, forwarding client requests to the internal auth-service.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  // Resolves the internal URL from the environment, defaulting to the Docker service name
  private readonly targetUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';

  constructor(private readonly proxyService: ProxyService) {}

  /**
   * @description Forwards the login request to the auth-service.
   * @param {Request} req - The Express request object containing the user credentials in the body.
   * @returns {Promise<any>} The generated JWT token payload from the underlying service.
   */
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  async login(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}/api/auth/login`, req);
  }

  /**
   * @description Forwards the registration request to the auth-service.
   * @param {Request} req - The Express request object containing the new user details.
   * @returns {Promise<any>} The created user record (excluding password).
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}/api/auth/register`, req);
  }

  /**
   * @description Catch-all route to forward any other authentication-related requests 
   * (e.g., profile fetching, token refreshing) that might be added to the internal service.
   * @param {Request} req - The Express request object.
   * @returns {Promise<any>} The response from the internal auth-service.
   */
  @All('*')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Forward any other auth-related request' })
  async proxyAll(@Req() req: Request) {
    // Reconstruct the original path relative to the auth module
    // e.g., /api/auth/profile -> /api/auth/profile
    const path = req.originalUrl;
    return this.proxyService.forwardRequest(`${this.targetUrl}${path}`, req);
  }
}