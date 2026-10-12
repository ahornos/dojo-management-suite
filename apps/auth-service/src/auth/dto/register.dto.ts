/**
 * @file register.dto.ts
 * @description Data Transfer Object for PUBLIC user registration.
 * Deliberately exposes no `roles` field: self-registered accounts are always STUDENT, and any
 * attempt to send `roles` is rejected by the global `ValidationPipe` (`forbidNonWhitelisted`).
 * Privileged accounts must be created through the guarded `/auth/users` endpoint.
 */

import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'User email address', example: 'user@dojo.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Plain text password', example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
