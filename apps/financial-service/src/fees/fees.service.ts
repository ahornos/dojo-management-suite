import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeTierDto } from './dto/create-fee-tier.dto';
import { AssignStudentFeeDto } from './dto/assign-student-fee.dto';
import { MassFeeUpdateDto } from './dto/mass-fee-update.dto';

/**
 * @file fees.service.ts
 * @description Business logic for managing academy fee tiers, student specific fee overrides, and mass updates.
 */
@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new base fee tier for the academy.
   * 
   * @param dto - Fee tier configuration data
   * @returns The created fee tier entity
   */
  async createFeeTier(dto: CreateFeeTierDto) {
    return this.prisma.feeTier.create({
      data: {
        name: dto.name,
        description: dto.description,
        baseAmount: dto.baseAmount,
        criteria: dto.criteria ?? undefined,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Retrieves all active fee tiers configured in the academy.
   * 
   * @returns Array of active fee tiers
   */
  async findAllFeeTiers() {
    return this.prisma.feeTier.findMany({
      where: { isActive: true },
    });
  }

  /**
   * Assigns or overrides a fee configuration for a specific student profile.
   * 
   * @param dto - Student fee assignment parameters
   * @returns The created student fee record
   */
  async assignStudentFee(dto: AssignStudentFeeDto) {
    return this.prisma.studentFee.create({
      data: {
        studentProfileId: dto.studentProfileId,
        feeTierId: dto.feeTierId ?? null,
        customAmount: dto.customAmount ?? null,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date(),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
      },
    });
  }

  /**
   * Performs a mass fee update across base fee tiers (percentage increase or fixed amount).
   * 
   * @param dto - Mass update parameters
   * @returns List of updated fee tiers
   */
  async massFeeUpdate(dto: MassFeeUpdateDto) {
    if (!dto.percentage && !dto.fixedAmount) {
      throw new BadRequestException('Either percentage or fixedAmount must be provided for mass update.');
    }

    const whereCondition = dto.tierId ? { id: dto.tierId } : { isActive: true };
    const tiers = await this.prisma.feeTier.findMany({ where: whereCondition });

    const updates = tiers.map(async (tier) => {
      let currentAmount = Number(tier.baseAmount);

      if (dto.percentage) {
        currentAmount += currentAmount * (dto.percentage / 100);
      }
      if (dto.fixedAmount) {
        currentAmount += dto.fixedAmount;
      }

      return this.prisma.feeTier.update({
        where: { id: tier.id },
        data: {
          baseAmount: Number(currentAmount.toFixed(2)),
        },
      });
    });

    return Promise.all(updates);
  }
}