import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file assign-promotion.dto.ts
 * @description Data Transfer Object for linking an active promotion to a student profile.
 */
export class AssignPromotionDto {
  @ApiProperty({ description: 'Unique ID of the student profile', example: 'uuid-student' })
  @IsString()
  @IsNotEmpty()
  studentProfileId: string;

  @ApiProperty({ description: 'Unique ID of the promotion to apply', example: 'uuid-promo' })
  @IsString()
  @IsNotEmpty()
  promotionId: string;

  @ApiPropertyOptional({ description: 'Optional explicit expiration date for this student' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}