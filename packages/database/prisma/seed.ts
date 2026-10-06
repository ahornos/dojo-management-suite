/**
 * @file seed.ts
 * @description Database seeding script to automatically provision the default 
 * SUPER_ADMIN user and foundational martial disciplines (Brazilian Jiu-Jitsu) 
 * with complete adult and kids belt hierarchies upon initial deployment[cite: 9, 10].
 */

import { PrismaClient, Role } from '../client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database initialization...');

  // 1. Provision Default Super Admin[cite: 9, 10]
  const adminEmail = process.env.DEFAULT_SUPER_ADMIN_EMAIL || 'superadmin@foxjiujitsuacademy.com';
  const adminPassword = process.env.DEFAULT_SUPER_ADMIN_PASSWORD || 'SecurePassword123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        roles: [Role.SUPER_ADMIN],
      },
    });
    console.log(`[Seed] Default SUPER_ADMIN created successfully: ${adminEmail}`);
  } else {
    console.log(`[Seed] SUPER_ADMIN already exists: ${adminEmail}`);
  }

  // 2. Provision Default Martial Discipline & Comprehensive Belt Hierarchy (BJJ)
  const bjjDisciplineName = 'Brazilian Jiu-Jitsu';
  let bjjDiscipline = await prisma.discipline.findUnique({
    where: { name: bjjDisciplineName },
  });

  if (!bjjDiscipline) {
    bjjDiscipline = await prisma.discipline.create({
      data: {
        name: bjjDisciplineName,
        description: 'Traditional Brazilian Jiu-Jitsu focusing on grappling, submissions, and self-defense.',
        programs: {
          create: [
            {
              name: 'Adults Program',
              minAge: 16,
              maxAge: 99,
              beltRanks: {
                create: [
                  { name: 'White Belt', order: 1, maxStripes: 4, minMonthsRequired: 0, minHoursRequired: 0 },
                  { name: 'Blue Belt', order: 2, maxStripes: 4, minMonthsRequired: 12, minHoursRequired: 100 },
                  { name: 'Purple Belt', order: 3, maxStripes: 4, minMonthsRequired: 24, minHoursRequired: 250 },
                  { name: 'Brown Belt', order: 4, maxStripes: 4, minMonthsRequired: 18, minHoursRequired: 300 },
                  { name: 'Black Belt', order: 5, maxStripes: 6, minMonthsRequired: 36, minHoursRequired: 500 },
                ],
              },
            },
            {
              name: 'Kids Program',
              minAge: 4,
              maxAge: 15,
              beltRanks: {
                create: [
                  { name: 'White Belt', order: 1, maxStripes: 4, minMonthsRequired: 0, minHoursRequired: 0 },
                  { name: 'Grey/White Belt', order: 2, maxStripes: 4, minMonthsRequired: 6, minHoursRequired: 30 },
                  { name: 'Solid Grey Belt', order: 3, maxStripes: 4, minMonthsRequired: 6, minHoursRequired: 30 },
                  { name: 'Grey/Black Belt', order: 4, maxStripes: 4, minMonthsRequired: 6, minHoursRequired: 30 },
                  { name: 'Yellow/White Belt', order: 5, maxStripes: 4, minMonthsRequired: 12, minHoursRequired: 50 },
                  { name: 'Solid Yellow Belt', order: 6, maxStripes: 4, minMonthsRequired: 12, minHoursRequired: 50 },
                  { name: 'Yellow/Black Belt', order: 7, maxStripes: 4, minMonthsRequired: 12, minHoursRequired: 50 },
                  { name: 'Green/White Belt', order: 8, maxStripes: 4, minMonthsRequired: 12, minHoursRequired: 60 },
                  { name: 'Solid Green Belt', order: 9, maxStripes: 4, minMonthsRequired: 12, minHoursRequired: 60 },
                  { name: 'Green/Black Belt', order: 10, maxStripes: 4, minMonthsRequired: 12, minHoursRequired: 60 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log('[Seed] Default Brazilian Jiu-Jitsu discipline, programs, and expanded belt ranks created successfully.');
  } else {
    console.log('[Seed] Brazilian Jiu-Jitsu discipline already exists.');
  }

  console.log('[Seed] Database initialization completed successfully.');
}

main()
  .catch((e) => {
    console.error('[Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });