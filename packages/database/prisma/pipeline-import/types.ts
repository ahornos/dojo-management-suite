/**
 * @file types.ts
 * @description Shared Prisma surface and counters for the numbered CSV pipeline.
 */

import type { PrismaClient } from '../../client';

/**
 * Prisma delegates the pipeline touches (no cross-context `include`).
 */
export type PipelinePrisma = Pick<
  PrismaClient,
  | 'academySettings'
  | 'ageBracket'
  | 'affiliationLicense'
  | 'attendanceRecord'
  | 'attendanceSession'
  | 'academyScheduleSlot'
  | 'bankMandate'
  | 'beltRank'
  | 'discipline'
  | 'disciplineProgram'
  | 'federation'
  | 'federationSeason'
  | 'guardian'
  | 'studentGuardian'
  | 'studentProfile'
  | 'studentRank'
  | 'studentStatusHistory'
  | 'tenantFinancialConfig'
  | 'user'
>;

/**
 * Runtime options for a pipeline run.
 */
export interface PipelineOptions {
  tenantId: string;
  passwordHash: string | null;
  hashPassword: (plain: string) => Promise<string>;
}

/**
 * Counters printed at the end of a batch.
 */
export interface PipelineSummary {
  academyUpserted: number;
  ageBracketsUpserted: number;
  usersUpserted: number;
  federationsUpserted: number;
  disciplinesUpserted: number;
  beltRanksUpserted: number;
  schedulesUpserted: number;
  studentsUpserted: number;
  guardiansLinked: number;
  licensesUpserted: number;
  attendancesUpserted: number;
  promotionsApplied: number;
}
