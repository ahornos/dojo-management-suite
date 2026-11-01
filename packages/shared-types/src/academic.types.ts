/**
 * @file academic.types.ts
 * @description Cross-service DTOs for the academic bounded context (disciplines, ranks).
 */

/**
 * Discipline identity returned by academic-service list/detail endpoints.
 */
export interface DisciplineSummary {
  id: string;
  name: string;
  /** Short staff-facing label (e.g. `BJJ`). Null when unset; UI falls back to `name`. */
  acronym: string | null;
  description?: string | null;
}
