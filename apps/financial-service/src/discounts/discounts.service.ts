import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { AssignDiscountDto } from './dto/assign-discount.dto';

/**
 * @file discounts.service.ts
 * @description Core business logic for creating discount rules and calculating dynamic fee deductions.
 */
@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new financial discount rule in the system.
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
   * Assigns a discount rule to a specific student profile.
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
   * @param studentProfileId - Target student UUID
   * @param baseAmount - The original fee calculated by FeesModule
   * @returns Final calculated amount avoiding negative values
   */
  async calculateDiscountedFee(studentProfileId: string, baseAmount: number): Promise<number> {
    const activeDiscounts = await this.prisma.studentDiscount.findMany({
      where: {
        studentProfileId,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        discount: { isActive: true },
      },
      include: { discount: true },
    });

    let finalAmount = baseAmount;

    for (const sd of activeDiscounts) {
      const discountRule = sd.discount;

      if (discountRule.type === 'PERCENTAGE' && discountRule.value) {
        finalAmount -= baseAmount * (Number(discountRule.value) / 100);
      } else if (discountRule.type === 'FIXED_DISCOUNT' && discountRule.value) {
        finalAmount -= Number(discountRule.value);
      } else if (discountRule.type === 'FREE_PERIOD') {
        finalAmount = 0;
        break; 
      }
    }

    return Math.max(0, Number(finalAmount.toFixed(2)));
  }
}