/**
 * @file FederationTableRow.tsx
 * @description Expandable catalog row: identity summary, tagged contacts, and icon actions.
 */

import { Ban, ChevronRight, CircleCheck, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Federation, FederationContact } from './types';

interface FederationTableRowProps {
  federation: Federation;
  expanded: boolean;
  isSuperAdmin: boolean;
  isToggling: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onOpenPriceList: () => void;
}

/**
 * @param {FederationContact[]} contacts - Tagged contacts.
 * @param {string} medium - Medium to keep.
 * @returns {FederationContact[]} Matching contacts.
 */
function contactsByMedium(contacts: FederationContact[], medium: FederationContact['medium']): FederationContact[] {
  return contacts.filter((contact) => contact.medium === medium);
}

/**
 * Expandable federation row plus detail panel with contacts and price-list access.
 *
 * @param {FederationTableRowProps} props - Row state and action handlers.
 * @returns {JSX.Element} Two table rows (summary + details).
 */
export function FederationTableRow({
  federation,
  expanded,
  isSuperAdmin,
  isToggling,
  onToggle,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onOpenPriceList,
}: FederationTableRowProps): JSX.Element {
  const { t } = useTranslation();
  const isDeleted = Boolean(federation.deletedAt);
  const contacts = federation.contacts ?? [];
  const seasons = (federation.seasons ?? []).filter((season) => season.isActive).map((season) => season.seasonName);

  return (
    <>
      <tr
        className={cn('group cursor-pointer hover:bg-muted/60 transition-colors', expanded && 'bg-muted/40')}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={expanded ? t('financial.federations.collapse') : t('financial.federations.expand')}
      >
        <td className="px-4 py-3 font-medium text-foreground">{federation.name}</td>
        <td className="px-4 py-3 text-muted-foreground">{federation.acronym || '—'}</td>
        <td className="px-4 py-3 text-muted-foreground">
          {t(`countries.${federation.country}`, { defaultValue: federation.country })}
        </td>
        <td className="px-4 py-3 text-muted-foreground">{federation.email || '—'}</td>
        <td className="px-4 py-3 text-muted-foreground">{seasons.length > 0 ? seasons.join(' · ') : '—'}</td>
        <td className="px-4 py-3">
          <Badge variant={isDeleted ? 'destructive' : federation.isActive ? 'default' : 'secondary'}>
            {isDeleted
              ? t('financial.federations.deleted')
              : federation.isActive
                ? t('financial.federations.active')
                : t('financial.federations.inactive')}
          </Badge>
        </td>
        <td
          className={cn(
            'sticky right-0 whitespace-nowrap px-4 py-3 text-right group-hover:bg-muted/60',
            expanded ? 'bg-muted/40 group-hover:bg-muted/40' : 'bg-card',
          )}
        >
          <div className="inline-flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
            {!isDeleted ? (
              <Tooltip content={t('financial.federations.edit')}>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={t('financial.federations.edit')}
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
              </Tooltip>
            ) : null}

            {!isDeleted && federation.isActive ? (
              <Tooltip content={t('financial.federations.deactivate')}>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={t('financial.federations.deactivate')}
                  disabled={isToggling}
                  onClick={onDeactivate}
                >
                  <Ban className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Tooltip>
            ) : null}

            {!isDeleted && !federation.isActive ? (
              <Tooltip content={t('financial.federations.activate')}>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={t('financial.federations.activate')}
                  disabled={isToggling}
                  onClick={onActivate}
                >
                  <CircleCheck className="h-4 w-4 text-primary" />
                </Button>
              </Tooltip>
            ) : null}

            {isSuperAdmin ? (
              <Tooltip content={t('financial.federations.delete')}>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                  aria-label={t('financial.federations.delete')}
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Tooltip>
            ) : null}

            <Tooltip content={expanded ? t('financial.federations.collapse') : t('financial.federations.expand')}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-expanded={expanded}
                aria-label={expanded ? t('financial.federations.collapse') : t('financial.federations.expand')}
                onClick={onToggle}
              >
                <ChevronRight
                  className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-90')}
                />
              </Button>
            </Tooltip>
          </div>
        </td>
      </tr>
      {expanded ? (
        <tr className="bg-card">
          <td colSpan={7} className="px-4 pb-4 pt-0">
            <div className="space-y-4 overflow-hidden rounded-md border border-border bg-muted/20 p-4">
              <section>
                <h3 className="text-sm font-semibold text-foreground">
                  {t('financial.federations.profile_section')}
                </h3>
                <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  <Detail label={t('financial.federations.name')} value={federation.name} />
                  <Detail label={t('financial.federations.acronym')} value={federation.acronym || '—'} />
                  <Detail
                    label={t('financial.federations.country')}
                    value={t(`countries.${federation.country}`, { defaultValue: federation.country })}
                  />
                  <Detail label={t('financial.federations.email')} value={federation.email || '—'} />
                  <Detail
                    label={t('financial.federations.table_seasons')}
                    value={seasons.length > 0 ? seasons.join(' · ') : '—'}
                  />
                </dl>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-foreground">
                  {t('financial.federations.contacts_section')}
                </h3>
                {contacts.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">{t('financial.federations.contacts_empty')}</p>
                ) : (
                  <div className="mt-2 grid gap-3 md:grid-cols-3">
                    <ContactGroup
                      title={t('enums.federation_contact_medium.PHONE')}
                      contacts={contactsByMedium(contacts, 'PHONE')}
                    />
                    <ContactGroup
                      title={t('enums.federation_contact_medium.EMAIL')}
                      contacts={contactsByMedium(contacts, 'EMAIL')}
                    />
                    <ContactGroup
                      title={t('enums.federation_contact_medium.ADDRESS')}
                      contacts={contactsByMedium(contacts, 'ADDRESS')}
                    />
                  </div>
                )}
              </section>

              <Button type="button" variant="outline" size="sm" onClick={onOpenPriceList}>
                {t('financial.federations.price_list')}
              </Button>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

interface DetailProps {
  label: string;
  value: string;
}

/**
 * @param {DetailProps} props - Label and value.
 * @returns {JSX.Element} Definition pair.
 */
function Detail({ label, value }: DetailProps): JSX.Element {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

interface ContactGroupProps {
  title: string;
  contacts: FederationContact[];
}

/**
 * @param {ContactGroupProps} props - Medium title and tagged values.
 * @returns {JSX.Element} Contact group.
 */
function ContactGroup({ title, contacts }: ContactGroupProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      {contacts.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{t('financial.federations.contacts_none')}</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm">
          {contacts.map((contact) => (
            <li key={contact.id ?? `${contact.medium}-${contact.value}`} className="text-foreground">
              {contact.tag ? (
                <span className="mr-1 rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                  {contact.tag}
                </span>
              ) : null}
              {contact.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
