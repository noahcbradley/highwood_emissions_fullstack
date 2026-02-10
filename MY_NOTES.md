# App Design and Requirements

- Backend: NestJS
- DB: PostgreSQL
- ORM: Prisma or Drizzle (Prisma is easier to reason about for reviewers)
- Validation: Zod
- Frontend: Next.js (App Router)
- Infra: Docker Compose

# Creation Steps

## Client

- `npx create-next-app@latest client`
  - Using defaults
- RUN client `docker compose up client`

### Build

`docker compose build --no-cache client`

## Server

- `npx @nestjs/cli new server`
- Use npm
- `npm install prisma @prisma/client`

### Build

`docker compose build --no-cache server`

### Shell

`docker compose exec server sh`

### Configure Prisma

In a shell within the server run `npx prisma migrate dev --name init`

#### Generate Prisma

`npx prisma generate`

## Database

- 