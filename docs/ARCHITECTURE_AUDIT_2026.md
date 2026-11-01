# Dojo Management Suite — Architecture Audit

| | |
|---|---|
| **Date** | 2026-10-30 |
| **Scope** | Entire pnpm monorepo (`apps/*`, `packages/*`, Docker, docs, scripts) |
| **Standard** | Industry DDD / modular-monolith practice, 12-factor config, GitOps secrets, NestJS + React PWA conventions |
| **Verdict** | **A capable modular monolith packaged as microservices.** Query-layer identity decoupling is real. Database-per-service, tenant isolation, and GitOps-grade operations are not. Treat “microservices” as an *intent*, not a current fact. |

This audit is unforgiving on purpose. The product already has a clear domain language, a working Compose stack, and several correct DDD moves. Those are listed. Everything else is graded against what a multi-tenant SaaS of this shape needs before a second academy, a second environment, or a second engineer on call.

Severity:

- **P0** — correctness, security, or tenancy defect that will leak data, mint money incorrectly, or block a real customer.
- **P1** — will bite the next environment, the next hire, or the next schema change.
- **P2** — hygiene, drift, and premature abstraction.

---

## Scorecard vs stated rules

The workspace claims bounded contexts, no cross-service FKs, `ConfigService` instead of `process.env`, Decimal money, semantic tokens, i18n, React Query, Jest, and thin controllers (`.cursorrules`, `README.md`, `docs/domain/*.md`).

| Rule | Status | Evidence |
|---|---|---|
| Bounded contexts own their tables; no physical cross-service FKs | **FAIL** | `StudentFee`, `StudentDiscount`, `StudentSubscription` `@relation` to `StudentProfile` in `packages/database/prisma/schema.prisma` |
| Cross-domain identity over HTTP, never Prisma `include` across boundaries | **PASS** at query layer; **FAIL** at schema | No `prisma.user` in academic/financial. Physical FKs still join financial rows to academic profiles |
| User demographics live on `StudentProfile` | **PARTIAL** | Schema is correct. `UserSummary`, `CreateUserDto`, and PWA `UserForm` still pretend they exist on User |
| JWT + `@dms/shared-auth` | **PASS** | Guards are shared; JWT *strategy* is copy-pasted three times |
| No `process.env` in services | **FAIL** | Remittance creditor fallbacks, `main.ts` ports, seed/import passwords |
| No JS floats for money | **FAIL** on write DTOs | `@IsNumber()` on fees/cash/discounts; Decimal only on federation pricing and discount *calculation* |
| `$transaction` for multi-step writes | **PARTIAL** | Student create is correct. Cash close, license batch, enroll+mandate saga are not |
| Semantic Tailwind tokens + i18n | **PASS** on PWA chrome; **FAIL** on auth-service Spanish strings |
| React Query + shared `apiClient` | **PASS** (base URL is hardcoded) |
| Jest only | **PASS** for execution; leftover `vitest.config*.ts` in every Nest app |
| Multi-tenant isolation | **FAIL** | Documented in `docs/domain/tenant-operations.md`; almost no `tenantId` on aggregate roots |
| Turborepo | **DEAD** | `turbo.json` exists; no script invokes `turbo` |

---

## 1. Architectural Patterns & Domain-Driven Design

### 1.1 What we actually built

This is **not** a database-per-service microservice estate. It is a **modular monolith with process isolation**:

```
PWA :5173  →  API Gateway :3000  →  auth :3001 / academic :3002 / financial :3003
                                      └──────── one PostgreSQL schema ────────┘
                                      └──────── one Prisma Client ────────────┘
```

| Package | Role | Owns at *runtime* | Owns at *schema* |
|---|---|---|---|
| `auth-service` | Identity, JWT issuance, internal user directory | Writes `users` | Full `PrismaClient` |
| `academic-service` | Students, belts, attendance, graduations, licenses | Writes academic tables; HTTP to auth | Full `PrismaClient` |
| `financial-service` | Fees, cash, SEPA, federations | Writes financial tables; HTTP to auth (remittances only) | Full `PrismaClient` |
| `api-gateway` | Reverse proxy, CORS, Helmet, throttle | None | No Prisma |
| `pwa-frontend` | React PWA | Composes all three contexts | — |
| `@dms/database` | Single Prisma schema + generated client | The whole model | The whole model |
| `@dms/shared-auth` | `JwtAuthGuard`, `RolesGuard`, `@CurrentUser`, `@TenantId` | — | — |
| `@dms/shared-types` | Enums + `UserSummary` HTTP contracts | — | — |

Docker Compose (`docker-compose.yml`) injects the **same** `.env` and the **same** `DATABASE_URL` into every Nest container. Redis is provisioned and unused.

**That packaging is a valid modular-monolith choice.** Pretending each process has an independent database is not. Academic *could* `prisma.user.findMany()` today. Financial *could* `prisma.studentProfile.deleteMany()`. Isolation is a convention, not a compiler or FK constraint.

**Refactor path (do this in order):**

1. Keep the shared Postgres for now. Add architecture tests / ESLint boundaries that forbid `prisma.user` outside auth, `prisma.studentProfile` outside academic, `prisma.bankMandate` outside financial.
2. Split into **three Prisma schemas** (or three databases) only after those tests exist and the physical cross-context FKs below are gone.
3. Do not split the network further until the gateway stops being a dumb proxy *or* is honestly renamed one.

### 1.2 Bounded context: Identity vs Academic vs Financial

