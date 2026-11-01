-- Soft-delete federations. Live uniqueness of (tenantId, name) is a partial index
-- so a deleted catalog name can be reused. Idempotent for `migrate reset`.

ALTER TABLE "federations" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

DROP INDEX IF EXISTS "federations_tenantId_name_key";
DROP INDEX IF EXISTS "federations_name_key";

CREATE UNIQUE INDEX IF NOT EXISTS "federations_tenantId_name_alive_key"
  ON "federations" ("tenantId", "name")
  WHERE "deletedAt" IS NULL;

CREATE INDEX IF NOT EXISTS "federations_tenantId_deletedAt_idx"
  ON "federations" ("tenantId", "deletedAt");

CREATE INDEX IF NOT EXISTS "federations_tenantId_name_idx"
  ON "federations" ("tenantId", "name");
