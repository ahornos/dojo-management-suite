/**
 * @file EntityFormPage.tsx
 * @description Shared create/edit page chrome: back-to-list header and centered form container.
 */

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EntityFormPageProps {
  /** Parent list path (`/students`, `/users`, `/disciplines`, `/federations`). */
  backTo: string;
  /** Localized page title (create or “Edit X: Name”). */
  title: string;
  /** Form density: 3xl for sparse entities, 5xl for multi-section student/user forms. */
  maxWidth?: 'max-w-3xl' | 'max-w-5xl' | 'max-w-6xl';
  isLoading?: boolean;
  errorMessage?: string | null;
  children: ReactNode;
}

/**
 * Unified header + content wrapper for dedicated entity form routes.
 *
 * @param {EntityFormPageProps} props - Back target, title, width, and form body.
 * @returns {JSX.Element} Form page layout.
 */
export function EntityFormPage({
  backTo,
  title,
  maxWidth = 'max-w-5xl',
  isLoading = false,
  errorMessage = null,
  children,
}: EntityFormPageProps): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-[var(--space-gap)]">
      <header className="dms-surface flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          onClick={() => navigate(backTo)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <h1 className="min-w-0 flex-1 text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
      </header>

      <div className={cn('mx-auto w-full', maxWidth)}>
        {isLoading ? (
          <p className="dms-surface text-muted-foreground">{t('common.loading')}</p>
        ) : errorMessage ? (
          <p className="dms-surface border-destructive/40 bg-destructive/10 text-destructive">{errorMessage}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
