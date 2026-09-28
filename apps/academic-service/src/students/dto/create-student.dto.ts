import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'John', description: 'First name of the student' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the student' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Unique email address for the student' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+34600123456', description: 'Optional contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'ID of the primary martial arts discipline the student is enrolling in' 
  })
  @IsUUID()
  disciplineId: string;
}