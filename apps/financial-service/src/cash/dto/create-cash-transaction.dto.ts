import { IsNumber, IsNotEmpty, IsString, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CashMovementType, CashCategory, PaymentMethod } from '@dms/shared-types';

/**
 * @file create-cash-transaction.dto.ts
 * @description Data Transfer Object for recording a cash income or expense transaction.
 */
export class CreateCashTransactionDto {
  @ApiProperty({ description: 'ID of the cash session this transaction belongs to' })
  @IsString()
  @IsNotEmpty()
  cashSessionId: string;

  @ApiProperty({ description: 'Type of transaction', enum: CashMovementType })
  @IsEnum(CashMovementType)
  type: CashMovementType;

  @ApiProperty({ description: 'Category of the transaction', enum: CashCategory })
  @IsEnum(CashCategory)
  category: CashCategory;

  @ApiProperty({ description: 'Payment method used', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Monetary amount of the transaction', example: 45.00 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Description of the cash movement' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Optional reference ID (e.g. associated student profile)' })
  @IsString()
  @IsOptional()
  studentProfileId?: string;
}