/**
 * @file update-saved-theme.dto.ts
 * @description Partial update for a tenant-owned custom appearance (name and/or tokens).
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { ThemeConfigDto } from './update-academy-settings.dto';

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
 * Validated body of `PATCH /academy/appearances/:id`.
 */
export class UpdateSavedThemeDto {
  @ApiPropertyOptional({ example: 'Summer camp' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'SAVED_THEME_NAME_INVALID' })
  @MaxLength(80, { message: 'SAVED_THEME_NAME_INVALID' })
  name?: string;

  @ApiPropertyOptional({ type: ThemeConfigDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ThemeConfigDto)
  themeConfig?: ThemeConfigDto;
}
