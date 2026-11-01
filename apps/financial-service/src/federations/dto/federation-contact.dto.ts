/**
 * @file federation-contact.dto.ts
 * @description Tagged multi-medium contact for a federation catalog entry.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

const CONTACT_MEDIA = ['EMAIL', 'PHONE', 'ADDRESS'] as const;

/**
 * @param {unknown} value - Raw input.
 * @returns {unknown} Trimmed string, or the original value.
 */
function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * One tagged contact (several phones, emails, or addresses per federation).
 */
export class FederationContactDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ enum: CONTACT_MEDIA })
  @IsIn(CONTACT_MEDIA)
  medium: (typeof CONTACT_MEDIA)[number];

  @ApiProperty({ example: 'secretaria@fcj.cat' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'Secretaria' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  tag?: string;
}

/**
 * Full replacement list for `POST /financial/federations/:id/contacts`.
 */
export class ReplaceFederationContactsDto {
  @ApiProperty({ type: [FederationContactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FederationContactDto)
  contacts: FederationContactDto[];
}
