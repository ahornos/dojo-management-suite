/**
 * @file constants.ts
 * @description Ordered Google-Sheets pipeline stems under repo `import-data/`.
 */

/** Dataset stems processed from academy identity through attendances. */
export const PIPELINE_FILE_STEMS = [
  '01-academy-settings',
  '02-users',
  '03-federations',
  '04-disciplines',
  '05-schedules',
  '06-students',
  '07-licenses',
  '08-attendances',
] as const;

/** One numbered pipeline file without extension. */
export type PipelineFileStem = (typeof PIPELINE_FILE_STEMS)[number];

/** Default academy key when `DEFAULT_TENANT_ID` / `VITE_DEFAULT_TENANT_ID` is unset. */
export const PIPELINE_DEFAULT_TENANT_ID = 'fox-jiujitsu-academy';
