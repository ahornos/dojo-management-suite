/**
 * @file MultiSelectFilter.tsx
 * @description Compact popover multi-select used by the student directory toolbar.
 */

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  emptyLabel: string;
}

/**
 * Horizontal-toolbar combobox: trigger shows a count; the panel lists checkboxes.
 *
 * @param {MultiSelectFilterProps} props - Label, options, and selection.
 * @returns {JSX.Element} Filter control.
 */
export function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
  emptyLabel,
}: MultiSelectFilterProps): JSX.Element {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const summary =
    selected.length === 0
      ? emptyLabel
      : selected.length === 1
        ? (options.find((item) => item.value === selected[0])?.label ?? selected[0])
        : t('students.selected_count', { count: selected.length });

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 min-w-[10rem] max-w-[16rem] justify-between gap-2 font-normal"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex min-w-0 flex-col items-start text-left">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
          <span className="w-full truncate text-sm text-foreground">{summary}</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </Button>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-30 mt-1 w-64 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
        >
          <ul className="max-h-64 space-y-0.5 overflow-y-auto">
            {options.length === 0 ? (
              <li className="px-2 py-1.5 text-sm text-muted-foreground">{emptyLabel}</li>
            ) : (
              options.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <li key={option.value}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      <Checkbox
                        checked={checked}
                        onChange={() => toggle(option.value)}
                        aria-label={option.label}
                      />
                      <span className="text-foreground">{option.label}</span>
                    </label>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
