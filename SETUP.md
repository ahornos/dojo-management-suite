# Developer setup

This guide covers environment files, database provisioning, workspace commands, manual verification, and the failures that show up most often on a fresh clone.

For a single interactive run, use [`scripts/bootstrap.sh`](./scripts/bootstrap.sh).

---

## 1. Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20 or newer |
| pnpm | 12.6.0 (`corepack enable` then `corepack prepare pnpm@12.6.0 --activate`) |
| Docker + Compose v2 | BuildKit on (Compose v2 default) |
| Optional | `curl`, `jq` |

Clone the repository and work from the root. All `pnpm --filter` and `docker compose` commands assume that.

---

## 2. Environment variables

Docker Compose injects the **root** `.env` into every Nest service and the PWA. Never commit a real `.env`.

```bash
cp .env.example .env
```

Replace at least `JWT_SECRET` and `INTERNAL_API_KEY` with long random values. Services fail fast if those are missing.

### 2.1 Two PostgreSQL URLs

| Variable | Who uses it | Host |
|---|---|---|
| `DATABASE_URL` | Processes **inside** Compose (`env_file: .env`) | `postgres:5432` |
| `DATABASE_URL_HOST` | Prisma / seed / import on the **workstation** | `localhost:5433` |

Host commands must override `DATABASE_URL`:

```bash
export DATABASE_URL="${DATABASE_URL_HOST:-postgresql://dojo_admin:dojo_password@localhost:5433/dojo_management_suite?schema=public}"
pnpm --filter @dms/database db:push
```

If you leave the in-container URL on the host, Prisma cannot resolve hostname `postgres`.

### 2.2 Root `.env` (compose + seed)

See [`.env.example`](./.env.example). Summary:

| Key | Purpose |
|---|---|
| `DATABASE_URL` | Prisma inside containers |
| `DATABASE_URL_HOST` | Prisma on the host (port 5433) |
| `POSTGRES_*` | Official Postgres image (compose also sets these in YAML) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Token signing (shared by all Nest apps) |
| `INTERNAL_API_KEY` | Service-to-service users-directory calls |
| `REDIS_HOST` / `REDIS_PORT` | Provisioned; no app client yet |
| `AUTH_SERVICE_URL` / `ACADEMIC_SERVICE_URL` / `FINANCIAL_SERVICE_URL` | Gateway proxy + peer HTTP |
| `ALLOWED_ORIGINS` | Gateway CORS (comma-separated) |
| `DEFAULT_SUPER_ADMIN_EMAIL` / `DEFAULT_SUPER_ADMIN_PASSWORD` | Seed account |
| `VITE_DEFAULT_TENANT_ID` | Local tenant when there is no subdomain |
| `DOJO_CREDITOR_IBAN` / `DOJO_CREDITOR_BIC` | Optional SEPA creditor identity |

### 2.3 Per-service templates (local `pnpm start:dev` without Compose)

Each app also has `.env.example`. Copy next to that app only when you run the process on the host:

| File | Required extras |
|---|---|
| [`apps/auth-service/.env.example`](./apps/auth-service/.env.example) | `JWT_SECRET`, `INTERNAL_API_KEY`, `DATABASE_URL` (use `localhost:5433`) |
| [`apps/academic-service/.env.example`](./apps/academic-service/.env.example) | plus `AUTH_SERVICE_URL` |
| [`apps/financial-service/.env.example`](./apps/financial-service/.env.example) | plus `AUTH_SERVICE_URL`, optional SEPA |
| [`apps/api-gateway/.env.example`](./apps/api-gateway/.env.example) | downstream URLs (`http://localhost:3001` etc. on the host) |
| [`apps/pwa-frontend/.env.example`](./apps/pwa-frontend/.env.example) | `VITE_DEFAULT_TENANT_ID` |

Vite only exposes variables prefixed with `VITE_`.

---

## 3. Database provisioning

Compose publishes Postgres on **host 5433 → container 5432** so it does not collide with a local Postgres on 5432.

```bash
docker compose up -d postgres redis
docker compose ps
```

Wait until `dms-postgres` is `healthy`, then:

```bash
export DATABASE_URL="postgresql://dojo_admin:dojo_password@localhost:5433/dojo_management_suite?schema=public"
pnpm --filter @dms/database db:generate
pnpm --filter @dms/database db:push
pnpm --filter @dms/database db:seed
```

- `db:generate` writes `packages/database/client` (`@dms/database`).
- `db:push` applies `schema.prisma` without creating a migration (local / bootstrap).
- `db:seed` creates the default `SUPER_ADMIN` and baseline BJJ belt ranks.

Production-shaped changes must go through `packages/database/prisma/migrations` and `prisma migrate deploy`.

### Optional users CSV

```bash
pnpm --filter @dms/database exec ts-node prisma/import-users.ts /absolute/path/to/users.csv
```

Required headers (exact names):

