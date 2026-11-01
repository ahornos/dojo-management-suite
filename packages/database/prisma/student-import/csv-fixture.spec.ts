/**
 * @file csv-fixture.spec.ts
 * @description Parses the headless bootstrap fixture and checks mapping fallbacks.
 */

import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import { mapCsvRow } from './map-row';

const FIXTURE = path.resolve(__dirname, '../../../../import-data/students-import.csv.mock');
const today = new Date('2026-10-12T00:00:00.000Z');

/**
 * @param {string} filePath - CSV path.
 * @returns {Promise<Record<string, string>[]>} Parsed rows.
 */
function readCsv(filePath: string): Promise<Record<string, string>[]> {
  const rows: Record<string, string>[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: Record<string, string>) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

describe('import-data/students-import.csv.mock', () => {
  it('maps valid, duplicate, incomplete, paused, dropped and CCC IBAN rows', async () => {
    expect(fs.existsSync(FIXTURE)).toBe(true);
    const raw = await readCsv(FIXTURE);
    const mapped = raw.map((row, index) => mapCsvRow(row, index + 1, today));

    expect(mapped).toHaveLength(7);
    expect(mapped[0]?.email).toBe('ana.gomez@dojo.test');
    expect(mapped[0]?.iban).toBe('ES9121000418450200051332');
    expect(mapped[0]?.needsDataValidation).toBe(false);

    expect(mapped[1]?.email).toBe(mapped[0]?.email);

    expect(mapped[2]?.needsDataValidation).toBe(true);
    expect(mapped[2]?.missingFields).toEqual(expect.arrayContaining(['phone', 'dni', 'birthDate']));

    expect(mapped[3]?.status).toBe('PAUSED');
    expect(mapped[4]?.status).toBe('DROPPED');

    expect(mapped[5]?.iban).toBe('ES9121000418450200051332');
    expect(mapped[6]?.guardians.some((guardian) => guardian.email === 'laura.marti@dojo.test')).toBe(true);
    expect(mapped[6]?.isMinor).toBe(true);
  });
});
