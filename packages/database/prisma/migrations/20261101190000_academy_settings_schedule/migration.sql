-- Centralized academy operational settings, age brackets, weekly master schedule,
-- and attendance-session inheritance (time slot, exceptional flag, age brackets).
-- Idempotent for `migrate reset`. SEPA/legal identity stays on tenant_financial_configs.

CREATE TABLE IF NOT EXISTS "academy_settings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT '',
    "officialEmail" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'ES',
    "brandName" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academy_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "academy_settings_tenantId_key"
    ON "academy_settings"("tenantId");

CREATE TABLE IF NOT EXISTS "age_brackets" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "age_brackets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "age_brackets_tenantId_code_key"
    ON "age_brackets"("tenantId", "code");

CREATE INDEX IF NOT EXISTS "age_brackets_tenantId_sortOrder_idx"
    ON "age_brackets"("tenantId", "sortOrder");

CREATE TABLE IF NOT EXISTS "academy_schedule_slots" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "instructorUserId" TEXT NOT NULL,
    "maxCapacity" INTEGER,
    "ageBracketIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academy_schedule_slots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "academy_schedule_slots_tenantId_weekday_idx"
    ON "academy_schedule_slots"("tenantId", "weekday");

CREATE INDEX IF NOT EXISTS "academy_schedule_slots_disciplineId_idx"
    ON "academy_schedule_slots"("disciplineId");

ALTER TABLE "attendance_sessions"
    ADD COLUMN IF NOT EXISTS "scheduleSlotId" TEXT,
    ADD COLUMN IF NOT EXISTS "startTime" TEXT,
    ADD COLUMN IF NOT EXISTS "endTime" TEXT,
    ADD COLUMN IF NOT EXISTS "isExceptional" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "ageBracketIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS "attendance_sessions_scheduleSlotId_date_idx"
    ON "attendance_sessions"("scheduleSlotId", "date");

-- One generated session per master-calendar slot and calendar day.
CREATE UNIQUE INDEX IF NOT EXISTS "attendance_sessions_slot_date_key"
    ON "attendance_sessions"("scheduleSlotId", "date")
    WHERE "scheduleSlotId" IS NOT NULL;
