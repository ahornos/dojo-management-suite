/**
 * @file update-student.dto.ts
 * @description Data Transfer Object (DTO) for validating partial updates to an existing student profile.
 * Incorporates tracking fields for student lifecycle modifications (status transitions and reasoning).
 */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @ApiPropertyOptional({ description: 'Optional textual reason required when pausing or dropping a student account.' })
  @IsOptional()
  @IsString()
  statusReason?: string;
}