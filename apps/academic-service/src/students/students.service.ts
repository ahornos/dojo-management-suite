/**
 * @file students.service.ts
 * @description Service handling student profile operations. Integrates complex business logic
 * for linking existing users, upgrading roles dynamically, and orchestrating guardian creation
 * for minors within secure transactional boundaries.
 */

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves a single student profile.
   * Enforces data isolation: users can only view their own profile unless they have staff roles.
   * 
   * @param {string} id - Student Profile UUID.
   * @param {any} requestUser - The authenticated user requesting the data.
   * @returns {Promise<Object>} The student profile object with populated relations.
   * @throws {NotFoundException} If the profile does not exist.
   * @throws {ForbiddenException} If the user lacks permissions to view the profile.
   */
  async findOne(id: string, requestUser: any) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: true, // Personal data is normalized in the User table
        ranks: {
          include: { beltRank: { include: { program: true } } }
        },
        guardians: {
          include: { guardian: { include: { user: true } } }
        }
      },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${id} not found.`);
    }

    // RBAC Check supporting multiple roles array
    const userRoles: Role[] = requestUser.roles || [];
    const isStaff = userRoles.some((r) => 
      [Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR].includes(r)
    );
    const isOwner = student.userId === requestUser.userId;

    if (!isStaff && !isOwner) {
      throw new ForbiddenException('You are not authorized to view this profile.');
    }

    return student;
  }
  
  /**
   * Orchestrates the complex logic for Student creation.
   * Utilizes a Prisma Transaction to ensure atomicity across the following steps:
   * 1. Resolve Main User (Create new or append STUDENT role to existing).
   * 2. Create the Academic Student Profile.
   * 3. If minor, resolve Guardian User (Create new or append PARENT role to existing) and link.
   * 
   * @param {CreateStudentDto} payload - Complex structured payload from the frontend.
   * @returns {Promise<Object>} The newly created student profile.
   * @throws {BadRequestException} If the user already has a student profile.
   */
  async create(payload: CreateStudentDto) {
    const { isExistingUser, userId, userData, isMinor, parentData } = payload;
    
    return this.prisma.$transaction(async (tx) => {
      let finalUserId = userId;

      // --- Step 1: Resolve Main User Identity ---
      if (isExistingUser && userId) {
        const existingUser = await tx.user.findUnique({ where: { id: userId } });
        if (!existingUser) throw new NotFoundException('Base user not found.');
        
        // Append STUDENT role if not already present
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
            postalCode: userData.postalCode || existingUser.postalCode,
          }
        });
      } else {
        const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);
        const newUser = await tx.user.create({
          data: {
            email: userData.email,
            passwordHash: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            dni: userData.dni || null,
            phone: userData.phone || null,
            birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
            address: userData.address || null,
            city: userData.city || null,
            postalCode: userData.postalCode || null,
            country: userData.country || 'ES',
            roles: [Role.STUDENT],
          },
        });
        finalUserId = newUser.id;
      }

      if (!finalUserId) throw new BadRequestException('Failed to resolve user identity.');

      const existingProfile = await tx.studentProfile.findUnique({ where: { userId: finalUserId } });
      if (existingProfile) throw new BadRequestException('This user already has an active Student Profile.');

      // --- Step 2: Create Student Profile ---
      const studentProfile = await tx.studentProfile.create({
        data: { userId: finalUserId },
      });

      // --- Step 3: Resolve Legal Guardian for Minors ---
      if (isMinor && parentData) {
        let parentUser = await tx.user.findUnique({ where: { email: parentData.email } });
        
        if (!parentUser) {
          const hashedParentPassword = await bcrypt.hash('ChangeMe123!', 10);
          parentUser = await tx.user.create({
            data: {
              email: parentData.email,
              passwordHash: hashedParentPassword,
              firstName: parentData.firstName,
              lastName: parentData.lastName,
              dni: parentData.dni || null,
              phone: parentData.phone || null,
              roles: [Role.PARENT],
            }
          });
        } else {
           // Append PARENT role to existing user
           const updatedParentRoles = Array.from(new Set([...parentUser.roles, Role.PARENT]));
           await tx.user.update({
             where: { id: parentUser.id },
             data: { roles: updatedParentRoles }
           });
        }

        let guardian = await tx.guardian.findUnique({ where: { userId: parentUser.id } });
        if (!guardian) {
          guardian = await tx.guardian.create({ data: { userId: parentUser.id } });
        }

        await tx.studentGuardian.create({
          data: {
            studentProfileId: studentProfile.id,
            guardianId: guardian.id,
            relationship: 'Legal Guardian',
          }
        });
      }

      return studentProfile;
    });
  }

  /**
   * Updates personal information associated with a student profile.
   * Staff members execute direct updates to the User table; students generate a pending ProfileUpdateRequest.
   * 
   * @param {string} id - Student Profile UUID.
   * @param {any} updateData - JSON object with the requested changes.
   * @param {any} requestUser - The authenticated user requesting the update.
   */
  async updateProfile(id: string, updateData: any, requestUser: any) {
    const student = await this.findOne(id, requestUser);
    const userRoles: Role[] = requestUser.roles || [];
    const isStaff = userRoles.some((r) => [Role.SUPER_ADMIN, Role.ADMIN_STAFF].includes(r));

    if (!isStaff) {
      return this.prisma.profileUpdateRequest.create({
        data: {
          studentProfileId: student.id,
          requestedChanges: updateData,
        },
      });
    }

    // Direct updates target the normalized User table
    return this.prisma.user.update({
      where: { id: student.userId },
      data: {
        phone: updateData.phone,
        address: updateData.address,
        city: updateData.city,
        state: updateData.state,
        postalCode: updateData.postalCode,
        country: updateData.country,
        birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
      },
    });
  }

  /**
   * Retrieves all active student profiles.
   * 
   * @returns {Promise<Array>} List of students populated with user data and guardian information.
   */
  async findAll() {
    return this.prisma.studentProfile.findMany({
      include: {
        user: true,
        guardians: {
          include: { guardian: { include: { user: true } } }
        }
      },
    });
  }

  /**
   * Deletes a student profile from the database.
   * 
   * @param {string} id - Student Profile UUID.
   * @returns {Promise<Object>} The deleted student profile record.
   * @throws {NotFoundException} If the profile does not exist.
   */
  async remove(id: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${id} not found.`);
    }

    return this.prisma.studentProfile.delete({
      where: { id },
    });
  }
}