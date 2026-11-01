-- One-off member charges (federative license sales). Distinct from student_fees
-- (recurring membership assignments). Idempotent for `migrate reset`.

CREATE TABLE IF NOT EXISTS "student_charges" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "payerUserId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "concept" TEXT NOT NULL,
    "seasonName" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_charges_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "student_charges_tenantId_studentProfileId_idx"
    ON "student_charges"("tenantId", "studentProfileId");

CREATE INDEX IF NOT EXISTS "student_charges_tenantId_payerUserId_idx"
    ON "student_charges"("tenantId", "payerUserId");

CREATE INDEX IF NOT EXISTS "student_charges_tenantId_seasonName_idx"
    ON "student_charges"("tenantId", "seasonName");