The 2026 identity-decoupling pivot is the most important design in the repo. Parts of it are excellent. Parts of it are theatre.

#### What is correctly decoupled

`User` is a login identity. Demographics live on `StudentProfile`. Mandates belong to a payer, not a student.

```132:147:packages/database/prisma/schema.prisma
/// Login identity owned by auth-service. Demographics (dni, birthDate, phone, address)
/// live exclusively on StudentProfile — never on User.
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  firstName    String
  lastName     String
  gender       Gender?
  isActive     Boolean   @default(true)
  roles        Role[]    @default([STUDENT])
  ...
}
```

- `StudentProfile.userId` is optional (`String? @unique`). Minors have `userId: null` and link via `StudentGuardian`.
- `BankMandate.payerUserId` is a logical string. No `User @relation`. Coverage is `StudentProfile.bankMandateId` (indexed, not an FK).
- Academic `StudentsService` does not query `prisma.user`. It calls `UsersDirectoryClient` (`AUTH_SERVICE_URL/api/internal/users`) **before** opening `prisma.$transaction` — no HTTP while holding DB locks.
- Auth `UsersService.toSummary()` zeros `dni` / `birthDate` / `phone` / address fields. That is honest about the schema, dishonest about the public contract (see below).
- Audit actors (`changedById`, `proposedById`, `signedByUserId`, `holderUserId`) are logical IDs. Physical User FKs were stripped in historical migrations.

Domain docs (`docs/domain/academic-lifecycle.md`, `billing-and-remittances.md`) match this model. That is rare and should be preserved.

#### What is not decoupled

**P0 — Physical cross-context FKs.** Financial tables still cascade-delete with academic profiles:

```358:370:packages/database/prisma/schema.prisma
model StudentFee {
  studentProfileId String
  ...
  student          StudentProfile @relation(..., onDelete: Cascade)
}
```

Same pattern: `StudentDiscount`, `StudentSubscription`. `FeesService.assignStudentFee` inserts a `studentProfileId` with **no HTTP existence check**. Integrity is Postgres. Split the databases tomorrow and these writes either fail or create orphans.

`AffiliationLicense` correctly uses a logical `federationId` (documented in `docs/domain/federations-and-licenses.md`) **and** stores `amountCharged` / `isPaid` on an academic table — money in the wrong context.

**Action:** make `studentProfileId` on financial tables a logical UUID. Financial validates the student via an academic internal API (mirror of `/api/internal/users`). Drop Prisma `@relation` across the academic/financial boundary. Move license money to `FederationSeasonCharge` (already financial) or a dedicated charge aggregate.

**P0 — Tenant isolation is a header, not a model.** `docs/domain/tenant-operations.md` requires every query to scope by `tenantId`. Reality:

- JWT has **no tenant claim**. `@TenantId()` reads `x-school-id`. The browser chooses the academy.
- `tenantId` exists on `BankMandate`, `AffiliationLicense`, federations, financial-config.
- `User`, `StudentProfile`, `FeeTier`, `CashRegisterSession`, `RemittanceBatch` have **no `tenantId`**. `StudentsService.findAll()` is a global dump.

A second academy on this database is a GDPR incident, not a feature.

**Action:** put `tenantId` (or a membership table) in the JWT. Treat `x-school-id` as a consistency check, never as the source of truth. Add `tenantId` to every aggregate root and every `findMany`. Until then, stop calling this a white-label SaaS.

**P0 — Minors cannot be batch-licensed.** Domain rule: minors have no `User`. `LicensesService.resolveStudents` drops any profile whose `users.get(profile.userId)` is missing. Age filters then use `UserSummary.birthDate`, which auth now always returns as `null`. `StudentProfile.birthDate` exists and is unused. Preview/issue with an age range returns nobody.

**Action:** license students by `studentProfileId`. Age filters must read `StudentProfile.birthDate`. `holderUserId` must be nullable for minors (or licenses must not require a User).

**P1 — Ghost demographic API.** `UserSummary` still exposes `dni`, `birthDate`, `phone`, `address`, `city`, `state`, `postalCode`, `country`. Auth always nulls them. Academic `updateProfile` still PATCHes them to auth. `UsersService.buildPatch` ignores everything except `firstName`, `lastName`, `gender`. PWA `UserForm` still edits the discarded fields. Dual-write that writes to `/dev/null`.

`gender` remains on **both** `User` and `StudentProfile`. Adult updates will drift.

**Action:** strip demographics from `UserSummary`, `CreateUserDto`, `UpdatePersonalDataDto`, and the PWA user form. Keep `firstName` / `lastName` / `email` / `roles` / `isActive` / optional `gender` on User. Everything else on `StudentProfile`.

**P1 — BankMandate create does not verify the payer.** `BankMandatesService.create` accepts any `payerUserId` string. No call to auth. A typo produces a mandate that can never be signed by a real user.

**P1 — Duplicate mandate APIs.**

| Endpoint | Service | Tenant? | Signed? |
|---|---|---|---|
| `POST /financial/mandates` | `BankMandatesService` | yes | unsigned until clickwrap |
| `POST /financial/remittances/mandates` | `RemittancesService.createMandate` | **no** | written as signed |

The PWA uses the first. The second is a foot-gun. Delete it.

### 1.3 API Gateway is a reverse proxy, not a BFF

`apps/api-gateway/src/proxy/proxy.service.ts` states the model honestly: the gateway does **not** verify JWTs. It forwards `Authorization` and every service verifies the token itself. That is a defensible zero-trust edge.

