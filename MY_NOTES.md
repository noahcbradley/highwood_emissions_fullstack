# App Design and Requirements

- Backend: NestJS
- DB: PostgreSQL
- ORM: Prisma or Drizzle (Prisma is easier to reason about for reviewers)
- Validation: Zod
- Frontend: Next.js (App Router)
- Infra: Docker Compose

## Creation Steps

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

### Build Server

`docker compose build --no-cache server`

### Shell

`docker compose exec server sh`

### Configure Prisma

#### Generate Prisma

`npx prisma generate`

#### Sync to DB

In a shell within the server run `npx prisma migrate dev --name <unique_migration_name>`

Use unique_migration_name=init for first migration

#### Check if migrate is needed

`npx prisma migrate dev --preview-feature`

## Database

### Run Seed

`npm run prisma:seed`

## Live Site

### Database Live

### Frontend Live

### Backend Live
