/**
 * @file resolve-files.ts
 * @description Locates numbered production CSVs under `import-data/`.
 * Only `*.csv` files are imported. Anything containing `.mock` is ignored.
 */

import * as fs from 'fs';
import * as path from 'path';
import { IMPORT_DATA_DIR } from '../import-data-path';
import { PIPELINE_FILE_STEMS, type PipelineFileStem } from './constants';

/**
 * Absolute path to a production pipeline CSV (never a mock template).
 */
export interface ResolvedPipelineFile {
  stem: PipelineFileStem;
  filePath: string;
}

/**
 * @param {string} fileName - Basename or absolute path.
 * @returns {boolean} True only for production `*.csv` (not `*.csv.mock` / `*.mock.csv`).
 */
export function isProductionCsvFileName(fileName: string): boolean {
  const base = path.basename(fileName);
  if (base.includes('.mock')) return false;
  return base.toLowerCase().endsWith('.csv');
}

/**
 * Resolves the production CSV for one stem. Mock templates are never returned.
 *
 * @param {PipelineFileStem} stem - Numbered file stem.
 * @param {string} [directory] - Override of `import-data/` (tests).
 * @returns {ResolvedPipelineFile | null} Production file, or null when absent.
 */
export function resolvePipelineCsv(
  stem: PipelineFileStem,
  directory: string = IMPORT_DATA_DIR,
): ResolvedPipelineFile | null {
  const realCsv = path.join(directory, `${stem}.csv`);
  if (!fs.existsSync(realCsv) || !fs.statSync(realCsv).isFile()) {
    return null;
  }
  if (!isProductionCsvFileName(realCsv)) {
    return null;
  }
  return { stem, filePath: realCsv };
}

/**
 * Lists production `*.csv` files in 01→08 order. Missing stems are skipped.
 *
 * @param {string} [directory] - Override of `import-data/`.
 * @returns {ResolvedPipelineFile[]} Existing production files only.
 */
export function resolvePipelineFiles(directory: string = IMPORT_DATA_DIR): ResolvedPipelineFile[] {
  return PIPELINE_FILE_STEMS.map((stem) => resolvePipelineCsv(stem, directory)).filter(
    (file): file is ResolvedPipelineFile => file !== null,
  );
}

/**
 * Lists tracked `*.csv.mock` templates (documentation / fixture tests only — never imported).
 *
 * @param {string} [directory] - Override of `import-data/`.
 * @returns {ResolvedPipelineFile[]} Existing mock templates.
 */
export function resolveMockTemplates(directory: string = IMPORT_DATA_DIR): ResolvedPipelineFile[] {
  const files: ResolvedPipelineFile[] = [];
  for (const stem of PIPELINE_FILE_STEMS) {
    const mock = path.join(directory, `${stem}.csv.mock`);
    if (fs.existsSync(mock) && fs.statSync(mock).isFile()) {
      files.push({ stem, filePath: mock });
    }
  }
  return files;
}
