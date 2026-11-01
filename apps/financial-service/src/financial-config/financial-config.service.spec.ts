/**
 * @file financial-config.service.spec.ts
 * @description Unit tests for FinancialConfigService. Prisma is mocked; every call is tenant-scoped.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FinancialConfigService } from './financial-config.service';

describe('FinancialConfigService', () => {
  let service: FinancialConfigService;
  const prisma = {
    tenantFinancialConfig: {
      upsert: jest.fn(),
    },
  };

  const tenantId = 'fox-jiujitsu-academy';
  const row = {
    id: 'config-1',
    tenantId,
    legalName: '',
    taxId: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'ES',
    creditorId: '',
    iban: '',
    bic: null,
  };

  beforeEach(async () => {
    prisma.tenantFinancialConfig.upsert.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialConfigService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(FinancialConfigService);
  });

  it('getConfig upserts a blank row scoped to the tenant', async () => {
    prisma.tenantFinancialConfig.upsert.mockResolvedValue(row);

    await expect(service.getConfig(tenantId)).resolves.toEqual(row);
    expect(prisma.tenantFinancialConfig.upsert).toHaveBeenCalledWith({
      where: { tenantId },
      create: { tenantId },
      update: {},
    });
  });

  it('upsertConfig writes only the provided fields for that tenant', async () => {
    const data = { creditorId: 'ES12ZZZ1234567', legalName: 'Fox Jiu-Jitsu Academy' };
    prisma.tenantFinancialConfig.upsert.mockResolvedValue({ ...row, ...data });

    await expect(service.upsertConfig(tenantId, data)).resolves.toEqual(expect.objectContaining(data));
    expect(prisma.tenantFinancialConfig.upsert).toHaveBeenCalledWith({
      where: { tenantId },
      create: { tenantId, ...data },
      update: data,
    });
  });
});