`Name`, `Surname/s`, `Email`, `Init password`, `Role`, `ID / Passport`, `birthDate`, `Phone`, `Address`, `City`, `State / Province`, `Postal Code`, `Country`

The importer hashes passwords, skips existing emails, and is safe to re-run.

---

## 4. pnpm workspace commands

```bash
pnpm install                 # all apps + packages
pnpm build                   # packages/* that define a build script
pnpm build:shared            # @dms/shared-types then @dms/shared-auth
pnpm clean:packages          # remove package dist/ trees
pnpm test:unit               # Jest unit (shared-auth + four Nest apps)
pnpm test:e2e                # Jest E2E (four Nest apps)
pnpm --filter auth-service start:dev
pnpm --filter pwa-frontend dev
```

Filter names: `auth-service`, `academic-service`, `financial-service`, `api-gateway`, `pwa-frontend`, `@dms/database`, `@dms/shared-types`, `@dms/shared-auth`.

`@dms/database` has no `build` script; `pnpm build` skips it via `--if-present`.

---

## 5. Docker stack

Images build from the **repository root** so they can `COPY` `pnpm-lock.yaml` and every workspace `package.json` before source. Nest services share [`docker/Dockerfile.nestjs-dev`](./docker/Dockerfile.nestjs-dev) (`ARG SERVICE_NAME`). The PWA uses [`apps/pwa-frontend/Dockerfile`](./apps/pwa-frontend/Dockerfile) (`target: development`).

```bash
export DOCKER_BUILDKIT=1
docker compose up -d --build
```

The first build still downloads the pnpm store into a BuildKit cache (`id=pnpm-store`). Later builds reuse that mount and the manifest layers; source-only changes skip `pnpm fetch`.

| Container | Host |
|---|---|
| `dms-postgres` | localhost:5433 |
| `dms-redis` | localhost:6379 |
| `dms-api-gateway` | http://localhost:3000/api |
| `dms-auth-service` | http://localhost:3001/api/docs |
| `dms-academic-service` | http://localhost:3002/api/docs |
| `dms-financial-service` | http://localhost:3003/api/docs |
| `dms-pwa-frontend` | http://localhost:5173 |

---

## 6. Manual testing

1. Gateway health: `curl -sS http://localhost:3000/api`
2. Open Swagger on 3001 / 3002 / 3003 (`/api/docs`).
3. Register or log in through the gateway (`POST /api/auth/login`) or the PWA login page.
4. Confirm `Authorization: Bearer <jwt>` and `x-school-id: <VITE_DEFAULT_TENANT_ID>` on subsequent calls.
5. Smoke: list users (auth), list students (academic), list fee tiers (financial).
6. Automated:

```bash
pnpm test:unit
pnpm test:e2e
```

There is no frontend test runner; do not add one without an explicit decision.

---

## 7. Troubleshooting

**`getaddrinfo ENOTFOUND postgres` on the host**  
You ran Prisma with the in-container `DATABASE_URL`. Export `DATABASE_URL` from `DATABASE_URL_HOST`.

**`JWT_SECRET` / `INTERNAL_API_KEY` validation errors at bootstrap**  
Root `.env` is missing or Compose is not loading it. Copy `.env.example` and restart the service.

**`Cannot find module '@dms/shared-auth/dist/index.js'`**  
Workspace packages were not compiled, or the Compose bind-mount `./packages` hid the image `dist/`. Run `pnpm build` on the host, or let the container start script (`scripts/build-packages-writable.sh`) compile them.

**`EACCES` under `packages/*/dist`**  
Containers compile as root onto the bind-mount. Fix ownership:

```bash
sudo chown -R "$(id -u):$(id -g)" packages/shared-types/dist packages/shared-auth/dist
# or, if the stack is up:
docker exec dms-auth-service chmod -R a+rwX /app/packages/shared-types/dist /app/packages/shared-auth/dist
```

**`TS5083 Cannot read file '/app/tsconfig.base.json'`**  
The service `tsconfig.json` extends `../../tsconfig.base.json`. Compose must mount `./tsconfig.base.json:/app/tsconfig.base.json:ro` (already in `docker-compose.yml`).

**First Docker build still takes many minutes**  
Cold `pnpm fetch` fills the BuildKit cache. Confirm `DOCKER_BUILDKIT=1` and that you did not change `pnpm-lock.yaml`. Subsequent builds should skip that layer.

**Port already allocated (3000, 5173, 5433, 6379)**  
Stop the other process or change the left-hand side of the Compose port mapping.

**PWA talks to the wrong API**  
The browser must use the gateway (`http://localhost:3000`), not a service port. Check `apps/pwa-frontend` API base URL and CORS `ALLOWED_ORIGINS`.

**CSV import rejects the file**  
Headers must match `packages/database/prisma/import-users.ts` exactly, including `Surname/s` and `Init password`.
