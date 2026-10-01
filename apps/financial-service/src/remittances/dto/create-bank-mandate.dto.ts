import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file create-bank-mandate.dto.ts
 * @description Data Transfer Object for registering a signed SEPA direct debit bank mandate.
 */
export class CreateBankMandateDto {
  @ApiProperty({ description: 'ID of the student profile associated with the mandate', example: 'uuid-student' })
  @IsString()
  @IsNotEmpty()
  studentProfileId: string;

  @ApiProperty({ description: 'Debtor IBAN account number', example: 'ES9121000418450200051234' })
  @IsString()
  @IsNotEmpty()
  iban: string;

  @ApiPropertyOptional({ description: 'BIC / SWIFT code of the debtor bank', example: 'CAIXESBBXXX' })
  @IsString()
  @IsOptional()
  bic?: string;

  @ApiProperty({ description: 'Unique mandate reference code required by SEPA', example: 'MANDATE-2026-001' })
  @IsString()
  @IsNotEmpty()
  mandateReference: string;

  @ApiProperty({ description: 'Date when the mandate was signed by the student/guardian', example: '2026-01-15T00:00:00.000Z' })
  @IsDateString()
  signatureDate: string;

  @ApiPropertyOptional({ description: 'Mandate activation status', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}