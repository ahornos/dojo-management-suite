import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RemittanceItemStatus } from '@dms/shared-types';

/**
 * @file update-remittance-item-status.dto.ts
 * @description Data Transfer Object for updating individual collection item status (e.g. returns/rejections).
 */
export class UpdateRemittanceItemStatusDto {
  @ApiProperty({ description: 'New status of the remittance item', enum: RemittanceItemStatus, example: RemittanceItemStatus.RETURNED })
  @IsEnum(RemittanceItemStatus)
  status: RemittanceItemStatus;

  @ApiPropertyOptional({ description: 'Reason code or description if payment is returned by the bank', example: 'Insufficient funds (AM04)' })
  @IsString()
  @IsOptional()
  returnReason?: string;
}