import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StudentStatus } from '@dms/database/client';

export class CreateStudentDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '+34600000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Main Street 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Barcelona' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '08001' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ enum: StudentStatus, example: 'ACTIVE' })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;
}