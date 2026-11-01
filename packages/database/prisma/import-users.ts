/**
 * @file import-users.ts
 * @description Headless CLI for `pnpm import:users`.
 * Default source: `import-data/users-import.csv`, falling back to `users-import.csv.mock`.
 * Strictly validates headers, skips existing emails, and hashes passwords.
 * DNI and other demographics are not stored on User (they live on StudentProfile).
 */

import { PrismaClient, Role } from '../client';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import csvParser from 'csv-parser';
import { resolveImportCsv } from './import-data-path';

const prisma = new PrismaClient();

/**
 * Interface representing the exact expected structure of the CSV file.
 * @interface
 */
interface CsvUserRow {
  Name: string;
  'Surname/s': string;
  Email: string;
  'Init password': string;
  Role: string;
  'ID / Passport': string;
  birthDate: string;
  Phone: string;
  Address: string;
  City: string;
  'State / Province': string;
  'Postal Code': string;
  Country: string;
}

/**
 * Array defining the mandatory columns required for a successful import.
 * @constant
 */
const EXPECTED_HEADERS = [
  'Name',
  'Surname/s',
  'Email',
  'Init password',
  'Role',
  'ID / Passport',
  'birthDate',
  'Phone',
  'Address',
  'City',
  'State / Province',
  'Postal Code',
  'Country',
];

/**
 * Parses and validates the CSV file, then imports users sequentially into the database.
 * 
 * @param {string} filePath - Absolute or relative path to the provided CSV file.
 * @returns {Promise<void>}
 */
async function importUsers(filePath: string): Promise<void> {
  console.log(`\n📂 Starting user import from: ${filePath}\n`);
  const usersToImport: CsvUserRow[] = [];
  let isStructureValid = true;

  // 1. Read, validate, and parse the CSV file asynchronously
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('headers', (headers: string[]) => {
        const missingHeaders = EXPECTED_HEADERS.filter(
          (requiredHeader) => !headers.includes(requiredHeader)
        );

        if (missingHeaders.length > 0) {
          isStructureValid = false;
          reject(
            new Error(
              `Invalid CSV structure. Missing required columns: \n- ${missingHeaders.join('\n- ')}`
            )
          );
        }
      })
      .on('data', (data: CsvUserRow) => {
        if (isStructureValid) {
          usersToImport.push(data);
        }
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });

  console.log(`📊 Valid CSV structure confirmed. Found ${usersToImport.length} users to process.\n`);

  // 2. Process each user sequentially to avoid overwhelming database connections
  for (const row of usersToImport) {
    try {
      const email = row.Email?.trim();
      if (!email) {
        console.warn(`⚠️  Skipped: Row missing email address (Name: ${row.Name || 'Unknown'}).`);
        continue;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`⏭️  Skipped: User with email '${email}' already exists.`);
        continue;
      }

      const saltRounds = 10;
      const plainPassword = row['Init password']?.trim() || 'FoxJiuJitsu2026!';
      const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

      const parsedRole = (row.Role?.trim() as Role) || Role.STUDENT;

      // Login identity only. DNI / birthDate / address live on StudentProfile.
      await prisma.user.create({
        data: {
          firstName: row.Name?.trim() || 'Unknown',
          lastName: row['Surname/s']?.trim() || 'Unknown',
          email: email,
          passwordHash: passwordHash,
          roles: [parsedRole],
          isActive: true,
        },
      });

      console.log(`✅ Created: ${row.Name} ${row['Surname/s']} (${email}) -> Roles: [${parsedRole}]`);
    } catch (error) {
      console.error(`❌ Error importing user ${row.Email}:`, error);
    }
  }

  console.log('\n🎉 User import process completed successfully.\n');
}

/**
 * Main execution block. Default source: `import-data/users-import.csv`, then `users-import.csv.mock`.
 */
async function main() {
  const resolved = resolveImportCsv('users', process.argv[2]);
  if (resolved.usedFallback) {
    console.log(`[import-users] Real CSV missing; using template ${resolved.filePath}`);
  }
  await importUsers(resolved.filePath);
}

main()
  .catch((e) => {
    console.error('\n💥 Fatal error during execution:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });