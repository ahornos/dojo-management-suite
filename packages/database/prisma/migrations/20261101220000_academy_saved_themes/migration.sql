-- Tenant-owned custom appearances plus the last activated appearance key.
-- Idempotent for `migrate reset`.

ALTER TABLE "academy_settings"
    ADD COLUMN IF NOT EXISTS "activeAppearanceKey" TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS "academy_saved_themes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "themeConfig" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "academy_saved_themes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "academy_saved_themes_tenantId_idx"
    ON "academy_saved_themes"("tenantId");

CREATE UNIQUE INDEX IF NOT EXISTS "academy_saved_themes_tenantId_name_key"
    ON "academy_saved_themes"("tenantId", "name");
