import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registers a new student and creates their associated profile.
   * @param dto - Data Transfer Object containing student registration details
   * @returns The created user entity along with its student profile
   */
  async create(dto: CreateStudentDto) {
    // Note: Discipline association is handled via BeltRanks / StudentRanks in this schema architecture.
    // We create the user and their core student profile atomically.
    return this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'STUDENT',
        studentProfile: {
          create: {
            phone: dto.phone,
            status: 'TRIAL',
          },
        },
      },
      include: {
        studentProfile: {
          include: {
            ranks: {
              include: {
                beltRank: {
                  include: {
                    discipline: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Retrieves all registered students with their academic profiles.
   * @returns Array of users filtered by the STUDENT role
   */
  async findAll() {
    return this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        studentProfile: {
          include: {
            ranks: {
              include: {
                beltRank: {
                  include: {
                    discipline: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}