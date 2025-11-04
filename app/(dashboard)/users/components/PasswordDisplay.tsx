'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Eye, EyeOff, RefreshCw, Copy as CopyIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

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
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);

      toast.success('Password copied to clipboard', {
        description: 'The password has been copied. Store it securely.',
        duration: 2000
      });

      // Reset copied state after a delay
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy password', {
        description: 'Unable to copy to clipboard. Please try again.',
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
        <TooltipContent>{revealed ? 'Hide' : 'Show'}</TooltipContent>
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
          <TooltipContent>Regenerate</TooltipContent>
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
          <TooltipContent>
            {copied ? 'Copied!' : 'Copy password'}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
