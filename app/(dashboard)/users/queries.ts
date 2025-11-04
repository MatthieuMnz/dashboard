import 'server-only';

import { db, users, type SelectUser } from '@/lib/db';
import { USER_LIST_LIMIT } from '@/lib/constants';
import { asc, count, eq } from 'drizzle-orm';

export type ListUsersResult = {
  users: SelectUser[];
  totalUsers: number;
};

export async function listUsers(): Promise<ListUsersResult> {
  const [rows, total] = await Promise.all([
    db.select().from(users).orderBy(asc(users.id)).limit(USER_LIST_LIMIT),
    db.select({ total: count(users.id) }).from(users)
  ]);

  return {
    users: rows,
    totalUsers: Number(total[0]?.total ?? 0)
  };
}

export async function findUserByEmail(email: string) {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return row ?? null;
}

export async function insertUser(input: {
  email: string;
  name?: string | null;
  username?: string | null;
  passwordHash?: string | null;
}) {
  const [row] = await db
    .insert(users)
    .values({
      email: input.email,
      name: input.name ?? null,
      username: input.username ?? null,
      passwordHash: input.passwordHash ?? null
    })
    .returning();
  return row;
}

export async function updateUserById(
  id: number,
  input: { email?: string; name?: string | null; username?: string | null }
) {
  const [row] = await db
    .update(users)
    .set({
      email: input.email,
      name: input.name ?? null,
      username: input.username ?? null
    })
    .where(eq(users.id, id))
    .returning();
  return row;
}

export async function deleteUserById(id: number) {
  const [row] = await db.delete(users).where(eq(users.id, id)).returning();
  return row;
}

export async function updatePasswordHashById(id: number, passwordHash: string) {
  const [row] = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, id))
    .returning();
  return row;
}
