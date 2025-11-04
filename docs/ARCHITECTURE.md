## Company Admin Platform — Architecture & Standards

This document is the single source of truth for how we design, build, and scale the Admin Platform. It defines goals, scope, conventions, and rules to keep the codebase clean and future‑proof as we add more tools (contests admin, widgets panel, partnerships, etc.).

Reference template: [Vercel Next.js Postgres Auth Tailwind Template](https://github.com/vercel/nextjs-postgres-nextauth-tailwindcss-template).

### Vision

- **One admin platform** that aggregates multiple “apps/tools/sections” under a single UI and login.
- **Modular by concept** (e.g., `dashboard/partnership`, `dashboard/contests`, `dashboard/widgets`), each with its own pages, components, data layer, and server logic.
- **Scale safely** with consistent patterns for routing, data access, validation, permissions, and UI.

## Tech Stack

- **Framework**: Next.js App Router (v16)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui (Radix primitives)
- **Auth**: Auth.js v5 (NextAuth)
- **Database**: PostgreSQL 16 (VPS hosted)
- **ORM**: Drizzle ORM (postgres-js) + drizzle-zod
- **State**: React Server Components by default; Client Components only when needed
- **Analytics**: Vercel Analytics (optional in prod)
- **Package manager**: pnpm
- **Tooling**: Prettier, TypeScript path aliases, Tailwind

## Environments & Configuration

- **Environment files**: `.env` for local dev; secure env vars in production via systemd/PM2 or your secret manager.
- **Critical vars**: `POSTGRES_URL`, Auth provider secrets, app URLs. Do not hardcode.
- **Database**: Postgres 16 reachable from app server. Ensure SSL as appropriate.
- **Node**: Use current LTS.

## Project Structure & Conventions

High‑level structure (simplified):

```
app/
  (dashboard)/
    layout.tsx            # dashboard chrome (nav, breadcrumbs, user)
    page.tsx              # main dashboard index
    actions.ts            # shared dashboard server actions (keep small)
    <concept>/            # e.g., partnership, contests, widgets
      page.tsx            # concept landing
      <subpage>/page.tsx  # optional nested pages
      actions.ts          # concept‑scoped server actions
      components/         # concept‑scoped UI
      schemas.ts          # zod schemas (DTOs)
      queries.ts          # concept‑scoped data access helpers
components/               # shared UI (shadcn)
lib/
  db.ts                   # drizzle postgres client, tables, queries
  auth.ts                 # Auth.js config/helpers
  utils.ts                # pure utilities
```

Rules:

- **Domain first**: Each concept gets a folder under `app/(dashboard)/<concept>` with its own `actions.ts`, `components/`, `schemas.ts`, and `queries.ts`.
- **Shared UI** goes in `components/` or `@/components/ui`. Do not duplicate UI across concepts.
- **Server code only on the server**: use Server Components and server actions for data/side‑effects. Keep Client Components minimal.
- **Path aliases**: prefer `@/components/...` and `@/lib/...` over relative paths.

## Routing & Navigation

- Route per concept: `/dashboard/<concept>` (e.g., `/dashboard/partnership`).
- Use the dashboard `layout.tsx` to provide persistent navigation, search, user menu, breadcrumbs.
- Subpages nest under concept: `/dashboard/<concept>/<subpage>`.
- Only export client components when interactive UI is necessary. Default to server pages.

## Data Layer (Drizzle ORM)

- Connection: `lib/db.ts` initializes a `postgres` client via `POSTGRES_URL` and `drizzle(client)`.
- Tables & enums: define with `pgTable`, `pgEnum`, etc. Keep column names snake_case in DB, map to camelCase in TypeScript.
- Queries: colocate read/write helpers per concept in `queries.ts`. Use `lib/db.ts` for shared tables that cut across concepts.
- Validation: define input/output schemas with `zod`/`drizzle-zod`. Never trust client input.
- Pagination/search: prefer cursor/offset helpers in `queries.ts`. Keep page‑size small for UI responsiveness.

Migrations:

- Use `drizzle-kit` for schema migrations. Store migrations in `drizzle/` and run them as part of deploys.
- Never mutate tables directly in production. Always create a migration.

## Server Actions & APIs

- Prefer **server actions** colocated with pages/components when actions are page‑local. For shared actions within a concept, use `app/(dashboard)/<concept>/actions.ts`.
- Actions must:
  - Validate input with `zod`.
  - Authorize (role/capability check) before DB mutations.
  - Handle errors predictably (return typed error objects or throw domain errors caught by UI error boundaries).
- Avoid creating separate API routes unless the action must be called from non‑React contexts or external systems.

## AuthN & AuthZ

- Use Auth.js v5 with a single sign‑in flow.
- Gate all dashboard routes behind authentication in server components/layouts.
- Introduce **roles/capabilities** early (e.g., `admin`, `editor`, `viewer`) and check in server actions and server components.
- Never rely on client‑side role checks for security decisions.

## UI & Styling

- Use shadcn/ui primitives. Only add custom components to `components/` when they are reused across concepts.
- Tailwind conventions:
  - Keep class lists readable, group by layout → spacing → color → state.
  - Extract repeated patterns into reusable components/variants (CVA) instead of copy‑pasting classes.
- Accessibility: prefer Radix components, ensure keyboard support and proper ARIA.

## Error Handling

- UI: use error boundaries (`error.tsx`) under concept folders for domain‑specific errors.
- Server: throw typed domain errors; avoid leaking low‑level details to the client. Log full errors on the server.

## Performance

- Default to Server Components and server data fetching.
- Use streaming/suspense where appropriate.
- Defer JS: avoid client components unless necessary (forms, interactivity).
- Paginate lists; avoid returning unbounded datasets.

## Security

- Secrets only via envs. Never commit secrets.
- Validate and sanitize all inputs with `zod`.
- Apply least‑privilege DB roles if using multiple DB users.
- Use HTTPS end‑to‑end in production.

## Observability

- Centralize logging on the server. Include request IDs for actionable traces.
- Add basic analytics for usage insights of each concept (feature adoption, errors).

## Deployment (Ubuntu VPS)

- Postgres 16 managed on the VPS (backups scheduled, retention defined).
- App deploy options:
  - **Node + systemd/PM2**: build on CI, rsync artifacts, run `next start` behind reverse proxy (nginx/Caddy).
  - Configure environment via systemd drop‑ins or `.env` loaded by your process manager.
- Run DB migrations during deploy. Fail fast if migrations fail.

## Code Style & Conventions

- TypeScript strict mode. Avoid `any`.
- Naming:
  - Files: kebab‑case for files, `page.tsx`, `layout.tsx`, `actions.ts`.
  - Components: `PascalCase` exported from files named after the component.
  - Variables/functions: descriptive, avoid abbreviations.
- Imports: use path aliases (`@/components`, `@/lib`). No deep relative chains.
- Formatting: Prettier default config in `package.json`. Do not override per‑file.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`...).

## Adding a New Concept (Example: Partnerships)

1. Create folder: `app/(dashboard)/partnership/`.
2. Add `page.tsx` (server component) with the landing UI.
3. Add `schemas.ts` (zod) for inputs/filters, `queries.ts` for reads, `actions.ts` for mutations.
4. Define tables/enums in `lib/db.ts` or (preferred) split to `lib/schema/partnership.ts` and import into `db.ts`.
5. Create migrations with drizzle‑kit and apply them.
6. Add navigation entry in `app/(dashboard)/layout.tsx`.
7. Add tests for `schemas` and critical `queries/actions` (unit/integration as needed).

## Appendix

- Path aliases (`tsconfig.json`): `@/components/*` → `components/*`, `@/lib/*` → `lib/*`.
- Example data code lives in `lib/db.ts` and `app/api/seed/route.ts`; use it as a reference for Drizzle patterns.

---

This standard evolves with the platform. Keep it updated when introducing new patterns.
