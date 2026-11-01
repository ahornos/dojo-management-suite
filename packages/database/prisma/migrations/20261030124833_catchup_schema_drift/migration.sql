-- Catch-up for schema that previously lived only in `db push` / schema.prisma.
-- Prisma's first draft aborted: it ALTERed `cash_transactions` and
-- `student_status_history` before those tables exist, and nested COMMIT inside
-- Migrate's transaction. This file keeps the same end state, in a safe order.

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_DISCOUNT', 'FREE_PERIOD');

-- CreateEnum
CREATE TYPE "DiscountCategory" AS ENUM ('FAMILY', 'SECURITY_FORCES', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "CashSessionStatus" AS ENUM ('OPEN', 'CLOSED', 'RECONCILED');

-- CreateEnum
CREATE TYPE "CashMovementType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "CashCategory" AS ENUM ('MEMBERSHIP_PAYMENT', 'EXAM_FEE', 'MERCHANDISE_SALE', 'OTHER_INCOME', 'OPERATIONAL_EXPENSE');

-- CreateEnum
CREATE TYPE "RemittanceStatus" AS ENUM ('DRAFT', 'GENERATED', 'SUBMITTED', 'SETTLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RemittanceItemStatus" AS ENUM ('PENDING', 'SETTLED', 'RETURNED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SPORTS_TECHNICAL_DIRECTOR';

-- DropForeignKey
ALTER TABLE "status_history" DROP CONSTRAINT IF EXISTS "status_history_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "student_guardians" DROP CONSTRAINT IF EXISTS "student_guardians_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student_subscriptions" DROP CONSTRAINT IF EXISTS "student_subscriptions_feePlanId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "guardians_dni_key";

-- DropIndex
DROP INDEX IF EXISTS "student_profiles_dni_key";

-- DropIndex
DROP INDEX IF EXISTS "student_ranks_studentProfileId_beltRankId_key";

-- DropIndex
DROP INDEX IF EXISTS "student_subscriptions_mandateReference_key";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "attendedAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "countedForRank" SET DEFAULT true;

-- AlterTable
ALTER TABLE "federations" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "guardians" DROP COLUMN "dni",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student_guardians" DROP CONSTRAINT "student_guardians_pkey",
DROP COLUMN "relation",
DROP COLUMN "studentId",
ADD COLUMN     "relationship" TEXT,
ADD COLUMN     "studentProfileId" TEXT NOT NULL,
ADD CONSTRAINT "student_guardians_pkey" PRIMARY KEY ("studentProfileId", "guardianId");

-- AlterTable
ALTER TABLE "student_licenses" ALTER COLUMN "holderType" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "hasBorrowedGi",
ADD COLUMN     "emergencyContacts" JSONB DEFAULT '[]',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "student_ranks" ALTER COLUMN "lastStripeAt" SET NOT NULL,
ALTER COLUMN "lastStripeAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "student_subscriptions" DROP COLUMN "accountHolderName",
DROP COLUMN "agreedPrice",
DROP COLUMN "feePlanId",
DROP COLUMN "iban",
DROP COLUMN "mandateReference",
DROP COLUMN "mandateSignatureDate",
DROP COLUMN "paymentMethod",
ADD COLUMN     "feeTierId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "passwordHash" SET NOT NULL;

-- DropTable
DROP TABLE "fee_plans";

-- DropTable
DROP TABLE "status_history";

-- PaymentMethod is unused after dropping student_subscriptions.paymentMethod.
-- Recreate it to match schema.prisma (SEPA -> gone; BANK_TRANSFER added).
DROP TYPE "PaymentMethod";
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER');

-- StudentStatus: INACTIVE is not in schema.prisma; map it to DROPPED.
-- Only student_profiles still uses the enum (status_history is gone).
ALTER TABLE "student_profiles" ALTER COLUMN "status" DROP DEFAULT;
CREATE TYPE "StudentStatus_new" AS ENUM ('TRIAL', 'ACTIVE', 'PAUSED', 'DROPPED');
ALTER TABLE "student_profiles" ALTER COLUMN "status" TYPE "StudentStatus_new" USING (
  CASE "status"::text
    WHEN 'INACTIVE' THEN 'DROPPED'
    ELSE "status"::text
  END
)::"StudentStatus_new";
ALTER TYPE "StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "StudentStatus_old";
ALTER TABLE "student_profiles" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "student_status_history" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "previousStatus" "StudentStatus",
    "newStatus" "StudentStatus" NOT NULL,
    "reason" TEXT,
    "leaveReason" "LeaveReason",
    "leaveNoticeMethod" "LeaveNoticeMethod",
    "customReasonDetails" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_update_requests" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "requestedChanges" JSONB NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_update_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graduation_requests" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "proposedBeltId" TEXT,
    "proposedStripes" INTEGER,
    "proposedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graduation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_tiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseAmount" DECIMAL(10,2) NOT NULL,
    "criteria" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fees" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "feeTierId" TEXT,
    "customAmount" DECIMAL(10,2),
    "ipcApplied" BOOLEAN NOT NULL DEFAULT false,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DiscountType" NOT NULL,
    "category" "DiscountCategory" NOT NULL,
    "value" DECIMAL(10,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_discounts" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "student_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_register_sessions" (
    "id" TEXT NOT NULL,
    "openedById" TEXT NOT NULL,
    "closedById" TEXT,
    "openingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closingDate" TIMESTAMP(3),
    "initialBalance" DECIMAL(10,2) NOT NULL,
    "expectedClosingBalance" DECIMAL(10,2),
    "actualClosingBalance" DECIMAL(10,2),
    "discrepancy" DECIMAL(10,2),
    "status" "CashSessionStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_register_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_transactions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentProfileId" TEXT,
    "type" "CashMovementType" NOT NULL,
    "category" "CashCategory" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_financial_configs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "legalName" TEXT NOT NULL DEFAULT '',
    "taxId" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'ES',
    "creditorId" TEXT NOT NULL DEFAULT '',
    "iban" TEXT NOT NULL DEFAULT '',
    "bic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_financial_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_mandates" (
    "id" TEXT NOT NULL,
    "payerUserId" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "bic" TEXT,
    "mandateReference" TEXT NOT NULL,
    "signatureDate" TIMESTAMP(3) NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountHolderDni" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT '',
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "signedByUserId" TEXT,
    "signatureIp" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_mandates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remittance_batches" (
    "id" TEXT NOT NULL,
    "batchReference" TEXT NOT NULL,
    "executionDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "status" "RemittanceStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedById" TEXT NOT NULL,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "remittance_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remittance_items" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "mandateId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "RemittanceItemStatus" NOT NULL DEFAULT 'PENDING',
    "returnReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "remittance_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fee_tiers_name_key" ON "fee_tiers"("name");

-- CreateIndex
CREATE INDEX "student_fees_studentProfileId_idx" ON "student_fees"("studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts"("code");

-- CreateIndex
CREATE INDEX "student_discounts_studentProfileId_idx" ON "student_discounts"("studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "student_discounts_studentProfileId_discountId_key" ON "student_discounts"("studentProfileId", "discountId");

-- CreateIndex
CREATE INDEX "cash_transactions_sessionId_idx" ON "cash_transactions"("sessionId");

-- CreateIndex
CREATE INDEX "cash_transactions_studentProfileId_idx" ON "cash_transactions"("studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_financial_configs_tenantId_key" ON "tenant_financial_configs"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "bank_mandates_mandateReference_key" ON "bank_mandates"("mandateReference");

-- CreateIndex
CREATE INDEX "bank_mandates_tenantId_payerUserId_idx" ON "bank_mandates"("tenantId", "payerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "remittance_batches_batchReference_key" ON "remittance_batches"("batchReference");

-- CreateIndex
CREATE UNIQUE INDEX "guardians_userId_key" ON "guardians"("userId");

-- AddForeignKey
ALTER TABLE "student_status_history" ADD CONSTRAINT "student_status_history_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_update_requests" ADD CONSTRAINT "profile_update_requests_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduation_requests" ADD CONSTRAINT "graduation_requests_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_feeTierId_fkey" FOREIGN KEY ("feeTierId") REFERENCES "fee_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_discounts" ADD CONSTRAINT "student_discounts_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_subscriptions" ADD CONSTRAINT "student_subscriptions_feeTierId_fkey" FOREIGN KEY ("feeTierId") REFERENCES "fee_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "cash_register_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remittance_items" ADD CONSTRAINT "remittance_items_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "remittance_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remittance_items" ADD CONSTRAINT "remittance_items_mandateId_fkey" FOREIGN KEY ("mandateId") REFERENCES "bank_mandates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "federation_season_charges_tenantId_federationId_season_holderTy" RENAME TO "federation_season_charges_tenantId_federationId_season_hold_key";
