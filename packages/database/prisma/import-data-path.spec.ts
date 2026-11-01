/**
 * @file import-data-path.spec.ts
 * @description Fallback from a missing real CSV to the tracked `.csv.mock` template.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { IMPORT_DATA_DIR, resolveImportCsv } from './import-data-path';

describe('resolveImportCsv', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dms-import-data-'));

  afterAll(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('prefers the real gitignored CSV when it exists', () => {
    const dir = path.join(tempRoot, 'with-real');
    fs.mkdirSync(dir);
    const real = path.join(dir, 'students-import.csv');
    const mock = path.join(dir, 'students-import.csv.mock');
    fs.writeFileSync(real, 'firstName\nReal\n');
    fs.writeFileSync(mock, 'firstName\nMock\n');

    const resolved = resolveImportCsv('students', undefined, dir);
    expect(resolved).toEqual({ filePath: real, usedFallback: false });
  });

  it('falls back to the .csv.mock template when the real CSV is absent', () => {
    const dir = path.join(tempRoot, 'mock-only');
    fs.mkdirSync(dir);
    const mock = path.join(dir, 'users-import.csv.mock');
    fs.writeFileSync(mock, 'Name,Email\nAina,aina@dojo.test\n');

    const resolved = resolveImportCsv('users', undefined, dir);
    expect(resolved).toEqual({ filePath: mock, usedFallback: true });
  });

  it('uses an explicit CLI path without falling back', () => {
    const explicit = path.join(tempRoot, 'custom.csv');
    fs.writeFileSync(explicit, 'email\ncli@dojo.test\n');
    const resolved = resolveImportCsv('students', explicit, path.join(tempRoot, 'unused'));
    expect(resolved.usedFallback).toBe(false);
    expect(resolved.filePath).toBe(explicit);
  });

  it('throws when neither the real CSV nor the mock exists', () => {
    const dir = path.join(tempRoot, 'empty');
    fs.mkdirSync(dir);
    expect(() => resolveImportCsv('students', undefined, dir)).toThrow(/No import file/);
  });

  it('points at the repo import-data directory by default', () => {
    expect(path.basename(IMPORT_DATA_DIR)).toBe('import-data');
    const studentsMock = path.join(IMPORT_DATA_DIR, 'students-import.csv.mock');
    expect(fs.existsSync(studentsMock)).toBe(true);
  });
});
