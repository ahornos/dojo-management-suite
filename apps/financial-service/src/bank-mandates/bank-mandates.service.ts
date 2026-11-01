/**
 * @file bank-mandates.service.ts
 * @description Owns SEPA bank-mandate persistence in the financial bounded context.
 * Mandates belong to the payer (`payerUserId`), not the student. Coverage of a student's
 * fees is stored as a logical `StudentProfile.bankMandateId` in the academic context.
 */

import { randomBytes } from 'crypto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@dms/database/client';
import { Role } from '@dms/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankMandateDto } from './dto/create-bank-mandate.dto';

const STAFF_ROLES: ReadonlySet<Role> = new Set([Role.SUPER_ADMIN, Role.ADMIN_STAFF]);

/**
 * Issues unique, human-readable SEPA mandate references.
 *
 * @returns {string} Reference of the form `DMS-MANDATE-<timestamp>-<hex>`.
 */
export function generateMandateReference(): string {
  return `DMS-MANDATE-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * Financial owner of `bank_mandates`. Does not query `users` or `student_profiles`.
 */
@Injectable()
export class BankMandatesService {
  /**
   * @param {PrismaService} prisma - Database access limited to the financial domain.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the payer's active mandate, or creates an unsigned one. One parent has one active mandate.
   *
   * @param {CreateBankMandateDto} dto - Payer, IBAN, and account-holder identity.
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object>} The existing or created mandate (`isSigned` is false until clickwrap).
   * @throws {BadRequestException} If the generated reference collides after a retry (`MANDATE_ALREADY_EXISTS`).
   */
  async create(dto: CreateBankMandateDto, tenantId: string) {
    const existing = await this.prisma.bankMandate.findFirst({
      where: { tenantId, payerUserId: dto.payerUserId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) {
      return existing;
    }

    const data = {
      payerUserId: dto.payerUserId,
      tenantId,
      iban: dto.iban,
      bic: dto.bic,
      accountHolderName: dto.accountHolderName.trim(),
      accountHolderDni: dto.accountHolderDni,
      signatureDate: new Date(),
      isSigned: false,
      isActive: true,
    };

    try {
      return await this.prisma.bankMandate.create({
        data: { ...data, mandateReference: generateMandateReference() },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error;
      }
    }

    try {
      return await this.prisma.bankMandate.create({
        data: { ...data, mandateReference: generateMandateReference() },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('MANDATE_ALREADY_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Returns the latest active mandate for a payer in this tenant.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} payerUserId - Auth-service user who owns the IBAN.
   * @returns {Promise<object>} The mandate.
   * @throws {NotFoundException} If none exists (`MANDATE_NOT_FOUND`).
   */
  async findForPayer(tenantId: string, payerUserId: string) {
    const mandate = await this.prisma.bankMandate.findFirst({
      where: { tenantId, payerUserId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!mandate) {
      throw new NotFoundException('MANDATE_NOT_FOUND');
    }
    return mandate;
  }

  /**
   * Returns a mandate by id within this tenant.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Mandate UUID.
   * @returns {Promise<object>} The mandate.
   * @throws {NotFoundException} If none exists (`MANDATE_NOT_FOUND`).
   */
  async findById(tenantId: string, id: string) {
    const mandate = await this.prisma.bankMandate.findFirst({
      where: { id, tenantId },
    });
    if (!mandate) {
      throw new NotFoundException('MANDATE_NOT_FOUND');
    }
    return mandate;
  }

  /**
   * Records clickwrap acceptance. Identity and IP come from the gateway/JWT, not the client body.
   *
   * @param {string} mandateId - Mandate to sign.
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} userId - JWT `sub` of the person who ticked accept.
   * @param {string} ipAddress - Client IP stamped by the API Gateway.
   * @param {Role[]} roles - Caller roles; non-staff may sign only if they are `payerUserId`.
   * @returns {Promise<object>} The signed mandate.
   * @throws {NotFoundException} If the mandate is missing in this tenant (`MANDATE_NOT_FOUND`).
   * @throws {BadRequestException} If it is already signed (`MANDATE_ALREADY_SIGNED`).
   * @throws {ForbiddenException} If a non-staff caller does not own the mandate (`MANDATE_SIGNER_NOT_AUTHORIZED`).
   */
  async markAsSigned(mandateId: string, tenantId: string, userId: string, ipAddress: string, roles: Role[]) {
    const mandate = await this.prisma.bankMandate.findFirst({
      where: { id: mandateId, tenantId },
    });
    if (!mandate) {
      throw new NotFoundException('MANDATE_NOT_FOUND');
    }
    if (mandate.isSigned) {
      throw new BadRequestException('MANDATE_ALREADY_SIGNED');
    }

    const isStaff = roles.some((role) => STAFF_ROLES.has(role));
    if (!isStaff && mandate.payerUserId !== userId) {
      throw new ForbiddenException('MANDATE_SIGNER_NOT_AUTHORIZED');
    }

    return this.prisma.bankMandate.update({
      where: { id: mandateId },
      data: {
        isSigned: true,
        signedAt: new Date(),
        signedByUserId: userId,
        signatureIp: ipAddress,
      },
    });
  }
}
