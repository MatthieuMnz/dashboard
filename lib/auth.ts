import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import argon2 from 'argon2';
import { db, users } from '@/lib/db';
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
        console.log('Authorize called with:', { 
          hasEmail: !!raw?.email, 
          hasPassword: !!raw?.password,
          email: raw?.email 
        });
        
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          console.error('Credentials schema validation failed:', parsed.error);
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
          console.error(`User not found: ${email}`);
          return null;
        }
        
        if (!user.passwordHash) {
          console.error(`User ${email} has no password hash`);
          return null;
        }

        try {
          const ok = await argon2.verify(user.passwordHash, password);
          if (!ok) {
            console.error(`Password verification failed for user ${email}`);
            return null;
          }
        } catch (error) {
          console.error(`Error verifying password for user ${email}:`, error);
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
