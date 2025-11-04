'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, type LoginFormState } from './actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? 'Connexion en cours…' : 'Se connecter'}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginFormState, FormData>(
    loginAction,
    undefined
  );

  const params = useSearchParams();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (state && 'success' in state && !state.success && state.error) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (params?.get('signout') === '1') {
      toast.success('Déconnexion réussie.');
    }
  }, [params]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lastEmail');
      if (saved) setEmail(saved);
    } catch {}
  }, []);

  return (
    <form
      action={formAction}
      className="w-full space-y-3"
      onSubmit={() => {
        try {
          localStorage.setItem('lastEmail', email);
        } catch {}
      }}
    >
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="utilisateur@exemple.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
      </div>
      {state && 'success' in state && !state.success ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
