import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsDateString, IsIBAN } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { toIban } from '../../common/iban';

/**
 * @file create-bank-mandate.dto.ts
 * @description Data Transfer Object for registering a signed SEPA direct debit bank mandate.
 */
export class CreateBankMandateDto {
  @ApiProperty({ description: 'Auth-service user id of the payer who owns the IBAN', example: 'uuid-payer' })
  @IsString()
  @IsNotEmpty()
  payerUserId: string;

  @ApiProperty({ description: 'Debtor IBAN account number. Spaces and hyphens are stripped before validation.', example: 'ES9121000418450200051332' })
  @Transform(({ value }) => toIban(value))
  @IsIBAN()
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

  @ApiProperty({ description: 'Legal name of the bank account holder (SEPA debtor)', example: 'Ana Garcia' })
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty({ description: 'DNI/NIF/NIE of the account holder (CaixaBank SEPA requirement)', example: '12345678Z' })
  @IsString()
  @IsNotEmpty()
  accountHolderDni: string;


  @ApiPropertyOptional({ description: 'Mandate activation status', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}