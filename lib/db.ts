import 'server-only';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, text, serial } from 'drizzle-orm/pg-core';

const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// Users table mapping existing SQL schema and password hashing column
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  username: text('username'),
  passwordHash: text('password_hash')
});

export type SelectUser = typeof users.$inferSelect;
