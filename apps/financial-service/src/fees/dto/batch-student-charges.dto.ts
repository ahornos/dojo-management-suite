/**
 * @file batch-student-charges.dto.ts
 * @description Batch of one-off member charges created over the internal financial API.
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateStudentChargeItemDto } from './create-student-charge-item.dto';

/**
 * Validated body of `POST /internal/financial/fees/batch`.
 */
export class BatchStudentChargesDto {
  @ApiProperty({ type: [CreateStudentChargeItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'BATCH_FEES_REQUIRED' })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentChargeItemDto)
  fees: CreateStudentChargeItemDto[];
}
