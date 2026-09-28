import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Evaluates if a student is eligible for a stripe (grade) promotion or a belt promotion.
   * @param studentProfileId - Student profile UUID
   */
  async evaluatePromotionEligibility(studentProfileId: string) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 1,
          include: {
            beltRank: true,
          },
        },
      },
    });

    if (!studentProfile) {
      throw new NotFoundException(`Student profile with ID ${studentProfileId} not found`);
    }

    const ranks = (studentProfile as any).ranks || [];
    const activeRank = ranks[0];
    
    if (!activeRank) {
      throw new BadRequestException(`Student does not have an active belt rank assigned`);
    }

    const currentBelt = activeRank.beltRank;

    // Calculate time elapsed in months since last promotion or stripe
    const lastPromotionDate = activeRank.lastStripeAt || activeRank.promotedAt;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastPromotionDate.getTime());
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);

    const hasEnoughHours = activeRank.accumulatedHours >= currentBelt.minHoursRequired;
    const hasEnoughTime = diffMonths >= currentBelt.minMonthsRequired;

    const canPromoteStripe = 
      currentBelt.maxStripes > 0 && 
      activeRank.currentStripes < currentBelt.maxStripes && 
      hasEnoughHours && 
      hasEnoughTime;

    return {
      studentProfileId,
      currentBelt: currentBelt.name,
      currentStripes: activeRank.currentStripes,
      maxStripes: currentBelt.maxStripes,
      accumulatedHours: activeRank.accumulatedHours,
      requiredHours: currentBelt.minHoursRequired,
      elapsedMonths: parseFloat(diffMonths.toFixed(1)),
      requiredMonths: currentBelt.minMonthsRequired,
      isEligibleForStripe: canPromoteStripe,
      isEligibleForBeltPromotion: hasEnoughHours && hasEnoughTime && (!canPromoteStripe || activeRank.currentStripes === currentBelt.maxStripes),
    };
  }

  /**
   * Promotes a student to the next stripe or transitions to the next belt rank.
   * @param studentProfileId - Student profile UUID
   */
  async promoteStudent(studentProfileId: string) {
    const eligibility = await this.evaluatePromotionEligibility(studentProfileId);

    if (!eligibility.isEligibleForStripe && !eligibility.isEligibleForBeltPromotion) {
      throw new BadRequestException(`Student does not meet the requirements for promotion yet.`);
    }

    const activeRank = await this.prisma.studentRank.findFirst({
      where: { studentProfileId },
      orderBy: { promotedAt: 'desc' },
      include: { 
        beltRank: true, 
      },
    });

    if (!activeRank || !activeRank.beltRank) {
      throw new NotFoundException(`Active rank or belt details not found for student`);
    }

    // Scenario A: Grant a new stripe if max stripes not reached
    if (eligibility.isEligibleForStripe) {
      return this.prisma.studentRank.update({
        where: { id: activeRank.id },
        data: {
          currentStripes: { increment: 1 },
          lastStripeAt: new Date(),
          accumulatedHours: 0,
        },
      });
    }

    // Scenario B: Promote to the next Belt Rank using the active client field (disciplineId)
    const nextBelt = await this.prisma.beltRank.findFirst({
      where: {
        disciplineId: (activeRank.beltRank as any).disciplineId,
        order: { gt: activeRank.beltRank.order },
      },
      orderBy: { order: 'asc' },
    });

    if (!nextBelt) {
      throw new BadRequestException(`No higher belt rank configured. Student is at peak rank.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const newRank = await tx.studentRank.create({
        data: {
          studentProfileId,
          beltRankId: nextBelt.id,
          currentStripes: 0,
          accumulatedHours: 0,
          promotedAt: new Date(),
        },
      });

      return newRank;
    });
  }
}