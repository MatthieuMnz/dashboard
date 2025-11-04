'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

type CopyableProps = {
  /** The text content to copy */
  value: string;
  /** Optional label for the toast notification */
  label?: string;
  /** Optional className for the wrapper */
  className?: string;
  /** Optional className for the copy button */
  buttonClassName?: string;
  /** Custom children to render. If not provided, displays the value */
  children?: React.ReactNode;
  /** Size of the copy icon */
  iconSize?: number;
  /** Position of the copy button */
  position?: 'right' | 'left' | 'top' | 'bottom';
  /** Whether to show the copy button on hover only */
  showOnHover?: boolean;
  /** Whether to truncate long text */
  truncate?: boolean;
  /** Maximum length before truncation */
  maxLength?: number;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Copyable component that makes any text content copyable with a hover copy button.
 *
 * @example
 * ```tsx
 * // Simple usage
 * <Copyable value="user@example.com" />
 *
 * // With custom children
 * <Copyable value="user@example.com" label="Email">
 *   <span className="font-mono">{email}</span>
 * </Copyable>
 *
 * // In a table cell
 * <TableCell>
 *   <Copyable value={user.id} label="User ID" />
 * </TableCell>
 * ```
 */
export function Copyable({
  value,
  label,
  className,
  buttonClassName,
  children,
  iconSize = 14,
  position = 'right',
  showOnHover = true,
  truncate = false,
  maxLength = 50,
  ...props
}: CopyableProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { copied, copy } = useCopyToClipboard({ resetAfterMs: 2000 });

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await copy(value);

      toast.success('Copié dans le presse-papiers', {
        description: label
          ? `${label} copié`
          : 'Texte copié dans le presse-papiers',
        duration: 2000
      });
    } catch (err) {
      toast.error('Échec de la copie', {
        description: 'Impossible de copier dans le presse-papiers',
        duration: 2000
      });
    }
  };

  const displayValue =
    truncate && value.length > maxLength
      ? `${value.slice(0, maxLength)}...`
      : value;

  const positionClasses = {
    right: 'right-2 top-1/2 -translate-y-1/2',
    left: 'left-2 top-1/2 -translate-y-1/2',
    top: 'top-2 left-1/2 -translate-x-1/2',
    bottom: 'bottom-2 left-1/2 -translate-x-1/2'
  };

  const buttonBaseClasses = cn(
    'absolute z-10 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm border border-border shadow-sm transition-all duration-200',
    'hover:bg-accent hover:border-accent-foreground/20',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'active:scale-95',
    'h-6 w-6 min-w-[24px]',
    positionClasses[position],
    showOnHover && !isHovered && 'opacity-0 pointer-events-none',
    buttonClassName
  );

  return (
    <div
      className={cn('relative group inline-flex items-center', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children ?? (
        <span
          className={cn('select-none mr-2', position === 'right' && 'pr-8')}
          title={value}
        >
          {displayValue}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className={buttonBaseClasses}
        aria-label={`Copier ${label || 'le texte'} dans le presse-papiers`}
        title={`Copier ${label || 'le texte'}`}
      >
        {copied ? (
          <Check
            className="h-3.5 w-3.5 text-green-600 dark:text-green-400"
            size={iconSize}
          />
        ) : (
          <Copy
            className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground"
            size={iconSize}
          />
        )}
      </button>
    </div>
  );
}

/**
 * CopyableText - A simple wrapper for text that makes it copyable
 */
export function CopyableText({
  value,
  label,
  className,
  ...props
}: Omit<CopyableProps, 'children'>) {
  return (
    <Copyable
      value={value}
      label={label}
      className={cn('inline-block', className)}
      {...props}
    />
  );
}

/**
 * CopyableTableCell - A wrapper for table cells that makes content copyable
 */
export function CopyableTableCell({
  value,
  label,
  children,
  className,
  ...props
}: CopyableProps & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('relative', className)} {...props}>
      {children ? (
        <Copyable value={value} label={label} className="w-full">
          {children}
        </Copyable>
      ) : (
        <Copyable value={value} label={label} className="w-full" />
      )}
    </td>
  );
}
