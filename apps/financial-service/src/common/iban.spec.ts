/**
 * @file iban.spec.ts
 * @description Unit tests for IBAN compacting (spaces/hyphens) and Spanish CCC wrapping.
 */

import { compactIban, toIban } from './iban';

describe('IBAN sanitizers', () => {
  it('strips spaces and uppercases before checksum/IsIBAN input', () => {
    expect(toIban('ES91 2100 0418 4502 0005 1332')).toBe('ES9121000418450200051332');
    expect(toIban('es91 2100 0418 4502 0005 1332')).toBe('ES9121000418450200051332');
  });

  it('strips hyphens and other separators', () => {
    expect(toIban('ES91-2100-0418-4502-0005-1332')).toBe('ES9121000418450200051332');
    expect(compactIban('ES91.2100.0418.4502.0005.1332')).toBe('ES9121000418450200051332');
  });

  it('wraps a 20-digit Spanish CCC as an ES IBAN', () => {
    expect(toIban('2100 0418 4502 0005 1332')).toBe('ES9121000418450200051332');
  });

  it('leaves blank input blank so optional validators can skip', () => {
    expect(toIban('')).toBe('');
    expect(toIban('   ')).toBe('');
  });
});
