/**
 * @file types.ts
 * @description Shared TypeScript interfaces for Disciplines, Programs, and Belt Ranks.
 */

export interface BeltRankPayload {
  id?: string;
  disciplineProgramId: string;
  name: string;
  order: number;
  maxStripes: number;
  minMonthsRequired: number;
  minHoursRequired: number;
}

export interface DisciplineProgramPayload {
  id?: string;
  disciplineId: string;
  name: string;
  minAge: number;
  maxAge: number;
  beltRanks?: BeltRankPayload[];
}

export interface DisciplinePayload {
  id?: string;
  name: string;
  description?: string;
  programs?: DisciplineProgramPayload[];
}