/**
 * @file federation-budget.ts
 * @description Pure payout calculation: club fee + per-holder federation cost/sale totals.
 */

import { Prisma } from '@dms/database/client';

/**
 * Catalog prices and holder counts used to compute a seasonal federation budget.
 */
export interface FederationBudgetInput {
  clubFee: Prisma.Decimal;
  studentPrice: Prisma.Decimal;
  instructorPrice: Prisma.Decimal;
  technicalDirectorPrice: Prisma.Decimal;
  studentSalePrice: Prisma.Decimal;
  instructorSalePrice: Prisma.Decimal;
  studentCount: number;
  instructorCount: number;
  technicalDirectorCount: number;
  includeClubFee: boolean;
}

/**
 * Seasonal breakdown of what the academy owes the federation vs. what it charges members.
 */
export interface FederationBudgetBreakdown {
  clubFee: Prisma.Decimal;
  studentCount: number;
  studentCost: Prisma.Decimal;
  studentSale: Prisma.Decimal;
  instructorCount: number;
  instructorCost: Prisma.Decimal;
  instructorSale: Prisma.Decimal;
  technicalDirectorCount: number;
  technicalDirectorCost: Prisma.Decimal;
  totalCost: Prisma.Decimal;
  totalSale: Prisma.Decimal;
}

/**
 * Calculates club + student + staff federation costs using exact decimals.
 *
 * @param {FederationBudgetInput} input - Catalog prices and issued-holder counts.
 * @returns {FederationBudgetBreakdown} Cost (payout) and sale (member) totals.
 */
export function calculateFederationBudget(input: FederationBudgetInput): FederationBudgetBreakdown {
  const studentCost = input.studentPrice.mul(input.studentCount);
  const instructorCost = input.instructorPrice.mul(input.instructorCount);
  const technicalDirectorCost = input.technicalDirectorPrice.mul(input.technicalDirectorCount);
  const studentSale = input.studentSalePrice.mul(input.studentCount);
  const instructorSale = input.instructorSalePrice.mul(input.instructorCount);
  const clubFee = input.includeClubFee ? input.clubFee : new Prisma.Decimal(0);

  return {
    clubFee,
    studentCount: input.studentCount,
    studentCost,
    studentSale,
    instructorCount: input.instructorCount,
    instructorCost,
    instructorSale,
    technicalDirectorCount: input.technicalDirectorCount,
    technicalDirectorCost,
    totalCost: clubFee.add(studentCost).add(instructorCost).add(technicalDirectorCost),
    totalSale: studentSale.add(instructorSale),
  };
}
