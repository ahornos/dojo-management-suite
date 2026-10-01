import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDecimal, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PromotionType, PromotionCategory } from '@dms/shared-types';

export class CreatePromotionDto {
  @ApiProperty({ example: 'SUMMER26' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Summer Special 2026' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Discount for summer enrollments' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PromotionType, example: PromotionType.PERCENTAGE })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiProperty({ enum: PromotionCategory, example: PromotionCategory.TEMPORARY })
  @IsEnum(PromotionCategory)
  category: PromotionCategory;

  @ApiPropertyOptional({ example: '15.00', description: 'Value of the discount' })
  @IsOptional()
  @IsDecimal()
  value?: number;

  @ApiPropertyOptional({ example: '2026-06-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-08-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}