What it actually is:

- Header whitelist, 10s timeout, retries on idempotent methods, 502/504 mapping, Helmet, CORS, 100 req/60s throttle.
- Mechanical path rewrite. Academic controllers live at `@Controller('students')` so the gateway strips `/academic`. Financial controllers live at `@Controller('financial/fees')` so the path is forwarded unchanged. Two public URL dialects.
- No JWT verification, no RBAC at the edge (despite README claiming “proxy + CORS + RBAC”), no response composition, no saga, no DTO validation of downstream bodies (`@Req()` only).

Internal user directory (`/api/internal/users`) is **not** proxied. That is correct.

**The PWA is the BFF.** Enrollment + mandate attach is a two-call saga in the browser:

```30:50:apps/pwa-frontend/src/pages/students/useStudents.ts
async function attachMandate(...) {
  try {
    const response = await apiClient.post('/financial/mandates', { payerUserId, iban, ... });
    await apiClient.patch(`/academic/students/${student.id}`, { bankMandateId: mandate.id });
  } catch {
    return { failed: true, mandate: null };  // academic write already committed
  }
}
```

License batch issuance is the same pattern (academic write + financial charge, orchestrated by the UI — documented as intentional in `docs/domain/federations-and-licenses.md`). That is an anti-pattern once money or GDPR is involved.

**Action (pick one and document it as an ADR):**

- **A. Honest edge proxy.** Rename README claims. Keep JWT at the services. Move sagas into a process manager (Nest module in academic or a dedicated `apps/orchestrator`) that calls peers over the internal API key.
- **B. Real BFF.** Gateway verifies JWT, composes student+mandate+fee, owns enroll+mandate and license+charge sagas with compensation. Downstream services stay ignorant of the browser.

Do not stay in the middle.

### 1.4 Backend service layers

**What is good**

- Controllers are thin. Business branching lives in services.
- `ValidationPipe` with whitelist/transform is the Nest default in these apps.
- Student create: HTTP provision → `$transaction` for profile + guardians + ranks. Correct order.
- Federation money path uses `Prisma.Decimal` / `toDecimal(string)`.
- Internal API is keyed (`INTERNAL_API_KEY` + `InternalApiKeyGuard`). Gateway never exposes it.

**Anti-patterns**

| Issue | Severity | Where |
|---|---|---|
| Shared `PrismaClient` with a comment that says “academic domain only” | P1 | Every `PrismaService` |
| `PrismaService` / `JwtStrategy` / `env.validation.ts` / `UsersDirectoryClient` triplicated | P1 | `apps/{auth,academic,financial}-service` |
| `UsersDirectoryClient` copy-pasted (academic: read+provision+patch; financial: read-only) | P1 | Should live in `@dms/shared-auth` or a new `@dms/identity-client` |
| `process.env.DOJO_CREDITOR_IBAN` with demo IBAN fallback, ignoring `TenantFinancialConfig` | P0 | `apps/financial-service/src/remittances/remittances.service.ts` |
| Default password `'TemporaryPassword123!'` | P0 | `apps/auth-service/src/auth/auth.service.ts` |
| Money DTOs as `@IsNumber()` | P1 | Fees, cash, discounts, remittance item amounts |
| `CashService.closeSession` not transactional; concurrent `createTransaction` races the close | P1 | financial-service |
| `LicensesService.issueBatch` `createMany` then `findMany` | P1 | academic-service |
| Hard delete despite documented soft-delete protocol | P1 | `docs/domain/roles-and-permissions.md` vs `remove()` |
| Domain billing rules not implemented | P1 | Prorating, cumulative discounts, dunning, batch days 1st/10th — docs only |
| Nest version skew | P2 | `@nestjs/swagger` 7 vs 12; `@nestjs/passport` 10 vs 12; `bcrypt` 5 vs 6 |
| Auth messages in Spanish | P2 | `'Usuario registrado exitosamente'` — i18n belongs in the PWA |
| `Promise<any>` on gateway + several controllers | P2 | Destroys the “strict TypeScript” claim |

**Hexagonal / ports-and-adapters:** not used. Nest module-per-folder is the right default for this team size. Do **not** introduce a `domain/application/infra` folder tax until the bounded contexts are actually isolated. The current pain is schema sharing, not folder names.

### 1.5 Frontend architecture

`apps/pwa-frontend` is a pages-centric React 19 PWA:

- Routing: `react-router-dom` v7, lazy pages, nested `ProtectedRoute` (auth then RBAC). Attendances and Graduations are **placeholder divs**.
- Server state: TanStack Query (`retry: 1`, `refetchOnWindowFocus: false`) behind colocated hooks (`useStudents`, `useStudentMandate`, `useUsers`, `useDisciplines`, `useFederations`, `useLicenses`).
- Client state: one Zustand store (`useAuthStore`) with persist. No Redux. Correct for this app.
- Theming: semantic tokens (`bg-background`, `text-primary`, `bg-card`). Structural `bg-white` / `text-blue-*` are essentially gone. Remaining black/white is belt glyphs. Tokens themselves are a **single Fox-academy palette**, not per-tenant theming — the “multi-tenant theming” rule is a CSS variable hook waiting for a second theme.
- i18n: `en.json` / `es.json` / `ca.json` with `t('key')`. Residual hardcoded Spanish is on the **backend**.

**P1 — `apiClient` hardcodes the gateway:**

```16:18:apps/pwa-frontend/src/lib/api.ts
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
```

