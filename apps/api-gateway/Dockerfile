# syntax=docker/dockerfile:1
# Build context MUST be the monorepo root (`.`).
# From `/app/apps/api-gateway`, `extends: ../../tsconfig.base.json` → `/app/tsconfig.base.json`.

FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    DATABASE_URL=postgresql://dojo_admin:dojo_password@postgres:5432/dojo_management_suite?schema=public

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@9.12.1 --activate

FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/database/prisma.config.ts ./packages/database/
COPY packages/database/prisma ./packages/database/prisma
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-auth/package.json ./packages/shared-auth/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/academic-service/package.json ./apps/academic-service/
COPY apps/financial-service/package.json ./apps/financial-service/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/pwa-frontend/package.json ./apps/pwa-frontend/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm fetch \
    && pnpm install --frozen-lockfile --offline --filter api-gateway... \
    && pnpm --filter @dms/database db:generate

FROM deps AS development

COPY packages/ ./packages/
COPY scripts/ ./scripts/
COPY apps/api-gateway/ ./apps/api-gateway/

RUN pnpm --recursive --filter "./packages/**" --if-present run build \
    && pnpm --filter @dms/database db:generate

WORKDIR /app/apps/api-gateway

EXPOSE 3000

CMD ["sh", "-c", "sh /app/scripts/build-packages-writable.sh && pnpm run start:dev"]

FROM deps AS build

COPY packages/ ./packages/
COPY scripts/ ./scripts/
COPY apps/api-gateway/ ./apps/api-gateway/

RUN pnpm --recursive --filter "./packages/**" --if-present run build \
    && pnpm --filter @dms/database db:generate \
    && pnpm --filter api-gateway build

FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat \
  && addgroup -S dms && adduser -S dms -G dms

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=build /app/apps/api-gateway/package.json ./apps/api-gateway/package.json

WORKDIR /app/apps/api-gateway

USER dms

EXPOSE 3000

CMD ["node", "dist/main"]
