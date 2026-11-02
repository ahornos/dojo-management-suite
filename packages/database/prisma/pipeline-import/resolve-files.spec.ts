/**
 * @file resolve-files.spec.ts
 * @description Production importer reads only `*.csv`; mock templates are never selected.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { IMPORT_DATA_DIR } from '../import-data-path';
import { PIPELINE_FILE_STEMS } from './constants';
import {
  isProductionCsvFileName,
  resolveMockTemplates,
  resolvePipelineCsv,
  resolvePipelineFiles,
} from './resolve-files';

describe('isProductionCsvFileName', () => {
  it('accepts a real production CSV', () => {
    expect(isProductionCsvFileName('06-students.csv')).toBe(true);
  });

  it('rejects mock templates regardless of suffix order', () => {
    expect(isProductionCsvFileName('06-students.csv.mock')).toBe(false);
    expect(isProductionCsvFileName('06-students.mock.csv')).toBe(false);
  });
});

describe('resolvePipelineCsv', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dms-pipeline-'));

  afterAll(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('returns the production CSV and ignores a sibling mock', () => {
    const dir = path.join(tempRoot, 'with-real');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, '02-users.csv'), 'email\nreal@dojo.test\n');
    fs.writeFileSync(path.join(dir, '02-users.csv.mock'), 'email\nmock@dojo.test\n');
    fs.writeFileSync(path.join(dir, '02-users.mock.csv'), 'email\nalso-mock@dojo.test\n');

    const resolved = resolvePipelineCsv('02-users', dir);
    expect(resolved).toEqual({
      stem: '02-users',
      filePath: path.join(dir, '02-users.csv'),
    });
  });

  it('returns null when only a .csv.mock template exists', () => {
    const dir = path.join(tempRoot, 'mock-only');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, '03-federations.csv.mock'), 'name,acronym\n');
    expect(resolvePipelineCsv('03-federations', dir)).toBeNull();
  });

  it('returns null when only a legacy .mock.csv file exists', () => {
    const dir = path.join(tempRoot, 'legacy-mock');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, '04-disciplines.mock.csv'), 'name\n');
    expect(resolvePipelineCsv('04-disciplines', dir)).toBeNull();
  });

  it('skips missing stems instead of throwing', () => {
    const dir = path.join(tempRoot, 'empty');
    fs.mkdirSync(dir);
    expect(resolvePipelineFiles(dir)).toEqual([]);
  });

  it('lists tracked csv.mock templates from import-data/ without selecting them for import', () => {
    expect(resolvePipelineFiles(IMPORT_DATA_DIR)).toEqual([]);
    const mocks = resolveMockTemplates(IMPORT_DATA_DIR);
    expect(mocks.map((file) => file.stem)).toEqual([...PIPELINE_FILE_STEMS]);
    for (const file of mocks) {
      expect(file.filePath.endsWith('.csv.mock')).toBe(true);
      expect(isProductionCsvFileName(file.filePath)).toBe(false);
      expect(fs.existsSync(file.filePath)).toBe(true);
    }
  });
});