`VITE_API_BASE_URL` is unused. A Docker/production PWA cannot target another host without a rebuild hack. Triple token lookup (Zustand → persisted JSON → raw `localStorage.token`) is leftover defensive code.

**P1 — Zero frontend tests.** No `*.spec.ts` / `*.test.tsx` under `apps/pwa-frontend`. The enroll+mandate saga, list filters, and IBAN helpers are untested.

**P2 — Domain enums duplicated** in `src/lib/domain-enums.ts` instead of `@dms/shared-types`. Drift is guaranteed.

**P2 — Feature-Sliced Design is not used.** Pages-colocated hooks are fine until a second client (instructor mobile, parent portal). Then extract `entities/student`, `features/enroll-student`, `shared/api`. Do not FSD-rewrite the PWA this quarter.

### 1.6 Testing vs architecture

Backend unit tests (mocked Prisma / HttpService) are the strongest part of the repo: identity HTTP contracts, student HTTP-before-transaction ordering, Decimal mass-update, proxy retries, env fail-fast.

E2E suites (`test/*.e2e-spec.ts`) are **in-process HTTP tests with mocked Prisma**. They do not boot gateway + three services + Postgres. There are no consumer-driven contract tests between `UsersDirectoryClient` and `InternalUsersController`.

Missing tests that would have caught P0s: tenant isolation on `findAll`, license age-filter with `StudentProfile.birthDate`, minor license issuance, `attachMandate` compensation, SEPA XML against `TenantFinancialConfig`.

---

## 2. Monorepo & Directory Structure

### 2.1 Workspace layout

```
dojo-management-suite/
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── academic-service/
│   ├── financial-service/
│   └── pwa-frontend/
├── packages/
│   ├── database/          # Prisma + seed + import (the real platform kernel)
│   ├── shared-auth/       # Guards/decorators only
│   ├── shared-types/      # Enums + HTTP contracts
│   ├── config/            # EMPTY
│   └── ui/                # EMPTY
├── docker/Dockerfile.nestjs-dev
├── scripts/{bootstrap.sh,ensure-workspace-packages.cjs,...}
├── docs/domain/*.md
├── import-data/           # PII CSVs gitignored; mocks not committed
├── docker-compose.yml
├── turbo.json             # unused
└── package.json           # pnpm@12.6.0
```

`pnpm-workspace.yaml` is `apps/*` + `packages/*`. Empty `packages/config` and `packages/ui` match the glob and have no `package.json` (pnpm ignores them). They are TODOs that look like abandoned scaffolding.

Root `package.json` has `type: "module"` while helper scripts are CJS (`.cjs`) — works, traps anyone adding ESM scripts. `@radix-ui/react-switch` is a **root dependency**. That is a frontend leak; it does not belong at the workspace root.

### 2.2 Backend folders — Nest module-per-domain (correct)

Classic Nest: `students/`, `bank-mandates/`, `fees/`, each with `*.module.ts` / `*.controller.ts` / `*.service.ts` / `dto/`. This is the industry default and matches the bounded contexts. Do not flatten into `controllers/` / `services/` type-centric folders.

Gaps:

- `prisma/`, `auth/`, `config/` copied per service instead of `@dms/database` exporting `PrismaService` and `@dms/shared-auth` exporting `JwtStrategy`.
- `users-directory/` exists in academic and financial — should be one package.
- Academic/gateway `package.json` still say `license: UNLICENSED` while the repo is MIT.

### 2.3 Frontend folders — pages-centric (acceptable, not FSD)

```
apps/pwa-frontend/src/
├── pages/{login,dashboard,users,students,disciplines,financial/{federations,licenses}}
├── components/{ui,layout,auth,forms}
├── lib/{api,domain-enums,iban,...}
├── store/useAuthStore.ts
└── i18n/{config.ts,locales/{en,es,ca}.json}
```

Hooks live next to the page (`pages/students/useStudents.ts`). shadcn-style `components/ui` + `@/` alias. Lazy routes in `App.tsx` already give route-level code-splitting. That is enough until a second surface.

**Suggested evolution (do not big-bang):**

1. Move `lib/api.ts` + QueryClient defaults into `packages/` only if a second app needs them.
2. Promote `@dms/shared-types` as the single enum source; delete `domain-enums.ts`.
3. When a parent/instructor app appears: extract `packages/ui` (design tokens + primitives) and `features/*`. Until then, empty `packages/ui` is noise — delete it or put the Tailwind preset there.

### 2.4 Shared library boundaries

```
@dms/shared-types  ←  @dms/shared-auth
        ↑                    ↑
        └── Nest apps ───────┘
@dms/database/client  ←  auth / academic / financial
                         (not gateway, not PWA)
```

**P1 — Prisma Client is gitignored** (`packages/database/client/`). A fresh clone cannot typecheck until `db:generate`. `ensure-workspace-packages.cjs` covers Nest prehooks, not a raw IDE open. Document `pnpm --filter @dms/database db:generate` as step zero, or commit a generate-on-install `prepare` script.

**P1 — Enums are hand-duplicated** three ways: Prisma enums, `@dms/shared-types`, PWA `domain-enums.ts`. README even admits they “must stay value-identical”. They will not. Generate shared-types from Prisma, or import Prisma enums in shared-types (with care for frontend bundle).

**P2 — `shared-auth` is under-scoped.** Guards without `JwtStrategy` and without the users-directory HTTP client force every service to reinvent the same 40 lines.

