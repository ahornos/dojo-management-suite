/**
 * @file register.dto.ts
 * @description Data Transfer Object for user registration.
 * Validates incoming data for creating a new user account, supporting multiple roles.
 */

import { IsString, IsEmail, IsNotEmpty, IsEnum, MinLength, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@dms/shared-types';

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

  @ApiPropertyOptional({ 
    description: 'System roles assigned to the user', 
    enum: Role, 
    isArray: true, 
    example: [Role.STUDENT] 
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}