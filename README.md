# Dojo Management Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pnpm](https://img.shields.io/badge/pnpm-12-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

White-label SaaS for martial-arts academies: identity, student lifecycle, belt progression, attendance, billing, cash register, and SEPA remittances.

The frontend talks only to the API Gateway. Domain services own their tables in a shared PostgreSQL database and exchange cross-domain data over internal HTTP — never by joining another service’s tables.

---

## Architecture

```text
                         ┌──────────────────────┐
                         │  PWA Frontend :5173  │
                         │  React 19 + Vite     │
                         └──────────┬───────────┘
                                    │  /api  + JWT
                         ┌──────────▼───────────┐
                         │   API Gateway :3000  │
                         │   proxy + CORS + RBAC│
                         └──┬────────┬────────┬─┘
             ┌──────────────┘        │        └──────────────┐
             ▼                       ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │ Auth      :3001 │    │ Academic  :3002 │    │ Financial :3003 │
    │ users, JWT,     │    │ students, belts │    │ fees, cash,     │
    │ roles           │    │ attendance      │    │ SEPA            │
    └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
             │                      │                      │
             └──────────────┬───────┴──────────┬───────────┘
                            ▼                  ▼
                   ┌────────────────┐   ┌────────────┐
                   │ PostgreSQL :5433│   │ Redis :6379│
                   │ (shared schema) │   │ (reserved) │
                   └────────────────┘   └────────────┘
```

```text
dojo-management-suite/
├── apps/
│   ├── api-gateway/          # Public /api entry — routes, helmet, throttling
│   ├── auth-service/         # Identity: register, login, JWT, user CRUD
│   ├── academic-service/     # Students, disciplines, attendance, graduations
│   ├── financial-service/    # Fees, discounts, cash, mandates, remittances
│   └── pwa-frontend/         # React PWA (i18n: en / es / ca)
├── packages/
│   ├── database/             # Prisma schema, migrations, seed, generated client
│   ├── shared-auth/          # JWT guards, roles, CurrentUser decorator
│   └── shared-types/         # Shared enums and contracts
├── docker/                   # Shared NestJS Dockerfile (pnpm store cache)
├── scripts/                  # bootstrap.sh and package-build helpers
├── docker-compose.yml
├── SETUP.md
└── LICENSE
```

---

## Microservices map

| Service | Package | Host port | Owns | Public docs |
|---|---|---|---|---|
| API Gateway | `api-gateway` | 3000 | None (no Prisma) | http://localhost:3000/api/docs |
| Auth | `auth-service` | 3001 | `users` | http://localhost:3001/api/docs |
| Academic | `academic-service` | 3002 | students, belts, attendance, graduations | http://localhost:3002/api/docs |
| Financial | `financial-service` | 3003 | fees, cash, remittances, mandates | http://localhost:3003/api/docs |
| PWA | `pwa-frontend` | 5173 | UI only | http://localhost:5173 |

Gateway health: [http://localhost:3000/api](http://localhost:3000/api)

Roles: `SUPER_ADMIN`, `ADMIN_STAFF`, `SPORTS_TECHNICAL_DIRECTOR`, `INSTRUCTOR`, `STUDENT`, `PARENT`.

---

## Tech stack

| Layer | Choice |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Language | TypeScript (strict) |
| Backend | NestJS 10, Passport JWT, class-validator |
| Database | PostgreSQL 15 + Prisma 5 (`@dms/database`) |
| Frontend | React 19, Vite, TanStack Query, Zustand, Zod, i18next, Tailwind |
| Auth shared | `@dms/shared-auth` |
| Contracts | `@dms/shared-types` |
| Tests | Jest 29 + Supertest |
| Runtime | Docker Compose (`dms-network`) |

---

## Prerequisites

- Node.js 20+
- [pnpm 12.6.0](https://pnpm.io/) (`packageManager` in root `package.json`; Corepack is enough)
- Docker Engine + Docker Compose v2 (BuildKit enabled — the Compose v2 default)
- Git

---

## Quick start

One interactive pass from a clean machine:

```bash
cp .env.example .env          # set JWT_SECRET and INTERNAL_API_KEY
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

The script can wipe Compose volumes (after confirmation), install and build the workspace, apply Prisma, optionally import a users CSV, start the stack, run unit + E2E suites, and print a status dashboard.

Manual equivalent:

```bash
cp .env.example .env
pnpm install
pnpm build
docker compose up -d postgres redis
# wait until postgres is healthy, then from the host:
export DATABASE_URL="$(grep '^DATABASE_URL_HOST=' .env | cut -d= -f2-)"
pnpm --filter @dms/database db:push
pnpm --filter @dms/database db:generate
pnpm --filter @dms/database db:seed
docker compose up -d --build
```

Open http://localhost:5173 and sign in with `DEFAULT_SUPER_ADMIN_EMAIL` / `DEFAULT_SUPER_ADMIN_PASSWORD` from `.env`.

Full environment, CSV format, and troubleshooting: **[SETUP.md](./SETUP.md)**.

---

## Common commands

```bash
pnpm install                          # workspace install
pnpm build                            # compile packages/* (shared-types, shared-auth)
pnpm test:unit                        # Jest unit suites
pnpm test:e2e                         # Jest E2E suites
pnpm --filter @dms/database db:push   # sync schema (host: set DATABASE_URL to DATABASE_URL_HOST)
docker compose up -d --build          # stack
docker compose logs -f api-gateway    # follow one service
```

Schema changes live in `packages/database/prisma/schema.prisma`. After editing: add a migration under `packages/database/prisma/migrations`, run `pnpm --filter @dms/database db:generate`, and keep `@dms/shared-types` enums value-identical to Prisma enums.

---

## License

MIT © 2026 Alberto Hornos Vidal. See [LICENSE](./LICENSE).
