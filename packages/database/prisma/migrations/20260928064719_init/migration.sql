-- AlterTable
ALTER TABLE IF EXISTS "disciplines" ADD COLUMN IF NOT EXISTS "description" TEXT;

-- AlterTable
ALTER TABLE IF EXISTS "student_profiles" ADD COLUMN IF NOT EXISTS "address" TEXT,
ADD COLUMN IF NOT EXISTS "city" TEXT,
ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
