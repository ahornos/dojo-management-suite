import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file open-cash-session.dto.ts
 * @description Data Transfer Object for opening a new daily cash register session.
 */
export class OpenCashSessionDto {
  @ApiProperty({ description: 'Initial cash amount in the register when opening (starting float)', example: 50.00 })
  @IsNumber()
  @Min(0)
  openingFloat: number;

  @ApiPropertyOptional({ description: 'Optional notes regarding the cash session opening', example: 'Standard morning shift opening' })
  @IsString()
  @IsOptional()
  notes?: string;
}