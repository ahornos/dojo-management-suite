/**
 * @file bank-mandates.service.spec.ts
 * @description Unit tests for BankMandatesService. Prisma is mocked; mandate references are generated internally.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@dms/database/client';
import { Role } from '@dms/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { BankMandatesService } from './bank-mandates.service';

describe('BankMandatesService', () => {
  let service: BankMandatesService;
  const prisma = {
    bankMandate: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const tenantId = 'fox-jiujitsu-academy';
  const dto = {
    payerUserId: '22222222-2222-4222-8222-222222222222',
    iban: 'ES9121000418450200051332',
    accountHolderName: 'Ana Garcia',
    accountHolderDni: '12345678Z',
  };

  beforeEach(async () => {
    prisma.bankMandate.create.mockReset();
    prisma.bankMandate.findFirst.mockReset();
    prisma.bankMandate.update.mockReset();
    prisma.bankMandate.findFirst.mockResolvedValue(null);
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankMandatesService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(BankMandatesService);
  });

  it('persists an unsigned mandate scoped to the tenant and payer', async () => {
    prisma.bankMandate.create.mockImplementation(({ data }) => Promise.resolve({ id: 'mandate-1', ...data }));

    const before = Date.now();
    const result = await service.create(dto, tenantId);
    const after = Date.now();

    expect(prisma.bankMandate.create).toHaveBeenCalledTimes(1);
    const saved = prisma.bankMandate.create.mock.calls[0][0].data;
    expect(saved.tenantId).toBe(tenantId);
    expect(saved.isSigned).toBe(false);
    expect(saved.payerUserId).toBe(dto.payerUserId);
    expect(saved.mandateReference).toMatch(/^DMS-MANDATE-\d+-[A-F0-9]{8}$/);
    expect(saved.signatureDate.getTime()).toBeGreaterThanOrEqual(before);
    expect(saved.signatureDate.getTime()).toBeLessThanOrEqual(after);
    expect(result).toEqual(expect.objectContaining({ id: 'mandate-1', iban: dto.iban }));
    expect(saved).not.toHaveProperty('studentProfileId');
  });

  it('reuses the payer\'s existing active mandate instead of creating a second one', async () => {
    prisma.bankMandate.findFirst.mockResolvedValue({ id: 'mandate-existing', payerUserId: dto.payerUserId });

    await expect(service.create(dto, tenantId)).resolves.toEqual(
      expect.objectContaining({ id: 'mandate-existing' }),
    );
    expect(prisma.bankMandate.create).not.toHaveBeenCalled();
  });

  it('retries once on a unique-reference collision then succeeds', async () => {
    const collision = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '5.22.0',
    });
    prisma.bankMandate.create
      .mockRejectedValueOnce(collision)
      .mockResolvedValueOnce({ id: 'mandate-2', mandateReference: 'DMS-MANDATE-retry' });

    await expect(service.create(dto, tenantId)).resolves.toEqual(expect.objectContaining({ id: 'mandate-2' }));
    expect(prisma.bankMandate.create).toHaveBeenCalledTimes(2);
  });

  it('maps a second unique-reference collision to MANDATE_ALREADY_EXISTS', async () => {
    const collision = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '5.22.0',
    });
    prisma.bankMandate.create.mockRejectedValue(collision);

    await expect(service.create(dto, tenantId)).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.create(dto, tenantId)).rejects.toThrow('MANDATE_ALREADY_EXISTS');
  });

  describe('markAsSigned', () => {
    const mandate = {
      id: 'mandate-1',
      tenantId,
      isSigned: false,
      payerUserId: 'parent-1',
    };

    it('records clickwrap audit fields for staff', async () => {
      prisma.bankMandate.findFirst.mockResolvedValue(mandate);
      prisma.bankMandate.update.mockImplementation(({ data }) =>
        Promise.resolve({ ...mandate, ...data }),
      );

      const before = Date.now();
      const result = await service.markAsSigned(
        mandate.id,
        tenantId,
        'admin-uuid',
        '203.0.113.10',
        [Role.ADMIN_STAFF],
      );
      const after = Date.now();

      expect(result.isSigned).toBe(true);
      expect(result.signedByUserId).toBe('admin-uuid');
      expect(result.signatureIp).toBe('203.0.113.10');
      expect(result.signedAt.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.signedAt.getTime()).toBeLessThanOrEqual(after);
      expect(prisma.bankMandate.findFirst).toHaveBeenCalledWith({
        where: { id: mandate.id, tenantId },
      });
    });

    it('allows a parent who owns the mandate', async () => {
      prisma.bankMandate.findFirst.mockResolvedValue(mandate);
      prisma.bankMandate.update.mockResolvedValue({ ...mandate, isSigned: true });

      await expect(
        service.markAsSigned(mandate.id, tenantId, 'parent-1', '203.0.113.10', [Role.PARENT]),
      ).resolves.toEqual(expect.objectContaining({ isSigned: true }));
    });

    it('rejects a non-staff caller who is not the payer', async () => {
      prisma.bankMandate.findFirst.mockResolvedValue(mandate);

      await expect(
        service.markAsSigned(mandate.id, tenantId, 'other-user', '203.0.113.10', [Role.STUDENT]),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(prisma.bankMandate.update).not.toHaveBeenCalled();
    });

    it('rejects a second signature', async () => {
      prisma.bankMandate.findFirst.mockResolvedValue({ ...mandate, isSigned: true });

      await expect(
        service.markAsSigned(mandate.id, tenantId, 'admin-uuid', '203.0.113.10', [Role.SUPER_ADMIN]),
      ).rejects.toThrow('MANDATE_ALREADY_SIGNED');
    });

    it('rejects a mandate outside the tenant', async () => {
      prisma.bankMandate.findFirst.mockResolvedValue(null);

      await expect(
        service.markAsSigned(mandate.id, tenantId, 'admin-uuid', '203.0.113.10', [Role.ADMIN_STAFF]),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  it('findForPayer returns the latest active mandate in the tenant', async () => {
    prisma.bankMandate.findFirst.mockResolvedValue({ id: 'mandate-1', tenantId });

    await expect(service.findForPayer(tenantId, dto.payerUserId)).resolves.toEqual(
      expect.objectContaining({ id: 'mandate-1' }),
    );
    expect(prisma.bankMandate.findFirst).toHaveBeenCalledWith({
      where: { tenantId, payerUserId: dto.payerUserId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('findForPayer throws when none exists', async () => {
    prisma.bankMandate.findFirst.mockResolvedValue(null);

    await expect(service.findForPayer(tenantId, dto.payerUserId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
