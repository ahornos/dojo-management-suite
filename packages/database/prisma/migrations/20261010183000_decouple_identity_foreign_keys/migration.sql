-- Bounded-context isolation: identity (users) is owned by auth-service, so the academic tables
-- keep only a logical reference (userId) and no longer enforce a physical foreign key.

-- DropForeignKey
ALTER TABLE "student_profiles" DROP CONSTRAINT "student_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "guardians" DROP CONSTRAINT "guardians_userId_fkey";
