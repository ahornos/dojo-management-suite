import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Native checkbox using semantic tokens (`accent-primary`, `border-input`).
 */
const Checkbox = React.forwardRef<HTMLInputElement, Omit<React.ComponentProps<'input'>, 'type'>>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      className={cn(
        'mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
