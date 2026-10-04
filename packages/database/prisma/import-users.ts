/**
 * @file import-users.ts
 * @description Dynamic seed script to populate the database with users from a provided CSV file.
 * Accepts the CSV file path as a CLI argument, strictly validates the header structure, 
 * checks for existing users by email to prevent overwriting, securely hashes passwords, 
 * and maps the data to the Prisma schema.
 */

// IMPORTANTE: Importamos desde la ruta custom generada "../client" según tu schema.prisma
import { PrismaClient, Role } from '../client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import csvParser from 'csv-parser';

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
        // Validate CSV structure before processing data
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

      // Check if user already exists to prevent data duplication
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`⏭️  Skipped: User with email '${email}' already exists.`);
        continue;
      }

      // Hash the initial password from the CSV, or fallback to a secure default
      const saltRounds = 10;
      const plainPassword = row['Init password']?.trim() || 'FoxJiuJitsu2026!';
      const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

      // Create the new user mapping CSV headers to Prisma Schema fields
      await prisma.user.create({
        data: {
          firstName: row.Name?.trim() || 'Unknown',
          lastName: row['Surname/s']?.trim() || 'Unknown',
          email: email,
          passwordHash: passwordHash,
          role: (row.Role?.trim() as Role) || Role.STUDENT,
          dni: row['ID / Passport']?.trim() || null,
          phone: row.Phone?.trim() || null,
          address: row.Address?.trim() || null,
          city: row.City?.trim() || null,
          state: row['State / Province']?.trim() || null,
          postalCode: row['Postal Code']?.trim() || null,
          country: row.Country?.trim() || 'ES',
          isActive: true,
        },
      });

      console.log(`✅ Created: ${row.Name} ${row['Surname/s']} (${email}) -> Role: ${row.Role}`);
    } catch (error) {
      console.error(`❌ Error importing user ${row.Email}:`, error);
    }
  }

  console.log('\n🎉 User import process completed successfully.\n');
}

/**
 * Main execution block. Parses CLI arguments, resolves file paths, and manages global errors.
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('\n❌ Missing CSV file argument.');
    console.log('💡 Usage: pnpm --filter database exec ts-node prisma/import-users.ts <path-to-csv-file>\n');
    process.exit(1);
  }

  const csvFilePath = path.resolve(args[0]);
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`\n❌ File not found: ${csvFilePath}\n`);
    process.exit(1);
  }

  await importUsers(csvFilePath);
}

main()
  .catch((e) => {
    console.error('\n💥 Fatal error during execution:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });