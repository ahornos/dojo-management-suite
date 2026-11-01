/**
 * @file upsert-program.dto.ts
 * @description Create/update payloads for a discipline training program (no financial fields).
 */

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { CreateBeltRankDto } from './create-discipline.dto';

/**
 * Body of `POST /disciplines/:id/programs`.
 */
export class CreateProgramDto {
  @ApiProperty({ example: 'Adults (16+)' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 16 })
  @IsOptional()
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({ example: 99 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAge?: number;
}

/**
 * Body of `PATCH /disciplines/programs/:programId`.
 */
export class UpdateProgramDto extends PartialType(CreateProgramDto) {}

/**
 * Body of `POST /disciplines/programs/:programId/belts`.
 */
export class CreateStandaloneBeltRankDto extends CreateBeltRankDto {}
