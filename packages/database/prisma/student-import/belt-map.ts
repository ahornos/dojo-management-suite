/**
 * @file belt-map.ts
 * @description Matches CSV discipline / belt names to seeded catalog rows.
 * Unmatched belts fall back to the program's entry-level rank and must be flagged.
 */

/**
 * Belt rank snapshot used by the importer (no Prisma `include` across bounded contexts).
 */
export interface CatalogBelt {
  id: string;
  name: string;
  order: number;
}

/**
 * Age-banded program with ordered belt ranks.
 */
export interface CatalogProgram {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  beltRanks: CatalogBelt[];
}

/**
 * Discipline catalog entry (`Brazilian Jiu-Jitsu`, etc.).
 */
export interface CatalogDiscipline {
  id: string;
  name: string;
  acronym?: string | null;
  programs: CatalogProgram[];
}

/**
 * Result of resolving a CSV discipline + belt against the academy catalog.
 */
export interface BeltResolution {
  discipline: CatalogDiscipline | null;
  program: CatalogProgram | null;
  belt: CatalogBelt | null;
  defaultedBelt: boolean;
  unmatchedDiscipline: boolean;
  unmatchedBelt: boolean;
}

const DISCIPLINE_ALIASES: Record<string, string> = {
  bjj: 'brazilianjiujitsu',
  brazilianjiujitsu: 'brazilianjiujitsu',
  jiujitsu: 'brazilianjiujitsu',
  nogi: 'brazilianjiujitsu',
};

/**
 * @param {string} value - Discipline or belt label.
 * @returns {string} Lowercase alphanumeric key.
 */
export function normalizeCatalogName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/solid/g, '')
    .replace(/belt/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

/**
 * Finds a catalog discipline by exact name, alias, or a comma-separated CSV cell.
 *
 * @param {string} raw - CSV `discipline` cell.
 * @param {CatalogDiscipline[]} catalog - Seeded disciplines.
 * @returns {CatalogDiscipline | null} Match, or null when nothing in the catalog applies.
 */
export function matchDiscipline(raw: string, catalog: CatalogDiscipline[]): CatalogDiscipline | null {
  const tokens = raw
    .split(/[,;/|]+/)
    .map((token) => token.trim())
    .filter(Boolean);
  if (raw.trim() && tokens.length === 0) {
    tokens.push(raw.trim());
  }

  for (const token of tokens.length > 0 ? tokens : [raw]) {
    const key = DISCIPLINE_ALIASES[normalizeCatalogName(token)] ?? normalizeCatalogName(token);
    if (!key) continue;
    const found = catalog.find((item) => {
      const nameKey = DISCIPLINE_ALIASES[normalizeCatalogName(item.name)] ?? normalizeCatalogName(item.name);
      if (nameKey === key) return true;
      const acronymKey = item.acronym ? normalizeCatalogName(item.acronym) : '';
      return Boolean(acronymKey) && (acronymKey === key || acronymKey === normalizeCatalogName(token));
    });
    if (found) return found;
  }
  return null;
}

/**
 * Resolves the belt to assign. Kids belts (grey/yellow/green) prefer the kids program.
 *
 * @param {object} input - CSV labels, optional age, and catalog.
 * @returns {BeltResolution} Match or entry-level fallback.
 */
export function resolveBelt(input: {
  disciplineName: string | null;
  beltName: string | null;
  age: number | null;
  catalog: CatalogDiscipline[];
}): BeltResolution {
  const empty: BeltResolution = {
    discipline: null,
    program: null,
    belt: null,
    defaultedBelt: false,
    unmatchedDiscipline: Boolean(input.disciplineName),
    unmatchedBelt: Boolean(input.beltName),
  };

  if (!input.disciplineName && !input.beltName) {
    return { ...empty, unmatchedDiscipline: false, unmatchedBelt: false };
  }

  const discipline = input.disciplineName ? matchDiscipline(input.disciplineName, input.catalog) : null;
  if (!discipline) {
    return { ...empty, unmatchedDiscipline: Boolean(input.disciplineName) };
  }

  const program = pickProgram(discipline, input.age, input.beltName);
  const ranks = [...(program?.beltRanks ?? [])].sort((a, b) => a.order - b.order);
  const entry = ranks[0] ?? null;
  if (!program || !entry) {
    return {
      discipline,
      program,
      belt: null,
      defaultedBelt: false,
      unmatchedDiscipline: false,
      unmatchedBelt: true,
    };
  }

  if (!input.beltName) {
    return {
      discipline,
      program,
      belt: entry,
      defaultedBelt: true,
      unmatchedDiscipline: false,
      unmatchedBelt: true,
    };
  }

  const wanted = normalizeCatalogName(input.beltName);
  const spanish: Record<string, string> = { blanco: 'white', negro: 'black', azul: 'blue', morado: 'purple', marron: 'brown' };
  const wantedKey = spanish[wanted] ?? wanted;
  const matched = ranks.find((rank) => normalizeCatalogName(rank.name) === wantedKey);

  if (matched) {
    return {
      discipline,
      program,
      belt: matched,
      defaultedBelt: false,
      unmatchedDiscipline: false,
      unmatchedBelt: false,
    };
  }

  return {
    discipline,
    program,
    belt: entry,
    defaultedBelt: true,
    unmatchedDiscipline: false,
    unmatchedBelt: true,
  };
}

/**
 * @param {CatalogDiscipline} discipline - Catalog row.
 * @param {number | null} age - Student age in years.
 * @param {string | null} beltName - CSV belt label (kids colours hint kids program).
 * @returns {CatalogProgram | null} Age-banded program, or the first program.
 */
function pickProgram(
  discipline: CatalogDiscipline,
  age: number | null,
  beltName: string | null,
): CatalogProgram | null {
  const programs = discipline.programs ?? [];
  if (programs.length === 0) return null;

  if (age !== null) {
    const byAge = programs.filter((program) => age >= program.minAge && age <= program.maxAge);
    if (byAge.length === 1) return byAge[0];
    if (byAge.length > 1) {
      return pickByBeltHint(byAge, beltName) ?? byAge[0];
    }
  }

  return pickByBeltHint(programs, beltName) ?? programs[0];
}

/**
 * @param {CatalogProgram[]} programs - Candidates.
 * @param {string | null} beltName - CSV belt.
 * @returns {CatalogProgram | null} Program whose ranks contain that belt.
 */
function pickByBeltHint(programs: CatalogProgram[], beltName: string | null): CatalogProgram | null {
  if (!beltName) return null;
  const wanted = normalizeCatalogName(beltName);
  const spanish: Record<string, string> = { blanco: 'white', negro: 'black', azul: 'blue', morado: 'purple', marron: 'brown' };
  const wantedKey = spanish[wanted] ?? wanted;
  const kidsHint = /grey|gray|yellow|green|amarillo|verde|gris/.test(wantedKey);

  const withBelt = programs.find((program) =>
    program.beltRanks.some((rank) => normalizeCatalogName(rank.name) === wantedKey),
  );
  if (withBelt) return withBelt;

  if (kidsHint) {
    return programs.find((program) => program.maxAge <= 16) ?? null;
  }
  return programs.find((program) => program.minAge >= 16) ?? null;
}
