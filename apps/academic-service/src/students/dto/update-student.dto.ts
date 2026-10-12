/**
 * @file update-student.dto.ts
 * @description Data Transfer Object (DTO) for validating partial updates to an existing student profile.
 * Incorporates tracking fields for student lifecycle modifications (status transitions and reasoning).
 */

import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEmail, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

/**
 * Turns the empty strings that HTML forms send for untouched inputs into `undefined`,
 * so format validators only run against real values.
 *
 * @param {{ value: unknown }} params - class-transformer params.
 * @returns {unknown} `undefined` for `''`, otherwise the original value.
 */
const emptyToUndefined = ({ value }: { value: unknown }): unknown => (value === '' ? undefined : value);

/**
 * Personal data of the student's identity. Unlike the creation payload, every field is optional because
 * the update is partial; only the provided fields are forwarded to the auth-service.
 */
export class UpdateStudentUserDataDto {
  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Primary email address (informational; not modifiable here).' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'John', description: 'User given name.' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User family name.' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '12345678Z', description: 'National Identification Number or Passport.' })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({ example: '+34600000000', description: 'Contact phone number.' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '2012-05-15', description: 'Date of birth in YYYY-MM-DD format.' })
  @Transform(emptyToUndefined)
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
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;
}

/**
 * Partial student update. Everything from the creation payload is optional, with `userData` relaxed
 * to {@link UpdateStudentUserDataDto}.
 */
export class UpdateStudentDto extends OmitType(PartialType(CreateStudentDto), ['userData'] as const) {
  @ApiPropertyOptional({ type: UpdateStudentUserDataDto, description: 'Personal data to update on the student identity.' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStudentUserDataDto)
  userData?: UpdateStudentUserDataDto;

  @ApiPropertyOptional({ description: 'Optional textual reason required when pausing or dropping a student account.' })
  @IsOptional()
  @IsString()
  statusReason?: string;
}
