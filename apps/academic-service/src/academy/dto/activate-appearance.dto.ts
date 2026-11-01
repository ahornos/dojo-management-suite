/**
 * @file activate-appearance.dto.ts
 * @description Body for switching the tenant's live workspace appearance.
 */

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

/**
 * Trims a string. Non-strings are left unchanged.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Trimmed string, or the original value.
 */
function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * Validated body of `PUT /academy/appearances/active`.
 */
export class ActivateAppearanceDto {
  @ApiProperty({
    example: 'preset:tatami',
    description: '`preset:<id>` for a system catalog or `saved:<uuid>` for a custom appearance.',
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @Matches(/^(preset:(tatami|modern|performance)|saved:[0-9a-fA-F-]{36})$/, {
    message: 'APPEARANCE_KEY_INVALID',
  })
  key: string;
}
