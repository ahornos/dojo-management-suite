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
    
    let baseClass = 'bg-gray-200 text-gray-800';
    let stripeClass: string | null = null;
    let textColor = 'text-gray-900';

    switch (belt.name) {
      case 'White Belt':
        baseClass = 'bg-white border border-gray-300';
        textColor = 'text-gray-800';
        break;
      case 'Blue Belt':
        baseClass = 'bg-blue-600';
        textColor = 'text-white';
        break;
      case 'Purple Belt':
        baseClass = 'bg-purple-700';
        textColor = 'text-white';
        break;
      case 'Brown Belt':
        baseClass = 'bg-amber-800';
        textColor = 'text-white';
        break;
      case 'Black Belt':
        baseClass = 'bg-neutral-900 border-b-4 border-red-600';
        textColor = 'text-white';
        break;
      case 'Solid Grey Belt':
        baseClass = 'bg-gray-400';
        textColor = 'text-gray-900';
        break;
      case 'Solid Yellow Belt':
        baseClass = 'bg-yellow-400';
        textColor = 'text-gray-900';
        break;
      case 'Solid Green Belt':
        baseClass = 'bg-green-600';
        textColor = 'text-white';
        break;
      case 'Grey/White Belt':
        baseClass = 'bg-gray-400';
        stripeClass = 'bg-white';
        textColor = 'text-gray-900';
        break;
      case 'Grey/Black Belt':
        baseClass = 'bg-gray-400';
        stripeClass = 'bg-neutral-900';
        textColor = 'text-white';
        break;
      case 'Yellow/White Belt':
        baseClass = 'bg-yellow-400';
        stripeClass = 'bg-white';
        textColor = 'text-gray-900';
        break;
      case 'Yellow/Black Belt':
        baseClass = 'bg-yellow-400';
        stripeClass = 'bg-neutral-900';
        textColor = 'text-gray-900';
        break;
      case 'Green/White Belt':
        baseClass = 'bg-green-600';
        stripeClass = 'bg-white';
        textColor = 'text-gray-900';
        break;
      case 'Green/Black Belt':
        baseClass = 'bg-green-600';
        stripeClass = 'bg-neutral-900';
        textColor = 'text-white';
        break;
      default:
        baseClass = 'bg-gray-200';
        textColor = 'text-gray-800';
        break;
    }

    const textBgPill = textColor === 'text-white' ? 'bg-black/25 px-2 py-0.5 rounded' : 'bg-white/80 px-2 py-0.5 rounded shadow-2xs';

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
          title={t('belts.edit_belt') || 'Edit belt requirements'}
        >
          <span className={`font-bold ${textColor === 'text-white' ? 'text-white/90' : 'text-gray-700'}`}>
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
            <span>Stripes: {belt.maxStripes}</span>
            <span>•</span>
            <span>{belt.minMonthsRequired} mos</span>
            <span>•</span>
            <span>{belt.minHoursRequired} hrs</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t('common.confirm_delete') || 'Are you sure you want to delete this belt rank?')) {
                deleteBeltRank.mutate(belt.id);
              }
            }}
            className="text-red-600 hover:text-red-800 font-bold px-1.5 py-0.5 bg-white/90 rounded text-xs shadow-xs"
            title={t('belts.delete') || 'Delete'}
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
    if (confirm(t('common.confirm_delete') || 'Are you sure you want to delete this discipline?')) {
      deleteDiscipline.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        {t('disciplines.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {t('disciplines.error')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('disciplines.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('disciplines.subtitle')}</p>
        </div>
        <button
          onClick={handleOpenCreateDiscipline}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {t('disciplines.new_discipline')}
        </button>
      </div>

      {/* Disciplines Grid / List */}
      <div className="grid grid-cols-1 gap-6">
        {(!disciplines || disciplines.length === 0) ? (
          <div className="bg-white p-8 rounded-lg text-center text-gray-500 border border-gray-100 shadow-sm">
            {t('disciplines.no_data')}
          </div>
        ) : (
          disciplines.map((discipline: any) => (
            <div key={discipline.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Discipline Info Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{discipline.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{discipline.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditDiscipline(discipline)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {t('disciplines.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteDiscipline(discipline.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    {t('disciplines.delete')}
                  </button>
                </div>
              </div>

              {/* Training Programs Section */}
              <div className="p-6 space-y-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {t('disciplines.programs_header')}
                </h3>

                {discipline.programs && discipline.programs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discipline.programs.map((program: any) => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-xs">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-gray-800">{program.name}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                            {program.minAge} - {program.maxAge} {t('disciplines.years')}
                          </span>
                        </div>

                        {/* Belt Ranks Grid with Realistic Badges */}
                        <div className="space-y-2 mt-3">
                          {program.beltRanks && program.beltRanks.length > 0 ? (
                            program.beltRanks.map((belt: any) => renderBeltBadge(belt, program.id))
                          ) : (
                            <p className="text-xs text-gray-400 italic">No belt ranks registered.</p>
                          )}
                        </div>

                        {/* Add Belt Button */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={() => handleOpenAddBelt(program.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            + {t('belts.add_belt')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">{t('disciplines.no_programs')}</p>
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