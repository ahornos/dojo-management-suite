import { Injectable } from '@nestjs/common';
import { Prisma } from '@dms/database/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { AssignDiscountDto } from './dto/assign-discount.dto';

/**
 * @file discounts.service.ts
 * @description Core business logic for creating discount rules and calculating dynamic fee deductions.
 */
@Injectable()
export class DiscountsService {
  /**
   * @param {PrismaService} prisma - Financial-domain Prisma client.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a reusable discount rule.
   *
   * @param {CreateDiscountDto} dto - Rule definition (code, type, value, validity window).
   * @returns {Promise<object>} The persisted discount.
   */
  async createDiscount(dto: CreateDiscountDto) {
    return this.prisma.discount.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        category: dto.category,
        value: dto.value ?? null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Assigns a discount rule to a student profile.
   *
   * @param {AssignDiscountDto} dto - Student, discount, and optional expiry.
   * @returns {Promise<object>} The persisted assignment.
   */
  async assignDiscountToStudent(dto: AssignDiscountDto) {
    return this.prisma.studentDiscount.create({
      data: {
        studentProfileId: dto.studentProfileId,
        discountId: dto.discountId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
  }

  /**
   * Processes all active discount rules for a student and calculates their final fee.
   * 
   * @param {string} studentProfileId - Target student profile UUID.
   * @param {Prisma.Decimal} baseAmount - Original fee (exact decimal, never a JS float).
   * @returns {Promise<Prisma.Decimal>} Final amount, rounded to 2 decimals and never negative.
   */
  async calculateDiscountedFee(studentProfileId: string, baseAmount: Prisma.Decimal): Promise<Prisma.Decimal> {
    const activeDiscounts = await this.prisma.studentDiscount.findMany({
      where: {
        studentProfileId,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        discount: { isActive: true },
      },
      include: { discount: true },
    });

    let finalAmount = new Prisma.Decimal(baseAmount);

    for (const sd of activeDiscounts) {
      const discountRule = sd.discount;

      if (discountRule.type === 'PERCENTAGE' && discountRule.value) {
        finalAmount = finalAmount.minus(baseAmount.times(discountRule.value).dividedBy(100));
      } else if (discountRule.type === 'FIXED_DISCOUNT' && discountRule.value) {
        finalAmount = finalAmount.minus(discountRule.value);
      } else if (discountRule.type === 'FREE_PERIOD') {
        finalAmount = new Prisma.Decimal(0);
        break;
      }
    }

    return Prisma.Decimal.max(0, finalAmount.toDecimalPlaces(2));
  }
}