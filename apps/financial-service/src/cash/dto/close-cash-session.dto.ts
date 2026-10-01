import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file close-cash-session.dto.ts
 * @description Data Transfer Object for closing a cash register session with physical count reconciliation.
 */
export class CloseCashSessionDto {
  @ApiProperty({ description: 'Actual physical counted cash amount in the register at closing', example: 245.50 })
  @IsNumber()
  @Min(0)
  closingBalance: number;

  @ApiPropertyOptional({ description: 'Optional notes or explanations for discrepancies', example: 'Minor 2 euro difference due to change making' })
  @IsString()
  @IsOptional()
  notes?: string;
}