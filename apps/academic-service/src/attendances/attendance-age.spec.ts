/**
 * @file attendance-age.spec.ts
 * @description Unit tests for check-in age-bracket helpers.
 */

import { ageBracketForAge, matchesAnyAgeBracket, resolveRosterAgeRange } from './attendance-age';

describe('attendance age brackets', () => {
  it('maps completed ages onto the student directory groups', () => {
    expect(ageBracketForAge(4)).toBe('kids');
    expect(ageBracketForAge(10)).toBe('infantil');
    expect(ageBracketForAge(14)).toBe('juvenil');
    expect(ageBracketForAge(30)).toBe('adults');
    expect(ageBracketForAge(null)).toBeNull();
  });

  it('expands a named bracket and keeps an open adult upper bound', () => {
    expect(resolveRosterAgeRange('kids', undefined, undefined)).toEqual({ minAge: 3, maxAge: 6 });
    expect(resolveRosterAgeRange('adults', undefined, undefined)).toEqual({ minAge: 16 });
    expect(resolveRosterAgeRange(undefined, 8, 12)).toEqual({ minAge: 8, maxAge: 12 });
  });

  it('matches a birth date against any selected bracket', () => {
    const today = new Date('2026-11-01T00:00:00.000Z');
    const birth = new Date('2020-01-01T00:00:00.000Z');
    expect(
      matchesAnyAgeBracket(birth, [{ code: 'kids', minAge: 3, maxAge: 6 }], today),
    ).toBe(true);
    expect(
      matchesAnyAgeBracket(birth, [{ code: 'adults', minAge: 16, maxAge: 999 }], today),
    ).toBe(false);
    expect(matchesAnyAgeBracket(birth, [], today)).toBe(true);
  });
});
