/**
 * @file FederationStatusBadge.tsx
 * @description Visual federative membership tag for an expanded student row.
 */

import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { useStudentAffiliation } from '../useStudentAffiliation';

interface FederationStatusBadgeProps {
  studentProfileId: string;
  enabled: boolean;
}

/**
 * @param {string | null} acronym - Catalog acronym.
 * @param {string | null} name - Catalog name.
 * @returns {string} Preferred short label.
 */
function federationLabel(acronym: string | null, name: string | null): string {
  const short = acronym?.trim();
  if (short) return short;
  return name?.trim() || '—';
}

/**
 * Shows "Federado" with federation + season, or "No Federado".
 *
 * @param {FederationStatusBadgeProps} props - Student id and whether to fetch.
 * @returns {JSX.Element} Badge group.
 */
export function FederationStatusBadge({ studentProfileId, enabled }: FederationStatusBadgeProps): JSX.Element {
  const { t } = useTranslation();
  const { data, isLoading } = useStudentAffiliation(studentProfileId, enabled);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t('students.detail.federation_loading')}
      </p>
    );
  }

  if (!data?.federated || data.affiliations.length === 0) {
    return (
      <Badge variant="secondary" role="status">
        {t('students.detail.not_federated')}
      </Badge>
    );
  }

  return (
    <ul className="flex flex-wrap gap-1.5" role="status">
      {data.affiliations.map((affiliation) => (
        <li key={`${affiliation.federationId}-${affiliation.season}`}>
          <Badge variant="default">
            {t('students.detail.federated')}
            {' · '}
            {federationLabel(affiliation.federationAcronym, affiliation.federationName)}
            {' · '}
            {affiliation.season}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
