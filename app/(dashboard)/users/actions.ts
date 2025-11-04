'use server';

import argon2 from 'argon2';
import { createUserSchema, type CreateUserInput } from './schemas';
import {
  findUserByEmail,
  insertUser,
  updateUserById,
  deleteUserById,
  updatePasswordHashById
} from './queries';
import { revalidatePath } from 'next/cache';

function generatePassword(length: number = 16): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.?';
  const all = upper + lower + digits + symbols;

  const pick = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  const remainingLength = Math.max(length - required.length, 0);
  const remaining = Array.from({ length: remainingLength }, () => pick(all));
  const result = [...required, ...remaining];

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.join('');
}

export async function createUser(input: CreateUserInput) {
  const { email, name, username } = createUserSchema.parse(input);

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('A user with this email already exists.');
  }

  const plaintextPassword = generatePassword(16);
  const passwordHash = await argon2.hash(plaintextPassword, {
    type: argon2.argon2id
  });

  const user = await insertUser({
    email,
    name: name ?? null,
    username: username ?? null,
    passwordHash
  });

  revalidatePath('/users');
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username
    },
    plaintextPassword
  };
}

export async function updateUserAction(
  id: number,
  input: { email?: string; name?: string; username?: string }
) {
  const safeEmail = input.email?.trim();
  if (safeEmail) {
    const existing = await findUserByEmail(safeEmail);
    if (existing && existing.id !== id) {
      throw new Error('A user with this email already exists.');
    }
  }

  const updated = await updateUserById(id, {
    email: safeEmail,
    name: input.name ?? null,
    username: input.username ?? null
  });

  revalidatePath('/users');
  return {
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      username: updated.username
    }
  };
}

export async function deleteUserAction(id: number) {
  const deleted = await deleteUserById(id);
  revalidatePath('/users');
  return { id: deleted?.id };
}

export async function resetUserPasswordAction(id: number) {
  const plaintextPassword = generatePassword(16);
  const passwordHash = await argon2.hash(plaintextPassword, {
    type: argon2.argon2id
  });
  await updatePasswordHashById(id, passwordHash);
  revalidatePath('/users');
  return { plaintextPassword };
}