**P2 — Nested lockfiles.** Tracked `package-lock.json` plus `apps/*/pnpm-lock.yaml` beside the root `pnpm-lock.yaml`. One lockfile. Delete the rest.

**P2 — Turbo is dead weight.** Either `pnpm build` / `test` / `lint` go through `turbo run` with `dependsOn: ["^build"]`, or remove the dependency and the README claim.

### 2.5 Structural improvements for scale

| Now | Next (second academy / second client) | Not yet |
|---|---|---|
| One Prisma schema | Three schemas, still one Postgres | Three databases + distributed tx |
| Pages-colocated PWA | `packages/ui` + shared Query hooks | Full FSD rewrite |
| Copy-pasted PrismaModule | `@dms/database` Nest module | Hexagonal ports |
| Empty `packages/config` | Zod env schemas + typed `ConfigService` | Consul / remote config |
| Empty `packages/ui` | Tailwind preset + semantic tokens as a package | Design-system site |

---

## 3. Configuration & Secrets Management (GitOps Security)

### 3.1 How env is loaded today

| Mechanism | Where | Verdict |
|---|---|---|
| Root `.env` via Compose `env_file` | Every container | Correct for **local** Compose |
| Hand-rolled `validateEnv()` | auth / academic / financial `ConfigModule.forRoot({ validate })` | Fail-fast for `JWT_SECRET` + `INTERNAL_API_KEY` only |
| Gateway | **No `validate`**, inconsistent URL defaults | Host `start:dev` can silently point at Docker DNS names |
| Zod | Frontend **forms** only | Not used for env |
| `process.env` | remittances creditor, `main.ts` ports, seed, import | Violates workspace rule |

`validateEnv` accepts `replace-with-a-long-random-secret`. A non-empty string is enough. `DATABASE_URL` is **not** required; a Nest service can boot and die on first query.

Placeholder secrets and demo SEPA identity are in `.env.example` **and** in runtime fallbacks. Example files are allowed to be fake. Runtime fallbacks to `ES9100000000000000000000` / `TemporaryPassword123!` / `SecurePassword123!` are not.

### 3.2 Inventory of secret-shaped values

| Item | Severity | Location |
|---|---|---|
| Postgres `dojo_admin` / `dojo_password` | P1 (local OK, prod copy-paste) | `docker-compose.yml`, `.env.example`, baked `ENV` in `docker/Dockerfile.nestjs-dev` |
| `DATABASE_URL=...dojo_password@postgres...` in image layers | P1 | Nest Dockerfile `ENV` |
| Seed password fallback `SecurePassword123!` | P1 | `packages/database/prisma/seed.ts` |
| Import default `FoxJiuJitsu2026!` | P1 | `import-users.ts`, student-import constants, mock CSV |
| Admin create-user default `TemporaryPassword123!` | P0 | `auth.service.ts` |
| Demo SEPA IBAN used if env missing | P0 | `remittances.service.ts` |
| `JWT_SECRET` / `INTERNAL_API_KEY` placeholders pass validation | P1 | `env.validation.ts` |
| Real `import-data/*.csv` (PII) | P1 if committed | gitignored; directory itself untracked |
| No private keys / PEM / age files in git | OK | — |

`.gitignore` correctly ignores `.env` / `.env.*` with exceptions for `.env.example` and `.env.template`. That **also swallows** `.env.msd.example` and `apps/*/.env.<svc>.example`, so those “cloud-ready” templates cannot be the documented contract.

There is **no** SOPS, age, `.sops.yaml`, Sealed Secrets, or GitOps overlay. There is **no** `.github/`. There is **no** staging or production deploy target in-repo.

### 3.3 SOPS + age vs ignored `.env` files

**Local development: keep ignored `.env` files. Do not encrypt a Docker Compose `.env` with SOPS.** Developers must be able to `cp .env.example .env` and boot. Age-encrypted Compose files add ceremony without a remote cluster.

**The moment a second environment exists (staging, a VPS, Kubernetes, a teammate’s shared server), ignored `.env` files are insufficient.** They drift, they get Slack’d, they get `git add -f`’d. That is when GitOps secrets pay for themselves.

Recommended standard for this repo:

| Environment | Mechanism | Why |
|---|---|---|
| Laptop / Compose | `.env` (gitignored), generated from `.env.example` | Fast, 12-factor, matches current Compose `env_file` |
| CI | GitHub Actions **secrets** / OIDC to a cloud SM | Short-lived, never on disk in the runner workspace |
| Staging / prod (when it exists) | **Mozilla SOPS + age** (or SOPS + cloud KMS) on `deploy/envs/{staging,prod}.enc.yaml` | Encrypted-at-rest in git, decrypt in CD, keys not in the repo |
| Runtime | Orchestrator injects env / files. **Never** `ENV DATABASE_URL=...` in a Dockerfile | Image layers are not a secret store |

SOPS + age specifically (vs Vault, vs Sealed Secrets):

- **Use SOPS+age** if deploy is GitOps-on-a-repo (Helm/Kustomize/Compose-on-a-server) and the team is small. Age keys are files; a paper + YubiKey backup of the age identity is enough. Encrypt YAML, not `.env` blobs, so diffs stay reviewable (`sops --encrypted-regex '^(password|secret|key|iban)'`).
- **Use SOPS+GCP/AWS KMS** instead of age once more than two humans need decrypt and you already have cloud IAM.
- **Do not use Sealed Secrets** until you actually run Kubernetes.
- **Do not put secrets in `turbo.json`, Prisma schema, or seed defaults.**

