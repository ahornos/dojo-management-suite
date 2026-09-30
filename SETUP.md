# 🚀 Dojo Management Suite (DMS) - Initial Setup & Clean Deployment

This guide outlines the standard operating procedure for a complete, clean initialization of the DMS monorepo. Following this sequence guarantees an idempotent deployment, ensuring that all microservices, databases, and test suites run successfully without ghost data or caching conflicts.

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

## 4. Database Hydration & Typings (Critical)
Do not run tests before this step. The microservices require the database tables to be initialized and the Prisma client to be fully generated.

```bash
# 1. Synchronize the database schema with the PostgreSQL instance
pnpm --filter @dms/database db:push

# 2. Generate the Prisma Client typings for TypeScript compilation
pnpm --filter @dms/database exec prisma generate
```

## 5. Validation & Test Suites
With the infrastructure running and the database fully hydrated, validate the integrity of the system.

### Unit Tests
Verify the isolated business logic of each microservice:

```bash
pnpm --filter auth-service test
pnpm --filter academic-service test
pnpm --filter financial-service test
```

### End-to-End (E2E) Tests
Verify network boundaries, database connectivity, and HTTP request filters:

```bash
pnpm --filter auth-service test:e2e
pnpm --filter academic-service test:e2e
pnpm --filter financial-service test:e2e
```

## 6. Accessing the Microservices & Swagger UI
Once all tests pass successfully, the microservices are fully operational:

| Microservice       | Internal Port | External Mapping | Swagger Documentation URL |
|---                 | ---           |---               |--- 
| API Gateway        |	3000	     | 3000	            | -                         |
| Auth Service       |	3000	     | 3001	            | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) |
| Academic Service   |	3000	     | 3002	            | [http://localhost:3002/api/docs](http://localhost:3002/api/docs) |
| Financial Service  |	3000	     | 3003	            | [http://localhost:3003/api/docs](http://localhost:3003/api/docs) |