import { IsNotEmpty, IsOptional, IsString, IsInt, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBeltRankDto {
  @ApiProperty({ example: 'White' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ example: 4, description: 'Max stripes or grades for this belt (e.g. 4 for adults, 12 for kids, 0 for Judo)' })
  @IsInt()
  @Min(0)
  maxStripes: number;

  @ApiProperty({ example: 12, description: 'Minimum training months required in this rank' })
  @IsInt()
  @Min(0)
  minMonthsRequired: number;

  @ApiProperty({ example: 40, description: 'Minimum accumulated Grade Hours (H.d.G.) required' })
  @IsInt()
  @Min(0)
  minHoursRequired: number;
}

export class CreateDisciplineProgramDto {
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

  @ApiProperty({ type: [CreateBeltRankDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateBeltRankDto)
  @ArrayMinSize(1)
  beltRanks: CreateBeltRankDto[];
}

export class CreateDisciplineDto {
  @ApiProperty({ example: 'Brazilian Jiu-Jitsu' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Grappling martial art focused on ground fighting' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [CreateDisciplineProgramDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateDisciplineProgramDto)
  @ArrayMinSize(1)
  programs: CreateDisciplineProgramDto[];
}