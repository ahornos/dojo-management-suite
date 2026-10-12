import { randomUUID } from 'crypto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@dms/database/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankMandateDto } from './dto/create-bank-mandate.dto';
import { CreateRemittanceBatchDto } from './dto/create-remittance-batch.dto';
import { UpdateRemittanceItemStatusDto } from './dto/update-remittance-item-status.dto';
import { RemittanceStatus, RemittanceItemStatus } from '@dms/shared-types';
import { generateSepaXml } from './utils/sepa-xml-generator.util';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';

/**
 * @file remittances.service.ts
 * @description Business logic for SEPA bank mandates, remittance batch generation, and return management.
 */
@Injectable()
export class RemittancesService {
  /**
   * @param {PrismaService} prisma - Database access limited to the financial domain.
   * @param {UsersDirectoryClient} usersClient - Resolves debtor identities owned by the auth-service.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersClient: UsersDirectoryClient,
  ) {}

  /**
   * Persists a SEPA mandate when the reference is unique.
   *
   * @param {CreateBankMandateDto} dto - Mandate payload.
   * @returns {Promise<object>} The created mandate.
   * @throws {BadRequestException} If `mandateReference` already exists.
   */
  async createMandate(dto: CreateBankMandateDto) {
    const existing = await this.prisma.bankMandate.findUnique({
      where: { mandateReference: dto.mandateReference },
    });

    if (existing) {
      throw new BadRequestException('MANDATE_ALREADY_EXISTS');
    }

    return this.prisma.bankMandate.create({
      data: {
        studentProfileId: dto.studentProfileId,
        iban: dto.iban,
        bic: dto.bic,
        mandateReference: dto.mandateReference,
        signatureDate: new Date(dto.signatureDate),
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Generates a SEPA remittance batch, validates mandates, computes totals, and builds the XML file.
   * Uses one query for all mandates and ONE batch HTTP call for all debtor identities (no N+1).
   *
   * @param {CreateRemittanceBatchDto} dto - Batch reference, execution date and items to collect.
   * @param {string} userId - Identifier of the user generating the batch (audit).
   * @returns {Promise<object>} The persisted batch with its items plus an `xmlPreview` of the SEPA file.
   * @throws {BadRequestException} If the batch exists, a mandate is missing/inactive, or a debtor identity cannot be resolved.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async generateBatch(dto: CreateRemittanceBatchDto, userId: string) {
    const existingBatch = await this.prisma.remittanceBatch.findUnique({
      where: { batchReference: dto.batchReference },
    });

    if (existingBatch) {
      throw new BadRequestException('REMITTANCE_BATCH_ALREADY_EXISTS');
    }

    // 1. Single query for every mandate involved (the profile is only read for its identity reference).
    const mandateIds = Array.from(new Set(dto.items.map((item) => item.mandateId)));
    const mandates = await this.prisma.bankMandate.findMany({
      where: { id: { in: mandateIds } },
      include: { student: { select: { userId: true } } },
    });
    const mandatesById = new Map(mandates.map((mandate) => [mandate.id, mandate]));

    // 2. Fail fast on missing/inactive mandates before paying for the HTTP round trip.
    for (const item of dto.items) {
      const mandate = mandatesById.get(item.mandateId);

      if (!mandate || !mandate.isActive) {
        throw new BadRequestException('ACTIVE_MANDATE_NOT_FOUND');
      }
    }

    // 3. Single batch call for all debtors, merged in memory below.
    const debtors = await this.usersClient.findManyByIds(mandates.map((mandate) => mandate.student.userId));

    let totalAmount = new Prisma.Decimal(0);
    const itemsWithMandates = [];

    for (const item of dto.items) {
      const mandate = mandatesById.get(item.mandateId)!;
      const debtor = debtors.get(mandate.student.userId);

      if (!debtor) {
        throw new BadRequestException('DEBTOR_IDENTITY_NOT_FOUND');
      }

      const amount = new Prisma.Decimal(item.amount);
      totalAmount = totalAmount.plus(amount);
      itemsWithMandates.push({
        id: this.generateItemId(),
        amount,
        mandateId: mandate.id,
        mandateReference: mandate.mandateReference,
        signatureDate: mandate.signatureDate,
        debtorIban: mandate.iban,
        debtorName: `${debtor.firstName} ${debtor.lastName}`,
        status: RemittanceItemStatus.PENDING,
      });
    }

    // Generate the SEPA XML content (pain.008)
    const sepaXmlContent = generateSepaXml({
      batchReference: dto.batchReference,
      executionDate: new Date(dto.executionDate),
      creditorName: 'Dojo Management Suite SL',
      creditorIban: process.env.DOJO_CREDITOR_IBAN || 'ES9100000000000000000000',
      creditorBic: process.env.DOJO_CREDITOR_BIC || 'DEMOESXX',
      items: itemsWithMandates,
    });

    // In a real-world scenario, you could save 'sepaXmlContent' to cloud storage or local disk.
    // Here we store the virtual path and metadata.
    const batch = await this.prisma.remittanceBatch.create({
      data: {
        batchReference: dto.batchReference,
        executionDate: new Date(dto.executionDate),
        totalAmount,
        totalItems: dto.items.length,
        status: RemittanceStatus.GENERATED,
        generatedById: userId,
        filePath: `/remittances/sepa-${dto.batchReference}.xml`,
        items: {
          create: itemsWithMandates.map(i => ({
            // Same id as the XML EndToEndId, so bank returns can be matched to the stored item.
            id: i.id,
            mandateId: i.mandateId,
            amount: i.amount,
            status: i.status,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return {
      ...batch,
      xmlPreview: sepaXmlContent, // Useful for debugging or immediate download
    };
  }

  /**
   * Generates a collision-safe collection item id.
   * A hyphen-less UUID v4 (32 chars) is used because SEPA `EndToEndId` is limited to 35 characters.
   *
   * @returns {string} 32-character hexadecimal identifier.
   */
  private generateItemId(): string {
    return randomUUID().replace(/-/g, '');
  }

  /**
   * Loads a remittance batch with its items and linked mandates.
   *
   * @param {string} batchId - Batch UUID.
   * @returns {Promise<object>} The batch graph.
   * @throws {NotFoundException} If the batch does not exist.
   */
  async getBatchDetails(batchId: string) {
    const batch = await this.prisma.remittanceBatch.findUnique({
      where: { id: batchId },
      include: { items: { include: { mandate: true } } },
    });

    if (!batch) {
      throw new NotFoundException('REMITTANCE_BATCH_NOT_FOUND');
    }

    return batch;
  }

  /**
   * Applies a settlement or return status to a remittance item.
   *
   * @param {string} itemId - Remittance item UUID.
   * @param {UpdateRemittanceItemStatusDto} dto - Status and optional return reason.
   * @returns {Promise<object>} The updated item.
   * @throws {NotFoundException} If the item does not exist.
   */
  async updateItemStatus(itemId: string, dto: UpdateRemittanceItemStatusDto) {
    const item = await this.prisma.remittanceItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('REMITTANCE_ITEM_NOT_FOUND');
    }

    return this.prisma.remittanceItem.update({
      where: { id: itemId },
      data: {
        status: dto.status,
        returnReason: dto.returnReason,
      },
    });
  }
}