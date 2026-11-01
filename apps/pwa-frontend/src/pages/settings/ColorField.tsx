/**
 * @file ColorField.tsx
 * @description Hex color picker bound to react-hook-form (native color + text).
 */

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * Combined color swatch and hex input.
 *
 * @param {object} props - Field name and label.
 * @returns {JSX.Element} Color picker field.
 */
export function ColorField({ name, label }: { name: string; label: string }): JSX.Element {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={label}
                className="h-10 w-12 cursor-pointer rounded-md border border-input bg-background p-1"
                value={/^#([0-9A-Fa-f]{6})$/.test(field.value) ? field.value : '#2563EB'}
                onChange={(event) => field.onChange(event.target.value.toUpperCase())}
              />
              <Input
                value={field.value}
                onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                placeholder="#2563EB"
                maxLength={7}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
