import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { AssignPromotionDto } from './dto/assign-promotion.dto';

/**
 * @file promotions.service.ts
 * @description Core business logic for creating promotions and calculating dynamic discounts.
 */
@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new promotional rule in the system.
   */
  async createPromotion(dto: CreatePromotionDto) {
    return this.prisma.promotion.create({
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
   * Assigns a promotion to a specific student profile.
   */
  async assignPromotionToStudent(dto: AssignPromotionDto) {
    return this.prisma.studentPromotion.create({
      data: {
        studentProfileId: dto.studentProfileId,
        promotionId: dto.promotionId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
  }

  /**
   * Processes all active rules for a student and calculates their final discounted fee.
   * 
   * @param studentProfileId - Target student
   * @param baseAmount - The original fee calculated by FeesModule
   * @returns Final calculated amount avoiding negative values
   */
  async calculateDiscountedFee(studentProfileId: string, baseAmount: number): Promise<number> {
    const activePromotions = await this.prisma.studentPromotion.findMany({
      where: {
        studentProfileId,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        promotion: { isActive: true },
      },
      include: { promotion: true },
    });

    let finalAmount = baseAmount;

    for (const sp of activePromotions) {
      const promo = sp.promotion;

      if (promo.type === 'PERCENTAGE' && promo.value) {
        finalAmount -= baseAmount * (Number(promo.value) / 100);
      } else if (promo.type === 'FIXED_DISCOUNT' && promo.value) {
        finalAmount -= Number(promo.value);
      } else if (promo.type === 'FREE_PERIOD') {
        finalAmount = 0;
        break; // Free period overrides all other calculations
      }
    }

    return Math.max(0, Number(finalAmount.toFixed(2)));
  }
}