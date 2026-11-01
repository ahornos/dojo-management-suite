/**
 * @file create-saved-theme.dto.ts
 * @description Body for persisting a tenant-owned custom appearance.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
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
 * Validated body of `POST /academy/appearances`.
 */
export class CreateSavedThemeDto {
  @ApiProperty({ example: 'Night tatami', description: 'Staff-facing appearance title.' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(2, { message: 'SAVED_THEME_NAME_INVALID' })
  @MaxLength(80, { message: 'SAVED_THEME_NAME_INVALID' })
  name: string;

  @ApiProperty({ type: ThemeConfigDto, description: 'Token catalog copied into the saved appearance.' })
  @IsObject()
  @ValidateNested()
  @Type(() => ThemeConfigDto)
  themeConfig: ThemeConfigDto;

  @ApiPropertyOptional({ description: 'When true, also writes the catalog onto academy settings as the active theme.' })
  @IsOptional()
  @IsBoolean()
  activate?: boolean;
}
