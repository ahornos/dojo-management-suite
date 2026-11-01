/**
 * @file iban.spec.ts
 * @description Import-time IBAN compacting, Spanish CCC wrapping, and checksum.
 */

import { isValidIban, toIban } from './iban';

describe('toIban', () => {
  it('compacts spaced Spanish IBANs', () => {
    expect(toIban('ES91 2100 0418 4502 0005 1332')).toBe('ES9121000418450200051332');
    expect(isValidIban('ES91 2100 0418 4502 0005 1332')).toBe(true);
  });

  it('wraps a 20-digit Spanish CCC', () => {
    expect(toIban('2100 0418 4502 0005 1332')).toBe('ES9121000418450200051332');
    expect(isValidIban('21000418450200051332')).toBe(true);
  });
});
