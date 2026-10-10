/**
 * @file create-student.dto.ts
 * @description Data Transfer Object (DTO) for validating incoming student creation requests.
 * Includes student lifecycle status mapping for the initial registration phase.
 */

import { IsBoolean, IsOptional, IsString, IsEmail, ValidateNested, IsDateString, Length, IsArray, IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum StudentStatusEnum {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DROPPED = 'DROPPED',
}

export class StudentUserDataDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Primary email address for the user account.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'User given name.' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User family name.' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '12345678Z', description: 'National Identification Number or Passport.' })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({ example: '+34600000000', description: 'Contact phone number.' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '2012-05-15', description: 'Date of birth in YYYY-MM-DD format.' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'Main Street 123', description: 'Street address including number and door.' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Barcelona', description: 'City or municipality.' })
  @IsOptional()
  @IsString()
  city?: string;
  
  @ApiPropertyOptional({ example: 'Catalonia', description: 'State, province, or region.' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '08001', description: 'Postal or ZIP code.' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'ES', description: 'ISO 3166-1 alpha-2 country code.' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;
}

export class GuardianDto {
  @ApiPropertyOptional({ description: 'Indicates if the guardian already has a system user account.' })
  @IsOptional()
  @IsBoolean()
  isExistingUser?: boolean;

  @ApiPropertyOptional({ description: 'UUID of the existing guardian user account.' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'Jane', description: 'Guardian given name.' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Guardian family name.' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'jane.doe@example.com', description: 'Guardian contact email.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+34611222333', description: 'Guardian emergency contact phone.' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '87654321X', description: 'Guardian National ID.' })
  @IsString()
  dni: string;

  @ApiPropertyOptional({ example: 'Madre', description: 'Relationship to the student (e.g., Padre, Madre, Tutor Legal, or custom).' })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional({ example: 'Tío', description: 'Custom relationship specification if relationship is set to Other.' })
  @IsOptional()
  @IsString()
  customRelationship?: string;
}

export class EmergencyContactDto {
  @ApiProperty({ example: 'Carlos López', description: 'Full name of the emergency contact.' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+34600000000', description: 'Emergency contact phone number.' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Pareja', description: 'Relationship to the student.' })
  @IsString()
  relationship: string;

  @ApiPropertyOptional({ example: 'Abuela', description: 'Custom relationship specification if relationship is set to Other.' })
  @IsOptional()
  @IsString()
  customRelationship?: string;
}

export class StudentDisciplineAssignmentDto {
  @ApiProperty({ description: 'UUID of the discipline to enroll the student in.' })
  @IsString()
  disciplineId: string;

  @ApiPropertyOptional({ description: 'Optional specific belt rank UUID if transferring from another academy.' })
  @IsOptional()
  @IsString()
  beltRankId?: string;

  @ApiPropertyOptional({ description: 'Initial number of stripes or degrees on the belt.', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentStripes?: number;
}

export class CreateStudentDto {
  @ApiProperty({ description: 'Flag indicating if the base student user already exists in the system.' })
  @IsBoolean()
  isExistingUser: boolean;

  @ApiPropertyOptional({ description: 'UUID of the existing user (required if isExistingUser is true).' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ enum: StudentStatusEnum, description: 'Initial lifecycle status of the student. Defaults to ACTIVE.' })
  @IsOptional()
  @IsEnum(StudentStatusEnum)
  status?: StudentStatusEnum;

  @ApiProperty({ description: 'Personal data payload for the student user account.' })
  @ValidateNested()
  @Type(() => StudentUserDataDto)
  userData: StudentUserDataDto;

  @ApiProperty({ description: 'Flag indicating if the student is under 18 years old.' })
  @IsBoolean()
  isMinor: boolean;

  @ApiPropertyOptional({ type: [GuardianDto], description: 'Array of legal guardians. Strictly required if the student is a minor.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuardianDto)
  guardians?: GuardianDto[];

  @ApiPropertyOptional({ type: [EmergencyContactDto], description: 'Array of lightweight emergency contacts. Utilized predominantly for adult students.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  emergencyContacts?: EmergencyContactDto[];

  @ApiPropertyOptional({ type: [StudentDisciplineAssignmentDto], description: 'List of discipline assignments with optional custom belts and stripe levels.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentDisciplineAssignmentDto)
  disciplines?: StudentDisciplineAssignmentDto[];
}