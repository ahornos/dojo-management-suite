import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @file remittance-item-input.dto.ts
 * @description Helper DTO for individual collection items inside a new remittance batch.
 */
class RemittanceItemInputDto {
  @ApiProperty({ description: 'ID of the active bank mandate to charge', example: 'uuid-mandate' })
  @IsString()
  @IsNotEmpty()
  mandateId: string;

  @ApiProperty({ description: 'Monetary amount to collect via SEPA', example: 45.00 })
  @IsNumber()
  @Min(0.01)
  amount: number;
}

/**
 * @file create-remittance-batch.dto.ts
 * @description Data Transfer Object for generating a new SEPA direct debit remittance batch file.
 */
export class CreateRemittanceBatchDto {
  @ApiProperty({ description: 'Unique reference code for the remittance batch', example: 'REM-2026-04-01' })
  @IsString()
  @IsNotEmpty()
  batchReference: string;

  @ApiProperty({ description: 'Planned execution date for bank collection', example: '2026-04-05T00:00:00.000Z' })
  @IsDateString()
  executionDate: string;

  @ApiProperty({ description: 'List of collection items to include in the batch', type: [RemittanceItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RemittanceItemInputDto)
  items: RemittanceItemInputDto[];
}