/**
 * @file discounts.controller.spec.ts
 * @description Unit tests for `DiscountsController`: delegation, decimal-safe responses and access-control metadata.
 */

import 'reflect-metadata';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Prisma } from '@dms/database/client';
import { Role } from '@dms/shared-types';
import { ROLES_KEY } from '@dms/shared-auth';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { ParseDecimalPipe } from '../common/pipes/parse-decimal.pipe';

describe('DiscountsController', () => {
  const service: jest.Mocked<Pick<DiscountsService, 'createDiscount' | 'assignDiscountToStudent' | 'calculateDiscountedFee'>> = {
    createDiscount: jest.fn(),
    assignDiscountToStudent: jest.fn(),
    calculateDiscountedFee: jest.fn(),
  };
  const controller = new DiscountsController(service as unknown as DiscountsService);

  beforeEach(() => jest.clearAllMocks());

  it('delegates discount creation and assignment', async () => {
    const createDto = { code: 'X' } as never;
    const assignDto = { studentProfileId: 's' } as never;

    await controller.createDiscount(createDto);
    await controller.assignDiscount(assignDto);

    expect(service.createDiscount).toHaveBeenCalledWith(createDto);
    expect(service.assignDiscountToStudent).toHaveBeenCalledWith(assignDto);
  });

  it('returns base and final amounts as exact 2-decimal strings', async () => {
    service.calculateDiscountedFee.mockResolvedValue(new Prisma.Decimal('28.3305').toDecimalPlaces(2));

    const result = await controller.calculateDiscount('student-1', new Prisma.Decimal('33.33'));

    expect(service.calculateDiscountedFee).toHaveBeenCalledWith('student-1', expect.any(Prisma.Decimal));
    expect(result).toEqual({ baseAmount: '33.33', finalAmount: '28.33' });
  });

  it('binds the baseAmount route parameter to ParseDecimalPipe', () => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, DiscountsController, 'calculateDiscount') as Record<string, { data: string; pipes: unknown[] }>;
    const baseAmountArg = Object.values(args).find((arg) => arg.data === 'baseAmount');

    expect(baseAmountArg?.pipes).toContain(ParseDecimalPipe);
  });

  it('restricts the calculation endpoint to SUPER_ADMIN and ADMIN_STAFF', () => {
    expect(Reflect.getMetadata(ROLES_KEY, DiscountsController.prototype.calculateDiscount)).toEqual([Role.SUPER_ADMIN, Role.ADMIN_STAFF]);
  });
});
