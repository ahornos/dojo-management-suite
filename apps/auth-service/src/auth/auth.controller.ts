import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * @class AuthController
 * @description Exposes REST API HTTP endpoints for user registration and authentication login.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles HTTP POST requests to register a new user in the system.
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
}