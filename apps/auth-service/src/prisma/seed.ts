import { PrismaClient, Role } from '@dms/database';
import * as bcrypt from 'bcrypt';

/**
 * @file seed.ts
 * @description Database seeding script to automatically provision the default 
 * SUPER_ADMIN user upon initial deployment using environment variables.
 */

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.DEFAULT_SUPER_ADMIN_EMAIL || 'superadmin@fox-jiujitsu-academy.com';
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
        role: Role.SUPER_ADMIN,
      },
    });
    console.log(`[Seed] Default SUPER_ADMIN created successfully: ${adminEmail}`);
  } else {
    console.log(`[Seed] SUPER_ADMIN already exists: ${adminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error('[Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });