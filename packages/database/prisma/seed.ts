/**
 * @file seed.ts
 * @description Database seeding script to automatically provision the default
 * SUPER_ADMIN user and foundational martial disciplines (Brazilian Jiu-Jitsu)
 * with complete adult and kids belt hierarchies upon initial deployment.
 *
 * Super Admin is a login identity only. Unique key is `email` — national ID and
 * other demographics live exclusively on `StudentProfile`.
 */

import { PrismaClient, Role } from '../client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database initialization...');

  // 1. Provision Default Super Admin (identified by email, never by dni)
  const adminEmail = process.env.DEFAULT_SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.DEFAULT_SUPER_ADMIN_PASSWORD;
  if (!adminEmail?.trim()) {
    throw new Error('FATAL: DEFAULT_SUPER_ADMIN_EMAIL is required to seed the Super Admin.');
  }
  if (!adminPassword?.trim()) {
    throw new Error('FATAL: DEFAULT_SUPER_ADMIN_PASSWORD is required to seed the Super Admin.');
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      roles: [Role.SUPER_ADMIN],
      isActive: true,
    },
  });
  console.log(`[Seed] SUPER_ADMIN ensured: ${adminEmail}`);

  // 2. Provision Default Martial Discipline & Comprehensive Belt Hierarchy (BJJ)
  const bjjDisciplineName = 'Brazilian Jiu-Jitsu';
  let bjjDiscipline = await prisma.discipline.findUnique({
    where: { name: bjjDisciplineName },
  });

  if (!bjjDiscipline) {
    bjjDiscipline = await prisma.discipline.create({
      data: {
        name: bjjDisciplineName,
        acronym: 'BJJ',
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
    if (bjjDiscipline.acronym !== 'BJJ') {
      bjjDiscipline = await prisma.discipline.update({
        where: { id: bjjDiscipline.id },
        data: { acronym: 'BJJ' },
      });
      console.log('[Seed] Brazilian Jiu-Jitsu acronym set to BJJ.');
    } else {
      console.log('[Seed] Brazilian Jiu-Jitsu discipline already exists.');
    }
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
