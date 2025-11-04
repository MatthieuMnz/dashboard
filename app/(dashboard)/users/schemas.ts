import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .trim()
    .min(1)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  username: z
    .string()
    .trim()
    .min(1)
    .optional()
    .or(z.literal('').transform(() => undefined))
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    name: z
      .string()
      .trim()
      .min(1)
      .optional()
      .or(z.literal('').transform(() => undefined)),
    username: z
      .string()
      .trim()
      .min(1)
      .optional()
      .or(z.literal('').transform(() => undefined))
  })
  .strict();