`bootstrap.sh` should `openssl rand -hex 32` `JWT_SECRET` and `INTERNAL_API_KEY` when they still match the example placeholders. Production `validateEnv` must reject those placeholders and `dojo_password` when `NODE_ENV=production`.

Remove baked `ENV DATABASE_URL=...` from `docker/Dockerfile.nestjs-dev`. Pass it at runtime only.

### 3.4 `.env.example` vs `.env.local` convention to enforce

Standardize on **one** catalog and **two** ignored overlays. Delete the rest.

| File | Role | Git |
|---|---|---|
| `.env.example` | Complete key catalog with **fake** values. The schema of the system. | **tracked** |
| `.env` | Compose / bootstrap (current). Docker DNS hostnames (`postgres`, `auth-service`). | ignored |
| `apps/<svc>/.env.local` | Host `pnpm start:dev` overrides (`localhost:5433`, `http://localhost:3001`). Nest `ConfigModule.envFilePath` should be `['.env.local', '.env', '../../.env']`. | ignored |
| `apps/pwa-frontend/.env.local` | `VITE_API_BASE_URL=http://localhost:3000/api`, `VITE_DEFAULT_TENANT_ID`. Vite already loads this. | ignored |
| **Delete** `.env.msd.example`, `apps/*/.env.<svc>.example` | Duplicates, currently gitignored by `.env.*` | — |

Rules:

1. Every key in `.env.example` is documented in SETUP.md (already mostly true).
2. No runtime default for secrets. Missing `JWT_SECRET` aborts boot. Missing `DOJO_CREDITOR_IBAN` must **not** fall back to a demo IBAN; remittance generation must read `TenantFinancialConfig` or fail.
3. Vite only exposes `VITE_*`. Wire `VITE_API_BASE_URL` into `api.ts` immediately.
4. Shared Zod (or class-validator) schema lives in the currently empty `packages/config`. One `validateEnv` implementation, imported by all Nest apps **including the gateway**. Reject example placeholders in production.
5. Do **not** use `.env.development` unless gitignore and Cursor ignore agree. They currently do not.

---

## 4. DevEx, Infrastructure Lifecycle & Containerization

### 4.1 Current developer path

The happy path is `scripts/bootstrap.sh`: optional `docker compose down -v`, copy `.env`, `pnpm install` + `pnpm build`, start postgres/redis, `db:generate` + **`db:push`** + `db:seed`, import users and students **without confirmation**, `docker compose up -d --build`, unit + e2e.

That script is the best DevEx artifact in the repo. It is also destructive, uses `db:push` instead of migrations, always imports CSVs, and offers `docker system prune -a --volumes -f` (host-wide, not project-scoped).

Root scripts have **no** `dev`, `lint`, `format`, `db:migrate`, `db:reset`, or `docker:*`. Day-to-day is Compose or `pnpm --filter <svc> start:dev`.

### 4.2 Containerization

**What is good**

- Build context is the monorepo root. `docker/Dockerfile.nestjs-dev` copies manifests first and uses `pnpm fetch` with a BuildKit cache mount (`id=pnpm-store`) — this matches the workspace Docker rule.
- Postgres 15 + Redis healthchecks. Named volumes. One bridge network.
- `.dockerignore` is solid (git, `node_modules`, `dist`, `.env`, Prisma client).

**What is not**

| Issue | Severity |
|---|---|
| **pnpm 12.6.0 in `packageManager` vs `corepack prepare pnpm@9.12.1` in images** | P1 — frozen lockfile from 12 can fail on 9 |
| No Compose **profiles** (`infra`, `app`, `full`) | P1 — cannot start only Postgres |
| No `--remove-orphans` on up/down | P2 |
| App services have **no healthchecks**; gateway `depends_on` is start-order only | P1 — gateway can 502 on boot |
| Duplicate unused Dockerfiles (`apps/*/Dockerfile.dev`, PWA `Dockerfile.dev`) | P2 |
| Production stage exists only for gateway + PWA nginx; compose never uses them | P1 if you deploy |
| Bind-mount `./packages` hides image `dist/` — SETUP already documents `Cannot find module '@dms/shared-auth/dist'` | P1 |
| Redis required `service_healthy` but no app client | P2 — dead infra on the critical path |
| Hardcoded `POSTGRES_PASSWORD` in YAML ignores `.env` `POSTGRES_*` | P1 — two sources of truth |

### 4.3 Database lifecycle — the actual wound

Committed history: 12 Prisma migrations, including `IF EXISTS` armor so `migrate reset` can replay against a DB that never received later columns. That armor exists because **local workflow uses `db:push`**, which does not write `_prisma_migrations`. A later `migrate deploy` on a pushed database is undefined.

There is **no** `db:migrate` / `db:migrate:deploy` / `db:reset` script. SETUP says production “must go through `prisma migrate deploy`” and then provides no npm script.

Seed now upserts Super Admin by **email** and creates BJJ with `acronym: 'BJJ'`. That is correct after identity decoupling. Historical migrations still needed extra SQL (`discipline_programs`, `users.roles` vs `users.role`) because init never matched the current schema. That is the cost of evolving a single schema without treating migrations as the only apply path.

**From-scratch zero-state (the standard to enforce):**

```bash
# 1. Infra only
docker compose --profile infra up -d --remove-orphans
# 2. Schema from migrations, not push
DATABASE_URL="$DATABASE_URL_HOST" pnpm --filter @dms/database db:migrate:reset  # confirm
# 3. Seed (admin + BJJ)
pnpm --filter @dms/database db:seed
# 4. Optional imports (never implicit)
pnpm import:users
pnpm import:students
# 5. Apps
docker compose --profile app up -d --build --remove-orphans
```

