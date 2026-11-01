/**
 * @file create-federation.dto.ts
 * @description Validated body for creating a tenant federation (identity + seasons).
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { FederationContactDto } from './federation-contact.dto';
import { FederationSeasonDto } from './federation-season.dto';

/**
 * @param {unknown} value - Raw input.
 * @returns {unknown} Trimmed string, or the original value.
 */
function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * Validated body of `POST /financial/federations`.
 */
export class CreateFederationDto {
  @ApiProperty({ example: 'Federació Catalana de Judo' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'FCJ' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  acronym?: string;

  @ApiProperty({ example: 'ES', description: 'ISO 3166-1 alpha-2.' })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim().toUpperCase();
    return trimmed === '' ? 'ES' : trimmed;
  })
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/, { message: 'FEDERATION_COUNTRY_INVALID' })
  country: string;

  @ApiProperty({ example: 'secretaria@fcj.cat' })
  @Transform(({ value }) => trimString(value))
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ type: [FederationContactDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FederationContactDto)
  contacts?: FederationContactDto[];

  @ApiPropertyOptional({ type: [FederationSeasonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FederationSeasonDto)
  seasons?: FederationSeasonDto[];
}
