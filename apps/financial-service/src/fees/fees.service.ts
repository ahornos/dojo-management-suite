import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@dms/database/client';
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
   * Performs a mass fee update across base fee tiers (percentage increase and/or fixed amount).
   * Runs in one transaction: either every targeted tier is updated or none is. All arithmetic uses
   * exact decimals and the result is rounded to 2 places (the column scale).
   *
   * @param {MassFeeUpdateDto} dto - Mass update parameters.
   * @returns {Promise<Array>} List of updated fee tiers.
   * @throws {BadRequestException} `MASS_UPDATE_REQUIRES_PERCENTAGE_OR_FIXED_AMOUNT` if neither value is given;
   * `MASS_UPDATE_RESULTS_IN_NEGATIVE_AMOUNT` if any tier would end up below zero (transaction rolled back).
   */
  async massFeeUpdate(dto: MassFeeUpdateDto) {
    if (!dto.percentage && !dto.fixedAmount) {
      throw new BadRequestException('MASS_UPDATE_REQUIRES_PERCENTAGE_OR_FIXED_AMOUNT');
    }

    const whereCondition = dto.tierId ? { id: dto.tierId } : { isActive: true };

    return this.prisma.$transaction(async (tx) => {
      const tiers = await tx.feeTier.findMany({ where: whereCondition });
      const updatedTiers = [];

      // Sequential on purpose: an interactive transaction owns a single connection.
      for (const tier of tiers) {
        const newAmount = this.applyIncrease(tier.baseAmount, dto);

        if (newAmount.isNegative()) {
          throw new BadRequestException('MASS_UPDATE_RESULTS_IN_NEGATIVE_AMOUNT');
        }

        updatedTiers.push(await tx.feeTier.update({ where: { id: tier.id }, data: { baseAmount: newAmount } }));
      }

      return updatedTiers;
    });
  }

  /**
   * Applies the percentage and fixed increments to an amount using exact decimal arithmetic.
   *
   * @param {Prisma.Decimal} current - Current amount.
   * @param {Pick<MassFeeUpdateDto, 'percentage' | 'fixedAmount'>} increase - Increments to apply.
   * @returns {Prisma.Decimal} New amount rounded to 2 decimals (half-up).
   */
  private applyIncrease(current: Prisma.Decimal, increase: Pick<MassFeeUpdateDto, 'percentage' | 'fixedAmount'>): Prisma.Decimal {
    let amount = new Prisma.Decimal(current);

    if (increase.percentage) {
      amount = amount.plus(current.times(increase.percentage).dividedBy(100));
    }
    if (increase.fixedAmount) {
      amount = amount.plus(increase.fixedAmount);
    }

    return amount.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  }
}
