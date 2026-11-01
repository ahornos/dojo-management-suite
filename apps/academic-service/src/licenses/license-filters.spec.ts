/**
 * @file license-filters.spec.ts
 * @description Unit tests for massive license-generation filter helpers.
 */

import {
  ageInYears,
  defaultValidUntil,
  isMinor,
  matchesAgeFilter,
  matchesBirthYearFilter,
  matchesEnrollmentFilter,
} from './license-filters';

describe('license filters', () => {
  const today = new Date('2026-10-12T00:00:00.000Z');

  it('computes completed years of age', () => {
    expect(ageInYears(new Date('2010-10-12T00:00:00.000Z'), today)).toBe(16);
    expect(ageInYears(new Date('2010-10-13T00:00:00.000Z'), today)).toBe(15);
  });

  it('treats a missing birth date as a miss when an age range is set', () => {
    expect(matchesAgeFilter(null, 16, 16, today)).toBe(false);
    expect(matchesAgeFilter(null, undefined, undefined, today)).toBe(true);
  });

  it('keeps only ages inside the inclusive range', () => {
    const birth = new Date('2014-01-01T00:00:00.000Z');
    expect(matchesAgeFilter(birth, 10, 14, today)).toBe(true);
    expect(matchesAgeFilter(birth, 16, 18, today)).toBe(false);
  });

  it('keeps birth years inside an inclusive custom window', () => {
    const birth = new Date('2010-06-01T00:00:00.000Z');
    expect(matchesBirthYearFilter(birth, 2010, 2015)).toBe(true);
    expect(matchesBirthYearFilter(birth, undefined, 2010)).toBe(true);
    expect(matchesBirthYearFilter(birth, 2011, undefined)).toBe(false);
    expect(matchesBirthYearFilter(null, 2010, 2015)).toBe(false);
    expect(matchesBirthYearFilter(birth, undefined, undefined)).toBe(true);
  });

  it('keeps profiles created strictly before the enrollment bound', () => {
    const createdAt = new Date('2026-01-15T00:00:00.000Z');
    expect(matchesEnrollmentFilter(createdAt, new Date('2026-02-01T00:00:00.000Z'))).toBe(true);
    expect(matchesEnrollmentFilter(createdAt, new Date('2026-01-15T00:00:00.000Z'))).toBe(false);
    expect(matchesEnrollmentFilter(createdAt, undefined)).toBe(true);
  });

  it('defaults validity to 31 August of the season end year', () => {
    expect(defaultValidUntil('2026-2027').toISOString()).toBe('2027-08-31T00:00:00.000Z');
  });

  it('classifies minors from StudentProfile.birthDate, not from User', () => {
    expect(isMinor(new Date('2016-01-01T00:00:00.000Z'), null, today)).toBe(true);
    expect(isMinor(new Date('2000-01-01T00:00:00.000Z'), 'adult-user', today)).toBe(false);
    expect(isMinor(null, null, today)).toBe(true);
    expect(isMinor(null, 'adult-user', today)).toBe(false);
  });
});
