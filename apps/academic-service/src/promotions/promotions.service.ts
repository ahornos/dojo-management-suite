import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service responsible for evaluating martial arts promotion eligibility,
 * handling promotion workflows, executing rank updates, and rolling back errors.
 */
@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Evaluates whether a student is eligible for a stripe or belt promotion
   * by comparing their accumulated training hours and months in rank against
   * the requirements defined in their current belt rank.
   * 
   * @param studentProfileId - UUID of the student profile.
   * @returns An evaluation report with eligibility status and current metrics.
   */
  async evaluatePromotionEligibility(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 1,
          include: {
            beltRank: {
              include: {
                program: true,
              },
            },
          },
        },
        attendances: {
          where: { countedForRank: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${studentProfileId} not found.`);
    }

    const activeRank = student.ranks[0];
    if (!activeRank) {
      throw new BadRequestException(`Student has no active belt rank assigned.`);
    }

    const beltCriteria = activeRank.beltRank;

    const now = new Date();
    const promotedAt = new Date(activeRank.promotedAt);
    const monthsInRank =
      (now.getFullYear() - promotedAt.getFullYear()) * 12 +
      (now.getMonth() - promotedAt.getMonth());

    const trainingHours = student.attendances.filter(
      (att) => new Date(att.date) >= promotedAt,
    ).length;

    const meetsMonths = monthsInRank >= beltCriteria.minMonthsRequired;
    const meetsHours = trainingHours >= beltCriteria.minHoursRequired;
    const isEligible = meetsMonths && meetsHours;

    return {
      studentProfileId,
      currentBelt: beltCriteria.name,
      currentStripes: activeRank.currentStripes,
      maxStripes: beltCriteria.maxStripes,
      requirements: {
        minMonthsRequired: beltCriteria.minMonthsRequired,
        minHoursRequired: beltCriteria.minHoursRequired,
      },
      currentMetrics: {
        monthsInRank,
        accumulatedHours: trainingHours,
      },
      eligibility: {
        meetsMonths,
        meetsHours,
        isEligible,
      },
    };
  }

  /**
   * Creates a pending promotion request proposed by an instructor.
   * 
   * @param studentProfileId - UUID of the student profile.
   * @param instructorId - UUID of the user proposing the promotion.
   * @returns The created PromotionRequest record.
   */
  async proposePromotion(studentProfileId: string, instructorId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${studentProfileId} not found.`);
    }

    return this.prisma.promotionRequest.create({
      data: {
        studentProfileId,
        proposedById: instructorId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Executes a direct promotion for a student (Stripe or Belt rank transition).
   * 
   * @param studentProfileId - UUID of the student profile.
   * @returns The updated student rank record.
   */
  async executePromotion(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 1,
          include: {
            beltRank: {
              include: {
                program: {
                  include: {
                    beltRanks: {
                      orderBy: { order: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student || !student.ranks[0]) {
      throw new NotFoundException(`Active rank not found for student profile ID ${studentProfileId}.`);
    }

    const activeRank = student.ranks[0];
    const currentBelt = activeRank.beltRank;
    const programBelts = currentBelt.program.beltRanks;

    if (activeRank.currentStripes < currentBelt.maxStripes) {
      return this.prisma.studentRank.update({
        where: { id: activeRank.id },
        data: {
          currentStripes: { increment: 1 },
          lastStripeAt: new Date(),
        },
      });
    }

    const nextBeltIndex = programBelts.findIndex((b) => b.id === currentBelt.id) + 1;
    
    if (nextBeltIndex >= programBelts.length) {
      throw new BadRequestException(`Student is already at the highest belt rank of the program.`);
    }

    const nextBelt = programBelts[nextBeltIndex];

    return this.prisma.$transaction(async (tx) => {
      return tx.studentRank.create({
        data: {
          studentProfileId,
          beltRankId: nextBelt.id,
          currentStripes: 0,
          accumulatedHours: 0,
          promotedAt: new Date(),
          lastStripeAt: new Date(),
        },
      });
    });
  }

  /**
   * Rolls back the last promotion or stripe awarded to a student.
   * - If the active rank has accumulated stripes (> 0), it decrements one stripe.
   * - If the active rank has 0 stripes, it removes the current rank entry to fall back to the previous belt history.
   * 
   * @param studentProfileId - UUID of the student profile.
   * @returns The restored active rank record.
   */
  async rollbackPromotion(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 2, // Fetch current and previous rank records
          include: { beltRank: true },
        },
      },
    });

    if (!student || !student.ranks[0]) {
      throw new NotFoundException(`Active rank not found for student profile ID ${studentProfileId}.`);
    }

    const currentRank = student.ranks[0];

    // Scenario A: If stripes were recently awarded, decrement a stripe
    if (currentRank.currentStripes > 0) {
      return this.prisma.studentRank.update({
        where: { id: currentRank.id },
        data: {
          currentStripes: { decrement: 1 },
        },
      });
    }

    // Scenario B: If current rank has 0 stripes, it might be a recent belt promotion.
    // Revert by deleting the latest rank entry so the previous rank becomes active again.
    const previousRank = student.ranks[1];
    if (!previousRank) {
      throw new BadRequestException(`Cannot rollback further: student is at their initial rank record.`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.studentRank.delete({
        where: { id: currentRank.id },
      });

      return tx.studentRank.findUnique({
        where: { id: previousRank.id },
        include: { beltRank: true },
      });
    });
  }
}