/**
 * @file license-pricing.spec.ts
 * @description Unit tests for season-aware Decimal license pricing.
 */

import { Prisma } from '@dms/database/client';
import {
  pickLicenseType,
  pickPriceRow,
  priceRowAmounts,
  resolveSeasonCatalog,
} from './license-pricing';

const instructor = {
  id: 'row-instructor',
  kind: 'INSTRUCTOR' as const,
  label: '',
  birthYearFrom: null,
  cost: '50.00',
  reduction: '0.00',
  chargePrice: '55.00',
  sortOrder: 0,
};

const adult = {
  id: 'row-adult',
  kind: 'ADULT' as const,
  label: '',
  birthYearFrom: null,
  cost: '35.00',
  reduction: '5.00',
  chargePrice: '40.00',
  sortOrder: 1,
};

const youth = {
  id: 'row-youth',
  kind: 'CUSTOM' as const,
  label: 'Infantil/Juvenil',
  birthYearFrom: 2010,
  cost: '25.00',
  reduction: '0.00',
  chargePrice: '30.00',
  sortOrder: 2,
};

const cadet = {
  id: 'row-cadet',
  kind: 'CUSTOM' as const,
  label: 'Cadet',
  birthYearFrom: 2015,
  cost: '20.00',
  reduction: '0.00',
  chargePrice: '22.00',
  sortOrder: 3,
};

const standardType = {
  id: 'type-standard',
  name: 'Standard',
  isActive: true,
  priceRows: [instructor, adult, youth, cadet],
};

const season = {
  id: 'season-1',
  seasonName: '26/27',
  currency: 'EUR',
  clubCost: '120.00',
  isActive: true,
  licenseTypes: [standardType],
};

describe('resolveSeasonCatalog', () => {
  it('matches seasonName then falls back to the first active season', () => {
    expect(resolveSeasonCatalog([season], '26/27')?.id).toBe('season-1');
    expect(resolveSeasonCatalog([season], 'missing')?.id).toBe('season-1');
  });
});

describe('pickLicenseType', () => {
  it('prefers an explicit id and otherwise the first active type', () => {
    const extra = { ...standardType, id: 'type-plus', name: 'Plus' };
    expect(pickLicenseType([standardType, extra], 'type-plus')?.id).toBe('type-plus');
    expect(pickLicenseType([standardType, extra])?.id).toBe('type-standard');
  });
});

describe('pickPriceRow', () => {
  const rows = [instructor, adult, youth, cadet];

  it('uses the instructor row for staff', () => {
    expect(pickPriceRow(rows, 'INSTRUCTOR')?.id).toBe('row-instructor');
    expect(pickPriceRow(rows, 'TECHNICAL_DIRECTOR')?.id).toBe('row-instructor');
  });

  it('picks the highest matching birth-year threshold, else adult', () => {
    expect(pickPriceRow(rows, 'STUDENT', 2008)?.id).toBe('row-adult');
    expect(pickPriceRow(rows, 'STUDENT', 2012)?.id).toBe('row-youth');
    expect(pickPriceRow(rows, 'STUDENT', 2018)?.id).toBe('row-cadet');
    expect(pickPriceRow(rows, 'STUDENT', null)?.id).toBe('row-adult');
  });
});

describe('priceRowAmounts', () => {
  it('subtracts reduction from cost and uses chargePrice as sale', () => {
    const result = priceRowAmounts(adult);
    expect(result.costAmount.equals(new Prisma.Decimal('30.00'))).toBe(true);
    expect(result.saleAmount.toFixed(2)).toBe('40.00');
    expect(result.seasonalDiscountApplied).toBe(true);
  });

  it('floors reductions at zero', () => {
    const result = priceRowAmounts({ ...adult, reduction: '99.00' });
    expect(result.costAmount.toFixed(2)).toBe('0.00');
  });
});
