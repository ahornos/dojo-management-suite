import { IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Unique identifier of the student profile attending the class' 
  })
  @IsUUID()
  studentProfileId: string;

  @ApiPropertyOptional({ 
    example: '2026-09-28T18:00:00.000Z', 
    description: 'Optional timestamp of the attendance. Defaults to current time if omitted.' 
  })
  @IsOptional()
  @IsDateString()
  attendedAt?: string;
}