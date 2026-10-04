/**
 * @file auth.controller.ts
 * @description API Gateway controller for authentication and user management routing.
 * Acts as a reverse proxy, forwarding client HTTP requests to the internal auth-service.
 */

import { Controller, Get, Post, Patch, Delete, Req, All } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';

/**
 * @class AuthController
 * @description Exposes authentication and administrative user endpoints at the Gateway level.
 * It transparently proxies these requests to the downstream auth-service.
 */
@ApiTags('Authentication & Users')
@Controller('auth')
export class AuthController {
  /**
   * Resolves the internal URL from the environment, defaulting to the internal Docker service name.
   * @private
   * @readonly
   */
  private readonly targetUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';

  constructor(private readonly proxyService: ProxyService) {}

  /**
   * @description Proxies the login request to authenticate a user and retrieve a JWT.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The JWT access token and user metadata.
   */
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  async login(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Proxies the user registration request to the downstream auth-service.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The newly registered user data.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Proxies the administrative request to create a new user account.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The created user data.
   */
  @Post('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user account (Admin)' })
  async createUser(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Proxies the request to retrieve the full list of system users.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} An array of user profiles.
   */
  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all users (Admin)' })
  async findAllUsers(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Proxies the request to update a specific user's profile and settings.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The updated user record.
   */
  @Patch('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by ID' })
  async updateUser(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Proxies the request to permanently delete or deactivate a user account.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} A deletion confirmation message.
   */
  @Delete('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  async removeUser(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Catch-all route to forward any other auth-related request transparently.
   * This ensures backward compatibility and handles edge-case routes without manual mapping.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The proxy response from the internal service.
   */
  @All('*')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Forward any other auth-related request' })
  async proxyAll(@Req() req: Request): Promise<any> {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }
}