import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file create-fee-tier.dto.ts
 * @description Data Transfer Object for creating a new base fee tier in the academy.
 */
export class CreateFeeTierDto {
  @ApiProperty({ description: 'Unique name of the fee tier (e.g., BRONZE, SILVER, GOLD, CHILD)', example: 'BRONZE' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Optional description of what the tier includes', example: 'Standard plan up to 3 days per week' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Base monthly price for this tier', example: 45.00 })
  @IsNumber()
  @Min(0)
  baseAmount: number;

  @ApiPropertyOptional({ description: 'Additional criteria such as training hours, age limits, etc.', example: { maxHoursPerWeek: 3, minAge: 6, maxAge: 12 } })
  @IsObject()
  @IsOptional()
  criteria?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Whether the fee tier is currently active', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}