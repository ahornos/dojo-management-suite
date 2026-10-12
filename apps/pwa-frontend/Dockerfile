# syntax=docker/dockerfile:1
# PWA image. Build context MUST be the monorepo root (lockfile + workspace).
#   docker build -f apps/pwa-frontend/Dockerfile --target development .

FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.12.1 --activate

FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-auth/package.json ./packages/shared-auth/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/academic-service/package.json ./apps/academic-service/
COPY apps/financial-service/package.json ./apps/financial-service/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/pwa-frontend/package.json ./apps/pwa-frontend/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm fetch \
    && pnpm install --frozen-lockfile --offline --filter pwa-frontend...

FROM deps AS development

COPY apps/pwa-frontend/ ./apps/pwa-frontend/

WORKDIR /app/apps/pwa-frontend

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM deps AS build

COPY apps/pwa-frontend/ ./apps/pwa-frontend/

RUN pnpm --filter pwa-frontend build

FROM nginx:1.27-alpine AS production

COPY --from=build /app/apps/pwa-frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
