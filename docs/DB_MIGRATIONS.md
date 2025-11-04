# Drizzle Migrations — Quickstart

## Prerequisites

- Set `POSTGRES_URL` in a `.env` at the repo root.
- Ensure the schema is defined in `lib/db.ts` (or `lib/schema/**/*.ts`).

## Common commands

```bash
# Generate SQL migrations from TypeScript schema
pnpm drizzle:generate

# Apply migrations to the current database
pnpm drizzle:migrate

# Explore your DB with Drizzle Studio
pnpm drizzle:studio
```

## Typical flow

1. Edit schema in `lib/db.ts` (or `lib/schema/...`).
2. Generate migrations: `pnpm drizzle:generate`.
3. Review SQL in `drizzle/`.
4. Apply: `pnpm drizzle:migrate`.

## Notes

- Never edit committed migration files; create a new migration for changes.
- Run migrations during deploys before starting the app.
- Back up production before running migrations.

