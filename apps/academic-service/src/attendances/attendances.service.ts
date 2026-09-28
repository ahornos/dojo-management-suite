import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registers a new attendance log for a student and optionally updates accumulated training hours.
   * @param dto - Data Transfer Object containing attendance details
   * @ecosystem Automatically links to the student profile
   */
  async create(dto: CreateAttendanceDto) {
    // Verify that the student profile exists
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { id: dto.studentProfileId },
    });

    if (!studentProfile) {
      throw new NotFoundException(`Student profile with ID ${dto.studentProfileId} not found`);
    }

    // Create the attendance record
    const attendance = await this.prisma.attendance.create({
      data: {
        studentProfileId: dto.studentProfileId,
        attendedAt: dto.attendedAt ? new Date(dto.attendedAt) : undefined,
      },
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    return attendance;
  }

  /**
   * Retrieves all registered attendance logs.
   * @returns Array of attendance records with student details
   */
  async findAll() {
    return this.prisma.attendance.findMany({
      include: {
        studentProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        attendedAt: 'desc',
      },
    });
  }

  /**
   * Retrieves attendances filtered by a specific student profile.
   * @param studentProfileId - ID of the student profile
   */
  async findByStudent(studentProfileId: string) {
    return this.prisma.attendance.findMany({
      where: { studentProfileId },
      orderBy: {
        attendedAt: 'desc',
      },
    });
  }

  /**
   * Deletes an attendance record by its ID.
   * @param id - Attendance record UUID
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
}