import { pgTable, text, serial } from 'drizzle-orm/pg-core';

// Drizzle schema definitions only (no runtime DB client, no 'server-only')
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  username: text('username'),
  passwordHash: text('password_hash')
});

export type SelectUser = typeof users.$inferSelect;


