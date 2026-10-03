import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType, DiscountCategory } from '@dms/shared-types'; 

/**
 * @file create-discount.dto.ts
 * @description Data Transfer Object for creating a new financial discount rule.
 */
export class CreateDiscountDto {
  @ApiProperty({ description: 'Unique code for the discount', example: 'SUMMER2026' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Display name of the discount', example: 'Summer Campaign' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Details about the discount criteria' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Type of calculation applied', enum: DiscountType })
  @IsEnum(DiscountType)
  type: DiscountType;

  @ApiProperty({ description: 'Category classifying the discount', enum: DiscountCategory })
  @IsEnum(DiscountCategory)
  category: DiscountCategory;

  @ApiPropertyOptional({ description: 'Numeric value (percentage or fixed amount) to deduct', example: 15.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @ApiPropertyOptional({ description: 'Activation date of the campaign' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Expiration date of the campaign' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Indicates if the discount is currently active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}