`db:push` becomes a forbidden local path, or is renamed `db:push:dangerous` and stripped from bootstrap/README.

### 4.4 Data import

| Command | Implementation | Notes |
|---|---|---|
| `pnpm import:users` | `packages/database/prisma/import-users.ts` | Email-only User create (demographics no longer written) |
| `pnpm import:students` | `prisma/import-students.ts` + `student-import/*` | Unit-tested; minors without User; mandate on payer |

Resolver: CLI arg → `import-data/<file>.csv` → `import-data/<file>.csv.mock`.

**P1 — `import-data/` is untracked.** `.gitignore` ignores `*.csv` but mocks are supposed to be committed fixtures and currently are not. Bootstrap always imports, including whatever PII CSV happens to sit on disk, with no confirm (unlike volume teardown).

**Action:** commit `*.csv.mock`. Keep real CSVs ignored. Bootstrap must `confirm` before import. Document student CSV headers in SETUP.md (users CSV is documented; students are not).

### 4.5 Makefile vs package.json

**Keep pnpm as the source of truth. Add a thin Makefile only as a non-Node billboard.**

A Makefile that reimplements `bootstrap.sh` will rot. A Makefile that calls pnpm/compose will help the next hire who types `make` by habit.

Recommended split:

```make
# Makefile — wrappers only. Logic lives in package.json / scripts/.
up:            ; docker compose --profile full up -d --build --remove-orphans
down:          ; docker compose down --remove-orphans
reset:         ; docker compose down -v --remove-orphans
db-migrate:    ; pnpm --filter @dms/database db:migrate
db-reset:      ; pnpm --filter @dms/database db:migrate:reset
seed:          ; pnpm --filter @dms/database db:seed
import:        ; pnpm import:users && pnpm import:students
test:          ; pnpm test:unit && pnpm test:e2e
bootstrap:     ; bash scripts/bootstrap.sh
```

Root `package.json` must gain the real scripts first: `docker:up`, `docker:down`, `db:migrate`, `db:migrate:deploy`, `db:reset`, `lint`. Wire Turbo for `build`/`test`/`lint` **or** delete it.

`bootstrap.sh` changes:

1. `docker compose down -v --remove-orphans` (never `system prune -a` as a default offer).
2. `migrate reset` (with the existing confirm) instead of `db:push`.
3. Confirm before CSV import.
4. Generate JWT/API keys if they still look like placeholders.
5. Align image pnpm to `12.6.0`.

### 4.6 CI — absent

There is **no** `.github/workflows`. `origin` is GitHub. Every push to `main` is unaudited.

Minimum pipeline:

```yaml
# .github/workflows/ci.yml
# pnpm install --frozen-lockfile
# pnpm build
# pnpm test:unit
# pnpm test:e2e   # with Compose postgres service
# pnpm --filter pwa-frontend exec tsc -b   # until real UI tests exist
```

Add a `lint` job the day ESLint configs stop being Nest scaffolding leftovers.

---

## 5. Documentation & Meta-files

### 5.1 Inventory

| File | Status | Quality |
|---|---|---|
| `README.md` | Present | Strong product overview, architecture diagram, ports, quick start. Overclaims Turbo and “RBAC on the gateway”. Documents `db:push` as the happy path. |
| `SETUP.md` | Present | Best operational doc in the repo. Dual `DATABASE_URL`, CSV headers (users), Compose failure modes. Does not document student import or migrate-reset. |
| `LICENSE` | Present | MIT © 2026 Alberto Hornos Vidal |
| `CONTRIBUTING.md` | **Missing** | — |
| `.gitignore` | Present | Correct for `.env`, Prisma client, PII CSVs. Also ignores `.cursorrules` / `.cursorignore` (team convention, unusual). Nested lockfiles not ignored. |
| `.dockerignore` | Present | Good. Excludes `*.md` from images. |
| `docs/domain/*.md` | Present | The actual source of domain truth. Several rules are unimplemented (soft-delete, coming-of-age, prorating, dunning, tenant scoping). |
| `docs/adr/` | **Missing** | Decisions live in chat history and migration comments. |
| App `README.md` | Present | Nest/Vite boilerplates. Misleading. |
| `.editorconfig` / `.nvmrc` / `.npmrc` | Missing | Pin Node 20 in `.nvmrc` at least. |
| `CODEOWNERS` / security policy | Missing | Acceptable for a private solo repo; add before a second committer. |

Domain docs are unusually good. They must stay **product rules**, not architecture decisions. When code and docs disagree, that is a P0/P1 (see licenses vs minors, tenant vs header, soft-delete vs `remove()`). Either implement the doc or change the doc in the same PR.

### 5.2 CONTRIBUTING.md (what to write)

A one-pager is enough:

1. pnpm 12 only. No npm/yarn. No nested lockfiles.
2. Jest only. No Vitest.
3. No cross-service Prisma `include` / physical FKs. Cross-domain IDs over HTTP.
4. No `process.env` in Nest services. No JS floats for money.
5. UI strings in locale files. Semantic color tokens.
6. Schema changes = new SQL migration, never `db:push` on shared DBs.
7. Link SETUP.md, this audit, and `docs/adr/`.

Replace Nest/Vite app READMEs with a five-line pointer to the root README.

