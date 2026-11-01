/**
 * @file create-trial-student.dto.spec.ts
 * @description Validation contract of `CreateTrialStudentDto`: adult vs minor required fields.
 */

import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateTrialStudentDto, isTrialAdult } from './create-trial-student.dto';

/**
 * Builds an ISO birth date that yields the given age today.
 *
 * @param {number} age - Desired age in full years.
 * @returns {string} YYYY-MM-DD string.
 */
const birthDateForAge = (age: number): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  return date.toISOString().slice(0, 10);
};

/**
 * Transforms a plain payload and validates it like the global `ValidationPipe`.
 *
 * @param {Record<string, unknown>} payload - Raw request body.
 * @returns {Promise<string[]>} Flattened invalid property names.
 */
async function invalidProperties(payload: Record<string, unknown>): Promise<string[]> {
  const dto = plainToInstance(CreateTrialStudentDto, payload);
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
  return errors.map((error) => error.property);
}

describe('CreateTrialStudentDto', () => {
  const disciplineId = '11111111-1111-4111-8111-111111111111';

  it('treats 18-year-olds as adults', () => {
    expect(isTrialAdult(birthDateForAge(18))).toBe(true);
    expect(isTrialAdult(birthDateForAge(17))).toBe(false);
  });

  it('accepts an adult with email and phone', async () => {
    expect(
      await invalidProperties({
        disciplineId,
        firstName: 'Maria',
        lastName: 'Garcia',
        birthDate: birthDateForAge(25),
        email: 'maria@dojo.test',
        phone: '+34600000000',
      }),
    ).toEqual([]);
  });

  it('rejects an adult without email or phone', async () => {
    const errors = await invalidProperties({
      disciplineId,
      firstName: 'Maria',
      lastName: 'Garcia',
      birthDate: birthDateForAge(25),
    });

    expect(errors).toEqual(expect.arrayContaining(['email', 'phone']));
    expect(errors).not.toEqual(expect.arrayContaining(['guardianName', 'guardianPhone']));
  });

  it('accepts a minor with guardian name and phone', async () => {
    expect(
      await invalidProperties({
        disciplineId,
        firstName: 'Leo',
        lastName: 'Garcia',
        birthDate: birthDateForAge(12),
        guardianName: 'Ana Garcia',
        guardianPhone: '+34611111111',
      }),
    ).toEqual([]);
  });

  it('rejects a minor without guardian contact', async () => {
    const errors = await invalidProperties({
      disciplineId,
      firstName: 'Leo',
      lastName: 'Garcia',
      birthDate: birthDateForAge(12),
      email: 'leo@dojo.test',
    });

    expect(errors).toEqual(expect.arrayContaining(['guardianName', 'guardianPhone']));
  });

  it('rejects a missing disciplineId', async () => {
    const errors = await invalidProperties({
      firstName: 'Maria',
      lastName: 'Garcia',
      birthDate: birthDateForAge(25),
      email: 'maria@dojo.test',
      phone: '600',
    });

    expect(errors).toContain('disciplineId');
  });
});
