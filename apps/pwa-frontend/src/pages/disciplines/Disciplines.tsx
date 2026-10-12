/**
 * @file Disciplines.tsx
 * @description Disciplines and training programs management view. 
 * Displays martial arts disciplines, age-based training programs, localized belt hierarchies 
 * with realistic BJJ solid and center-striped belt badge designs, and full CRUD management modals.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDisciplines } from './useDisciplines';
import { getLocalizedBeltName } from '@/lib/beltTranslations';
import { DisciplineModal } from './DisciplineModal';
import { BeltRankModal } from './BeltRankModal';
import { DisciplinePayload, BeltRankPayload } from './types';

/**
 * Renders the Disciplines management interface with localization, realistic color-coded belt ranks,
 * and integrated modal dialogs for full CRUD operations (Create, Read, Update, Delete).
 * 
 * @component
 * @returns {React.ReactElement} The rendered disciplines view.
 */
export default function Disciplines() {
  const { t } = useTranslation();
  const { 
    disciplines, 
    isLoading, 
    error, 
    createDiscipline, 
    updateDiscipline, 
    deleteDiscipline,
    saveBeltRank, 
    deleteBeltRank 
  } = useDisciplines();

  // Modal states for Disciplines
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplinePayload | null>(null);

  // Modal states for Belt Ranks
  const [isBeltModalOpen, setIsBeltModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [selectedBeltRank, setSelectedBeltRank] = useState<BeltRankPayload | null>(null);

  /**
   * Renders a realistic BJJ belt badge with support for solid colors, 
   * authentic central horizontal stripes for kids' mixed belt ranks, and inline actions.
   * 
   * @param {any} belt - The belt rank object from database.
   * @param {string} programId - The ID of the parent training program.
   * @returns {React.ReactNode} The styled belt badge element.
   */
  const renderBeltBadge = (belt: any, programId: string) => {
    const localizedName = getLocalizedBeltName(belt.name, t);
    
    let baseClass = 'bg-muted text-foreground';
    let stripeClass: string | null = null;
    let textColor = 'text-foreground';

    switch (belt.name) {
      case 'White Belt':
        baseClass = 'bg-belt-white border border-border';
        textColor = 'text-foreground';
        break;
      case 'Blue Belt':
        baseClass = 'bg-belt-blue';
        textColor = 'text-white';
        break;
      case 'Purple Belt':
        baseClass = 'bg-belt-purple';
        textColor = 'text-white';
        break;
      case 'Brown Belt':
        baseClass = 'bg-belt-brown';
        textColor = 'text-white';
        break;
      case 'Black Belt':
        baseClass = 'bg-belt-black border-b-4 border-belt-red';
        textColor = 'text-white';
        break;
      case 'Solid Grey Belt':
        baseClass = 'bg-belt-grey';
        textColor = 'text-foreground';
        break;
      case 'Solid Yellow Belt':
        baseClass = 'bg-belt-yellow';
        textColor = 'text-foreground';
        break;
      case 'Solid Green Belt':
        baseClass = 'bg-belt-green';
        textColor = 'text-white';
        break;
      case 'Grey/White Belt':
        baseClass = 'bg-belt-grey';
        stripeClass = 'bg-belt-white';
        textColor = 'text-foreground';
        break;
      case 'Grey/Black Belt':
        baseClass = 'bg-belt-grey';
        stripeClass = 'bg-belt-black';
        textColor = 'text-white';
        break;
      case 'Yellow/White Belt':
        baseClass = 'bg-belt-yellow';
        stripeClass = 'bg-belt-white';
        textColor = 'text-foreground';
        break;
      case 'Yellow/Black Belt':
        baseClass = 'bg-belt-yellow';
        stripeClass = 'bg-belt-black';
        textColor = 'text-foreground';
        break;
      case 'Green/White Belt':
        baseClass = 'bg-belt-green';
        stripeClass = 'bg-belt-white';
        textColor = 'text-foreground';
        break;
      case 'Green/Black Belt':
        baseClass = 'bg-belt-green';
        stripeClass = 'bg-belt-black';
        textColor = 'text-white';
        break;
      default:
        baseClass = 'bg-muted';
        textColor = 'text-foreground';
        break;
    }

    const textBgPill = textColor === 'text-white' ? 'bg-black/25 px-2 py-0.5 rounded' : 'bg-card/80 px-2 py-0.5 rounded shadow-2xs';

    return (
      <div
        key={belt.id}
        className={`relative overflow-hidden p-3 rounded-lg flex items-center justify-between text-xs font-medium shadow-xs transition-all ${baseClass} ${textColor}`}
      >
        {stripeClass && (
          <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 ${stripeClass} opacity-95 shadow-2xs`} />
        )}

        {/* Belt Details & Name (Click to Edit Requirements) */}
        <div 
          className="relative z-10 flex items-center gap-2 cursor-pointer flex-1"
          onClick={() => handleOpenEditBelt(programId, belt)}
          title={t('belts.edit_belt')}
        >
          <span className={`font-bold ${textColor === 'text-white' ? 'text-white/90' : 'text-foreground'}`}>
            #{belt.order}
          </span>
          <span className={`font-semibold text-sm ${textBgPill}`}>
            {localizedName}
          </span>
        </div>

        {/* Requirements Info & Delete Action */}
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
                deleteBeltRank.mutate(belt.id);
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

  const handleOpenCreateDiscipline = () => {
    setSelectedDiscipline(null);
    setIsDisciplineModalOpen(true);
  };

  const handleOpenEditDiscipline = (discipline: DisciplinePayload) => {
    setSelectedDiscipline(discipline);
    setIsDisciplineModalOpen(true);
  };

  const handleOpenAddBelt = (programId: string) => {
    setSelectedProgramId(programId);
    setSelectedBeltRank(null);
    setIsBeltModalOpen(true);
  };

  const handleOpenEditBelt = (programId: string, belt: BeltRankPayload) => {
    setSelectedProgramId(programId);
    setSelectedBeltRank(belt);
    setIsBeltModalOpen(true);
  };

  const handleDisciplineSubmit = (data: DisciplinePayload) => {
    if (data.id) {
      updateDiscipline.mutate(data, {
        onSuccess: () => setIsDisciplineModalOpen(false),
      });
    } else {
      createDiscipline.mutate(data, {
        onSuccess: () => setIsDisciplineModalOpen(false),
      });
    }
  };

  const handleBeltSubmit = (data: BeltRankPayload) => {
    saveBeltRank.mutate(data, {
      onSuccess: () => setIsBeltModalOpen(false),
    });
  };

  const handleDeleteDiscipline = (id: string) => {
    if (confirm(t('common.confirm_delete'))) {
      deleteDiscipline.mutate(id);
    }
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
      {/* Header Section */}
      <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('disciplines.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('disciplines.subtitle')}</p>
        </div>
        <button
          onClick={handleOpenCreateDiscipline}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          {t('disciplines.new_discipline')}
        </button>
      </div>

      {/* Disciplines Grid / List */}
      <div className="grid grid-cols-1 gap-6">
        {(!disciplines || disciplines.length === 0) ? (
          <div className="bg-card p-8 rounded-lg text-center text-muted-foreground border border-border shadow-sm">
            {t('disciplines.no_data')}
          </div>
        ) : (
          disciplines.map((discipline: any) => (
            <div key={discipline.id} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
              {/* Discipline Info Header */}
              <div className="p-6 border-b border-border bg-muted/50 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{discipline.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{discipline.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditDiscipline(discipline)}
                    className="text-sm text-primary hover:text-primary font-medium"
                  >
                    {t('disciplines.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteDiscipline(discipline.id)}
                    className="text-sm text-destructive hover:text-destructive font-medium"
                  >
                    {t('disciplines.delete')}
                  </button>
                </div>
              </div>

              {/* Training Programs Section */}
              <div className="p-6 space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('disciplines.programs_header')}
                </h3>

                {discipline.programs && discipline.programs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discipline.programs.map((program: any) => (
                      <div key={program.id} className="border border-border rounded-lg p-4 bg-card shadow-xs">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-foreground">{program.name}</span>
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">
                            {program.minAge} - {program.maxAge} {t('disciplines.years')}
                          </span>
                        </div>

                        {/* Belt Ranks Grid with Realistic Badges */}
                        <div className="space-y-2 mt-3">
                          {program.beltRanks && program.beltRanks.length > 0 ? (
                            program.beltRanks.map((belt: any) => renderBeltBadge(belt, program.id))
                          ) : (
                            <p className="text-xs text-muted-foreground italic">{t('disciplines.no_belts')}</p>
                          )}
                        </div>

                        {/* Add Belt Button */}
                        <div className="mt-4 pt-3 border-t border-border flex justify-end">
                          <button
                            onClick={() => handleOpenAddBelt(program.id)}
                            className="text-xs text-primary hover:text-primary font-semibold"
                          >
                            + {t('belts.add_belt')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('disciplines.no_programs')}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals Integration */}
      <DisciplineModal
        isOpen={isDisciplineModalOpen}
        discipline={selectedDiscipline}
        onClose={() => setIsDisciplineModalOpen(false)}
        onSubmit={handleDisciplineSubmit}
        isPending={createDiscipline.isPending || updateDiscipline.isPending}
      />

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