# 🚀 Dojo Management Suite (DMS) - Initial Setup & Clean Deployment

This guide outlines the standard operating procedure for a complete, clean initialization of the DMS monorepo. Following this sequence guarantees an idempotent deployment, ensuring that all microservices, databases, and test suites run successfully without ghost data or caching conflicts.

## 0. Environment Variables Configuration
Before spinning up the infrastructure, ensure your environment variables are configured in your `.env` files at the root and service levels:
- `DEFAULT_SUPER_ADMIN_EMAIL`: Email address for the initial platform super administrator[cite: 6].
- `DEFAULT_SUPER_ADMIN_PASSWORD`: Secure password for the initial super administrator[cite: 6].
- `VITE_DEFAULT_TENANT_ID`: Default multi-tenant school identifier (e.g., `fox-jiujitsu-academy`).
- `ALLOWED_ORIGINS`: Allowed CORS origins for the frontend and gateway (e.g., `http://localhost:5173,http://localhost:4200`).

## 1. Environment Reset (Clean Slate)
To prevent conflicts with previous localized states, orphaned Docker networks, or outdated Prisma artifacts, execute a full tear-down.

```bash
# 1. Spin down all containers and destroy persistent volumes (PostgreSQL/Redis)
docker compose down -v

# 2. Purge all local dependencies and build artifacts across the workspace
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf apps/*/dist packages/*/dist
```

## 2. Dependency Resolution
DMS uses `pnpm` workspaces for dependency management. Ensure you are using Node.js (v20+ recommended).

```bash
# Install all root, package, and microservice dependencies
pnpm install
```

## 3. Infrastructure & Microservices Orchestration
Start the core infrastructure (PostgreSQL, Redis) and all NestJS microservices in detached mode using Docker Compose.

```bash
# Force a clean build of all Docker images and recreate containers
docker compose up --build --force-recreate -d
```
> **_NOTE:_** Wait approximately 10–15 seconds for the PostgreSQL container to pass its health checks.

## 4. Shared Types Compilation, Database Hydration & SUPER_ADMIN Seeding (Critical)
Do not run tests or build microservices before this step. The shared package must be compiled first so that microservices can resolve path aliases, the database schema must be fully synchronized, and the default super administrator account must be provisioned.

```bash
# 1. Build the shared types package (generates /dist required for TypeScript path aliasing)
pnpm --filter @dms/shared-types build

# 2. Synchronize the database schema with the PostgreSQL instance
pnpm --filter @dms/database db:push

# 3. Generate the Prisma Client typings for TypeScript compilation
pnpm --filter @dms/database exec prisma generate

# 4. Provision the initial SUPER_ADMIN user via the seeding script using environment variables
docker exec -it dms-auth-service pnpm ts-node src/prisma/seed.ts
```

## 5. Optional: Bulk User Import from CSV (Academy Roster)
If you wish to populate the database with an initial academy roster (such as instructors, administrative staff, or students) from a formatted CSV file, you can run the dynamic import script.

```bash
# Populate academy users securely from a CSV file (e.g., Fox Jiu-jitsu Academy roster)
pnpm --filter database exec ts-node prisma/import-users.ts path/to/csv/users_dms.csv
```
> **_NOTE:_** This script is optional and fully idempotent. It strictly validates the CSV structure (checking for required headers such as Name, Surname/s, Email, Role, ID / Passport, etc.), securely hashes passwords with bcrypt, and skips already existing emails to prevent data duplication.

## 6. Validation & Test Suites
With the infrastructure running and the database fully hydrated, validate the integrity of the system.

### Unit Tests
Verify the isolated business logic of each microservice:

```bash
pnpm --filter auth-service test
pnpm --filter academic-service test
pnpm --filter financial-service test
pnpm --filter api-gateway test
```

### End-to-End (E2E) Tests
Verify network boundaries, database connectivity, and HTTP request filters:

```bash
pnpm --filter auth-service test:e2e
pnpm --filter academic-service test:e2e
pnpm --filter financial-service test:e2e
pnpm --filter api-gateway test:e2e
```

## 7. Accessing the Microservices & Swagger UI
Once all tests pass successfully, the microservices are fully operational:

| Microservice       | Internal Port | External Mapping | Swagger Documentation URL |
|---                 | ---           |---               |--- 
| API Gateway        |	3000	     | 3000	            | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) |                         |
| Auth Service       |	3000	     | 3001	            | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) |
| Academic Service   |	3000	     | 3002	            | [http://localhost:3002/api/docs](http://localhost:3002/api/docs) |
| Financial Service  |	3000	     | 3003	            | [http://localhost:3003/api/docs](http://localhost:3003/api/docs) |
