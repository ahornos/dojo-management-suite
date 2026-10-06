/**
 * @file create-student.dto.ts
 * @description Data Transfer Object for creating a new student profile.
 * Handles complex payloads from the frontend, supporting existing user linking
 * and automated guardian account creation for minors.
 */

import { IsBoolean, IsOptional, IsString, IsEmail, ValidateNested, IsDateString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class StudentUserDataDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '12345678Z' })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({ example: '+34600000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '2012-05-15' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'Main Street 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Barcelona' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '08001' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'ES' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;
}

class ParentUserDataDto {
  @ApiProperty({ example: 'parent.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Jane' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '87654321X' })
  @IsString()
  dni: string;

  @ApiProperty({ example: '+34611222333' })
  @IsString()
  phone: string;
}

export class CreateStudentDto {
  @ApiProperty({ description: 'Flag indicating if the base user already exists in the system' })
  @IsBoolean()
  isExistingUser: boolean;

  @ApiPropertyOptional({ description: 'UUID of the existing user (required if isExistingUser is true)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Personal data of the student' })
  @ValidateNested()
  @Type(() => StudentUserDataDto)
  userData: StudentUserDataDto;

  @ApiProperty({ description: 'Flag indicating if the student is under 18 years old' })
  @IsBoolean()
  isMinor: boolean;

  @ApiPropertyOptional({ description: 'Parent/Guardian data, required if isMinor is true' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ParentUserDataDto)
  parentData?: ParentUserDataDto;
}