/**
 * @file import-data-path.ts
 * @description Resolves headless import sources under repo `import-data/`.
 * Prefers a real `.csv` (gitignored PII) and falls back to the tracked `.csv.mock` template.
 */

import * as fs from 'fs';
import * as path from 'path';

/** Dataset keys matching `import-data/<dataset>-import.csv[.mock]`. */
export type ImportDataset = 'users' | 'students';

/** Absolute path to the monorepo `import-data/` directory. */
export const IMPORT_DATA_DIR = path.resolve(__dirname, '../../../import-data');

/**
 * Result of locating an import file.
 */
export interface ResolvedImportFile {
  filePath: string;
  usedFallback: boolean;
}

/**
 * Resolves a CSV for import.
 *
 * Order: explicit CLI path → `<directory>/<dataset>-import.csv` → `<dataset>-import.csv.mock`.
 *
 * @param {ImportDataset} dataset - `users` or `students`.
 * @param {string} [cliPath] - Optional absolute or relative path from the CLI.
 * @param {string} [directory] - Override of `import-data/` (used in unit tests).
 * @returns {ResolvedImportFile} Existing file and whether the mock template was used.
 * @throws {Error} When neither the real CSV nor the mock template exists.
 */
export function resolveImportCsv(
  dataset: ImportDataset,
  cliPath?: string,
  directory: string = IMPORT_DATA_DIR,
): ResolvedImportFile {
  if (cliPath) {
    const resolved = path.resolve(cliPath);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      throw new Error(`CSV not found: ${resolved}`);
    }
    return { filePath: resolved, usedFallback: false };
  }

  const realCsv = path.join(directory, `${dataset}-import.csv`);
  if (fs.existsSync(realCsv) && fs.statSync(realCsv).isFile()) {
    return { filePath: realCsv, usedFallback: false };
  }

  const mockCsv = path.join(directory, `${dataset}-import.csv.mock`);
  if (fs.existsSync(mockCsv) && fs.statSync(mockCsv).isFile()) {
    return { filePath: mockCsv, usedFallback: true };
  }

  throw new Error(
    `No import file for "${dataset}". Place ${dataset}-import.csv or ${dataset}-import.csv.mock in ${directory}.`,
  );
}