### 5.3 ADR standard

Adopt **MADR** (Markdown Architectural Decision Records) under `docs/adr/`. Filenames: `NNNN-short-title.md`. Status: `proposed` | `accepted` | `superseded by ADR-XXXX`. Keep each record under two pages. Domain `.md` files remain the ubiquitous language; ADRs record *why the code is shaped this way*.

Template:

```markdown
# ADR-NNNN: Title

- Status: accepted
- Date: 2026-10-30
- Deciders: …

## Context
The force that made a decision necessary.

## Decision
What we will do. One paragraph.

## Consequences
Positive, negative, follow-ups.

## Rejected alternatives
One line each. Why they lost.
```

**First records to write — the code already decided these without a paper trail:**

| ID | Title | Decision already in code |
|---|---|---|
| 0001 | Modular monolith, not database-per-service | One Postgres, one Prisma schema, process isolation |
| 0002 | Identity is a login User; academic identity is StudentProfile | Optional `userId`; minors have no User |
| 0003 | BankMandate owned by `payerUserId` | Coverage via logical `bankMandateId` |
| 0004 | No physical FKs to `users`; financial FKs to `StudentProfile` still exist | Honest: 0004 should either schedule their removal or accept the monolith |
| 0005 | Gateway is a zero-trust reverse proxy, not a BFF | JWT verified at each service; PWA composes contexts |
| 0006 | Tenant is `x-school-id` today, JWT claim tomorrow | Current state is unsafe for a second academy |
| 0007 | pnpm workspaces; Turbo unused | Either adopt Turbo or drop it |
| 0008 | Prisma migrate is the only apply path | Retire `db:push` from bootstrap |
| 0009 | Local secrets are `.env`; GitOps SOPS+age when a second env exists | This audit §3 |
| 0010 | Pages-colocated PWA, not FSD | Extract packages when a second client appears |

Link the ADR index from README. When a future refactor contradicts an ADR, **supersede** it — do not silently edit history.

### 5.4 Documentation debt that is actually architecture debt

- README “microservices own their tables” vs financial `@relation` to `StudentProfile`.
- README “gateway RBAC” vs proxy that does not verify JWT.
- README “Turborepo” vs unused `turbo.json`.
- `docs/domain/tenant-operations.md` “all queries MUST scope to tenantId” vs `findAll()` students.
- `docs/domain/roles-and-permissions.md` soft-delete vs hard `remove()`.
- `docs/domain/billing-and-remittances.md` prorating / dunning / batch days vs unimplemented services.
- App READMEs claiming UNLICENSED / Nest boilerplate.

Docs that lie become the next incident’s root-cause paragraph. Keep them meaner than the code, or the code will stay polite and wrong.

---

## Prioritized backlog

Do these in order. Later items assume earlier ones.

1. **P0 tenancy:** `tenantId` in JWT; scope every `findMany`; stop trusting `x-school-id` as the tenant.
2. **P0 money/identity bugs:** license minors from `StudentProfile`; age filters on profile DOB; remittances read `TenantFinancialConfig` via `ConfigService`; delete default passwords and demo IBAN fallbacks.
3. **P0 saga:** move enroll+mandate (and license+charge) out of the PWA into a server process with compensation.
4. **P1 kill cross-context FKs** on `StudentFee` / `StudentDiscount` / `StudentSubscription`; architecture tests that freeze the query-layer isolation you already have.
5. **P1 Prisma lifecycle:** `db:migrate` / `db:migrate:deploy` / `db:reset`; bootstrap uses reset, not push; Docker pnpm 12.6.0.
6. **P1 CI:** `.github/workflows/ci.yml` with frozen lockfile, build, unit, e2e.
7. **P1 config package:** Zod (or one `validateEnv`) in `@dms/config`; gateway included; reject placeholders in production; `VITE_API_BASE_URL`.
8. **P1 one mandate API; one users-directory client package; strip ghost User demographics.**
9. **P1 lockfiles, duplicate Dockerfiles, empty `packages/config|ui` (implement or delete), Turbo (use or drop).**
10. **P1 frontend tests** for `attachMandate`, IBAN, list filters. Delete leftover Vitest configs.
11. **P2 ADRs 0001–0010 + CONTRIBUTING.md.** Align domain docs with code (or implement the docs).
12. **P2 SOPS+age** the day a staging environment exists — not before.

---

## What is already at a high bar (do not regress)

These are not consolation prizes. They are the floor the rest of the backlog should match.

- Optional `StudentProfile.userId` and payer-owned `BankMandate` are the right model for a martial-arts academy (adults log in, minors do not, siblings share one IBAN).
- Academic never queries `prisma.user`. Provision happens before `$transaction`.
- Federation `federationId` on licenses is already a logical ID — the template for financial→academic student IDs.
- Gateway retry policy (idempotent methods only) is more careful than most homegrown proxies.
- Semantic tokens + three-locale i18n on the PWA.
- `bootstrap.sh` as a single interactive lifecycle — rare in repos this size.
- Domain markdown in `docs/domain/` is short, specific, and written in ubiquitous language.
- Backend Jest tests with strict Prisma/HTTP mocks, including Forbidden paths.

The gap is not talent or domain insight. The gap is **honesty about the modular monolith**, **tenant as a first-class column**, and **operations (migrate, CI, secrets) treated as product code**. Close those three and this codebase is in the top quartile of private SaaS monorepos. Leave them and the next academy, the next `migrate reset`, or the next leaked `.env` will write the next audit for you.
