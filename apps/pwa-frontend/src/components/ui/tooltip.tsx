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
}

/**
 * Wraps a control and shows `content` on hover and keyboard focus.
 *
 * @param {TooltipProps} props - Trigger and tooltip copy.
 * @returns {JSX.Element} Positioned tooltip.
 */
export function Tooltip({ content, children, className }: TooltipProps): JSX.Element {
  return (
    <span tabIndex={0} className={cn('group relative inline-flex outline-none', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md',
          'border border-border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground shadow-md',
          'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100',
        )}
      >
        {content}
      </span>
    </span>
  );
}
