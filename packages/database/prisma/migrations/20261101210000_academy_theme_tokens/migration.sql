-- High-res diploma/invoice mark. Design tokens stay in academy_settings.themeConfig (JSONB).
-- Idempotent for `migrate reset`.

ALTER TABLE "academy_settings"
    ADD COLUMN IF NOT EXISTS "pdfLogoUrl" TEXT NOT NULL DEFAULT '';
