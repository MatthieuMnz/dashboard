'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="p-4 md:p-6">
      <div className="mb-8 space-y-4">
        <h1 className="font-semibold text-lg md:text-2xl">
          Une erreur est survenue dans la section Utilisateurs
        </h1>
        <p className="text-muted-foreground">Veuillez réessayer.</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center rounded-md border px-3 text-sm"
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}
