/**
 * @file FormSection.tsx
 * @description Shared form layout primitives: section card, two-column grid, labelled field.
 */

import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

/**
 * Grouped fieldset with a heading. All application forms should wrap their blocks in this.
 *
 * @param {FormSectionProps} props - Title, optional help text, body, and optional header actions.
 * @returns {JSX.Element} Section card.
 */
export function FormSection({ title, description, children, actions }: FormSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4 md:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

interface FormGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Responsive two-column grid used for standard inputs (`gap-6`).
 *
 * @param {FormGridProps} props - Children and optional extra classes (e.g. `md:grid-cols-3`).
 * @returns {JSX.Element} Grid.
 */
export function FormGrid({ children, className }: FormGridProps) {
  return <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>{children}</div>;
}

interface FieldProps {
  id?: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Label + control + optional hint/error. Use `className="md:col-span-2"` for full-width notes.
 *
 * @param {FieldProps} props - Accessibility id, label, validation, and control.
 * @returns {JSX.Element} Field.
 */
export function Field({ id, label, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? ' *' : ''}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
