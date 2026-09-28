import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registers a new student and creates their associated profile.
   * @param dto - Data Transfer Object containing student registration details
   * @returns The created user entity along with its student profile
   */
  async create(dto: CreateStudentDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'STUDENT',
        studentProfile: {
          create: {
            phone: dto.phone,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            status: 'TRIAL',
            // If guardian data is provided, connect or create the guardian relation
            guardians: dto.guardian
              ? {
                  create: {
                    relation: dto.guardian.relation || 'Legal Guardian',
                    guardian: {
                      connectOrCreate: {
                        where: { dni: dto.guardian.dni },
                        create: {
                          dni: dto.guardian.dni,
                          firstName: dto.guardian.firstName,
                          lastName: dto.guardian.lastName,
                          phone: dto.guardian.phone,
                          email: dto.guardian.email,
                        },
                      },
                    },
                  },
                }
              : undefined,
          },
        },
      },
      include: {
        studentProfile: {
          include: {
            guardians: {
              include: {
                guardian: true,
              },
            },
            ranks: {
              include: {
                beltRank: {
                  include: {
                    program: true,
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
                    program: true,
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
   * Updates an existing student's core data and profile details.
   * @param id - User ID of the student
   * @param dto - Data Transfer Object containing updated values
   */
  async update(id: string, dto: UpdateStudentDto) {
    // Verify user/student existence
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { studentProfile: true },
    });

    if (!user || user.role !== 'STUDENT') {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        studentProfile: {
          update: {
            phone: dto.phone,
            address: dto.address,
            city: dto.city,
            postalCode: dto.postalCode,
            status: dto.status,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });
  }

  /**
   * Removes a student and cascades deletion to their student profile.
   * @param id - User ID of the student
   */
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== 'STUDENT') {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}