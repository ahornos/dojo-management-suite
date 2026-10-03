import { IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @class ProposeGraduationDto
 * @description DTO for optional parameters when an instructor proposes a specific belt rank or target stripes.
 */
export class ProposeGraduationDto {
  @ApiPropertyOptional({
    description: 'UUID of the proposed target belt rank',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Proposed belt ID must be a valid UUID' })
  proposedBeltId?: string;

  @ApiPropertyOptional({
    description: 'Number of proposed stripes for the student',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  proposedStripes?: number;
}