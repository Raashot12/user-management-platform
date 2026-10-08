# User Management Platform

Monorepo starter for the user management and résumé platform described in the project brief.

## Stack

- `apps/web`: React, Vite, TypeScript, Redux Toolkit / RTK Query
- `apps/api`: NestJS, TypeORM, PostgreSQL
- PostgreSQL for local development through Docker Compose

## Start here

1. Install Node.js 20+ and pnpm 10.
2. Copy `apps/api/.env.example` to `apps/api/.env` and adjust values if needed.
3. Start PostgreSQL with `pnpm db:up`.
4. Install dependencies with `pnpm install`.
5. Apply the initial schema with `pnpm db:migrate`.
6. Start both apps with `pnpm dev` (or start them separately with `pnpm dev:api` and `pnpm dev:web`).

The API is versioned under `/api/v1`; Swagger is at `/api/docs`. The web app expects the API at `http://localhost:3000/api/v1`. Use `pnpm db:down` to stop the local database; its named volume preserves local data.

The initial backend slice covers the user aggregate: profile, contact, address, and multiple academic records are created in one request and one database transaction. Schema changes are managed with migrations; TypeORM schema synchronization is disabled.

## Current milestone

- [x] Workspace and local PostgreSQL configuration
- [x] Initial user aggregate entities, DTOs, migration, and REST endpoints
- [x] Web app shell with API connection and user list starter
- [ ] Multi-step user form, résumé preview, and exports
- [ ] Authentication and administrator access
- [ ] Deployment configuration for Render and Vercel

