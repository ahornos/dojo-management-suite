-- AlterTable
ALTER TABLE "disciplines" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "student_profiles" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "postalCode" TEXT;
