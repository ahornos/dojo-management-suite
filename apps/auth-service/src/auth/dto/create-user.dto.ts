/**
 * @file create-user.dto.ts
 * @description Data Transfer Object for ADMINISTRATIVE user creation (`POST /auth/users`).
 * Unlike `RegisterDto`, it may assign roles, so the endpoint is guarded by `RolesGuard`.
 * Empty strings sent by the management form are normalised to `undefined` before validation.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender, Role } from '@dms/shared-types';
import { emptyToUndefined } from '../../common/transforms/empty-to-undefined';

export class CreateUserDto {
  @ApiProperty({ example: 'user@dojo.com', description: 'Unique email address.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: 'SecurePassword123!',
    description: 'Initial password. When omitted, a cryptographically random password is generated (unusable until reset).',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Optional gender for competition categories and stats.' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: Role, isArray: true, description: 'Assigned roles; defaults to [STUDENT].' })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @ApiPropertyOptional({ description: 'Whether the account can log in; defaults to true.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
