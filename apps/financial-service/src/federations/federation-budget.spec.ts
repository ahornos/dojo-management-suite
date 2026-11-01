/**
 * @file federation-budget.spec.ts
 * @description Unit tests for seasonal federation payout math (Decimal-only).
 */

import { Prisma } from '@dms/database/client';
import { calculateFederationBudget } from './federation-budget';

describe('calculateFederationBudget', () => {
  const catalog = {
    clubFee: new Prisma.Decimal('120.00'),
    studentPrice: new Prisma.Decimal('35.50'),
    instructorPrice: new Prisma.Decimal('50.00'),
    technicalDirectorPrice: new Prisma.Decimal('50.00'),
    studentSalePrice: new Prisma.Decimal('40.00'),
    instructorSalePrice: new Prisma.Decimal('55.00'),
  };

  it('sums club + student + staff federation costs without using floats', () => {
    const result = calculateFederationBudget({
      ...catalog,
      studentCount: 3,
      instructorCount: 2,
      technicalDirectorCount: 1,
      includeClubFee: true,
    });

    expect(result.studentCost.toFixed(2)).toBe('106.50');
    expect(result.instructorCost.toFixed(2)).toBe('100.00');
    expect(result.technicalDirectorCost.toFixed(2)).toBe('50.00');
    expect(result.clubFee.toFixed(2)).toBe('120.00');
    expect(result.totalCost.toFixed(2)).toBe('376.50');
    expect(result.studentSale.toFixed(2)).toBe('120.00');
    expect(result.instructorSale.toFixed(2)).toBe('110.00');
    expect(result.totalSale.toFixed(2)).toBe('230.00');
  });

  it('omits the club fee when includeClubFee is false', () => {
    const result = calculateFederationBudget({
      ...catalog,
      studentCount: 1,
      instructorCount: 0,
      technicalDirectorCount: 0,
      includeClubFee: false,
    });

    expect(result.clubFee.toFixed(2)).toBe('0.00');
    expect(result.totalCost.toFixed(2)).toBe('35.50');
  });

  it('returns zeros when no holders are selected', () => {
    const result = calculateFederationBudget({
      ...catalog,
      studentCount: 0,
      instructorCount: 0,
      technicalDirectorCount: 0,
      includeClubFee: false,
    });

    expect(result.totalCost.toFixed(2)).toBe('0.00');
    expect(result.totalSale.toFixed(2)).toBe('0.00');
  });
});
