import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import argon2 from 'argon2';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          return null;
        }
        const { email, password } = parsed.data;

        const [user] = await db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            username: users.username,
            passwordHash: users.passwordHash
          })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) {
          return null;
        }

        if (!user.passwordHash) {
          return null;
        }

        try {
          const ok = await argon2.verify(user.passwordHash, password);
          if (!ok) {
            return null;
          }
        } catch (error) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? user.username ?? user.email
        };
      }
    })
  ]
});
