/**
 * @file parse.spec.ts
 * @description Unit coverage for pipeline CSV parsers (roles, status, weekdays, C/G marks).
 */

import { AffiliationLicenseStatus, AttendanceStatus, Role, StudentStatus } from '../../client';
import {
  defaultValidUntil,
  parseAttendanceStatus,
  parseLegacyPromotionMark,
  parseLicenseStatus,
  parseRole,
  parseStudentStatus,
  parseWeekday,
  splitFullName,
} from './parse';

describe('pipeline-import/parse', () => {
  it('maps STAFF_ADMIN onto domain ADMIN_STAFF', () => {
    expect(parseRole('STAFF_ADMIN')).toBe(Role.ADMIN_STAFF);
    expect(parseRole('admin_staff')).toBe(Role.ADMIN_STAFF);
    expect(parseRole('INSTRUCTOR')).toBe(Role.INSTRUCTOR);
  });

  it('rejects unknown roles', () => {
    expect(() => parseRole('OWNER')).toThrow(/Unknown role/);
  });

  it('maps INACTIVE onto PAUSED', () => {
    expect(parseStudentStatus('INACTIVE')).toBe(StudentStatus.PAUSED);
    expect(parseStudentStatus('ACTIVE')).toBe(StudentStatus.ACTIVE);
    expect(parseStudentStatus('')).toBe(StudentStatus.ACTIVE);
  });

  it('parses ISO weekdays and localized names', () => {
    expect(parseWeekday('1')).toBe(1);
    expect(parseWeekday('Monday')).toBe(1);
    expect(parseWeekday('sábado')).toBe(6);
    expect(() => parseWeekday('funday')).toThrow(/dayOfWeek/);
  });

  it('reads legacy C/G promotion marks', () => {
    expect(parseLegacyPromotionMark('C')).toBe('BELT');
    expect(parseLegacyPromotionMark('cinturón')).toBe('BELT');
    expect(parseLegacyPromotionMark('G')).toBe('STRIPE');
    expect(parseLegacyPromotionMark('grado')).toBe('STRIPE');
    expect(parseLegacyPromotionMark('late')).toBeNull();
  });

  it('defaults attendance and license enums', () => {
    expect(parseAttendanceStatus('')).toBe(AttendanceStatus.PRESENT);
    expect(parseAttendanceStatus('LATE')).toBe(AttendanceStatus.LATE);
    expect(parseLicenseStatus('PAID')).toBe(AffiliationLicenseStatus.PAID);
    expect(parseLicenseStatus('unknown')).toBe(AffiliationLicenseStatus.PENDING);
  });

  it('derives 31 August from a YYYY-YYYY season', () => {
    expect(defaultValidUntil('2026-2027').toISOString()).toBe('2027-08-31T00:00:00.000Z');
  });

  it('splits a full name into first / last tokens', () => {
    expect(splitFullName('Aina Serra')).toEqual({ firstName: 'Aina', lastName: 'Serra' });
    expect(splitFullName('Marc')).toEqual({ firstName: 'Marc', lastName: 'Unknown' });
  });
});
