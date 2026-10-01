import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankMandateDto } from './dto/create-bank-mandate.dto';
import { CreateRemittanceBatchDto } from './dto/create-remittance-batch.dto';
import { UpdateRemittanceItemStatusDto } from './dto/update-remittance-item-status.dto';
import { RemittanceStatus, RemittanceItemStatus } from '@dms/shared-types';
import { generateSepaXml } from './utils/sepa-xml-generator.util';

/**
 * @file remittances.service.ts
 * @description Business logic for SEPA bank mandates, remittance batch generation, and return management.
 */
@Injectable()
export class RemittancesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMandate(dto: CreateBankMandateDto) {
    const existing = await this.prisma.bankMandate.findUnique({
      where: { mandateReference: dto.mandateReference },
    });

    if (existing) {
      throw new BadRequestException(`Mandate with reference ${dto.mandateReference} already exists.`);
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
   */
  async generateBatch(dto: CreateRemittanceBatchDto, userId: string) {
    const existingBatch = await this.prisma.remittanceBatch.findUnique({
      where: { batchReference: dto.batchReference },
    });

    if (existingBatch) {
      throw new BadRequestException(`Remittance batch with reference ${dto.batchReference} already exists.`);
    }

    let totalAmount = 0;
    const itemsWithMandates = [];

    // Verify all mandates exist and are active before creating the batch
    for (const item of dto.items) {
      const mandate = await this.prisma.bankMandate.findUnique({
        where: { id: item.mandateId },
        include: { student: { include: { user: true } } },
      });

      if (!mandate || !mandate.isActive) {
        throw new BadRequestException(`Active bank mandate with ID ${item.mandateId} not found.`);
      }

      totalAmount += item.amount;
      itemsWithMandates.push({
        id: `ITEM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        amount: item.amount,
        mandateId: mandate.id,
        mandateReference: mandate.mandateReference,
        signatureDate: mandate.signatureDate,
        debtorIban: mandate.iban,
        debtorName: `${mandate.student.user.firstName} ${mandate.student.user.lastName}`,
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

  async getBatchDetails(batchId: string) {
    const batch = await this.prisma.remittanceBatch.findUnique({
      where: { id: batchId },
      include: { items: { include: { mandate: true } } },
    });

    if (!batch) {
      throw new NotFoundException('Remittance batch not found.');
    }

    return batch;
  }

  async updateItemStatus(itemId: string, dto: UpdateRemittanceItemStatusDto) {
    const item = await this.prisma.remittanceItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Remittance collection item not found.');
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