/**
 * @file PriceListModal.tsx
 * @description Tabbed seasonal price-list viewer (one tab per configured season).
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currencyAdornment } from '@/lib/domain-enums';
import { cn } from '@/lib/utils';
import type { Federation, FederationLicensePriceRow, FederationSeason } from './types';

interface PriceListModalProps {
  federation: Federation | null;
  onClose: () => void;
}

/**
 * @param {string | undefined} cost - Cost field.
 * @param {string | undefined} reduction - Reduction field.
 * @returns {string} Display net or em dash.
 */
function formatNet(cost: string | undefined, reduction: string | undefined): string {
  const costValue = Number.parseFloat(cost ?? '');
  const reductionValue = Number.parseFloat(reduction || '0');
  if (Number.isNaN(costValue)) return '—';
  const net = Math.max(0, costValue - (Number.isNaN(reductionValue) ? 0 : reductionValue));
  return net.toFixed(2);
}

/**
 * @param {FederationLicensePriceRow} row - Matrix row.
 * @param {(key: string) => string} t - Translator.
 * @returns {string} Holder / range label.
 */
function rowLabel(row: FederationLicensePriceRow, t: (key: string) => string): string {
  if (row.kind === 'CUSTOM') {
    const year = row.birthYearFrom != null ? String(row.birthYearFrom) : '';
    return [row.label, year ? `≥ ${year}` : ''].filter(Boolean).join(' · ') || '—';
  }
  return t(`financial.federations.price_kind_${row.kind.toLowerCase()}`);
}

/**
 * Modal listing club cost and license-type matrices, tabbed by season.
 *
 * @param {PriceListModalProps} props - Federation catalog (already includes seasons) and close handler.
 * @returns {JSX.Element | null} Modal, or `null` when closed.
 */
export function PriceListModal({ federation, onClose }: PriceListModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const seasons = federation?.seasons ?? [];
  const [activeSeasonId, setActiveSeasonId] = useState<string>('');

  useEffect(() => {
    const first = seasons[0];
    setActiveSeasonId(first?.id ?? first?.seasonName ?? '');
  }, [federation?.id]);

  if (!federation) return null;

  const active: FederationSeason | undefined =
    seasons.find((season) => (season.id ?? season.seasonName) === activeSeasonId) ?? seasons[0];
  const suffix = currencyAdornment(active?.currency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/50 p-4">
      <Card className="w-full max-w-4xl bg-card shadow-xl" role="dialog" aria-modal="true">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{t('financial.federations.price_list_title', { name: federation.name })}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{t('financial.federations.price_list_help')}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t('financial.federations.price_list_close')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {seasons.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('financial.federations.price_list_empty')}</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 border-b border-border pb-3" role="tablist">
                {seasons.map((season) => {
                  const key = season.id ?? season.seasonName;
                  const selected = (active?.id ?? active?.seasonName) === key;
                  return (
                    <Button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      variant={selected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveSeasonId(key)}
                    >
                      {season.seasonName}
                    </Button>
                  );
                })}
              </div>

              {active ? (
                <div className="space-y-4">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{t('financial.federations.club_cost')}: </span>
                    {active.clubCost} {suffix}
                    <span className="ml-3 text-muted-foreground">
                      {t(`currencies.${active.currency}`, { defaultValue: active.currency })}
                    </span>
                  </p>

                  {(active.licenseTypes ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('financial.federations.price_list_empty')}</p>
                  ) : (
                    active.licenseTypes.map((type) => (
                      <div key={type.id ?? type.name} className="overflow-x-auto rounded-md border border-border">
                        <p className={cn('border-b border-border bg-muted/40 px-3 py-2 text-sm font-medium')}>
                          {type.name}
                        </p>
                        <table className="w-full min-w-[36rem] text-left text-sm">
                          <thead className="text-muted-foreground">
                            <tr>
                              <th className="px-3 py-2 font-medium">{t('financial.federations.price_col_range')}</th>
                              <th className="px-3 py-2 font-medium">{t('financial.federations.price_col_cost')}</th>
                              <th className="px-3 py-2 font-medium">{t('financial.federations.price_col_reduction')}</th>
                              <th className="px-3 py-2 font-medium">{t('financial.federations.price_col_net')}</th>
                              <th className="px-3 py-2 font-medium">{t('financial.federations.price_col_charge')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {type.priceRows.map((row) => (
                              <tr key={row.id ?? `${row.kind}-${row.label}`} className="border-t border-border">
                                <td className="px-3 py-2 text-foreground">{rowLabel(row, t)}</td>
                                <td className="px-3 py-2 tabular-nums">
                                  {row.cost} {suffix}
                                </td>
                                <td className="px-3 py-2 tabular-nums">
                                  {row.reduction} {suffix}
                                </td>
                                <td className="px-3 py-2 tabular-nums">
                                  {row.netTotal ?? formatNet(row.cost, row.reduction)} {suffix}
                                </td>
                                <td className="px-3 py-2 tabular-nums">
                                  {row.chargePrice} {suffix}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
