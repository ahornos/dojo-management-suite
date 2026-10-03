import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @class GraduationParamDto
 * @description DTO used to validate student profile UUID parameters across graduation endpoints.
 */
export class GraduationParamDto {
  @ApiProperty({
    description: 'Unique identifier of the student profile',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Student profile ID must be a valid UUID' })
  studentProfileId: string;
}