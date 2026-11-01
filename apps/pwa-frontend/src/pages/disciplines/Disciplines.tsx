/**
 * @file Disciplines.tsx
 * @description Discipline / program catalog. Used standalone historically and now embedded in Academy Settings.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resolveBeltAppearance } from '@/lib/beltAppearance';
import { getLocalizedBeltName } from '@/lib/beltTranslations';
import { BeltRankModal } from './BeltRankModal';
import { DisciplineForm } from './DisciplineForm';
import { BeltRankPayload, DisciplinePayload, DisciplineProgramPayload } from './types';
import { useDisciplines } from './useDisciplines';

/**
 * Renders the Disciplines catalog with belt-rank and program CRUD.
 *
 * @param {object} props - When `embedded`, the page chrome is omitted (settings Académico tab).
 * @returns {React.ReactElement} Catalog view.
 */
export function DisciplinesCatalog({ embedded = false }: { embedded?: boolean }): React.ReactElement {
  const { t } = useTranslation();
  const {
    disciplines,
    isLoading,
    error,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    createProgram,
    deleteProgram,
    saveBeltRank,
    deleteBeltRank,
  } = useDisciplines();

  const [isBeltModalOpen, setIsBeltModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [selectedBeltRank, setSelectedBeltRank] = useState<BeltRankPayload | null>(null);
  const [editor, setEditor] = useState<DisciplinePayload | 'new' | null>(null);

  /**
   * Renders a realistic BJJ belt badge with support for solid colors,
   * authentic central horizontal stripes for kids' mixed belt ranks, and inline actions.
   *
   * @param {BeltRankPayload} belt - The belt rank object from database.
   * @param {string} programId - The ID of the parent training program.
   * @returns {React.ReactNode} The styled belt badge element.
   */
  const renderBeltBadge = (belt: BeltRankPayload, programId: string) => {
    const localizedName = getLocalizedBeltName(belt.name, t);
    const appearance = resolveBeltAppearance(belt.name);
    const baseClass = `${appearance.baseClass} ${appearance.extraClass}`.trim();
    const stripeClass = appearance.stripeClass;
    const textColor = appearance.textClass;
    const lightText = textColor === 'text-white';
    const textBgPill = lightText ? 'bg-black/25 px-2 py-0.5 rounded' : 'bg-card/80 px-2 py-0.5 rounded shadow-2xs';

    return (
      <div
        key={belt.id}
        className={`relative overflow-hidden p-3 rounded-lg flex items-center justify-between text-xs font-medium shadow-xs transition-all ${baseClass} ${textColor}`}
      >
        {stripeClass && (
          <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 ${stripeClass} opacity-95 shadow-2xs`} />
        )}

        <div
          className="relative z-10 flex items-center gap-2 cursor-pointer flex-1"
          onClick={() => handleOpenEditBelt(programId, belt)}
          title={t('belts.edit_belt')}
        >
          <span className={`font-bold ${lightText ? 'text-white/90' : 'text-black'}`}>
            #{belt.order}
          </span>
          <span className={`font-semibold text-sm ${textBgPill}`}>
            {localizedName}
          </span>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div
            className={`flex items-center gap-2 text-[11px] ${textBgPill} cursor-pointer`}
            onClick={() => handleOpenEditBelt(programId, belt)}
          >
            <span>{t('belts.stripes_short', { count: belt.maxStripes })}</span>
            <span>•</span>
            <span>{t('belts.months_short', { count: belt.minMonthsRequired })}</span>
            <span>•</span>
            <span>{t('belts.hours_short', { count: belt.minHoursRequired })}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t('common.confirm_delete'))) {
                deleteBeltRank.mutate(belt.id as string);
              }
            }}
            className="text-destructive hover:text-destructive font-bold px-1.5 py-0.5 bg-card/90 rounded text-xs shadow-xs"
            title={t('belts.delete')}
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  /**
   * @param {string} programId - Parent program.
   * @returns {void}
   */
  const handleOpenAddBelt = (programId: string) => {
    setSelectedProgramId(programId);
    setSelectedBeltRank(null);
    setIsBeltModalOpen(true);
  };

  /**
   * @param {string} programId - Parent program.
   * @param {BeltRankPayload} belt - Existing rank.
   * @returns {void}
   */
  const handleOpenEditBelt = (programId: string, belt: BeltRankPayload) => {
    setSelectedProgramId(programId);
    setSelectedBeltRank(belt);
    setIsBeltModalOpen(true);
  };

  /**
   * @param {BeltRankPayload} data - Belt form payload.
   * @returns {void}
   */
  const handleBeltSubmit = (data: BeltRankPayload) => {
    saveBeltRank.mutate(data, {
      onSuccess: () => setIsBeltModalOpen(false),
    });
  };

  /**
   * @param {string} id - Discipline UUID.
   * @returns {void}
   */
  const handleDeleteDiscipline = (id: string) => {
    if (confirm(t('common.confirm_delete'))) {
      deleteDiscipline.mutate(id);
    }
  };

  /**
   * @param {DisciplinePayload} data - Identity fields.
   * @returns {void}
   */
  const handleDisciplineSubmit = (data: DisciplinePayload) => {
    const mutation = data.id ? updateDiscipline : createDiscipline;
    mutation.mutate(data, { onSuccess: () => setEditor(null) });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        {t('disciplines.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/40 rounded-lg text-destructive">
        {t('disciplines.error')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!embedded ? (
        <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('disciplines.title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('disciplines.subtitle')}</p>
          </div>
          <Button type="button" onClick={() => setEditor('new')}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('disciplines.new_discipline')}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setEditor('new')}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('disciplines.new_discipline')}
          </Button>
        </div>
      )}

      {editor ? (
        <DisciplineForm
          discipline={editor === 'new' ? null : editor}
          onSubmit={handleDisciplineSubmit}
          onCancel={() => setEditor(null)}
          isPending={createDiscipline.isPending || updateDiscipline.isPending}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6">
        {(!disciplines || disciplines.length === 0) ? (
          <div className="bg-card p-8 rounded-lg text-center text-muted-foreground border border-border shadow-sm">
            {t('disciplines.no_data')}
          </div>
        ) : (
          (disciplines as DisciplinePayload[]).map((discipline) => (
            <div key={discipline.id} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/50 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{discipline.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{discipline.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditor(discipline)}
                    className="text-sm text-primary hover:text-primary font-medium"
                  >
                    {t('disciplines.edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDiscipline(discipline.id as string)}
                    className="text-sm text-destructive hover:text-destructive font-medium"
                  >
                    {t('disciplines.delete')}
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('disciplines.programs_header')}
                </h3>

                {discipline.programs && discipline.programs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discipline.programs.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        renderBeltBadge={renderBeltBadge}
                        onAddBelt={() => handleOpenAddBelt(program.id as string)}
                        onDelete={() => {
                          if (confirm(t('settings.delete_program_confirm'))) {
                            deleteProgram.mutate(program.id as string);
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('disciplines.no_programs')}</p>
                )}

                <ProgramCreateRow
                  disciplineId={discipline.id as string}
                  onCreate={(payload) => createProgram.mutate(payload)}
                  isPending={createProgram.isPending}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <BeltRankModal
        isOpen={isBeltModalOpen}
        beltRank={selectedBeltRank}
        programId={selectedProgramId}
        onClose={() => setIsBeltModalOpen(false)}
        onSubmit={handleBeltSubmit}
        isPending={saveBeltRank.isPending}
      />
    </div>
  );
}

/**
 * Program card with belts and delete.
 *
 * @param {object} props - Program, belt renderer, and actions.
 * @returns {JSX.Element} Program card.
 */
function ProgramCard({
  program,
  renderBeltBadge,
  onAddBelt,
  onDelete,
}: {
  program: DisciplineProgramPayload;
  renderBeltBadge: (belt: BeltRankPayload, programId: string) => React.ReactNode;
  onAddBelt: () => void;
  onDelete: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="border border-border rounded-lg p-4 bg-card shadow-xs">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-foreground">{program.name}</span>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">
          {program.minAge} - {program.maxAge} {t('disciplines.years')}
        </span>
      </div>
      <div className="space-y-2 mt-3">
        {program.beltRanks && program.beltRanks.length > 0 ? (
          program.beltRanks.map((belt) => renderBeltBadge(belt, program.id as string))
        ) : (
          <p className="text-xs text-muted-foreground italic">{t('disciplines.no_belts')}</p>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-border flex justify-end gap-3">
        <button type="button" onClick={onAddBelt} className="text-xs text-primary hover:text-primary font-semibold">
          + {t('belts.add_belt')}
        </button>
        <button type="button" onClick={onDelete} className="text-xs text-destructive font-semibold">
          {t('settings.delete_program')}
        </button>
      </div>
    </div>
  );
}

/**
 * Compact create-program row under a discipline.
 *
 * @param {object} props - Parent discipline and create handler.
 * @returns {JSX.Element} Inline form.
 */
function ProgramCreateRow({
  disciplineId,
  onCreate,
  isPending,
}: {
  disciplineId: string;
  onCreate: (payload: { disciplineId: string; name: string; minAge: number; maxAge: number }) => void;
  isPending: boolean;
}): JSX.Element {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [minAge, setMinAge] = useState('16');
  const [maxAge, setMaxAge] = useState('99');

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-border p-3">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t('settings.program_name')}
        className="min-w-[10rem] flex-1"
      />
      <Input type="number" min={0} value={minAge} onChange={(event) => setMinAge(event.target.value)} className="w-24" />
      <Input type="number" min={0} value={maxAge} onChange={(event) => setMaxAge(event.target.value)} className="w-24" />
      <Button
        type="button"
        size="sm"
        disabled={!name.trim() || isPending}
        onClick={() => {
          const min = Number.parseInt(minAge, 10);
          const max = Number.parseInt(maxAge, 10);
          if (!name.trim() || !Number.isFinite(min) || !Number.isFinite(max)) return;
          onCreate({ disciplineId, name: name.trim(), minAge: min, maxAge: max });
          setName('');
        }}
      >
        {t('settings.add_program')}
      </Button>
    </div>
  );
}

/**
 * Standalone route wrapper. Prefer embedding via `DisciplinesCatalog`.
 *
 * @returns {React.ReactElement} Catalog page.
 */
export default function Disciplines(): React.ReactElement {
  return <DisciplinesCatalog />;
}
