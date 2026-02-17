# Architecture Overview — Emissions Data Platform

## 1. System Overview

This project implements the core of the **Emissions Ingestion & Analytics Engine** designed to safely ingest methane emissions data under unreliable network conditions while preserving **data integrity, correctness, and developer ergonomics**.

The system is composed of:

* **Backend API** (NestJS + Prisma)
* **Frontend Dashboard** (Next.js)
* **PostgreSQL** as the database system
* **Docker Compose** for one-command local development
* **Railway** for production deployment

The architecture prioritizes:

* **Idempotency**
* **Atomic transactions**
* **Simple but extensible data modeling**

---

## 2. Backend Architecture

### 2.1 Framework & Structure

The backend is built using **NestJS**, following a conventional layered architecture:

```text
server/
 ├─ src/
 │   ├─ sites/
 │   │   ├─ sites.controller.ts
 │   │   ├─ sites.module.ts
 │   │   ├─ sites.service.ts
 │   │   └─ dto/
 │   ├─ methane-reading/
 │   │   ├─ methane-reading.controller.ts
 │   │   ├─ methane-reading.module.ts
 │   │   ├─ methane-reading.service.ts
 │   │   └─ dto/
 └─ prisma/
     ├─ prisma.module.ts
     ├─ prisma.service.ts
     ├─ schema.prisma
     └─ seed.ts
```

* **Controllers** handle HTTP concerns only.
* **Services** encapsulate business logic and transactional boundaries.
* **DTOs & validation schemas** define the API contract.
* **Prisma** acts as the ORM and transaction manager.

This structure supports **platform-style development**, where additional teams could extend the system without entangling business logic.

---

## 3. Database Design

### 3.1 Schema Overview (Intentionally Minimal)

The database uses **two core tables**:

#### `Site`

* Represents an industrial asset (e.g., well site).
* Stores:

  * `emissionLimit`
  * `totalEmissionsToDate`
  * Metadata

#### `MethaneReading`

* Stores raw methane readings.
* Each row belongs to a `siteId`.
* Enforced uniqueness ensures idempotency.

```prisma
@@unique([siteId, timestamp])
```

This constraint guarantees **no duplicate ingestion for the same measurement window**, even under retries.

```prisma
@@index([siteId])
```

This constraint allows for quickly updating the total emissions for a site after a insertion of emission records.

### 3.2 Design Rationale

* **Denormalized summary (`totalEmissionsToDate`)** allows fast reads for dashboards.
* **Raw measurements preserved** for auditability and reprocessing.
* Minimal schema reduces complexity while remaining extensible.

---

## 4. Atomicity & Idempotency

### 4.1 Atomic Ingestion

The `/ingest` endpoint performs ingestion using a **single database transaction**:

1. Insert raw measurements.
2. Update the site’s aggregate emissions total.

If any step fails, the transaction is rolled back, ensuring **no partial writes**.

### 4.2 Idempotency Strategy

The system is resilient to retries caused by network instability:

* A **unique constraint** on `(siteId, timestamp)` prevents duplicates.
* Prisma throws a known constraint violation on retries.
* Duplicate measurements are safely ignored without inflating totals.

This ensures **exactly-once semantic behavior** at the database level.

---

## 5. Concurrency Considerations

While the current implementation focuses on correctness over throughput, it is safe under concurrent ingestion:

* PostgreSQL transactions guarantee isolation.
* Aggregate updates occur within the same transaction as inserts.
* Unique constraints act as a final line of defense against race conditions.

This provides a solid foundation for future enhancements such as optimistic locking or queue-based ingestion.

---

## 6. Frontend Architecture

The frontend is built with **Next.js (App Router)** and structured around reusable components:

```text
client/
 ├─ lib/
 │   └─ api.ts
 ├─ app/
 │   ├─ layout.tsx
 │   ├─ page.tsx
 │   └─ components/
```

### Key characteristics

* Components are **stateless where possible**
* API calls are centralized
* Errors are surfaced clearly to the user
* Retry flows demonstrate backend idempotency guarantees

The UI intentionally emphasizes **resilience over polish**, aligning with the system’s operational goals.

---

## 7. Developer Experience (DX)

### 7.1 One-Command Local Setup

Local development is fully automated via Docker:

```bash
docker compose up -d
```

This command:

* Starts PostgreSQL
* Waits for database readiness
* Runs Prisma generate, migrate, and seed
* Starts backend and frontend services

### 7.2 Docker Strategy

* **Production Dockerfiles** are optimized for Railway.
* **Dockerfile.dev** variants are used for local development.
* Runtime Prisma commands ensure environment variables are available.

This separation prevents local/dev concerns from leaking into production.

### 7.3 Local Development Without Docker (Primary Workflow)

For most day-to-day development, services are run directly on the host machine to enable faster startup, hot reload, and easier debugging. Docker is used only for the database.

#### Database

```bash
docker compose up postgres -d
```

#### Backend API Server

```bash
npm run start:dev
```

Requires .env file in /src/server with `DATABASE_URL=postgresql://emissions:emissions@localhost:5432/emissions`

#### Frontend Client

```bash
npm run dev
```

Requires .env file in /src/client with `NEXT_PUBLIC_API_URL=http://localhost:3001`

---

## 8. Deployment (Railway)

The system is deployed to **Railway** using Docker-based services:

* Backend and frontend deployed independently
* Environment variables injected via Railway dashboard
* Prisma migrations executed during service startup
* PostgreSQL managed as a Railway service

This mirrors production conditions closely while maintaining simplicity.

---

## 9. Seed Data

Initial seed data is provided to:

* Create sample sites
* Enable immediate dashboard visibility
* Support local testing without manual setup

Seeding runs automatically during container startup in development (section 7.1).

---

## 10. Observability & Error Handling

* Basic error handling is implemented to prevent unhandled failures and surface meaningful errors during development.
* Duplicate ingestion attempts can be identified through database constraints and insert results that are reported in the response of each attempted batch insertion.

While observability is intentionally lightweight in the current implementation, this establishes a starting point for improving structured error responses, frontend feedback, and more comprehensive logging and alerting in future iterations.

---

## 11. Extensibility & Modularity

The system is designed to grow:

* Clear module boundaries
* Database-first correctness guarantees
* Minimal coupling between layers
* Predictable transaction boundaries

Adding features such as alerting, background jobs, or analytics pipelines would not require architectural changes.

---

## 12. Future Improvements

Given more time, the following enhancements would be prioritized:

1. **Optimistic Locking** on `sites` to improve concurrent ingestion throughput.
2. **Transactional Outbox Pattern** to guarantee downstream event delivery.
3. **Time-based Partitioning** on the `measurements` table for large-scale datasets.
4. **API Versioning** to support long-lived IoT devices.
5. **Shared Type Contracts** between frontend and backend (Zod/OpenAPI).
6. **Metrics & Telemetry** for duplicate detection and ingestion rates.
7. **Background Workers** for aggregation instead of synchronous updates.

---

## 13. Conclusion

This architecture emphasizes **correctness first**, recognizing that in emissions reporting, **wrong data is worse than slow data**. The system demonstrates strong fundamentals—atomicity, idempotency, modularity, and operational clarity—while remaining intentionally simple and extensible.

It is designed not just to pass the challenge, but to serve as a foundation a real engineering team could confidently build upon.
