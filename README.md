# Dojo Management Suite 🥋

> A comprehensive, modular SaaS solution designed for martial arts academies and combat sports dojos, built with a scalable microservices architecture.

---

## 🏗️ Architecture & Monorepo Structure

Dojo Management Suite is structured as a high-performance monorepo managed via **pnpm workspaces**. 

```text
dojo-management-suite/
├── apps/
│   ├── api-gateway/          # Unified API Gateway routing and load balancing[cite: 1]
│   ├── auth-service/         # Centralized authentication & IAM service[cite: 1]
│   ├── academic-service/     # Core academic module (Students, Ranks, Attendances, Promotions)[cite: 1, 10]
│   └── financial-service/    # Billing, fee plans, cash register, and SEPA remittances[cite: 1]
├── packages/
│   ├── database/             # Shared Prisma ORM client, database schema & migrations
│   └── shared-types/         # Shared TypeScript interfaces and DTOs
├── pnpm-workspace.yaml
├── docker-compose.yml
└── SETUP.md                  # Comprehensive initial setup and clean deployment guide
```

---

## 🚀 Tech Stack

* **Backend Framework:** NestJS (TypeScript)
* **Database & ORM:** PostgreSQL & Prisma ORM
* **Caching & Queue:** Redis
* **Monorepo Manager:** pnpm Workspaces
* **Containerization:** Docker & Docker Compose
* **API Documentation:** OpenAPI / Swagger UI

---

## ⚙️ Getting Started (Development Environment)

For a complete, clean initialization from scratch (destroying previous volumes, purging artifacts, hydrating the database, and running test suites), please refer to the [SETUP.md](./SETUP.md) guide.

## 🔄 Database Workflow (Schema Changes)
Whenever you modify the `schema.prisma` file located in `packages/database/prisma/schema.prisma`

1. Apply changes to your local or containerized PostgreSQL database:

```bash
pnpm --filter @dms/database db:push
```

2. Regenerate the shared Prisma Client typings:

```bash
pnpm --filter @dms/database exec prisma generate
```
---

## 🧪 Running Tests

To run unit and E2E test suites across microservices:

```bash
# Unit tests
pnpm --filter auth-service test
pnpm --filter academic-service test
pnpm --filter financial-service test

# E2E integration tests
pnpm --filter auth-service test:e2e
pnpm --filter academic-service test:e2e
```
---

## 🌐 API Documentation (Swagger)

Once the infrastructure and services are running via Docker Compose, each microservice exposes its OpenAPI documentation at `/api/docs`:

* Auth Service: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

* Academic Service: [http://localhost:3002/api/docs](http://localhost:3002/api/docs)

* Financial Service: [http://localhost:3003/api/docs](http://localhost:3003/api/docs)

## 📄 License

This project is open-source software licensed under the MIT License. Feel free to use, modify, and distribute it under the terms of the license.

For a complet license text, please refer to [LICENSE](./LICENCE)
