/**
 * @file tooltip.tsx
 * @description Accessible hover tooltip primitive (shadcn-style) using semantic tokens.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  /** Default `top` for dense tables; `right` for the collapsed sidebar rail. */
  side?: 'top' | 'right';
}

/**
 * Wraps a control and shows `content` on hover and keyboard focus.
 *
 * @param {TooltipProps} props - Trigger, tooltip copy, and optional placement.
 * @returns {JSX.Element} Positioned tooltip.
 */
export function Tooltip({ content, children, className, side = 'top' }: TooltipProps): JSX.Element {
  return (
    <span className={cn('group relative inline-flex outline-none', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-md',
          'border border-border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground shadow-md',
          'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100',
          side === 'right'
            ? 'left-full top-1/2 ml-2 -translate-y-1/2'
            : 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
        )}
      >
        {content}
      </span>
    </span>
  );
}
