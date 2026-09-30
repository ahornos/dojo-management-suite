import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file mass-fee-update.dto.ts
 * @description Data Transfer Object for performing bulk fee increases (e.g., IPC adjustment or general increment).
 */
export class MassFeeUpdateDto {
  @ApiPropertyOptional({ description: 'Percentage increase to apply (e.g., 2.5 for 2.5%)', example: 2.5 })
  @IsNumber()
  @IsOptional()
  percentage?: number;

  @ApiPropertyOptional({ description: 'Fixed amount increase to add to the base prices', example: 5.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fixedAmount?: number;

  @ApiPropertyOptional({ description: 'Optional ID of a specific fee tier to target. If omitted, applies to all active tiers.', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  tierId?: string;
}