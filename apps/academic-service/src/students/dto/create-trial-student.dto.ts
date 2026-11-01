/**
 * @file create-trial-student.dto.ts
 * @description Payload for registering a TRIAL prospect. Adults must supply email and phone;
 * minors must supply a guardian name and phone instead of a full PARENT identity.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

/** Age at which a prospect is treated as an adult (own contact data, no guardian). */
export const TRIAL_ADULT_AGE = 18;

/**
 * Computes whether a birth date corresponds to an adult prospect.
 *
 * @param {string | undefined} birthDate - ISO-8601 date string.
 * @returns {boolean} `true` when the person is at least {@link TRIAL_ADULT_AGE}.
 */
export function isTrialAdult(birthDate: string | undefined): boolean {
  if (!birthDate) {
    return false;
  }

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= TRIAL_ADULT_AGE;
}

/**
 * Validated body of `POST /students/trial`.
 */
export class CreateTrialStudentDto {
  @ApiProperty({ description: 'Discipline the prospect is trying.' })
  @IsUUID()
  disciplineId: string;

  @ApiProperty({ example: 'Maria', description: 'Given name of the prospect.' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Garcia', description: 'Family name of the prospect.' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '2010-05-15', description: 'Date of birth in YYYY-MM-DD format.' })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({ example: 'maria@dojo.test', description: 'Required when the prospect is 18 or older.' })
  @ValidateIf((dto: CreateTrialStudentDto) => isTrialAdult(dto.birthDate))
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional({ example: '+34600000000', description: 'Required when the prospect is 18 or older.' })
  @ValidateIf((dto: CreateTrialStudentDto) => isTrialAdult(dto.birthDate))
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiPropertyOptional({ example: 'Ana Garcia', description: 'Required when the prospect is under 18.' })
  @ValidateIf((dto: CreateTrialStudentDto) => !isTrialAdult(dto.birthDate))
  @IsString()
  @IsNotEmpty()
  guardianName?: string;

  @ApiPropertyOptional({ example: '+34611111111', description: 'Required when the prospect is under 18.' })
  @ValidateIf((dto: CreateTrialStudentDto) => !isTrialAdult(dto.birthDate))
  @IsString()
  @IsNotEmpty()
  guardianPhone?: string;
}
