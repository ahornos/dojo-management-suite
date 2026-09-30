import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PromotionType, PromotionCategory } from '@dms/database/client';

/**
 * @file create-promotion.dto.ts
 * @description Data Transfer Object for creating a new discount rule or promotional campaign.
 */
export class CreatePromotionDto {
  @ApiProperty({ description: 'Unique code for the promotion', example: 'SUMMER2026' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Display name of the promotion', example: 'Summer Campaign' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Details about the promotion criteria' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Type of calculation applied', enum: PromotionType })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiProperty({ description: 'Category classifying the discount', enum: PromotionCategory })
  @IsEnum(PromotionCategory)
  category: PromotionCategory;

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

  @ApiPropertyOptional({ description: 'Indicates if the promotion is currently active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}