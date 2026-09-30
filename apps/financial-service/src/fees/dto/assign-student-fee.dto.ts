import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file assign-student-fee.dto.ts
 * @description Data Transfer Object for assigning a fee tier or custom override amount to a student profile.
 */
export class AssignStudentFeeDto {
  @ApiProperty({ description: 'Unique identifier of the student profile', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  studentProfileId: string;

  @ApiPropertyOptional({ description: 'ID of the base fee tier to assign', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsString()
  @IsOptional()
  feeTierId?: string;

  @ApiPropertyOptional({ description: 'Custom agreed historical or specific amount overriding the tier base price', example: 40.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  customAmount?: number;

  @ApiPropertyOptional({ description: 'Start date from which this fee configuration is effective', example: '2026-09-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Optional end date until which this fee configuration is valid', example: '2027-08-31T23:59:59.000Z' })
  @IsDateString()
  @IsOptional()
  effectiveTo?: string;
}