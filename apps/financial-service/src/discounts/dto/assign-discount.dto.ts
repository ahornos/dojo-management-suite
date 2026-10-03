import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @file assign-discount.dto.ts
 * @description Data Transfer Object for linking an active discount to a student profile.
 */
export class AssignDiscountDto {
  @ApiProperty({ description: 'Unique ID of the student profile', example: 'uuid-student' })
  @IsString()
  @IsNotEmpty()
  studentProfileId: string;

  @ApiProperty({ description: 'Unique ID of the discount to apply', example: 'uuid-discount' })
  @IsString()
  @IsNotEmpty()
  discountId: string;

  @ApiPropertyOptional({ description: 'Optional explicit expiration date for this student' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}