import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Controller exposing public endpoints for authentication and registration.
 * Does not require a JWT token for access.
 */
@ApiTags('Identity & Access Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Public endpoint to register new students in the platform.
   * 
   * @param dto - Registration form data.
   * @returns The newly created user.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Public endpoint to authenticate and log into the platform.
   * 
   * @param dto - User access credentials.
   * @returns JWT token to be used in authenticated requests.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}