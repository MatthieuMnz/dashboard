'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Une erreur est survenue</CardTitle>
          </div>
          <CardDescription>
            Une erreur s'est produite lors du chargement de cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Veuillez réessayer. Si le problème persiste, contactez le support
            technique.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Code d'erreur : {error.digest}
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={reset} variant="default">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
