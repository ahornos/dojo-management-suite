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
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Role } from '@dms/shared-types';
import { emptyToUndefined } from '../../common/transforms/empty-to-undefined';

export class CreateUserDto {
  @ApiProperty({ example: 'user@dojo.com', description: 'Unique email address.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'SecurePassword123!', description: 'Initial password; a temporary one is used when omitted.' })
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

  @ApiPropertyOptional({ description: 'National identity number (unique).' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({ example: '1990-05-21', description: 'ISO 8601 birth date.' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional()
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'ES', description: 'ISO 3166-1 alpha-2 country code.' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;

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
