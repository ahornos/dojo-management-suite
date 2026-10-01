import { IsString, IsEmail, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@dms/shared-types';

/**
 * @file register.dto.ts
 * @description Data Transfer Object for user registration.
 */
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

  @ApiProperty({ description: 'System role assigned to the user', enum: Role, example: Role.STUDENT })
  @IsEnum(Role)
  role: Role;
}