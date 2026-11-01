/**
 * @file import-students.ts
 * @description Headless CLI for `pnpm import:students`.
 * Default source: `import-data/students-import.csv`, falling back to `students-import.csv.mock`.
 */

import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import csvParser from 'csv-parser';
import { PrismaClient } from '../client';
import { resolveImportCsv } from './import-data-path';
import { DEFAULT_IMPORT_PASSWORD, DEFAULT_TENANT_ID } from './student-import/constants';
import { mapCsvRow } from './student-import/map-row';
import { formatAuditSummary, importStudentRows, type StudentImportPrisma } from './student-import/run-import';

const prisma = new PrismaClient();

/**
 * Reads every CSV row (headers may include a UTF-8 BOM).
 *
 * @param {string} filePath - Absolute path.
 * @returns {Promise<Record<string, string>[]>} Raw rows.
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

/**
 * CLI entry: resolve import-data file, map rows, persist sequentially.
 *
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const resolved = resolveImportCsv('students', process.argv[2]);
  if (resolved.usedFallback) {
    console.log(`[import-students] Real CSV missing; using template ${resolved.filePath}`);
  } else {
    console.log(`[import-students] Reading ${resolved.filePath}`);
  }

  const tenantId = process.env.DEFAULT_TENANT_ID || process.env.VITE_DEFAULT_TENANT_ID || DEFAULT_TENANT_ID;
  const defaultPlain = process.env.IMPORT_STUDENT_PASSWORD || DEFAULT_IMPORT_PASSWORD;
  const defaultPasswordHash = await bcrypt.hash(defaultPlain, 10);

  const rawRows = await readCsv(resolved.filePath);
  const mapped = rawRows.map((row, index) => mapCsvRow(row, index + 1));

  const summary = await importStudentRows(prisma as unknown as StudentImportPrisma, mapped, {
    tenantId,
    defaultPasswordHash,
    hashPassword: (plain) => bcrypt.hash(plain, 10),
  });

  console.log(formatAuditSummary(summary));
}

main()
  .catch((error: unknown) => {
    console.error('[import-students] fatal', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
