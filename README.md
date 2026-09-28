# Dojo Management Suite 🥋

> A comprehensive, modular SaaS solution designed for martial arts academies and combat sports dojos, built with a scalable microservices architecture.

---

## 🏗️ Architecture & Monorepo Structure

Dojo Management Suite is structured as a high-performance monorepo managed via **pnpm workspaces**. 

```text
dojo-management-suite/
├── apps/
│   ├── academic-service/     # Core academic module (Students, Ranks, Attendances, Promotions)
│   ├── auth-service/         # (Planned) Centralized authentication & IAM service
│   ├── financial-service/    # (Planned) Billing, fee plans, and subscriptions
│   └── api-gateway/          # (Planned) Unified API Gateway routing and load balancing
├── packages/
│   ├── database/             # Shared Prisma ORM client, database schema & migrations
│   └── shared-types/         # Shared TypeScript interfaces and DTOs
├── pnpm-workspace.yaml
└── docker-compose.yml
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

### Prerequisites
* Node.js (v20+ recommended)
* pnpm (`npm install -g pnpm`)
* Docker and Docker Compose

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/your-username/dojo-management-suite.git
cd dojo-management-suite
pnpm install
```

### 2. Set Up Environment Variables
Copy the environment template to create your local `.env` file:
```bash
cp .env.example .env
```

### 3. Spin Up Infrastructure (PostgreSQL & Redis)
Start the local databases using Docker Compose:
```bash
docker compose up -d
```

### 4. Initialize Database Schema & Client
Navigate to the database package to push the schema and generate the Prisma client:
```bash
cd packages/database
npx prisma db push
npx prisma generate
cd ../..
```

### 5. Run the Academic Service in Development Mode
```bash
pnpm --filter dms-academic-service start:dev
```

Once running, you can access the **Swagger API Documentation** at:
👉 `http://localhost:3001/api`

---

## 🔄 Database Workflow (Schema Changes)

Whenever you modify the `schema.prisma` file located in `packages/database/prisma/schema.prisma`:

1. Apply changes to your local PostgreSQL database:
   ```bash
   cd packages/database
   npx prisma db push
   ```
2. Regenerate the shared Prisma Client:
   ```bash
   npx prisma generate
   cd ../..
   ```

---

## 🧪 Running Tests

To run unit tests across packages or specific microservices:
```bash
# Run tests for the academic service
pnpm --filter dms-academic-service test
```

---

## 📦 Deployment Instructions

### Microservice Deployment
To build and run an individual microservice for production:
```bash
# Build the package
pnpm --filter dms-academic-service build

# Start production server
pnpm --filter dms-academic-service start:prod
```

### Full Project Deployment (Docker)
You can orchestrate the full stack deployment by extending the `docker-compose.yml` to include container definitions for each microservice alongside PostgreSQL and Redis.

---

## 📄 License

This project is open-source software licensed under the **MIT License**. Feel free to use, modify, and distribute it under the terms of the license.

