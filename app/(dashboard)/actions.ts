'use server';

import { signOut } from '@/lib/auth';

// Shared dashboard server actions

export async function signOutAction() {
  try {
    await signOut({ redirect: true, redirectTo: '/login?signout=1' });
  } catch (error) {
    // Re-throw redirect errors (Next.js redirects throw errors)
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Sign out error:', error);
    throw error;
  }
}
