'use server';

import { signIn } from '@/lib/auth';
import { z } from 'zod';
import { AuthError } from 'next-auth';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type LoginFormState =
  | { success: false; error: string }
  | { success: true }
  | undefined;

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const parsed = credentialsSchema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      error: 'Veuillez entrer un email et un mot de passe valides.'
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/?signedin=1'
    });
    // If we get here, login was successful (signIn will redirect)
    return { success: true };
  } catch (error) {
    // AuthError is thrown when credentials are invalid
    if (error instanceof AuthError) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }
    // Re-throw redirect errors (Next.js redirects throw errors)
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Login error:', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite. Veuillez réessayer."
    };
  }
}
