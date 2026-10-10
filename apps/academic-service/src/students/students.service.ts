/**
 * @file students.service.ts
 * @description Core service handling student profile operations. Implements robust business logic
 * for safe user identity resolution, heavy guardian management for minors, multi-discipline 
 * enrollments, and transactional state machine history logging (Audit Log) for lifecycle management.
 */

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';
import { CreateStudentDto, StudentStatusEnum } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves a single student profile including deep relationships and chronological status history.
   */
  async findOne(id: string, requestUser: any) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: true, 
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { changedBy: { select: { firstName: true, lastName: true } } }
        },
        ranks: { include: { beltRank: { include: { program: { include: { discipline: true } } } } } },
        guardians: { include: { guardian: { include: { user: true } } } }
      },
    });

    if (!student) throw new NotFoundException(`Student profile with ID ${id} not found.`);

    const userRoles: Role[] = requestUser.roles || [];
    const isStaff = userRoles.some(r => [Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.INSTRUCTOR].includes(r));
    if (!isStaff && student.userId !== requestUser.userId) throw new ForbiddenException('Unauthorized.');
    return student;
  }
  
  /**
   * Orchestrates the transactional creation of a Student Profile.
   * Initializes the student lifecycle audit log with the designated entry status.
   */
  async create(payload: CreateStudentDto, requestUser?: any) {
    const { isExistingUser, userId, userData, isMinor, guardians, emergencyContacts, disciplines, status } = payload;
    const initialStatus = status || StudentStatusEnum.ACTIVE;

    return this.prisma.$transaction(async (tx) => {
      let finalUserId = userId;

      if (isExistingUser && userId) {
        const existingUser = await tx.user.findUnique({ where: { id: userId } });
        if (!existingUser) throw new NotFoundException('Base user not found.');
        const updatedRoles = Array.from(new Set([...existingUser.roles, Role.STUDENT]));
        await tx.user.update({
          where: { id: userId },
          data: {
            roles: updatedRoles,
            dni: userData.dni || existingUser.dni,
            birthDate: userData.birthDate ? new Date(userData.birthDate) : existingUser.birthDate,
            phone: userData.phone || existingUser.phone,
            address: userData.address || existingUser.address,
            city: userData.city || existingUser.city,
            state: userData.state || existingUser.state,
            postalCode: userData.postalCode || existingUser.postalCode,
          }
        });
      } else {
        let existingUserByEmail = await tx.user.findUnique({ where: { email: userData.email } });
        if (existingUserByEmail) {
          finalUserId = existingUserByEmail.id;
          const updatedRoles = Array.from(new Set([...existingUserByEmail.roles, Role.STUDENT]));
          await tx.user.update({ 
            where: { id: finalUserId }, 
            data: { 
              roles: updatedRoles, 
              dni: userData.dni || existingUserByEmail.dni,
              phone: userData.phone || existingUserByEmail.phone,
              address: userData.address || existingUserByEmail.address,
              city: userData.city || existingUserByEmail.city,
              state: userData.state || existingUserByEmail.state,
              postalCode: userData.postalCode || existingUserByEmail.postalCode
            } 
          });
        } else {
          const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);
          const newUser = await tx.user.create({
            data: {
              email: userData.email, passwordHash: hashedPassword, firstName: userData.firstName,
              lastName: userData.lastName, dni: userData.dni || null, phone: userData.phone || null,
              birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
              address: userData.address || null,
              city: userData.city || null,
              state: userData.state || null,
              postalCode: userData.postalCode || null,
              country: userData.country || 'ES',
              roles: [Role.STUDENT],
            },
          });
          finalUserId = newUser.id;
        }
      }

      if (!finalUserId) throw new BadRequestException('Failed to resolve user identity.');

      const existingProfile = await tx.studentProfile.findUnique({ where: { userId: finalUserId } });
      if (existingProfile) throw new BadRequestException('This user already has an active Student Profile.');

      const studentProfile = await tx.studentProfile.create({
        data: { 
          userId: finalUserId,
          status: initialStatus as any, // Mapped to Prisma enum
          emergencyContacts: (!isMinor && emergencyContacts) ? (emergencyContacts as any) : [],
        },
      });

      // Write initial log to the state machine audit history
      await tx.studentStatusHistory.create({
        data: {
          studentProfileId: studentProfile.id,
          previousStatus: null,
          newStatus: initialStatus as any,
          reason: 'Initial enrollment',
          changedById: requestUser?.userId || null,
        }
      });

      if (isMinor && guardians && guardians.length > 0) {
        for (const guardianData of guardians) {
          let parentUser = null;
          if (guardianData.userId) parentUser = await tx.user.findUnique({ where: { id: guardianData.userId } });
          else if (guardianData.email) parentUser = await tx.user.findUnique({ where: { email: guardianData.email } });
          
          if (!parentUser) {
            const hashedParentPassword = await bcrypt.hash('ChangeMe123!', 10);
            parentUser = await tx.user.create({
              data: {
                email: guardianData.email, passwordHash: hashedParentPassword, firstName: guardianData.firstName,
                lastName: guardianData.lastName, phone: guardianData.phone || null, dni: guardianData.dni || null, roles: [Role.PARENT],
              }
            });
          } else {
             const updatedParentRoles = Array.from(new Set([...parentUser.roles, Role.PARENT]));
             parentUser = await tx.user.update({
               where: { id: parentUser.id },
               data: { roles: updatedParentRoles, firstName: guardianData.firstName, lastName: guardianData.lastName, phone: guardianData.phone, dni: guardianData.dni }
             });
          }

          let guardian = await tx.guardian.findUnique({ where: { userId: parentUser.id } });
          if (!guardian) guardian = await tx.guardian.create({ data: { userId: parentUser.id } });

          await tx.studentGuardian.create({
            data: {
              studentProfileId: studentProfile.id, guardianId: guardian.id,
              relationship: guardianData.relationship === 'Otro' ? guardianData.customRelationship : guardianData.relationship,
            }
          });
        }
      }

      if (disciplines && disciplines.length > 0) {
        for (const item of disciplines) {
          let targetBeltId = item.beltRankId;
          if (!targetBeltId) {
            const lowestBelt = await tx.beltRank.findFirst({ where: { program: { disciplineId: item.disciplineId } }, orderBy: { order: 'asc' } });
            if (lowestBelt) targetBeltId = lowestBelt.id;
          }
          if (targetBeltId) {
            await tx.studentRank.create({
              data: { studentProfileId: studentProfile.id, beltRankId: targetBeltId, currentStripes: item.currentStripes ?? 0 }
            });
          }
        }
      }

      return studentProfile;
    });
  }

  /**
   * Updates personal information, discipline ranks, and logs status transitions dynamically.
   */
  async updateProfile(id: string, updateData: UpdateStudentDto | any, requestUser: any) {
    const student = await this.findOne(id, requestUser);
    const isStaff = (requestUser.roles || []).some((r: Role) => [Role.SUPER_ADMIN, Role.ADMIN_STAFF].includes(r));

    if (!isStaff) {
      return this.prisma.profileUpdateRequest.create({ data: { studentProfileId: student.id, requestedChanges: updateData } });
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Core Profile Updates
      if (updateData.userData) {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            firstName: updateData.userData.firstName, lastName: updateData.userData.lastName,
            phone: updateData.userData.phone, address: updateData.userData.address,
            city: updateData.userData.city, state: updateData.userData.state,
            postalCode: updateData.userData.postalCode, country: updateData.userData.country,
            birthDate: updateData.userData.birthDate ? new Date(updateData.userData.birthDate) : undefined,
          },
        });
      }

      // 2. State Machine: Process lifecycle status change and write Audit Log
      if (updateData.status !== undefined && updateData.status !== student.status) {
        await tx.studentProfile.update({
          where: { id: student.id },
          data: { status: updateData.status as any }
        });

        await tx.studentStatusHistory.create({
          data: {
            studentProfileId: student.id,
            previousStatus: student.status as any,
            newStatus: updateData.status as any,
            reason: updateData.statusReason || 'Status changed manually',
            changedById: requestUser?.userId || null,
          }
        });
      }

      // 3. Lightweight Contacts (Adults)
      if (updateData.emergencyContacts !== undefined) {
        await tx.studentProfile.update({
          where: { id: student.id },
          data: { emergencyContacts: updateData.emergencyContacts }
        });
      }

      // 4. Heavy Guardians (Minors)
      if (updateData.isMinor !== undefined) {
        await tx.studentGuardian.deleteMany({ where: { studentProfileId: student.id } });
        if (updateData.isMinor && updateData.guardians?.length > 0) {
          for (const guardianData of updateData.guardians) {
            let parentUser = null;
            if (guardianData.userId) parentUser = await tx.user.findUnique({ where: { id: guardianData.userId } });
            else if (guardianData.email) parentUser = await tx.user.findUnique({ where: { email: guardianData.email } });

            if (!parentUser) {
              const hashedParentPassword = await bcrypt.hash('ChangeMe123!', 10);
              parentUser = await tx.user.create({
                data: {
                  email: guardianData.email, passwordHash: hashedParentPassword, firstName: guardianData.firstName,
                  lastName: guardianData.lastName, phone: guardianData.phone || null, dni: guardianData.dni || null, roles: [Role.PARENT],
                }
              });
            } else {
              const updatedParentRoles = Array.from(new Set([...parentUser.roles, Role.PARENT]));
              parentUser = await tx.user.update({
                where: { id: parentUser.id },
                data: { roles: updatedParentRoles, firstName: guardianData.firstName, lastName: guardianData.lastName, phone: guardianData.phone, dni: guardianData.dni }
              });
            }

            let guardian = await tx.guardian.findUnique({ where: { userId: parentUser.id } });
            if (!guardian) guardian = await tx.guardian.create({ data: { userId: parentUser.id } });

            await tx.studentGuardian.create({
              data: {
                studentProfileId: student.id, guardianId: guardian.id,
                relationship: guardianData.relationship === 'Otro' ? guardianData.customRelationship : guardianData.relationship,
              }
            });
          }
        }
      }

      // 5. Disciplines and Belts
      if (updateData.disciplines && Array.isArray(updateData.disciplines)) {
        const currentRanks = await tx.studentRank.findMany({ where: { studentProfileId: student.id }, include: { beltRank: { include: { program: true } } } });
        const targetAssignments = updateData.disciplines;
        const targetDisciplineIds = targetAssignments.map((d: any) => d.disciplineId);
        
        for (const rank of currentRanks.filter(r => !targetDisciplineIds.includes(r.beltRank.program.disciplineId))) {
          await tx.studentRank.delete({ where: { id: rank.id } });
        }

        for (const item of targetAssignments) {
          let targetBeltId = item.beltRankId;
          if (!targetBeltId) {
            const lowestBelt = await tx.beltRank.findFirst({ where: { program: { disciplineId: item.disciplineId } }, orderBy: { order: 'asc' } });
            if (lowestBelt) targetBeltId = lowestBelt.id;
          }
          if (!targetBeltId) continue;

          const existingRank = currentRanks.find(r => r.beltRank.program.disciplineId === item.disciplineId);
          if (existingRank) {
            await tx.studentRank.update({ where: { id: existingRank.id }, data: { beltRankId: targetBeltId, currentStripes: item.currentStripes ?? existingRank.currentStripes } });
          } else {
            await tx.studentRank.create({ data: { studentProfileId: student.id, beltRankId: targetBeltId, currentStripes: item.currentStripes ?? 0 } });
          }
        }
      }

      return this.findOne(id, requestUser);
    });
  }

  async findAll() {
    const students = await this.prisma.studentProfile.findMany({
      include: {
        user: true,
        ranks: { include: { beltRank: { include: { program: { include: { discipline: true } } } } } },
        guardians: { include: { guardian: { include: { user: true } } } }
      },
    });

    return students.map(student => ({
      ...student,
      ranks: student.ranks.map(rank => ({
        id: rank.id, beltRankId: rank.beltRankId, disciplineId: rank.beltRank?.program?.disciplineId,
        disciplineName: rank.beltRank?.program?.discipline?.name || 'Unknown Discipline',
        beltName: rank.beltRank?.name || 'Unknown Belt', currentStripes: rank.currentStripes,
      }))
    }));
  }

  async remove(id: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { id } });
    if (!student) throw new NotFoundException(`Student profile with ID ${id} not found.`);
    return this.prisma.studentProfile.delete({ where: { id } });
  }
}