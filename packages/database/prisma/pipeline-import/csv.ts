/**
 * @file csv.ts
 * @description Streams a UTF-8 CSV (BOM-safe) through `csv-parser`.
 */

import * as fs from 'fs';
import csvParser from 'csv-parser';

/**
 * Reads every row from a CSV file.
 *
 * @param {string} filePath - Absolute path.
 * @returns {Promise<Record<string, string>[]>} Raw rows keyed by header.
 */
export function readCsv(filePath: string): Promise<Record<string, string>[]> {
  const rows: Record<string, string>[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: Record<string, string>) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}
