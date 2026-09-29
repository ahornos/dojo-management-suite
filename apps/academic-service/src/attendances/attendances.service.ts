import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

/**
 * Service responsible for handling attendance business logic,
 * tracking training hours, and counting towards grade hours (H.d.G.).
 */
@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registers a new attendance entry for audit purposes and optionally 
   * counts it towards the student's active rank based on business rules.
   * 
   * @param dto - Data Transfer Object containing the student profile ID and optional timestamp
   * @returns The newly created attendance record
   */
  async create(dto: CreateAttendanceDto) {
    // 1. Verify that the student profile exists
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: dto.studentProfileId },
      include: {
        ranks: {
          include: { beltRank: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${dto.studentProfileId} not found`);
    }

    // 2. Determine today's date boundaries to check daily rank rules
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check if an attendance already counted for rank today for this student profile
    const existingRankAttendanceToday = await this.prisma.attendance.findFirst({
      where: {
        studentProfileId: dto.studentProfileId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        countedForRank: true,
      },
    });

    // Rule: Count for rank only if there isn't already one counted today
    const shouldCountForRank = !existingRankAttendanceToday;

    // 3. Perform atomic transaction: create attendance and update rank hours if applicable
    return this.prisma.$transaction(async (tx) => {
      // Always create the raw attendance record for absolute academy audit & quota control
      const attendance = await tx.attendance.create({
        data: {
          studentProfileId: dto.studentProfileId,
          date: dto.attendedAt ? new Date(dto.attendedAt) : undefined,
          countedForRank: shouldCountForRank,
        },
      });

      // If eligible for rank progression, find active rank and increment accumulated hours
      if (shouldCountForRank) {
        const activeRank = await tx.studentRank.findFirst({
          where: { studentProfileId: dto.studentProfileId },
          orderBy: { promotedAt: 'desc' },
        });

        if (activeRank) {
          await tx.studentRank.update({
            where: { id: activeRank.id },
            data: {
              accumulatedHours: {
                increment: 1, // Increments 1 hour per valid class attendance
              },
            },
          });
        }
      }

      return attendance;
    });
  }

  /**
   * Retrieves all attendance records ordered by date descending.
   * 
   * @returns Array of attendance records including student and user details
   */
  async findAll() {
    return this.prisma.attendance.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Deletes an attendance record by its ID.
   * 
   * @param id - Attendance record UUID
   * @returns The deleted attendance record
   */
  async remove(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return this.prisma.attendance.delete({
      where: { id },
    });
  }

  /**
   * Retrieves all attendance records for a specific student profile.
   * 
   * @param studentProfileId - Student profile UUID
   * @returns Array of attendance records for the specified student
   */
  async findByStudent(studentProfileId: string) {
    return this.prisma.attendance.findMany({
      where: { studentProfileId },
      orderBy: { date: 'desc' },
    });
  }
}