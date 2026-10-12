/**
 * @file update-student.dto.spec.ts
 * @description Validation contract of `UpdateStudentDto` under the global whitelist/transform pipe settings.
 */
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateStudentDto } from './update-student.dto';

/**
 * The Jest swagger mock's `PartialType` returns the class untouched (no `@IsOptional`), so the two
 * required base flags are always supplied; production `PartialType` makes them optional.
 */
const MOCK_REQUIRED_FIELDS = { isExistingUser: false, isMinor: false };

/**
 * Transforms a plain payload into the DTO and validates it like the global `ValidationPipe` would.
 *
 * @param {Record<string, unknown>} payload - Raw request body.
 * @returns {Promise<{ dto: UpdateStudentDto; errors: string[] }>} Instance and flattened error property names.
 */
async function check(payload: Record<string, unknown>) {
  const dto = plainToInstance(UpdateStudentDto, { ...MOCK_REQUIRED_FIELDS, ...payload });
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
  return { dto, errors: errors.map((e) => e.property) };
}

describe('UpdateStudentDto', () => {
  it('accepts an empty payload (every field is optional)', async () => {
    expect((await check({})).errors).toEqual([]);
  });

  it('turns empty-string form values into undefined so optional validators are skipped', async () => {
    const { dto, errors } = await check({ userData: { birthDate: '', country: '', email: 'a@b.test' } });

    expect(errors).toEqual([]);
    expect(dto.userData?.birthDate).toBeUndefined();
    expect(dto.userData?.country).toBeUndefined();
  });

  it('rejects malformed user data', async () => {
    expect((await check({ userData: { email: 'not-an-email' } })).errors).toContain('userData');
  });

  it('rejects unknown properties (forbidNonWhitelisted)', async () => {
    expect((await check({ unexpected: true })).errors).toContain('unexpected');
  });

  it('rejects an invalid status value', async () => {
    expect((await check({ status: 'NOT_A_STATUS' })).errors).toContain('status');
  });
});
