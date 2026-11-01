/**
 * @file MoneyInput.tsx
 * @description Enterprise money field: text input with a currency suffix addon.
 */

import { forwardRef, type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { currencyAdornment } from '@/lib/domain-enums';
import { cn } from '@/lib/utils';

interface MoneyInputProps extends Omit<ComponentProps<typeof Input>, 'type'> {
  /** ISO 4217 code driving the suffix (`EUR` → `€`). */
  currency?: string;
}

/**
 * Numeric-looking money input with an inner suffix (`€`, `$`, or the ISO code).
 *
 * @param {MoneyInputProps} props - Input props plus season currency.
 * @returns {JSX.Element} Adorned input.
 */
export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { currency, className, ...props },
  ref,
): JSX.Element {
  const suffix = currencyAdornment(currency);

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        className={cn('pr-12', className)}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-medium text-muted-foreground"
      >
        {suffix}
      </span>
    </div>
  );
});
