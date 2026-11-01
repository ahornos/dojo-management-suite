/**
 * @file constants.ts
 * @description Shared flags and defaults for the headless student CSV import.
 */

/** Status-history reason used when a legacy row is missing phone, DNI, or date of birth. */
export const DATA_VALIDATION_FLAG = 'REQUIERE_VALIDACION_DATOS';

/** Status-history reason when a minor was imported without a valid distinct parent. */
export const TUTOR_VALIDATION_FLAG = 'REQUIERE_DATOS_TUTOR';

/** Placeholder given name for the synthetic guardian assigned to unlinked minors. */
export const MOCK_PARENT_FIRST_NAME = 'Tutor Pendiente';

/** Placeholder national ID when a mandate is created without a holder DNI. */
export const PENDING_HOLDER_DNI = '00000000X';

/** Default academy tenant for mandate isolation (matches PWA `VITE_DEFAULT_TENANT_ID`). */
export const DEFAULT_TENANT_ID = 'fox-jiujitsu-academy';

/** Temporary password used when the CSV omits one (hashed by the importer). */
export const DEFAULT_IMPORT_PASSWORD = 'FoxJiuJitsu2026!';
