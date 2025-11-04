'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Eye, EyeOff, RefreshCw, Copy as CopyIcon, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

type Props = {
  password: string;
  onRegenerate?: () => Promise<void>;
  regenerateLoading?: boolean;
  showCopy?: boolean;
};

export function PasswordDisplay({
  password,
  onRegenerate,
  regenerateLoading = false,
  showCopy = true
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const { copied, copy } = useCopyToClipboard({ resetAfterMs: 2000 });

  async function handleCopy() {
    try {
      await copy(password);

      toast.success('Mot de passe copié dans le presse-papiers', {
        description:
          'Le mot de passe a été copié. Stockez-le de manière sécurisée.',
        duration: 2000
      });
    } catch (err) {
      toast.error('Échec de la copie du mot de passe', {
        description:
          'Impossible de copier dans le presse-papiers. Veuillez réessayer.',
        duration: 2000
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-md border p-3 font-mono text-sm select-all break-all flex-1 ${
          revealed ? '' : '[filter:blur(3px)]'
        }`}
      >
        {password}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setRevealed((prev) => !prev)}
          >
            {revealed ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        {/* @ts-expect-error - type inference issue with TooltipContent */}
        <TooltipContent>{revealed ? 'Masquer' : 'Afficher'}</TooltipContent>
      </Tooltip>
      {onRegenerate && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRegenerate}
              disabled={regenerateLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${regenerateLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          </TooltipTrigger>
          {/* @ts-expect-error - type inference issue with TooltipContent */}
          <TooltipContent>Régénérer</TooltipContent>
        </Tooltip>
      )}
      {showCopy && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handleCopy}
              className={
                copied
                  ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                  : ''
              }
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          {/* @ts-expect-error - type inference issue with TooltipContent */}
          <TooltipContent>
            {copied ? 'Copié !' : 'Copier le mot de passe'}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
