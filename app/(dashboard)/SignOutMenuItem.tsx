'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { signOutAction } from './actions';
import { useTransition } from 'react';

export function SignOutMenuItem() {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        startTransition(() => {
          signOutAction();
        });
      }}
      disabled={isPending}
    >
      {isPending ? 'Signing out…' : 'Sign Out'}
    </DropdownMenuItem>
  );
}


