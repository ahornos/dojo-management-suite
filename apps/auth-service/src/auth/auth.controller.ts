/**
 * @file auth.controller.ts
 * @description Exposes REST API HTTP endpoints for user registration, authentication login, 
 * and administrative user account management within the auth-service microservice.
 */

import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth & Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles HTTP POST requests to register a new user in the system (Public endpoint).
   * 
   * @param {RegisterDto} dto - The registration payload containing name, email, and password.
   * @returns {Promise<Object>} The registration response containing a success message and safe user details.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data format or email already exists.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Handles HTTP POST requests to authenticate user credentials and retrieve a JWT session token.
   * 
   * @param {LoginDto} dto - The login payload containing email and password.
   * @returns {Promise<Object>} An object containing the generated access token and user metadata.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and retrieve JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful, returns the access token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials provided.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Creates a new system user administratively (Staff/Admin utility).
   * 
   * @param {any} dto - Payload containing user registration details and personal info.
   * @returns {Promise<Object>} The newly created user record.
   */
  @Post('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user account (Admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  async createUser(@Body() dto: any) {
    return this.authService.createUser(dto);
  }

  /**
   * Retrieves all users registered in the system (Staff/Admin utility).
   * 
   * @returns {Promise<Array>} List of user profiles excluding sensitive password hashes.
   */
  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all system users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the array of users.' })
  async findAllUsers() {
    return this.authService.findAllUsers();
  }

  /**
   * Updates an existing user's profile and administrative data.
   * 
   * @param {string} id - The UUID of the user.
   * @param {any} dto - Payload containing updated personal info and roles.
   * @returns {Promise<Object>} The updated user record.
   */
  @Patch('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile and details' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  async updateUser(@Param('id') id: string, @Body() dto: any) {
    return this.authService.updateUser(id, dto);
  }

  /**
   * Removes or deactivates a user account from the system.
   * 
   * @param {string} id - The UUID of the user.
   * @returns {Promise<Object>} Confirmation message.
   */
  @Delete('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete or deactivate a user account' })
  @ApiResponse({ status: 200, description: 'User successfully deleted/deactivated.' })
  async removeUser(@Param('id') id: string) {
    return this.authService.removeUser(id);
  }
}